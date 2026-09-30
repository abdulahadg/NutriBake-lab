import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { createClient } from '@supabase/supabase-js';
import { seedNutriBakeDatabase } from './scripts/seedDatabase';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '15mb' }));

// Server-side privileged Supabase client (using server-only SUPABASE_SECRET_KEY)
const supabaseUrl = process.env.SUPABASE_URL || '';
const rawSecretKey = process.env.SUPABASE_SECRET_KEY || '';
// Privileged secret key for administrative operations (never fall back to publishable key)
const supabaseSecretKey = (rawSecretKey && !rawSecretKey.includes('•'))
  ? rawSecretKey.trim()
  : '';

const getSupabaseAdmin = () => {
  if (!supabaseUrl || !supabaseSecretKey) return null;
  return createClient(supabaseUrl, supabaseSecretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
};

const getSupabaseClient = (req?: express.Request) => {
  const authHeader = req?.headers.authorization;
  if (authHeader?.startsWith('Bearer ') && supabaseUrl) {
    const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY || '';
    return createClient(supabaseUrl, publishableKey, {
      global: { headers: { Authorization: authHeader } },
      auth: { autoRefreshToken: false, persistSession: false }
    });
  }
  return getSupabaseAdmin();
};

// ==========================================
// ROLE-BASED AUTHORIZATION MIDDLEWARE
// ==========================================
// Restricts sensitive mutations (products, team, users) strictly to verified Administrators
const requireAdmin = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  const userRoleHeader = req.headers['x-user-role'];

  // 1. If JWT is passed, verify with Supabase Auth
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const adminClient = getSupabaseAdmin();
    if (adminClient) {
      try {
        const { data: { user }, error } = await adminClient.auth.getUser(token);
        if (!error && user) {
          if (user.user_metadata?.role === 'admin') {
            return next();
          }
          const { data: profile } = await adminClient.from('profiles').select('role').eq('id', user.id).single();
          if (profile?.role === 'admin') {
            return next();
          }
          return res.status(403).json({ error: 'Access denied: Admin role required to modify bakery catalog or team records.' });
        }
      } catch (err: any) {
        console.warn('[NutriBake Server] Auth verification warning:', err?.message);
      }
    }
  }

  // 2. Check X-User-Role header
  if (userRoleHeader === 'admin') {
    return next();
  }

  return res.status(403).json({
    error: 'Access denied: Administrative privileges required to perform this action.'
  });
};

// ==========================================
// API ROUTES (Always placed before Vite middleware)
// ==========================================

// Health & connectivity check
app.get('/api/health', async (_req, res) => {
  const adminClient = getSupabaseAdmin();
  let supabaseStatus = 'not_configured';
  let authConnected = false;

  if (adminClient) {
    try {
      const { data, error } = await adminClient.auth.admin.listUsers();
      if (!error) {
        supabaseStatus = 'connected';
        authConnected = true;
      } else {
        supabaseStatus = 'auth_error: ' + error.message;
      }
    } catch (e: any) {
      supabaseStatus = 'error: ' + e.message;
    }
  }

  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    supabase: {
      urlConfigured: Boolean(supabaseUrl),
      secretKeyConfigured: Boolean(supabaseSecretKey),
      status: supabaseStatus,
      authConnected
    }
  });
});

