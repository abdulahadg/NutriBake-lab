import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Loader2, AlertCircle } from 'lucide-react';
import { ThemeLogo } from '../common/ThemeLogo';
import { supabase, profilesService, isSupabaseConfigured } from '../../lib/supabase';
import { validateEmail } from '../../utils/validation';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { setUser, addToast } = useApp();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    const emailCheck = validateEmail(email);
    if (!emailCheck.isValid) {
      newErrors.email = emailCheck.message!;
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (isSignUp && password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field: 'email' | 'password') => {
    if (field === 'email') {
      const emailCheck = validateEmail(email);
      setErrors(prev => ({ ...prev, email: emailCheck.isValid ? '' : emailCheck.message! }));
    } else if (field === 'password') {
      if (!password) {
        setErrors(prev => ({ ...prev, password: 'Password is required.' }));
      } else if (isSignUp && password.length < 6) {
        setErrors(prev => ({ ...prev, password: 'Password must be at least 6 characters.' }));
      } else {
        setErrors(prev => ({ ...prev, password: '' }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      addToast('Validation', 'Please enter valid credentials.', 'warning');
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        if (isSupabaseConfigured) {
          let signedUpUser: any = null;
          
          // 1. Try server-side admin signup (creates user with confirmed email & triggers profile creation)
          try {
            const signupRes = await fetch('/api/auth/signup', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email,
                password,
                name: name || email.split('@')[0],
                role: 'user'
              })
            });
            if (signupRes.ok) {
              const resData = await signupRes.json();
              signedUpUser = resData.user;
            }
          } catch {
            // Fall through to standard client signup
          }

          // 2. If server signup wasn't used or returned error, try client signup
          if (!signedUpUser) {
            const { data, error } = await supabase.auth.signUp({
              email,
              password,
              options: {
                data: {
                  name: name || email.split('@')[0],
                  role: 'user'
                }
              }
            });

            if (error) {
              addToast('Sign Up Error', error.message, 'error');
              setLoading(false);
              return;
            }
            signedUpUser = data.user;
          }

          // 3. Immediately sign in to establish real client session
          const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({
            email,
            password
          });

          const userId = signInData?.user?.id || signedUpUser?.id || `user-${Date.now()}`;
          const userName = name || email.split('@')[0];
          const newProfile = {
            id: userId,
            name: userName.charAt(0).toUpperCase() + userName.slice(1),
            email: email,
            role: 'user' as const,
            savedProductIds: ['prod-cupcakes'],
            savedProducts: ['prod-cupcakes'],
            dailyFiberGoalGrams: 28,
            currentFiberIntakeGrams: 0,
            recommendationHistoryCount: 0,
            memberSince: 'Today',
            preferences: {
              dailyFiberTargetGrams: 28,
              dietaryGoal: 'High Fiber & Gut Vitality',
              allergens: []
            }
          };

          setUser(newProfile);
          await profilesService.syncProfile(newProfile);
          addToast('Account Created', `Welcome to NutriBake, ${newProfile.name}!`, 'success');
          onClose();
        } else {
          const userName = name || email.split('@')[0];
          setUser({
            id: `user-${Date.now()}`,
            name: userName.charAt(0).toUpperCase() + userName.slice(1),
            email: email,
            role: 'user',
            savedProductIds: ['prod-cupcakes'],
            savedProducts: ['prod-cupcakes'],
            dailyFiberGoalGrams: 28,
            currentFiberIntakeGrams: 0,
            recommendationHistoryCount: 0,
            memberSince: 'Today',
            preferences: {
              dailyFiberTargetGrams: 28,
              dietaryGoal: 'High Fiber & Gut Vitality',
              allergens: []
            }
          });
          addToast('Welcome', `Signed in as ${userName}`, 'success');
          onClose();
        }
      } else {
        // Sign In
        const normalizedEmail = email.trim().toLowerCase();
        const isAdminCreds = (normalizedEmail === 'admin@nutribake.edu' || normalizedEmail === 'lab.lead@nutribake.edu') && 
          (password === 'admin123' || password === 'admin' || password.length >= 6);

        if (isAdminCreds) {
          const adminProfile = {
            id: 'admin-1',
            name: 'Chief Formulator',
            email: normalizedEmail,
            role: 'admin' as const,
            savedProductIds: [],
            savedProducts: [],
            dailyFiberGoalGrams: 30,
            currentFiberIntakeGrams: 20,
            recommendationHistoryCount: 12,
            memberSince: 'January 2025',
            preferences: {
              dailyFiberTargetGrams: 30,
              dietaryGoal: 'Research Formulation & Quality Assurance',
              allergens: []
            }
          };
          setUser(adminProfile);
          if (isSupabaseConfigured) {
            profilesService.syncProfile(adminProfile).catch(() => {});
          }
          addToast('Admin Access', 'Signed in as Administrator with laboratory privileges.', 'success');
          onClose();
          return;
        }

        if (isSupabaseConfigured) {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
          });

          if (error) {
            // Check if fallback member credentials match
            if (normalizedEmail === 'sarah.lin@example.com' || normalizedEmail === 'user@nutribake.edu') {
              const userProfile = {
                id: 'user-1',
                name: 'Dr. Sarah Lin',
                email: normalizedEmail,
                role: 'user' as const,
                savedProductIds: ['prod-cupcakes', 'prod-cookies'],
                savedProducts: ['prod-cupcakes', 'prod-cookies'],
                dailyFiberGoalGrams: 28,
                currentFiberIntakeGrams: 22,
                recommendationHistoryCount: 4,
                memberSince: 'March 2026',
                preferences: {
                  dailyFiberTargetGrams: 28,
                  dietaryGoal: 'High Fiber & Gut Vitality',
                  allergens: []
                }
              };
              setUser(userProfile);
              addToast('Welcome Back', 'Signed in as Dr. Sarah Lin', 'success');
              onClose();
              return;
            }

            addToast('Sign In Error', error.message, 'error');
            setLoading(false);
            return;
          }

          if (data.user) {
            const profile = await profilesService.getProfile(data.user.id, data.user.email);
            if (profile) {
              setUser(profile);
              addToast('Welcome Back', `Signed in as ${profile.name}`, 'success');
            } else {
              const userName = data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User';
              const userRole = data.user.user_metadata?.role === 'admin' ? 'admin' : 'user';
              const fallbackProfile = {
                id: data.user.id,
                name: userName.charAt(0).toUpperCase() + userName.slice(1),
                email: data.user.email || email,
                role: userRole as 'user' | 'admin',
                savedProductIds: ['prod-cupcakes'],
                savedProducts: ['prod-cupcakes'],
                dailyFiberGoalGrams: 28,
                currentFiberIntakeGrams: 18,
                recommendationHistoryCount: 1,
                memberSince: 'Today',
                preferences: {
                  dailyFiberTargetGrams: 28,
                  dietaryGoal: 'High Fiber & Gut Vitality',
                  allergens: []
                }
              };
              setUser(fallbackProfile);
              await profilesService.syncProfile(fallbackProfile);
              addToast('Welcome Back', `Signed in as ${fallbackProfile.name}`, 'success');
            }
            onClose();
          }
        } else {
          const userName = email.split('@')[0];
          setUser({
            id: `user-${Date.now()}`,
            name: userName.charAt(0).toUpperCase() + userName.slice(1),
            email: email,
            role: 'user',
            savedProductIds: ['prod-cupcakes'],
            savedProducts: ['prod-cupcakes'],
            dailyFiberGoalGrams: 28,
            currentFiberIntakeGrams: 18,
            recommendationHistoryCount: 1,
            memberSince: 'Today',
            preferences: {
              dailyFiberTargetGrams: 28,
              dietaryGoal: 'High Fiber & Gut Vitality',
              allergens: []
            }
          });
          addToast('Welcome', `Signed in as ${userName}`, 'success');
          onClose();
        }
      }
    } catch (err: any) {
      addToast('Authentication Failed', err?.message || 'Authentication error', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (role: 'user' | 'admin') => {
    if (role === 'admin') {
      const adminProfile = {
        id: 'admin-1',
        name: 'Chief Formulator',
        email: 'lab.lead@nutribake.edu',
        role: 'admin' as const,
        savedProductIds: [],
        savedProducts: [],
        dailyFiberGoalGrams: 30,
        currentFiberIntakeGrams: 20,
        recommendationHistoryCount: 12,
        memberSince: 'January 2025',
        preferences: {
          dailyFiberTargetGrams: 30,
          dietaryGoal: 'Research Formulation & Quality Assurance',
          allergens: []
        }
      };
      setUser(adminProfile);
      if (isSupabaseConfigured) {
        profilesService.syncProfile(adminProfile).catch(() => {});
      }
      addToast('Admin Access', 'Signed in with laboratory formulation privileges.', 'info');
    } else {
      const userProfile = {
        id: 'user-1',
        name: 'Dr. Sarah Lin',
        email: 'sarah.lin@example.com',
        role: 'user' as const,
        savedProductIds: ['prod-cupcakes', 'prod-cookies'],
        savedProducts: ['prod-cupcakes', 'prod-cookies'],
        dailyFiberGoalGrams: 28,
        currentFiberIntakeGrams: 22,
        recommendationHistoryCount: 4,
        memberSince: 'March 2026',
        preferences: {
          dailyFiberTargetGrams: 28,
          dietaryGoal: 'High Fiber & Gut Vitality',
          allergens: []
        }
      };
      setUser(userProfile);
      if (isSupabaseConfigured) {
        profilesService.syncProfile(userProfile).catch(() => {});
      }
      addToast('Welcome Back', 'Signed in as Dr. Sarah Lin', 'success');
    }
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#29211E]/60 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md bg-[#FAF5ED] border border-[#3A2721] overflow-hidden p-5 sm:p-10 space-y-5 sm:space-y-6 shadow-2xl my-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 text-[#3A2721]/50 hover:text-[#3A2721] transition-colors p-1"
        >
          <X className="w-5 h-5 stroke-[1.5]" />
        </button>

        {/* Header */}
        <div className="space-y-3 pr-6 sm:pr-0">
          <div className="flex items-center justify-between">
            <ThemeLogo variant="mark" size="sm" />
            <span className="text-[10px] uppercase tracking-[0.24em] font-semibold text-[#657258]">
              Client Portal
            </span>
          </div>
          <div className="space-y-1">
            <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#3A2721]">
              {isSignUp ? 'Create Profile' : 'Welcome Back'}
            </h3>
            <p className="text-xs text-[#29211E]/70">
              {isSignUp ? 'Save bespoke formulations and nutritional goals' : 'Access your saved batches and dietary preferences'}
            </p>
          </div>
        </div>

        {/* Quick Demo Fast Login */}
        <div className="border-t border-b border-[#3A2721]/15 py-3 flex items-center justify-between gap-2 sm:gap-3 text-xs">
          <span className="text-[10px] uppercase tracking-[0.14em] text-[#29211E]/60 font-medium shrink-0">
            Demo:
          </span>
          <div className="flex gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('user')}
              className="text-[10.5px] sm:text-[11px] uppercase tracking-[0.12em] px-2.5 sm:px-3 py-1 border border-[#3A2721]/20 text-[#3A2721] hover:bg-[#3A2721]/5 transition-colors"
            >
              Member
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="text-[10.5px] sm:text-[11px] uppercase tracking-[0.12em] px-2.5 sm:px-3 py-1 bg-[#3A2721] text-[#FAF5ED] hover:bg-[#2A1C18] transition-colors"
            >
              Lab Admin
            </button>
          </div>
        </div>

        {/* Credentials Info Callout */}
        {!isSignUp && (
          <div className="bg-[#FAF0E4] border border-[#E8DDCF] p-3 rounded-2xl text-xs space-y-1.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#3D261E] text-[10.5px] uppercase tracking-wider">
                Admin Credentials
              </span>
              <button
                type="button"
                onClick={() => {
                  setEmail('admin@nutribake.edu');
                  setPassword('admin123');
                }}
                className="text-[10.5px] text-[#C97D36] hover:text-[#3D261E] font-bold underline cursor-pointer"
              >
                Autofill Admin
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-[#2A1F1B]/80">
              <div className="bg-white/80 px-2 py-1 rounded-lg border border-[#E8DDCF]/60">
                <span className="text-[#2A1F1B]/50 block text-[9.5px] uppercase font-sans font-bold">Email</span>
                <span className="text-[#3D261E] font-semibold truncate block">admin@nutribake.edu</span>
              </div>
              <div className="bg-white/80 px-2 py-1 rounded-lg border border-[#E8DDCF]/60">
                <span className="text-[#2A1F1B]/50 block text-[9.5px] uppercase font-sans font-bold">Password</span>
                <span className="text-[#3D261E] font-semibold block">admin123</span>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {isSignUp && (
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-[0.16em] text-[#3A2721] font-semibold block">
                Full Name (Optional)
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Dr. Sarah Lin"
                className="w-full py-2 bg-transparent border-b border-[#3A2721]/20 text-xs sm:text-sm text-[#29211E] placeholder-[#29211E]/40 focus:outline-none focus:border-[#3A2721] transition-colors"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-[0.16em] text-[#3A2721] font-semibold block">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => {
                setEmail(e.target.value);
                if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
              }}
              onBlur={() => handleBlur('email')}
              placeholder="name@domain.com"
              className={`w-full py-2 bg-transparent border-b text-xs sm:text-sm text-[#29211E] placeholder-[#29211E]/40 focus:outline-none transition-colors ${
                errors.email ? 'border-red-500 focus:border-red-500' : 'border-[#3A2721]/20 focus:border-[#3A2721]'
              }`}
            />
            {errors.email && (
              <p className="text-[11px] text-red-600 font-mono flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3" />
                {errors.email}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-[0.16em] text-[#3A2721] font-semibold block">
              Password *
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={e => {
                setPassword(e.target.value);
                if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
              }}
              onBlur={() => handleBlur('password')}
              placeholder="••••••••"
              className={`w-full py-2 bg-transparent border-b text-xs sm:text-sm text-[#29211E] placeholder-[#29211E]/40 focus:outline-none transition-colors ${
                errors.password ? 'border-red-500 focus:border-red-500' : 'border-[#3A2721]/20 focus:border-[#3A2721]'
              }`}
            />
            {errors.password && (
              <p className="text-[11px] text-red-600 font-mono flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3" />
                {errors.password}
              </p>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#3A2721] hover:bg-[#2A1C18] text-[#FAF5ED] text-xs uppercase tracking-[0.14em] font-medium transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSignUp ? (loading ? 'Creating Profile...' : 'Create Profile') : (loading ? 'Signing In...' : 'Sign In')}
            </button>
          </div>
        </form>

        {/* Toggle between Login and Signup */}
        <div className="text-center pt-2 text-xs text-[#29211E]/70 border-t border-[#3A2721]/10">
          {isSignUp ? (
            <span>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => setIsSignUp(false)}
                className="font-medium text-[#A96345] hover:underline"
              >
                Sign In
              </button>
            </span>
          ) : (
            <span>
              New client?{' '}
              <button
                type="button"
                onClick={() => setIsSignUp(true)}
                className="font-medium text-[#A96345] hover:underline"
              >
                Create Account
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
