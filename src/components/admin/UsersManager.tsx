import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserProfileRecord } from '../../lib/supabase';
import { 
  Users, 
  ShieldCheck, 
  User, 
  Search, 
  Filter, 
  CheckCircle2, 
  Sparkles,
  ArrowUpDown
} from 'lucide-react';

export const UsersManager: React.FC = () => {
  const { profilesList, updateUserRole, user: currentUser, addToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'user'>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filteredUsers = profilesList.filter(u => {
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      (u.name && u.name.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.dietary_goal && u.dietary_goal.toLowerCase().includes(q));
    return matchesRole && matchesSearch;
  });

  const handleRoleToggle = async (profile: UserProfileRecord) => {
    const newRole = profile.role === 'admin' ? 'user' : 'admin';
    if (profile.id === currentUser?.id && newRole === 'user') {
      if (!window.confirm('Warning: You are demoting your own active account from Admin to User. Continue?')) {
        return;
      }
    }
    setUpdatingId(profile.id);
    try {
      const success = await updateUserRole(profile.id, newRole);
      if (success) {
        addToast('Role Updated', `${profile.name || 'User'} role set to ${newRole.toUpperCase()}.`, 'success');
      } else {
        addToast('Update Failed', 'Could not update user role.', 'error');
      }
    } catch {
      addToast('Error', 'Failed to change user role.', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3A2721]/15 pb-4">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-editorial font-bold text-[#657258] block">
            Security & Identity
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#3A2721]">
            User Profiles & Access Management
          </h2>
          <p className="text-xs text-[#2A1F1B]/75 mt-1 font-sans">
            Manage user accounts, dietary personalization goals, and elevate researchers to administrator privileges.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-[#3D261E] bg-[#FAF0E4] px-3 py-1.5 rounded-full border border-[#E8DDCF]">
            {profilesList.length} Registered Accounts
          </span>
        </div>
      </div>

      {/* SEARCH AND FILTER BAR */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#3D261E]/40" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-[#E8DDCF] rounded-full text-xs placeholder:text-[#3D261E]/40 shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <span className="text-[11px] text-[#2A1F1B]/70 font-mono">Role:</span>
          {(['all', 'admin', 'user'] as const).map(role => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition-all ${
                roleFilter === role
                  ? 'bg-[#3D261E] text-white shadow-2xs'
                  : 'bg-white text-[#3D261E]/70 border border-[#E8DDCF] hover:bg-[#FAF0E4]'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* USERS TABLE */}
      <div className="bg-white rounded-3xl border border-[#E8DDCF] overflow-hidden shadow-[0_8px_30px_rgba(61,38,30,0.03)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] border-b border-[#E8DDCF] font-mono text-[10.5px] uppercase tracking-editorial text-[#3D261E]/70">
              <tr>
                <th className="py-3 px-4 font-bold">User</th>
                <th className="py-3 px-4 font-bold">Role & Access</th>
                <th className="py-3 px-4 font-bold">Fiber Target</th>
                <th className="py-3 px-4 font-bold">Dietary Goal</th>
                <th className="py-3 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DDCF]/60 font-sans">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-[#2A1F1B]/60 text-xs">
                    No registered user accounts found matching your filter.
                  </td>
                </tr>
              ) : (
                filteredUsers.map(profile => (
                  <tr key={profile.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#FAF0E4] border border-[#E8DDCF] flex items-center justify-center text-[#C97D36] font-bold text-xs shrink-0">
                          {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <p className="font-semibold text-[#3D261E]">{profile.name || 'Unnamed Account'}</p>
                          <p className="text-[11px] text-[#2A1F1B]/60 font-mono">{profile.email || profile.id}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-mono font-bold ${
                        profile.role === 'admin'
                          ? 'bg-[#FAF0E4] text-[#C97D36] border border-[#EAD2B9]'
                          : 'bg-[#EEF3EB] text-[#5E7252] border border-[#D4E0CD]'
                      }`}>
                        {profile.role === 'admin' ? (
                          <>
                            <ShieldCheck className="w-3 h-3" />
                            <span>Administrator</span>
                          </>
                        ) : (
                          <>
                            <User className="w-3 h-3" />
                            <span>Consumer</span>
                          </>
                        )}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-[#3D261E]">
                      {profile.daily_fiber_target ? `${profile.daily_fiber_target}g / day` : '25g (Default)'}
                    </td>

                    <td className="py-3.5 px-4 text-xs text-[#2A1F1B]/80 max-w-xs truncate">
                      {profile.dietary_goal || 'General Gut Vitality & Family Nutrition'}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleRoleToggle(profile)}
                        disabled={updatingId === profile.id}
                        className={`px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-all ${
                          profile.role === 'admin'
                            ? 'border-[#C86B52] text-[#C86B52] hover:bg-red-50'
                            : 'border-[#5E7252] text-[#5E7252] hover:bg-[#EEF3EB]'
                        } disabled:opacity-50`}
                      >
                        {updatingId === profile.id ? 'Updating...' : profile.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