// Admin: Privileged user listing using secret key
app.get('/api/admin/users', async (req, res) => {
  const adminClient = getSupabaseAdmin();
  if (!adminClient) {
    return res.status(503).json({ error: 'Supabase admin client is not configured' });
  }

  try {
    const { data, error } = await adminClient.auth.admin.listUsers();
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.json({ users: data.users });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

// Admin: Schema status check
app.get('/api/admin/schema-status', async (_req, res) => {
  const adminClient = getSupabaseAdmin();
  if (!adminClient) {
    return res.status(503).json({ error: 'Supabase admin client not configured' });
  }

  const tables = [
    'products',
    'profiles',
    'daily_intake_logs',
    'sample_orders',
    'sensory_trials',
    'product_tasting_notes',
    'family_profiles',
    'alerts',
    'team'
  ];
  const results: Record<string, { exists: boolean; error?: string }> = {};

  for (const table of tables) {
    try {
      const { error } = await adminClient.from(table).select('*').limit(1);
      if (error) {
        results[table] = { exists: false, error: error.message };
      } else {
        results[table] = { exists: true };
      }
    } catch (e: any) {
      results[table] = { exists: false, error: e.message };
    }
  }

  res.json({ tables: results });
});

// ==========================================
// Full-Stack API routes for Team (Direct Supabase Source of Truth)
// ==========================================

app.get('/api/team', async (_req, res) => {
  const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY || '';
  const client = getSupabaseAdmin() || (supabaseUrl && publishableKey ? createClient(supabaseUrl, publishableKey) : null);

  if (!client) {
    return res.status(503).json({ error: 'Supabase client is not configured' });
  }

  try {
    const { data, error } = await client
      .from('team')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('[NutriBake Server] GET /api/team Supabase error:', error.message);
      return res.status(500).json({ error: error.message });
    }

    return res.json({ data: data || [] });
  } catch (e: any) {
    console.error('[NutriBake Server] GET /api/team exception:', e?.message);
    return res.status(500).json({ error: e?.message || 'Failed to fetch team data from Supabase' });
  }
});

app.post('/api/team', requireAdmin, async (req, res) => {
  const client = getSupabaseClient(req);
  if (!client) {
    const errorMsg = !supabaseSecretKey 
      ? 'Server secret key (SUPABASE_SECRET_KEY) is not configured. Privileged team mutations require a valid server-side secret key.'
      : 'Supabase client is not configured';
    console.error('[NutriBake Server] POST /api/team rejected:', errorMsg);
    return res.status(503).json({ error: errorMsg });
  }

  const member = {
    id: req.body.id || `team-${Date.now()}`,
    name: req.body.name,
    role: req.body.role,
    bio: req.body.bio || req.body.focus || '',
    department: req.body.department || 'Department of Software Engineering',
    sub_role: req.body.sub_role || req.body.subRole || '',
    id_number: req.body.id_number || req.body.idNumber || '',
    institution: req.body.institution || 'University of Sindh, Jamshoro',
    expertise: Array.isArray(req.body.expertise) ? req.body.expertise : [],
    display_order: req.body.display_order ?? req.body.displayOrder ?? 99,
    created_at: req.body.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  try {
    const { data, error } = await client
      .from('team')
      .insert(member)
      .select();

    if (error) {
      console.error('[NutriBake Server] Supabase team insert error:', error.message);
      return res.status(400).json({ error: error.message });
    }

    if (!data || data.length === 0) {
      console.error('[NutriBake Server] Supabase team insert: 0 rows modified (RLS rejected)');
      return res.status(403).json({
        error: 'Database mutation rejected by RLS: 0 rows inserted into remote public.team table. An active admin session or SUPABASE_SECRET_KEY is required.'
      });
    }

    return res.json({ data: data[0] });
  } catch (e: any) {
    console.error('[NutriBake Server] Team POST exception:', e);
    return res.status(500).json({ error: e?.message || 'Server error creating team member' });
  }
});

app.put('/api/team/:id', requireAdmin, async (req, res) => {
  const client = getSupabaseClient(req);
  if (!client) {
    const errorMsg = !supabaseSecretKey 
      ? 'Server secret key (SUPABASE_SECRET_KEY) is not configured. Privileged team mutations require a valid server-side secret key.'
      : 'Supabase client is not configured';
    console.error('[NutriBake Server] PUT /api/team/:id rejected:', errorMsg);
    return res.status(503).json({ error: errorMsg });
  }

  const id = req.params.id;
  const updates: any = {
    ...req.body,
    updated_at: new Date().toISOString()
  };
  if (req.body.subRole !== undefined) updates.sub_role = req.body.subRole;
  if (req.body.idNumber !== undefined) updates.id_number = req.body.idNumber;
  if (req.body.displayOrder !== undefined) updates.display_order = req.body.displayOrder;
  if (req.body.focus !== undefined && !updates.bio) updates.bio = req.body.focus;

  try {
    const { data, error } = await client
      .from('team')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) {
      console.error('[NutriBake Server] Supabase team update error:', error.message);
      return res.status(400).json({ error: error.message });
    }

    if (!data || data.length === 0) {
      console.error('[NutriBake Server] Supabase team update: 0 rows modified (RLS rejected)');
      return res.status(403).json({
        error: 'Database mutation rejected by RLS: 0 rows updated in remote public.team table. An active admin session or SUPABASE_SECRET_KEY is required.'
      });
    }

    return res.json({ data: data[0] });
  } catch (e: any) {
    console.error('[NutriBake Server] Team PUT exception:', e);
    return res.status(500).json({ error: e?.message || 'Server error updating team member' });
  }
});

app.delete('/api/team/:id', requireAdmin, async (req, res) => {
  const client = getSupabaseClient(req);
  if (!client) {
    const errorMsg = !supabaseSecretKey 
      ? 'Server secret key (SUPABASE_SECRET_KEY) is not configured. Privileged team mutations require a valid server-side secret key.'
      : 'Supabase client is not configured';
    console.error('[NutriBake Server] DELETE /api/team/:id rejected:', errorMsg);
    return res.status(503).json({ error: errorMsg });
  }

  const id = req.params.id;

  try {
    const { data, error } = await client
      .from('team')
      .delete()
      .eq('id', id)
      .select();

    if (error) {
      console.error('[NutriBake Server] Supabase team delete error:', error.message);
      return res.status(400).json({ error: error.message });
    }

    if (!data || data.length === 0) {
      console.error('[NutriBake Server] Supabase team delete: 0 rows modified (RLS rejected)');
      return res.status(403).json({
        error: 'Database mutation rejected by RLS: 0 rows deleted in remote public.team table. An active admin session or SUPABASE_SECRET_KEY is required.'
      });
    }

    return res.json({ success: true, deleted: data[0] });
  } catch (e: any) {
    console.error('[NutriBake Server] Team DELETE exception:', e);
    return res.status(500).json({ error: e?.message || 'Server error deleting team member' });
  }
});

// Full-Stack API routes for Products (Privileged & Secure)
app.get('/api/products', async (_req, res) => {
  const adminClient = getSupabaseAdmin();
  if (!adminClient) {
    return res.status(503).json({ error: 'Supabase admin client not configured' });
  }
  try {
    const { data, error } = await adminClient
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.json({ data: data || [] });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

app.post('/api/products', requireAdmin, async (req, res) => {
  const adminClient = getSupabaseAdmin();
  if (!adminClient) {
    return res.status(503).json({ error: 'Supabase admin client not configured' });
  }
  try {
    const { data, error } = await adminClient.from('products').upsert(req.body).select();
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    return res.json({ data: data?.[0] });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

app.put('/api/products/:id', requireAdmin, async (req, res) => {
  const adminClient = getSupabaseAdmin();
  if (!adminClient) {
    return res.status(503).json({ error: 'Supabase admin client not configured' });
  }
  try {
    const { data, error } = await adminClient
      .from('products')
      .update({ ...req.body, updated_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .select();
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    return res.json({ data: data?.[0] });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

app.delete('/api/products/:id', requireAdmin, async (req, res) => {
  const adminClient = getSupabaseAdmin();
  if (!adminClient) {
    return res.status(503).json({ error: 'Supabase admin client not configured' });
  }
  try {
    const { error } = await adminClient.from('products').delete().eq('id', req.params.id);
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    return res.json({ success: true });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

// Full-Stack API routes for Sample Orders
app.get('/api/sample-orders', async (req, res) => {
  const adminClient = getSupabaseAdmin();
  if (!adminClient) {
    return res.status(503).json({ error: 'Supabase admin client not configured' });
  }
  try {
    const userId = req.query.userId as string | undefined;
    let query = adminClient.from('sample_orders').select('*').order('created_at', { ascending: false });
    if (userId) {
      query = query.eq('user_id', userId);
    }
    const { data, error } = await query;
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.json({ data: data || [] });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

app.post('/api/sample-orders', async (req, res) => {
  const adminClient = getSupabaseAdmin();
  if (!adminClient) {
    return res.status(503).json({ error: 'Supabase admin client not configured' });
  }
  try {
    const { data, error } = await adminClient.from('sample_orders').insert(req.body).select();
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    return res.json({ data: data?.[0] });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

app.put('/api/sample-orders/:id', requireAdmin, async (req, res) => {
  const adminClient = getSupabaseAdmin();
  if (!adminClient) {
    return res.status(503).json({ error: 'Supabase admin client not configured' });
  }
  try {
    const { data, error } = await adminClient
      .from('sample_orders')
      .update({ ...req.body, updated_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .select();
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    return res.json({ data: data?.[0] });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

// Full-Stack Auth Signup (Rate-limit resilient via Admin Auth API)
app.post('/api/auth/signup', async (req, res) => {
  const adminClient = getSupabaseAdmin();
  if (!adminClient) {
    return res.status(503).json({ error: 'Supabase admin client not configured' });
  }
  try {
    const { email, password, name, role } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const { data, error } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name: name || email.split('@')[0],
        role: role || 'user'
      }
    });
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    return res.json({ user: data.user });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

// Admin: Run idempotent database restoration seed
app.post('/api/admin/seed', async (_req, res) => {
  try {
    const result = await seedNutriBakeDatabase();
    return res.json(result);
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

// Admin: Delete sample order
app.delete('/api/sample-orders/:id', async (req, res) => {
  const adminClient = getSupabaseAdmin();
  if (!adminClient) {
    return res.status(503).json({ error: 'Supabase admin client not configured' });
  }
  try {
    const { error } = await adminClient.from('sample_orders').delete().eq('id', req.params.id);
    if (error) return res.status(400).json({ error: error.message });
    return res.json({ success: true });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

// Admin: Aggregate database metrics across all 8 tables
app.get('/api/admin/stats', async (_req, res) => {
  const adminClient = getSupabaseAdmin();
  if (!adminClient) {
    return res.status(503).json({ error: 'Supabase admin client not configured' });
  }
  try {
    const tables = [
      'products',
      'profiles',
      'sample_orders',
      'sensory_trials',
      'product_tasting_notes',
      'family_profiles',
      'alerts',
      'daily_intake_logs',
      'team'
    ];
    const counts: Record<string, number> = {};

    await Promise.all(
      tables.map(async (table) => {
        try {
          const { count, error } = await adminClient
            .from(table)
            .select('*', { count: 'exact', head: true });
          counts[table] = error ? 0 : (count ?? 0);
        } catch {
          counts[table] = 0;
        }
      })
    );

    return res.json({ counts, timestamp: new Date().toISOString() });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

// Admin: Profiles list & update
app.get('/api/admin/profiles', async (_req, res) => {
  const adminClient = getSupabaseAdmin();
  if (!adminClient) return res.status(503).json({ error: 'Supabase admin client not configured' });
  try {
    const { data, error } = await adminClient
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) return res.status(400).json({ error: error.message });
    return res.json({ data: data || [] });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

app.put('/api/admin/profiles/:id', async (req, res) => {
  const adminClient = getSupabaseAdmin();
  if (!adminClient) return res.status(503).json({ error: 'Supabase admin client not configured' });
  try {
    const { data, error } = await adminClient
      .from('profiles')
      .update({ ...req.body, updated_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .select();
    if (error) return res.status(400).json({ error: error.message });
    return res.json({ data: data?.[0] });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

// Admin: Sensory Trials CRUD
app.get('/api/admin/sensory-trials', async (_req, res) => {
  const adminClient = getSupabaseAdmin();
  if (!adminClient) return res.status(503).json({ error: 'Supabase admin client not configured' });
  try {
    const { data, error } = await adminClient
      .from('sensory_trials')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) return res.status(400).json({ error: error.message });
    return res.json({ data: data || [] });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

app.post('/api/admin/sensory-trials', async (req, res) => {
  const adminClient = getSupabaseAdmin();
  if (!adminClient) return res.status(503).json({ error: 'Supabase admin client not configured' });
  try {
    const { data, error } = await adminClient.from('sensory_trials').insert(req.body).select();
    if (error) return res.status(400).json({ error: error.message });
    return res.json({ data: data?.[0] });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

app.delete('/api/admin/sensory-trials/:id', async (req, res) => {
  const adminClient = getSupabaseAdmin();
  if (!adminClient) return res.status(503).json({ error: 'Supabase admin client not configured' });
  try {
    const { error } = await adminClient.from('sensory_trials').delete().eq('id', req.params.id);
    if (error) return res.status(400).json({ error: error.message });
    return res.json({ success: true });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

// Admin: Daily Intake CRUD
app.get('/api/admin/daily-intake', async (_req, res) => {
  const adminClient = getSupabaseAdmin();
  if (!adminClient) return res.status(503).json({ error: 'Supabase admin client not configured' });
  try {
    const { data, error } = await adminClient
      .from('daily_intake_logs')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) return res.status(400).json({ error: error.message });
    return res.json({ data: data || [] });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

app.post('/api/admin/daily-intake', async (req, res) => {
  const adminClient = getSupabaseAdmin();
  if (!adminClient) return res.status(503).json({ error: 'Supabase admin client not configured' });
  try {
    const { data, error } = await adminClient.from('daily_intake_logs').insert(req.body).select();
    if (error) return res.status(400).json({ error: error.message });
    return res.json({ data: data?.[0] });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

app.delete('/api/admin/daily-intake/:id', async (req, res) => {
  const adminClient = getSupabaseAdmin();
  if (!adminClient) return res.status(503).json({ error: 'Supabase admin client not configured' });
  try {
    const { error } = await adminClient.from('daily_intake_logs').delete().eq('id', req.params.id);
    if (error) return res.status(400).json({ error: error.message });
    return res.json({ success: true });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

// Admin: Family Profiles CRUD
app.get('/api/admin/family-profiles', async (_req, res) => {
  const adminClient = getSupabaseAdmin();
  if (!adminClient) return res.status(503).json({ error: 'Supabase admin client not configured' });
  try {
    const { data, error } = await adminClient
      .from('family_profiles')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) return res.status(400).json({ error: error.message });
    return res.json({ data: data || [] });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

app.post('/api/admin/family-profiles', async (req, res) => {
  const adminClient = getSupabaseAdmin();
  if (!adminClient) return res.status(503).json({ error: 'Supabase admin client not configured' });
  try {
    const { data, error } = await adminClient.from('family_profiles').upsert(req.body).select();
    if (error) return res.status(400).json({ error: error.message });
    return res.json({ data: data?.[0] });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

app.delete('/api/admin/family-profiles/:id', async (req, res) => {
  const adminClient = getSupabaseAdmin();
  if (!adminClient) return res.status(503).json({ error: 'Supabase admin client not configured' });
  try {
    const { error } = await adminClient.from('family_profiles').delete().eq('id', req.params.id);
    if (error) return res.status(400).json({ error: error.message });
    return res.json({ success: true });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

// Admin: Product Tasting Notes CRUD
app.get('/api/admin/tasting-notes', async (_req, res) => {
  const adminClient = getSupabaseAdmin();
  if (!adminClient) return res.status(503).json({ error: 'Supabase admin client not configured' });
  try {
    const { data, error } = await adminClient
      .from('product_tasting_notes')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) return res.status(400).json({ error: error.message });
    return res.json({ data: data || [] });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

app.delete('/api/admin/tasting-notes/:id', async (req, res) => {
  const adminClient = getSupabaseAdmin();
  if (!adminClient) return res.status(503).json({ error: 'Supabase admin client not configured' });
  try {
    const { error } = await adminClient.from('product_tasting_notes').delete().eq('id', req.params.id);
    if (error) return res.status(400).json({ error: error.message });
    return res.json({ success: true });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

// Admin: Alerts CRUD
app.get('/api/admin/alerts', async (_req, res) => {
  const adminClient = getSupabaseAdmin();
  if (!adminClient) return res.status(503).json({ error: 'Supabase admin client not configured' });
  try {
    const { data, error } = await adminClient
      .from('alerts')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) return res.status(400).json({ error: error.message });
    return res.json({ data: data || [] });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

app.post('/api/admin/alerts', async (req, res) => {
  const adminClient = getSupabaseAdmin();
  if (!adminClient) return res.status(503).json({ error: 'Supabase admin client not configured' });
  try {
    const { data, error } = await adminClient.from('alerts').upsert(req.body).select();
    if (error) return res.status(400).json({ error: error.message });
    return res.json({ data: data?.[0] });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

app.put('/api/admin/alerts/:id', async (req, res) => {
  const adminClient = getSupabaseAdmin();
  if (!adminClient) return res.status(503).json({ error: 'Supabase admin client not configured' });
  try {
    const { data, error } = await adminClient
      .from('alerts')
      .update(req.body)
      .eq('id', req.params.id)
      .select();
    if (error) return res.status(400).json({ error: error.message });
    return res.json({ data: data?.[0] });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

app.delete('/api/admin/alerts/:id', async (req, res) => {
  const adminClient = getSupabaseAdmin();
  if (!adminClient) return res.status(503).json({ error: 'Supabase admin client not configured' });
  try {
    const { error } = await adminClient.from('alerts').delete().eq('id', req.params.id);
    if (error) return res.status(400).json({ error: error.message });
    return res.json({ success: true });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

// Admin: Website Content Management (Persistent JSON with fallback)
const CONTENT_FILE_PATH = path.join(process.cwd(), 'src/data/websiteContent.json');

app.get('/api/admin/website-content', (_req, res) => {
  try {
    if (fs.existsSync(CONTENT_FILE_PATH)) {
      const raw = fs.readFileSync(CONTENT_FILE_PATH, 'utf-8');
      return res.json({ content: JSON.parse(raw) });
    }
    return res.json({ content: null });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

app.post('/api/admin/website-content', (req, res) => {
  try {
    const content = req.body;
    fs.writeFileSync(CONTENT_FILE_PATH, JSON.stringify(content, null, 2), 'utf-8');
    return res.json({ success: true, content });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

// Admin: Upload custom product photography (supports data URLs or files)
app.post('/api/admin/upload-image', (req, res) => {
  try {
    const { dataUrl, filename } = req.body;
    if (!dataUrl || !dataUrl.startsWith('data:image/')) {
      return res.status(400).json({ error: 'Invalid image data URL' });
    }
    const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ error: 'Invalid base64 format' });
    }
    const ext = matches[1].split('/')[1] || 'jpg';
    const cleanExt = ext === 'jpeg' ? 'jpg' : ext;
    const safeName = (filename || `upload_${Date.now()}`).replace(/[^a-zA-Z0-9_-]/g, '_');
    const targetFilename = `${safeName}.${cleanExt}`;
    
    const uploadsDir = path.join(process.cwd(), 'public/images');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    const filePath = path.join(uploadsDir, targetFilename);
    const buffer = Buffer.from(matches[2], 'base64');
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/images/${targetFilename}`;
    return res.json({ url: publicUrl });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

// ==========================================
// VITE & STATIC MIDDLEWARE SETUP
// ==========================================

async function startServer() {
  try {
    if (process.env.NODE_ENV !== 'production') {
      const vite = await createViteServer({
        server: { 
          middlewareMode: true
        },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } else {
      const distPath = path.join(process.cwd(), 'dist');
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`[NutriBake Server] Running on http://0.0.0.0:${PORT}`);

      // Run background seed check asynchronously after server is listening
      (async () => {
        try {
          const adminClient = getSupabaseAdmin();
          if (adminClient) {
            const { count } = await adminClient.from('products').select('*', { count: 'exact', head: true });
            if (count === 0 || count === null) {
              console.log('[NutriBake Server] Database tables empty, running initial restoration seed...');
              await seedNutriBakeDatabase();
            }
          }
        } catch (err: any) {
          console.warn('[NutriBake Server] Initial seed check non-fatal notice:', err?.message);
        }
      })();
    });
  } catch (err: any) {
    console.error('[NutriBake Server] Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
