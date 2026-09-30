import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  ViewMode, 
  Product, 
  UserProfile, 
  AlertNotification, 
  RecommendationMatch, 
  ResearchPaper,
  DailyIntakeLogEntry,
  SampleTrialOrder,
  SampleOrderStatus,
  SensoryTrialEntry,
  ProductTastingNote,
  ChildFamilyProfile,
  TeamMember
} from '../types';
import { INITIAL_PRODUCTS, INITIAL_USER, INITIAL_ALERTS, INITIAL_TEAM_MEMBERS, RESEARCH_PAPERS } from '../data/mockData';
import { 
  INITIAL_DAILY_LOGS, 
  INITIAL_SAMPLE_ORDERS, 
  INITIAL_SENSORY_TRIALS, 
  INITIAL_TASTING_NOTES, 
  INITIAL_FAMILY_PROFILES 
} from '../data/portalMockData';
import {
  supabase,
  isSupabaseConfigured,
  productsService,
  intakeLogsService,
  sampleOrdersService,
  sensoryTrialsService,
  tastingNotesService,
  familyProfilesService,
  profilesService,
  alertsService,
  websiteContentService,
  teamService,
  setActiveUserRole
} from '../lib/supabase';
import { DEFAULT_WEBSITE_CONTENT, WebsiteContentData } from '../data/defaultWebsiteContent';

export interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  products: Product[];
  selectedProduct: Product | null;
  setSelectedProduct: (prod: Product | null) => void;
  openProductDetail: (productId: string) => void;
  user: UserProfile | null;
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  savedProductIds: string[];
  toggleSaveProduct: (productId: string) => void;
  isProductSaved: (productId: string) => boolean;
  alerts: AlertNotification[];
  markAlertAsRead: (alertId: string) => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  toasts: ToastMessage[];
  addToast: (title: string, message?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
  recommendationResults: RecommendationMatch[] | null;
  setRecommendationResults: (results: RecommendationMatch[] | null) => void;
  activeResearchPaper: ResearchPaper | null;
  setActiveResearchPaper: (paper: ResearchPaper | null) => void;
  
  // User Portal: Daily intake tracker
  dailyIntakeLogs: DailyIntakeLogEntry[];
  addIntakeLog: (entry: Omit<DailyIntakeLogEntry, 'id' | 'timestamp'>) => void;
  removeIntakeLog: (id: string) => void;
  clearDailyLogs: () => void;

  // User & Admin Portal: Sample Trial Orders
  sampleOrders: SampleTrialOrder[];
  createSampleOrder: (order: Omit<SampleTrialOrder, 'id' | 'orderNumber' | 'date'>) => void;
  updateOrderStatus: (id: string, status: SampleOrderStatus, notes?: string) => void;
  deleteSampleOrder: (id: string) => Promise<boolean>;

  // Admin Portal: Sensory Trials Log
  sensoryTrials: SensoryTrialEntry[];
  addSensoryTrial: (trial: Omit<SensoryTrialEntry, 'id' | 'date'>) => void;
  deleteSensoryTrial: (id: string) => void;

  // User Portal: Personal Product Tasting Notes & Ratings
  productTastingNotes: Record<string, ProductTastingNote>;
  saveProductTastingNote: (productId: string, rating: number, notes: string) => void;
  deleteTastingNote: (id: string) => Promise<boolean>;

  // User Portal: Family / Pediatric Profiles
  familyProfiles: ChildFamilyProfile[];
  addFamilyProfile: (profile: Omit<ChildFamilyProfile, 'id'>) => void;
  updateFamilyProfile: (id: string, profile: Partial<ChildFamilyProfile>) => void;
  deleteFamilyProfile: (id: string) => void;

  // Alerts Management
  addAlert: (alert: Omit<AlertNotification, 'id'>) => Promise<boolean>;
  updateAlert: (id: string, updates: Partial<AlertNotification>) => Promise<boolean>;
  deleteAlert: (id: string) => Promise<boolean>;

  // Users & Profiles Admin Management
  profilesList: UserProfile[];
  updateUserRole: (userId: string, role: 'user' | 'admin') => Promise<boolean>;

  // Website Content Management
  websiteContent: WebsiteContentData;
  updateWebsiteContent: (content: Partial<WebsiteContentData>) => Promise<boolean>;

  // Team Management (Supabase-backed text/data only)
  teamMembers: TeamMember[];
  addTeamMember: (member: Omit<TeamMember, 'id'>) => Promise<boolean>;
  updateTeamMember: (id: string, updates: Partial<TeamMember>) => Promise<boolean>;
  deleteTeamMember: (id: string) => Promise<boolean>;

  // Global Refresh
  refreshData: () => Promise<void>;

  // Admin helpers
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  duplicateProduct: (id: string) => void;
  resetAllData: () => void;
  // Quick navigation with smooth scroll to section if on home
  navigateTo: (mode: ViewMode, sectionId?: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('home');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [user, setUser] = useState<UserProfile | null>(INITIAL_USER);
  const [savedProductIds, setSavedProductIds] = useState<string[]>(INITIAL_USER.savedProductIds);
  const [alerts, setAlerts] = useState<AlertNotification[]>(INITIAL_ALERTS);
  const [searchOpen, setSearchOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [recommendationResults, setRecommendationResults] = useState<RecommendationMatch[] | null>(null);
  const [activeResearchPaper, setActiveResearchPaper] = useState<ResearchPaper | null>(null);

  // New Portal States
  const [dailyIntakeLogs, setDailyIntakeLogs] = useState<DailyIntakeLogEntry[]>(INITIAL_DAILY_LOGS);
  const [sampleOrders, setSampleOrders] = useState<SampleTrialOrder[]>(INITIAL_SAMPLE_ORDERS);
  const [sensoryTrials, setSensoryTrials] = useState<SensoryTrialEntry[]>(INITIAL_SENSORY_TRIALS);
  const [productTastingNotes, setProductTastingNotes] = useState<Record<string, ProductTastingNote>>(INITIAL_TASTING_NOTES);
  const [familyProfiles, setFamilyProfiles] = useState<ChildFamilyProfile[]>(INITIAL_FAMILY_PROFILES);
  const [profilesList, setProfilesList] = useState<UserProfile[]>([]);
  const [websiteContent, setWebsiteContent] = useState<WebsiteContentData>(DEFAULT_WEBSITE_CONTENT);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(INITIAL_TEAM_MEMBERS);

  useEffect(() => {
    setActiveUserRole(user?.role);
  }, [user]);

  const addToast = (title: string, message?: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      if (isSupabaseConfigured) {
        profilesService.syncProfile(updated).catch(() => {});
      }
      return updated;
    });
    addToast('Profile Updated', 'Your dietary target and preferences have been synchronized.', 'success');
  };

  const openProductDetail = (productId: string) => {
    const found = products.find(p => p.id === productId);
    if (found) {
      setSelectedProduct(found);
    }
  };

  const toggleSaveProduct = (productId: string) => {
    const prod = products.find(p => p.id === productId);
    const prodName = prod ? prod.name : 'Product';
    const isSaved = savedProductIds.includes(productId);
    const updatedIds = isSaved 
      ? savedProductIds.filter(id => id !== productId)
      : [...savedProductIds, productId];

    setSavedProductIds(updatedIds);
    if (user) {
      const updatedUser: UserProfile = {
        ...user,
        savedProductIds: updatedIds,
        savedProducts: updatedIds
      };
      setUser(updatedUser);
      if (isSupabaseConfigured) {
        profilesService.syncProfile(updatedUser).catch(() => {});
      }
    }

    if (isSaved) {
      addToast('Removed from Saved Items', `${prodName} was removed from your dashboard.`, 'info');
    } else {
      addToast('Saved to Favorites', `${prodName} is now in your saved nutrition list.`, 'success');
    }
  };

  const isProductSaved = (productId: string) => savedProductIds.includes(productId);

  const markAlertAsRead = (alertId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, read: true } : a));
    if (isSupabaseConfigured) {
      alertsService.markAsRead(alertId).catch(() => {});
    }
  };

  // Daily Intake Tracker Methods
  const addIntakeLog = async (entry: Omit<DailyIntakeLogEntry, 'id' | 'timestamp'>) => {
    const now = new Date();
    const timeString = `Today, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    const newEntry: DailyIntakeLogEntry = {
      ...entry,
      id: 'log-' + Date.now(),
      timestamp: timeString
    };
    
    // Optimistic update
    setDailyIntakeLogs(prev => [newEntry, ...prev]);
    const prevFiber = user?.currentFiberIntakeGrams ?? 0;
    if (user) {
      const newTotal = Number((prevFiber + entry.fiberGrams).toFixed(1));
      setUser(prev => prev ? { ...prev, currentFiberIntakeGrams: newTotal } : null);
    }
    addToast('Intake Logged', `Added ${entry.servings}x ${entry.productName} (+${entry.fiberGrams}g fiber).`, 'success');

    if (isSupabaseConfigured) {
      try {
        const success = await intakeLogsService.insert(newEntry, user?.id);
        if (!success) {
          // Rollback on failure
          setDailyIntakeLogs(prev => prev.filter(l => l.id !== newEntry.id));
          if (user) {
            setUser(prev => prev ? { ...prev, currentFiberIntakeGrams: prevFiber } : null);
          }
          addToast('Database Error', 'Could not save intake log to database. Reverted.', 'warning');
        } else if (user) {
          profilesService.syncProfile({ ...user, currentFiberIntakeGrams: Number((prevFiber + entry.fiberGrams).toFixed(1)) }).catch(() => {});
        }
      } catch (err: any) {
        setDailyIntakeLogs(prev => prev.filter(l => l.id !== newEntry.id));
        if (user) {
          setUser(prev => prev ? { ...prev, currentFiberIntakeGrams: prevFiber } : null);
        }
        addToast('Sync Error', err?.message || 'Database error occurred. Reverted.', 'error');
      }
    }
  };

  const removeIntakeLog = async (id: string) => {
    const item = dailyIntakeLogs.find(l => l.id === id);
    if (!item) return;

    // Optimistic removal
    setDailyIntakeLogs(prev => prev.filter(l => l.id !== id));
    const prevFiber = user?.currentFiberIntakeGrams ?? 0;
    if (user) {
      const newTotal = Math.max(0, Number((prevFiber - item.fiberGrams).toFixed(1)));
      setUser(prev => prev ? { ...prev, currentFiberIntakeGrams: newTotal } : null);
    }
    addToast('Serving Removed', 'Daily intake log updated.', 'info');

    if (isSupabaseConfigured) {
      try {
        const success = await intakeLogsService.delete(id);
        if (!success) {
          // Rollback on failure
          setDailyIntakeLogs(prev => [item, ...prev]);
          if (user) {
            setUser(prev => prev ? { ...prev, currentFiberIntakeGrams: prevFiber } : null);
          }
          addToast('Database Error', 'Could not delete intake log from database. Restored.', 'warning');
        } else if (user) {
          profilesService.syncProfile({ ...user, currentFiberIntakeGrams: Math.max(0, Number((prevFiber - item.fiberGrams).toFixed(1))) }).catch(() => {});
        }
      } catch (err: any) {
        setDailyIntakeLogs(prev => [item, ...prev]);
        if (user) {
          setUser(prev => prev ? { ...prev, currentFiberIntakeGrams: prevFiber } : null);
        }
        addToast('Sync Error', err?.message || 'Database error occurred. Restored.', 'error');
      }
    }
  };

  const clearDailyLogs = async () => {
    const prevLogs = [...dailyIntakeLogs];
    const prevFiber = user?.currentFiberIntakeGrams ?? 0;

    setDailyIntakeLogs([]);
    if (user) {
      setUser(prev => prev ? { ...prev, currentFiberIntakeGrams: 0 } : null);
    }
    addToast('Daily Log Reset', 'Intake counter reset for a new recording cycle.', 'info');

    if (isSupabaseConfigured) {
      try {
        const success = await intakeLogsService.clearAll(user?.id);
        if (!success) {
          setDailyIntakeLogs(prevLogs);
          if (user) {
            setUser(prev => prev ? { ...prev, currentFiberIntakeGrams: prevFiber } : null);
          }
          addToast('Database Error', 'Could not reset logs in database. Restored.', 'warning');
        } else if (user) {
          profilesService.syncProfile({ ...user, currentFiberIntakeGrams: 0 }).catch(() => {});
        }
      } catch (err: any) {
        setDailyIntakeLogs(prevLogs);
        if (user) {
          setUser(prev => prev ? { ...prev, currentFiberIntakeGrams: prevFiber } : null);
        }
        addToast('Sync Error', err?.message || 'Database error occurred. Restored.', 'error');
      }
    }
  };

  // Sample Orders Methods
  const createSampleOrder = async (orderData: Omit<SampleTrialOrder, 'id' | 'orderNumber' | 'date'>) => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newOrder: SampleTrialOrder = {
      ...orderData,
      id: 'ord-' + Date.now(),
      orderNumber: `NB-2026-TR-${randomNum}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
    };
    setSampleOrders(prev => [newOrder, ...prev]);
    addToast('Trial Order Placed', `Order ${newOrder.orderNumber} is submitted for lab dispatch.`, 'success');

    if (isSupabaseConfigured) {
      try {
        const success = await sampleOrdersService.insert(newOrder, user?.id);
        if (!success) {
          setSampleOrders(prev => prev.filter(o => o.id !== newOrder.id));
          addToast('Database Error', 'Could not save trial order to database. Reverted.', 'warning');
        }
      } catch (err: any) {
        setSampleOrders(prev => prev.filter(o => o.id !== newOrder.id));
        addToast('Sync Error', err?.message || 'Database error occurred.', 'error');
      }
    }
  };

  const updateOrderStatus = async (id: string, status: SampleOrderStatus, notes?: string) => {
    const prevOrder = sampleOrders.find(ord => ord.id === id);
    if (!prevOrder) return;

    setSampleOrders(prev => prev.map(ord => {
      if (ord.id === id) {
        return {
          ...ord,
          status,
          trackingNotes: notes !== undefined ? notes : ord.trackingNotes
        };
      }
      return ord;
    }));
    addToast('Status Updated', `Order status updated to ${status}.`, 'info');

    if (isSupabaseConfigured) {
      try {
        const success = await sampleOrdersService.updateStatus(id, status, notes);
        if (!success) {
          setSampleOrders(prev => prev.map(o => o.id === id ? prevOrder : o));
          addToast('Database Error', 'Failed to update order in database. Reverted.', 'warning');
        }
      } catch (err: any) {
        setSampleOrders(prev => prev.map(o => o.id === id ? prevOrder : o));
        addToast('Sync Error', err?.message || 'Database error occurred.', 'error');
      }
    }
  };

  // Sensory Trials Methods
  const addSensoryTrial = async (trialData: Omit<SensoryTrialEntry, 'id' | 'date'>) => {
    const newTrial: SensoryTrialEntry = {
      ...trialData,
      id: 'sen-' + Date.now(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
    };
    setSensoryTrials(prev => [newTrial, ...prev]);
    addToast('Trial Evaluation Logged', `Recorded panelist score: ${newTrial.overallAcceptability}% for ${newTrial.productName}.`, 'success');

    if (isSupabaseConfigured) {
      try {
        const success = await sensoryTrialsService.insert(newTrial);
        if (!success) {
          setSensoryTrials(prev => prev.filter(t => t.id !== newTrial.id));
          addToast('Database Error', 'Could not save sensory trial to database. Reverted.', 'warning');
        }
      } catch (err: any) {
        setSensoryTrials(prev => prev.filter(t => t.id !== newTrial.id));
        addToast('Sync Error', err?.message || 'Database error occurred.', 'error');
      }
    }
  };

  const deleteSensoryTrial = async (id: string) => {
    const prevTrial = sensoryTrials.find(t => t.id === id);
    if (!prevTrial) return;

    setSensoryTrials(prev => prev.filter(t => t.id !== id));
    addToast('Trial Removed', 'Sensory record removed from panel dataset.', 'info');

    if (isSupabaseConfigured) {
      try {
        const success = await sensoryTrialsService.delete(id);
        if (!success) {
          setSensoryTrials(prev => [prevTrial, ...prev]);
          addToast('Database Error', 'Could not delete trial from database. Restored.', 'warning');
        }
      } catch (err: any) {
        setSensoryTrials(prev => [prevTrial, ...prev]);
        addToast('Sync Error', err?.message || 'Database error occurred.', 'error');
      }
    }
  };

  // Product Tasting Notes Methods
  const saveProductTastingNote = async (productId: string, rating: number, notes: string) => {
    const prevNote = productTastingNotes[productId];
    const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    setProductTastingNotes(prev => ({
      ...prev,
      [productId]: { productId, rating, notes, date: dateStr }
    }));
    addToast('Notes Saved', 'Your personal sensory evaluation is saved to your profile.', 'success');

    if (isSupabaseConfigured) {
      try {
        const success = await tastingNotesService.upsert(productId, rating, notes, dateStr, user?.id);
        if (!success) {
          setProductTastingNotes(prev => {
            const next = { ...prev };
            if (prevNote) next[productId] = prevNote;
            else delete next[productId];
            return next;
          });
          addToast('Database Error', 'Could not save tasting notes to database. Reverted.', 'warning');
        }
      } catch (err: any) {
        setProductTastingNotes(prev => {
          const next = { ...prev };
          if (prevNote) next[productId] = prevNote;
          else delete next[productId];
          return next;
        });
        addToast('Sync Error', err?.message || 'Database error occurred.', 'error');
      }
    }
  };

  // Family Profiles Methods
  const addFamilyProfile = async (profileData: Omit<ChildFamilyProfile, 'id'>) => {
    const newProfile: ChildFamilyProfile = {
      ...profileData,
      id: 'fam-' + Date.now()
    };
    setFamilyProfiles(prev => [...prev, newProfile]);
    addToast('Family Member Added', `${newProfile.name}'s dietary profile is now active.`, 'success');

    if (isSupabaseConfigured) {
      try {
        const success = await familyProfilesService.insert(newProfile, user?.id);
        if (!success) {
          setFamilyProfiles(prev => prev.filter(p => p.id !== newProfile.id));
          addToast('Database Error', 'Could not save family profile to database. Reverted.', 'warning');
        }
      } catch (err: any) {
        setFamilyProfiles(prev => prev.filter(p => p.id !== newProfile.id));
        addToast('Sync Error', err?.message || 'Database error occurred.', 'error');
      }
    }
  };

  const updateFamilyProfile = async (id: string, updates: Partial<ChildFamilyProfile>) => {
    const prevProfile = familyProfiles.find(p => p.id === id);
    if (!prevProfile) return;

    setFamilyProfiles(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    addToast('Profile Updated', 'Family nutrition settings updated.', 'info');

    if (isSupabaseConfigured) {
      try {
        const success = await familyProfilesService.update(id, updates);
        if (!success) {
          setFamilyProfiles(prev => prev.map(p => p.id === id ? prevProfile : p));
          addToast('Database Error', 'Could not update family profile in database. Reverted.', 'warning');
        }
      } catch (err: any) {
        setFamilyProfiles(prev => prev.map(p => p.id === id ? prevProfile : p));
        addToast('Sync Error', err?.message || 'Database error occurred.', 'error');
      }
    }
  };

  const deleteFamilyProfile = async (id: string) => {
    const prevProfile = familyProfiles.find(p => p.id === id);
    if (!prevProfile) return;

    setFamilyProfiles(prev => prev.filter(p => p.id !== id));
    addToast('Profile Removed', 'Family record removed.', 'info');

    if (isSupabaseConfigured) {
      try {
        const success = await familyProfilesService.delete(id);
        if (!success) {
          setFamilyProfiles(prev => [...prev, prevProfile]);
          addToast('Database Error', 'Could not delete family profile from database. Restored.', 'warning');
        }
      } catch (err: any) {
        setFamilyProfiles(prev => [...prev, prevProfile]);
        addToast('Sync Error', err?.message || 'Database error occurred.', 'error');
      }
    }
  };

  const deleteSampleOrder = async (id: string): Promise<boolean> => {
    const prev = sampleOrders.find(o => o.id === id);
    setSampleOrders(orders => orders.filter(o => o.id !== id));
    addToast('Order Removed', 'Sample trial order was deleted.', 'info');
    try {
      const success = await sampleOrdersService.delete(id);
      if (!success && prev) {
        setSampleOrders(orders => [prev, ...orders]);
        addToast('Database Error', 'Could not delete order from database. Restored.', 'warning');
        return false;
      }
      return true;
    } catch {
      if (prev) setSampleOrders(orders => [prev, ...orders]);
      return false;
    }
  };

  const addAlert = async (newAlertData: Omit<AlertNotification, 'id'>): Promise<boolean> => {
    const newAlert: AlertNotification = {
      ...newAlertData,
      id: 'alt-' + Date.now()
    };
    setAlerts(prev => [newAlert, ...prev]);
    addToast('Announcement Broadcast', `Alert "${newAlert.title}" published.`, 'success');
    try {
      const success = await alertsService.insert(newAlert, user?.id);
      if (!success) {
        setAlerts(prev => prev.filter(a => a.id !== newAlert.id));
        addToast('Database Notice', 'Alert stored locally.', 'warning');
      }
      return success;
    } catch {
      return false;
    }
  };

  const updateAlert = async (id: string, updates: Partial<AlertNotification>): Promise<boolean> => {
    const prevAlert = alerts.find(a => a.id === id);
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
    try {
      const success = await alertsService.update(id, updates);
      if (!success && prevAlert) {
        setAlerts(prev => prev.map(a => a.id === id ? prevAlert : a));
      }
      return success;
    } catch {
      if (prevAlert) setAlerts(prev => prev.map(a => a.id === id ? prevAlert : a));
      return false;
    }
  };

  const deleteAlert = async (id: string): Promise<boolean> => {
    const prevAlert = alerts.find(a => a.id === id);
    setAlerts(prev => prev.filter(a => a.id !== id));
    addToast('Alert Archived', 'Alert notification removed.', 'info');
    try {
      const success = await alertsService.delete(id);
      if (!success && prevAlert) {
        setAlerts(prev => [prevAlert, ...prev]);
        addToast('Database Error', 'Could not delete alert. Restored.', 'warning');
        return false;
      }
      return true;
    } catch {
      if (prevAlert) setAlerts(prev => [prevAlert, ...prev]);
      return false;
    }
  };

  const deleteTastingNote = async (id: string): Promise<boolean> => {
    const prevNotes = { ...productTastingNotes };
    const filtered = Object.fromEntries(
      Object.entries(productTastingNotes).filter(([key, n]) => key !== id && (n as ProductTastingNote).productId !== id)
    );
    setProductTastingNotes(filtered);
    try {
      const res = await fetch(`/api/admin/tasting-notes/${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (!res.ok) {
        setProductTastingNotes(prevNotes);
        return false;
      }
      addToast('Note Deleted', 'Tasting evaluation note removed.', 'info');
      return true;
    } catch {
      setProductTastingNotes(prevNotes);
      return false;
    }
  };

  const updateUserRole = async (userId: string, role: 'user' | 'admin'): Promise<boolean> => {
    setProfilesList(prev => prev.map(p => p.id === userId ? { ...p, role } : p));
    if (user && user.id === userId) {
      setUser(prev => prev ? { ...prev, role } : null);
    }
    addToast('User Role Updated', `Role changed to ${role.toUpperCase()}.`, 'success');
    try {
      const success = await profilesService.updateRole(userId, role);
      if (!success) {
        const fresh = await profilesService.getAllProfiles();
        setProfilesList(fresh);
      }
      return success;
    } catch {
      return false;
    }
  };

  const updateWebsiteContent = async (contentUpdates: Partial<WebsiteContentData>): Promise<boolean> => {
    const updated = { ...websiteContent, ...contentUpdates };
    setWebsiteContent(updated);
    addToast('Website Content Updated', 'Live site presentation parameters published.', 'success');
    try {
      const success = await websiteContentService.save(updated);
      return success;
    } catch {
      return false;
    }
  };

  // Team Management Methods
  const addTeamMember = async (memberData: Omit<TeamMember, 'id'>): Promise<boolean> => {
    const newId = 'team-' + Date.now();
    const newMember: TeamMember = {
      ...memberData,
      id: newId,
      bio: memberData.bio || memberData.focus || '',
      focus: memberData.bio || memberData.focus || '',
      displayOrder: memberData.displayOrder ?? (teamMembers.length + 1)
    };

    try {
      const success = await teamService.insert(newMember);
      if (!success) {
        addToast('Database Error', 'Could not save team member to remote Supabase database.', 'error');
        return false;
      }
      setTeamMembers(prev => [...prev, newMember]);
      addToast('Team Member Added', `${newMember.name} saved to remote team directory.`, 'success');
      return true;
    } catch (err: any) {
      addToast('Sync Error', err?.message || 'Database error occurred while adding team member.', 'error');
      return false;
    }
  };

  const updateTeamMember = async (id: string, updates: Partial<TeamMember>): Promise<boolean> => {
    const prevMember = teamMembers.find(m => m.id === id);
    if (!prevMember) return false;

    const normalizedUpdates = {
      ...updates,
      bio: updates.bio || updates.focus || prevMember.bio,
      focus: updates.bio || updates.focus || prevMember.focus
    };

    // Optimistically update UI
    setTeamMembers(prev => prev.map(m => m.id === id ? { ...m, ...normalizedUpdates } : m));

    try {
      const success = await teamService.update(id, normalizedUpdates);
      if (!success) {
        // Rollback optimistic state immediately
        setTeamMembers(prev => prev.map(m => m.id === id ? prevMember : m));
        addToast('Database Error', 'Could not save changes to remote team table. Reverted.', 'error');
        return false;
      }
      addToast('Team Member Updated', 'Changes saved to remote database successfully.', 'success');
      return true;
    } catch (err: any) {
      // Rollback optimistic state on error
      setTeamMembers(prev => prev.map(m => m.id === id ? prevMember : m));
      addToast('Sync Error', err?.message || 'Database error occurred. Reverted.', 'error');
      return false;
    }
  };

  const deleteTeamMember = async (id: string): Promise<boolean> => {
    const m = teamMembers.find(member => member.id === id);
    if (!m) return false;

    // Optimistically remove from state
    setTeamMembers(prev => prev.filter(member => member.id !== id));

    try {
      const success = await teamService.delete(id);
      if (!success) {
        // Rollback optimistic state immediately
        setTeamMembers(prev => [...prev, m]);
        addToast('Database Error', 'Could not delete member from remote database. Restored.', 'error');
        return false;
      }
      addToast('Team Member Removed', `${m.name} was removed from team.`, 'info');
      return true;
    } catch (err: any) {
      // Rollback optimistic state on error
      setTeamMembers(prev => [...prev, m]);
      addToast('Sync Error', err?.message || 'Database error occurred. Restored.', 'error');
      return false;
    }
  };

  const refreshData = async () => {
    try {
      const [prods, trials, orders, logs, families, alertData, profs, siteContent, teamData] = await Promise.all([
        productsService.getAll(),
        sensoryTrialsService.getAll(),
        sampleOrdersService.getAll(user?.id, user?.role === 'admin'),
        intakeLogsService.getForUser(user?.id),
        familyProfilesService.getForUser(user?.id),
        user?.role === 'admin' ? alertsService.getAll() : alertsService.getAlerts(user?.id),
        profilesService.getAllProfiles(),
        websiteContentService.get(),
        teamService.getAll()
      ]);
      if (prods) setProducts(prods);
      if (trials) setSensoryTrials(trials);
      if (orders) setSampleOrders(orders);
      if (logs) setDailyIntakeLogs(logs);
      if (families) setFamilyProfiles(families);
      if (alertData) setAlerts(alertData);
      if (profs && profs.length > 0) setProfilesList(profs);
      if (siteContent) setWebsiteContent(siteContent);
      if (teamData && teamData.length > 0) setTeamMembers(teamData);
      addToast('Data Synchronized', 'All database tables refreshed from Supabase.', 'info');
    } catch (e) {
      console.warn('Refresh data notice:', e);
    }
  };

  // Product CRUD
  const addProduct = async (newProdData: Omit<Product, 'id'>) => {
    const newId = 'prod-' + Date.now();
    const newProduct: Product = {
      ...newProdData,
      id: newId
    };
    setProducts(prev => [newProduct, ...prev]);
    addToast('Product Formulated & Added', `${newProduct.name} is now live in laboratory catalog.`, 'success');

    if (isSupabaseConfigured) {
      try {
        const success = await productsService.insert(newProduct);
        if (!success) {
          setProducts(prev => prev.filter(p => p.id !== newProduct.id));
          addToast('Database Error', 'Could not save product to database catalog. Reverted.', 'warning');
        }
      } catch (err: any) {
        setProducts(prev => prev.filter(p => p.id !== newProduct.id));
        addToast('Sync Error', err?.message || 'Database error occurred.', 'error');
      }
    }
  };

  const updateProduct = async (idOrProd: string | Product, fields?: Partial<Product>) => {
    const id = typeof idOrProd === 'string' ? idOrProd : idOrProd.id;
    const updatedFields = typeof idOrProd === 'string' ? (fields || {}) : idOrProd;
    const prevProduct = products.find(p => p.id === id);
    if (!prevProduct) return;

    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedFields } : p));
    if (selectedProduct && selectedProduct.id === id) {
      setSelectedProduct(prev => prev ? { ...prev, ...updatedFields } : null);
    }
    addToast('Product Updated', 'Nutritional formulation parameters saved successfully.', 'info');

    if (isSupabaseConfigured) {
      try {
        const success = await productsService.update(id, updatedFields);
        if (!success) {
          setProducts(prev => prev.map(p => p.id === id ? prevProduct : p));
          if (selectedProduct && selectedProduct.id === id) {
            setSelectedProduct(prevProduct);
          }
          addToast('Database Error', 'Could not update product in database catalog. Reverted.', 'warning');
        }
      } catch (err: any) {
        setProducts(prev => prev.map(p => p.id === id ? prevProduct : p));
        if (selectedProduct && selectedProduct.id === id) {
          setSelectedProduct(prevProduct);
        }
        addToast('Sync Error', err?.message || 'Database error occurred.', 'error');
      }
    }
  };

  const duplicateProduct = async (id: string) => {
    const p = products.find(prod => prod.id === id);
    if (!p) return;
    const cloned: Product = {
      ...p,
      id: 'prod-' + Date.now(),
      name: `${p.name} (Prototype v2)`,
      batchCode: `NB-LAB-${Math.floor(100 + Math.random() * 900)}`,
      labStatus: 'Formulation Testing'
    };
    setProducts(prev => [cloned, ...prev]);
    addToast('Formulation Cloned', `Created iteration prototype for ${p.name}.`, 'success');

    if (isSupabaseConfigured) {
      try {
        const success = await productsService.insert(cloned);
        if (!success) {
          setProducts(prev => prev.filter(prod => prod.id !== cloned.id));
          addToast('Database Error', 'Could not persist cloned product to database. Reverted.', 'warning');
        }
      } catch (err: any) {
        setProducts(prev => prev.filter(prod => prod.id !== cloned.id));
        addToast('Sync Error', err?.message || 'Database error occurred.', 'error');
      }
    }
  };

  const deleteProduct = async (id: string) => {
    const p = products.find(prod => prod.id === id);
    if (!p) return;

    setProducts(prev => prev.filter(prod => prod.id !== id));
    if (selectedProduct && selectedProduct.id === id) {
      setSelectedProduct(null);
    }
    addToast('Product Archived', `${p.name} was removed from catalog.`, 'warning');

    if (isSupabaseConfigured) {
      try {
        const success = await productsService.delete(id);
        if (!success) {
          setProducts(prev => [p, ...prev]);
          addToast('Database Error', 'Could not delete product from database catalog. Restored.', 'warning');
        }
      } catch (err: any) {
        setProducts(prev => [p, ...prev]);
        addToast('Sync Error', err?.message || 'Database error occurred.', 'error');
      }
    }
  };

  const resetAllData = () => {
    setProducts(INITIAL_PRODUCTS);
    setAlerts(INITIAL_ALERTS);
    setSavedProductIds(INITIAL_USER.savedProductIds);
    setDailyIntakeLogs(INITIAL_DAILY_LOGS);
    setSampleOrders(INITIAL_SAMPLE_ORDERS);
    setSensoryTrials(INITIAL_SENSORY_TRIALS);
    setProductTastingNotes(INITIAL_TASTING_NOTES);
    setFamilyProfiles(INITIAL_FAMILY_PROFILES);
    setUser(INITIAL_USER);
    addToast('Reset Complete', 'Laboratory demo dataset restored to baseline.', 'info');
  };

  const navigateTo = (mode: ViewMode, sectionId?: string) => {
    setViewMode(mode);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (sectionId) {
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  const handleSetUser: React.Dispatch<React.SetStateAction<UserProfile | null>> = useCallback((value) => {
    setUser(prev => {
      const next = typeof value === 'function' ? value(prev) : value;
      if (next === null && isSupabaseConfigured) {
        supabase.auth.signOut().catch(() => {});
      }
      return next;
    });
  }, []);

  // Supabase Auth and initial dataset synchronization
  useEffect(() => {
    let isMounted = true;

    // 1. Listen to Supabase Auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;
      if (session?.user) {
        try {
          const profile = await profilesService.getProfile(session.user.id, session.user.email);
          if (profile && isMounted) {
            setUser(profile);
            setSavedProductIds(profile.savedProductIds || []);
          }
        } catch {
          // Graceful fallback
        }
      }
    });

    // 2. Fetch catalog products & sensory data & website content & team
    const loadInitialDbData = async () => {
      try {
        const [prods, trials, siteContent, teamData] = await Promise.all([
          productsService.getAll(),
          sensoryTrialsService.getAll(),
          websiteContentService.get(),
          teamService.getAll()
        ]);
        if (isMounted) {
          if (prods !== undefined) setProducts(prods);
          if (trials !== undefined) setSensoryTrials(trials);
          if (siteContent) setWebsiteContent(siteContent);
          if (teamData && teamData.length > 0) setTeamMembers(teamData);
        }
      } catch (e) {
        console.warn('[NutriBake Supabase] Database catalog initialized with baseline', e);
      }
    };

    loadInitialDbData();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Fetch user-specific tables when user changes
  useEffect(() => {
    if (!user?.id) return;
    let isMounted = true;

    const loadUserData = async () => {
      try {
        const [logs, orders, notes, families, userAlerts, profs] = await Promise.all([
          intakeLogsService.getForUser(user.id),
          sampleOrdersService.getAll(user.id, user.role === 'admin'),
          tastingNotesService.getForUser(user.id),
          familyProfilesService.getForUser(user.id),
          user.role === 'admin' ? alertsService.getAll() : alertsService.getAlerts(user.id),
          user.role === 'admin' ? profilesService.getAllProfiles() : Promise.resolve([])
        ]);

        if (isMounted) {
          if (logs !== undefined) setDailyIntakeLogs(logs);
          if (orders !== undefined) setSampleOrders(orders);
          if (notes !== undefined) setProductTastingNotes(notes);
          if (families !== undefined) setFamilyProfiles(families);
          if (userAlerts !== undefined) setAlerts(userAlerts);
          if (profs && profs.length > 0) setProfilesList(profs);
        }
      } catch (e) {
        console.warn('[NutriBake Supabase] User data sync active', e);
      }
    };

    loadUserData();

    return () => {
      isMounted = false;
    };
  }, [user?.id, user?.role]);

  // Keyboard shortcut Ctrl+K / Cmd+K for global search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <AppContext.Provider
      value={{
        viewMode,
        setViewMode,
        products,
        selectedProduct,
        setSelectedProduct,
        openProductDetail,
        user,
        setUser: handleSetUser,
        updateUserProfile,
        savedProductIds,
        toggleSaveProduct,
        isProductSaved,
        alerts,
        markAlertAsRead,
        searchOpen,
        setSearchOpen,
        toasts,
        addToast,
        removeToast,
        recommendationResults,
        setRecommendationResults,
        activeResearchPaper,
        setActiveResearchPaper,
        dailyIntakeLogs,
        addIntakeLog,
        removeIntakeLog,
        clearDailyLogs,
        sampleOrders,
        createSampleOrder,
        updateOrderStatus,
        deleteSampleOrder,
        sensoryTrials,
        addSensoryTrial,
        deleteSensoryTrial,
        productTastingNotes,
        saveProductTastingNote,
        deleteTastingNote,
        familyProfiles,
        addFamilyProfile,
        updateFamilyProfile,
        deleteFamilyProfile,
        addAlert,
        updateAlert,
        deleteAlert,
        profilesList,
        updateUserRole,
        websiteContent,
        updateWebsiteContent,
        teamMembers,
        addTeamMember,
        updateTeamMember,
        deleteTeamMember,
        refreshData,
        addProduct,
        updateProduct,
        deleteProduct,
        duplicateProduct,
        resetAllData,
        navigateTo,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
