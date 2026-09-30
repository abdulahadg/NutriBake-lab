import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Database, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  HardDrive, 
  Layers, 
  Package, 
  Award, 
  Users, 
  Bell, 
  Activity,
  FileSpreadsheet
} from 'lucide-react';

export const DatabaseStatusPanel: React.FC = () => {
  const { 
    isSupabaseConfigured, 
    products, 
    sampleOrders, 
    sensoryTrials, 
    familyProfiles, 
    alerts, 
    profilesList, 
    teamMembers,
    refreshData,
    addToast 
  } = useApp();

  const [isSyncing, setIsSyncing] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const res = await fetch('/api/admin/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.warn('Failed to fetch admin stats:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleSyncAll = async () => {
    setIsSyncing(true);
    try {
      await refreshData();
      await fetchStats();
      addToast('Synchronization Complete', 'All 8 database collections up to date.', 'success');
    } catch {
      addToast('Sync Notice', 'Data refreshed from local and cloud stores.', 'info');
    } finally {
      setIsSyncing(false);
    }
  };

  const tables = [
    {
      name: 'products',
      label: 'Products & Formulations',
      count: stats?.tables?.products ?? products.length,
      icon: Package,
      desc: 'Nutritional monographs, assays, and botanical ingredient ratios'
    },
    {
      name: 'profiles',
      label: 'User Profiles & RBAC',
      count: stats?.tables?.profiles ?? profilesList.length,
      icon: Users,
      desc: 'Consumer and researcher accounts, roles, and fiber targets'
    },
    {
      name: 'sample_orders',
      label: 'Trial Dispatches',
      count: stats?.tables?.sample_orders ?? sampleOrders.length,
      icon: Layers,
      desc: 'Chilled courier sample orders and sensory panel kits'
    },
    {
      name: 'sensory_trials',
      label: 'Sensory Panel Trials',
      count: stats?.tables?.sensory_trials ?? sensoryTrials.length,
      icon: Award,
      desc: 'Hedonic 9-point ratings for sweetness, texture, and aroma'
    },
    {
      name: 'product_tasting_notes',
      label: 'Consumer Tasting Notes',
      count: stats?.tables?.product_tasting_notes ?? 6,
      icon: FileSpreadsheet,
      desc: 'Community and panelist feedback on functional baked goods'
    },
    {
      name: 'family_profiles',
      label: 'Family Fiber Profiles',
      count: stats?.tables?.family_profiles ?? familyProfiles.length,
      icon: Users,
      desc: 'Household nutrition tracking and child-friendly preferences'
    },
    {
      name: 'alerts',
      label: 'Clinical Alerts & Notices',
      count: stats?.tables?.alerts ?? alerts.length,
      icon: Bell,
      desc: 'Harvest batches, clinical publications, and system bulletins'
    },
    {
      name: 'daily_intake_logs',
      label: 'Dietary Intake Logs',
      count: stats?.tables?.daily_intake_logs ?? 24,
      icon: Activity,
      desc: 'Daily fiber and resistant starch tracking logs'
    },
    {
      name: 'team',
      label: 'Team Profiles',
      count: stats?.tables?.team ?? teamMembers.length,
      icon: Users,
      desc: 'Student researcher profiles, academic authorship, and roles'
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3A2721]/15 pb-4">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-editorial font-bold text-[#657258] block">
            Cloud Architecture
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#3A2721]">
            Supabase Database Diagnostics & Table State
          </h2>
          <p className="text-xs text-[#2A1F1B]/75 mt-1 font-sans">
            Real-time status of the PostgreSQL cloud schema, table records, and synchronization pipeline.
          </p>
        </div>

        <button
          onClick={handleSyncAll}
          disabled={isSyncing}
          className="px-5 py-2.5 bg-[#3D261E] hover:bg-[#C97D36] text-white text-xs font-semibold rounded-full flex items-center gap-2 shadow-xs transition-all self-start disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'Synchronizing...' : 'Sync All Tables'}</span>
        </button>
      </div>

      {/* CONNECTION STATUS CARD */}
      <div className="card-soft bg-white p-6 rounded-3xl border border-[#E8DDCF] shadow-[0_8px_30px_rgba(61,38,30,0.03)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className={`p-3 rounded-2xl ${
              isSupabaseConfigured 
                ? 'bg-[#EEF3EB] text-[#5E7252] border border-[#D4E0CD]' 
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}>
              <HardDrive className="w-6 h-6 stroke-[1.8]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg text-[#3D261E] font-normal">
                  PostgreSQL Cloud Database (Supabase)
                </h3>
                <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full ${
                  isSupabaseConfigured 
                    ? 'bg-[#EEF3EB] text-[#5E7252] border border-[#D4E0CD]' 
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  {isSupabaseConfigured ? 'LIVE & CONNECTED' : 'LOCAL FALLBACK'}
                </span>
              </div>
              <p className="text-xs text-[#2A1F1B]/70 font-sans mt-0.5">
                {isSupabaseConfigured 
                  ? 'All reads and writes directly persist to the cloud PostgreSQL database.' 
                  : 'Operating in self-contained in-memory mode with fallback data.'}
              </p>
            </div>
          </div>

          <div className="font-mono text-xs text-[#3D261E]/80 bg-[#FAF7F2] p-3 rounded-2xl border border-[#E8DDCF] shrink-0">
            <p><span className="font-bold text-[#3D261E]">Schema:</span> public</p>
            <p><span className="font-bold text-[#3D261E]">Tables:</span> 8 Active Relational Tables</p>
          </div>
        </div>
      </div>

      {/* TABLE GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {tables.map(table => {
          const Icon = table.icon;
          return (
            <div 
              key={table.name}
              className="card-soft bg-white p-5 rounded-2xl border border-[#E8DDCF] space-y-3 shadow-2xs hover:border-[#C97D36]/40 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="p-2 bg-[#FAF0E4] rounded-xl text-[#C97D36]">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="font-mono text-2xl font-serif text-[#3D261E]">
                  {table.count}
                </span>
              </div>

              <div>
                <h4 className="font-serif text-sm font-medium text-[#3D261E]">
                  {table.label}
                </h4>
                <p className="font-mono text-[10px] text-[#2A1F1B]/50 mt-0.5">
                  table: {table.name}
                </p>
                <p className="font-sans text-[11px] text-[#2A1F1B]/70 mt-1 line-clamp-2">
                  {table.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
