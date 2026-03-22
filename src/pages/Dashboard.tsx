import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, User, Lock, Settings, LogOut, Shield, Bell, Camera,
  CheckCircle, Clock, AlertCircle, ChevronRight, MessageSquare, Calendar,
  Megaphone, Eye, EyeOff, Home, Check, Upload, X, Building, Briefcase,
  Phone, FileText, Edit3
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { userAPI, forumAPI, contentAPI, authAPI } from '../services/api';

type Tab = 'overview' | 'profile' | 'security' | 'settings';

// ── Helpers ──────────────────────────────────────────────────────────────────
const statusConfig: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  verified:             { label: 'Verified',             color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200', icon: <CheckCircle className="h-3.5 w-3.5" /> },
  pending_verification: { label: 'Pending Verification', color: 'text-amber-700',   bg: 'bg-amber-50 border-amber-200',    icon: <Clock className="h-3.5 w-3.5" /> },
  pending:              { label: 'Pending',              color: 'text-amber-700',   bg: 'bg-amber-50 border-amber-200',    icon: <Clock className="h-3.5 w-3.5" /> },
  rejected:             { label: 'Rejected',             color: 'text-red-700',     bg: 'bg-red-50 border-red-200',        icon: <AlertCircle className="h-3.5 w-3.5" /> },
  suspended:            { label: 'Suspended',            color: 'text-red-700',     bg: 'bg-red-50 border-red-200',        icon: <AlertCircle className="h-3.5 w-3.5" /> },
};

const getStatusCfg = (status: string) =>
  statusConfig[status] || { label: status, color: 'text-gray-600', bg: 'bg-gray-50 border-gray-200', icon: <Clock className="h-3.5 w-3.5" /> };

const Avatar = ({ src, name, size = 'md' }: { src?: string; name?: string; size?: 'sm' | 'md' | 'lg' | 'xl' }) => {
  const sz = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-16 h-16 text-xl', xl: 'w-24 h-24 text-3xl' }[size];
  const initials = name ? name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : '?';
  if (src) return <img src={src} alt={name} className={`${sz} rounded-full object-cover`} />;
  return (
    <div className={`${sz} rounded-full bg-secondary/20 flex items-center justify-center font-bold text-secondary border-2 border-secondary/30`}>
      {initials}
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
const Dashboard = () => {
  const { state, logout, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const user = state.user;

  const [activeTab, setActiveTab] = useState<Tab>('overview');

  // Overview data
  const [forums, setForums] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loadingOverview, setLoadingOverview] = useState(true);

  // Profile editing
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.profile?.phone || '',
    institution: user?.profile?.institution || '',
    specialization: user?.profile?.specialization || '',
    bio: user?.profile?.bio || '',
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Photo upload
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoUploading, setPhotoUploading] = useState(false);

  // Security
  const [secForm, setSecForm] = useState({ current: '', newPwd: '', confirm: '' });
  const [showPwd, setShowPwd] = useState({ current: false, newPwd: false, confirm: false });
  const [secSaving, setSecSaving] = useState(false);
  const [secMsg, setSecMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Settings / preferences — seeded from user.preferences once loaded
  const [prefs, setPrefs] = useState({
    emailAnnouncements: user?.preferences?.emailAnnouncements ?? true,
    emailEvents:        user?.preferences?.emailEvents        ?? true,
    emailForum:         user?.preferences?.emailForum         ?? false,
    profileVisible:     user?.preferences?.profileVisible     ?? true,
  });
  const [prefsSaving, setPrefsSaving] = useState(false);
  const [prefsMsg, setPrefsMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Redirect admin / super_admin
  useEffect(() => {
    if (user?.role === 'admin' || user?.role === 'super_admin') { window.location.href = '/admin'; }
  }, [user]);

  // Sync form + prefs when user loads/changes
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.profile?.phone || '',
        institution: user.profile?.institution || '',
        specialization: user.profile?.specialization || '',
        bio: user.profile?.bio || '',
      });
      setPrefs({
        emailAnnouncements: user.preferences?.emailAnnouncements ?? true,
        emailEvents:        user.preferences?.emailEvents        ?? true,
        emailForum:         user.preferences?.emailForum         ?? false,
        profileVisible:     user.preferences?.profileVisible     ?? true,
      });
    }
  }, [user]);

  // Fetch overview data
  useEffect(() => {
    if (!state.isAuthenticated) return;
    const load = async () => {
      try {
        const [cats, ann, evts] = await Promise.all([
          forumAPI.getForums(),
          contentAPI.getAnnouncements(),
          contentAPI.getEvents(),
        ]);
        setForums(cats.slice(0, 4));
        setAnnouncements(ann.slice(0, 3));
        setEvents(evts.slice(0, 3));
      } catch { /* silent */ }
      finally { setLoadingOverview(false); }
    };
    load();
  }, [state.isAuthenticated]);

  // ── Actions ────────────────────────────────────────────────────────────────
  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { alert('Please select an image file'); return; }
    if (file.size > 5 * 1024 * 1024) { alert('Image must be smaller than 5 MB'); return; }
    setPhotoPreview(URL.createObjectURL(file));
    setPhotoUploading(true);
    try {
      const fd = new FormData();
      fd.append('photo', file);
      const updated = await userAPI.updateProfile(fd);
      updateUserProfile(updated.user || updated);
      setPhotoPreview(null);
    } catch (err: any) {
      alert(err.message || 'Failed to upload photo');
      setPhotoPreview(null);
    } finally {
      setPhotoUploading(false);
      e.target.value = '';
    }
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMsg(null);
    try {
      const updated = await userAPI.updateProfileInfo({
        name: profileForm.name,
        email: profileForm.email,
        phone: profileForm.phone,
        institution: profileForm.institution,
        specialization: profileForm.specialization,
        bio: profileForm.bio,
      });
      updateUserProfile(updated.user || updated);
      setProfileMsg({ type: 'success', text: 'Profile updated successfully.' });
    } catch (err: any) {
      setProfileMsg({ type: 'error', text: err.message || 'Failed to update profile.' });
    } finally {
      setProfileSaving(false);
    }
  };

  const handleSecuritySave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecMsg(null);
    if (secForm.newPwd !== secForm.confirm) { setSecMsg({ type: 'error', text: 'New passwords do not match.' }); return; }
    if (secForm.newPwd.length < 6) { setSecMsg({ type: 'error', text: 'Password must be at least 6 characters.' }); return; }
    setSecSaving(true);
    try {
      await userAPI.changePassword({ currentPassword: secForm.current, newPassword: secForm.newPwd });
      setSecMsg({ type: 'success', text: 'Password changed successfully.' });
      setSecForm({ current: '', newPwd: '', confirm: '' });
    } catch (err: any) {
      setSecMsg({ type: 'error', text: err.message || 'Failed to change password.' });
    } finally {
      setSecSaving(false);
    }
  };

  const handlePrefsSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setPrefsSaving(true);
    setPrefsMsg(null);
    try {
      const result = await userAPI.updatePreferences(prefs);
      // Reflect saved prefs back into the auth context user object
      if (user) updateUserProfile({ ...user, preferences: result.preferences });
      setPrefsMsg({ type: 'success', text: 'Preferences saved.' });
    } catch (err: any) {
      setPrefsMsg({ type: 'error', text: err.message || 'Failed to save preferences.' });
    } finally {
      setPrefsSaving(false);
    }
  };

  // ── Profile completeness ────────────────────────────────────────────────────
  const completionFields = [
    !!user?.profile?.photo,
    !!user?.profile?.phone,
    !!user?.profile?.institution,
    !!user?.profile?.specialization,
    !!user?.profile?.bio,
    !!user?.profile?.idCard,
  ];
  const completionPct = Math.round((completionFields.filter(Boolean).length / completionFields.length) * 100);

  const statusCfg = getStatusCfg(user?.status || 'pending');

  // ── Sidebar nav ─────────────────────────────────────────────────────────────
  const navItems: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview',  icon: <LayoutDashboard className="h-4 w-4" /> },
    { id: 'profile',  label: 'Profile',   icon: <User className="h-4 w-4" /> },
    { id: 'security', label: 'Security',  icon: <Lock className="h-4 w-4" /> },
    { id: 'settings', label: 'Settings',  icon: <Settings className="h-4 w-4" /> },
  ];

  // ── Shared input class ──────────────────────────────────────────────────────
  const inputCls = "w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary focus:bg-white transition-all";
  const labelCls = "block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5";

  return (
    <div className="h-screen overflow-hidden flex bg-[#F5F7FA]">

      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      <aside className="h-screen sticky top-0 overflow-hidden w-60 bg-[#0A1A4A] flex flex-col flex-shrink-0">

        {/* Brand */}
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center flex-shrink-0">
            <Shield className="h-4 w-4 text-secondary" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none">ACSP</p>
            <p className="text-white/40 text-[10px] mt-0.5">Member Portal</p>
          </div>
        </div>

        {/* Avatar card */}
        <div className="px-4 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="relative group cursor-pointer" onClick={() => photoInputRef.current?.click()}>
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-secondary/40">
                {(photoPreview || user?.profile?.photo) ? (
                  <img src={photoPreview || user?.profile?.photo} alt={user?.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-secondary/20 flex items-center justify-center text-secondary font-bold text-sm">
                    {user?.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?'}
                  </div>
                )}
              </div>
              <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                {photoUploading ? (
                  <svg className="animate-spin h-3.5 w-3.5 text-white" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                ) : (
                  <Camera className="h-3.5 w-3.5 text-white" />
                )}
              </div>
              <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoSelect} />
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-semibold truncate">{user?.name || 'Member'}</p>
              <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full border ${statusCfg.bg} ${statusCfg.color} mt-0.5`}>
                {statusCfg.icon} {statusCfg.label}
              </span>
            </div>
          </div>

          {/* Profile completeness bar */}
          <div className="mt-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-white/40 text-[10px]">Profile complete</span>
              <span className="text-white/60 text-[10px] font-semibold">{completionPct}%</span>
            </div>
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-secondary rounded-full transition-all duration-500" style={{ width: `${completionPct}%` }} />
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-3">
          <p className="text-white/30 text-[10px] font-semibold uppercase tracking-widest px-2 mb-2">Menu</p>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 mb-0.5 ${
                activeTab === item.id
                  ? 'bg-secondary text-[#0A1A4A]'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-3 py-3 border-t border-white/10 space-y-0.5">
          <Link
            to="/"
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-white/50 hover:bg-white/10 hover:text-white transition-all"
          >
            <Home className="h-4 w-4" />
            Back to Site
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-white/50 hover:bg-red-500/20 hover:text-red-300 transition-all"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* ── Main ────────────────────────────────────────────────────────────── */}
      <main className="flex-1 h-screen overflow-y-auto">

        {/* Top bar */}
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-sm font-bold text-primary capitalize">{activeTab}</h1>
            <p className="text-xs text-gray-400">
              {activeTab === 'overview' && 'Your membership at a glance'}
              {activeTab === 'profile' && 'Manage your public profile'}
              {activeTab === 'security' && 'Password and authentication'}
              {activeTab === 'settings' && 'Notification preferences'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-gray-400 hover:text-primary transition-colors">
              <Bell className="h-4.5 w-4.5" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
            </button>
            <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-secondary/30 cursor-pointer" onClick={() => setActiveTab('profile')}>
              {user?.profile?.photo ? (
                <img src={user.profile.photo} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-secondary/10 flex items-center justify-center text-secondary font-bold text-xs">
                  {user?.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?'}
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="p-6 max-w-4xl mx-auto">

          {/* ── OVERVIEW ───────────────────────────────────────────────────── */}
          {activeTab === 'overview' && (
            <div className="space-y-6">

              {/* Welcome banner */}
              <div className="bg-gradient-to-r from-[#0A1A4A] to-[#0d2260] rounded-2xl p-6 flex items-center justify-between overflow-hidden relative">
                <div className="absolute right-0 top-0 w-64 h-full opacity-5">
                  <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1.5" fill="white"/></pattern></defs><rect width="100%" height="100%" fill="url(#dots)"/></svg>
                </div>
                <div>
                  <p className="text-secondary text-xs font-semibold tracking-widest uppercase mb-1">Welcome back</p>
                  <h2 className="text-white text-xl font-bold">{user?.name || 'Member'}</h2>
                  <p className="text-white/50 text-xs mt-1">
                    Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }) : '—'}
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${statusCfg.bg} ${statusCfg.color}`}>
                    {statusCfg.icon} {statusCfg.label}
                  </span>
                </div>
              </div>

              {/* Stat cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { label: 'Account Status', value: statusCfg.label, icon: <User className="h-5 w-5" />, color: 'text-primary', bg: 'bg-primary/10' },
                  { label: 'Profile Complete', value: `${completionPct}%`, icon: <CheckCircle className="h-5 w-5" />, color: 'text-secondary', bg: 'bg-secondary/10' },
                  { label: 'Forum Topics', value: forums.length.toString(), icon: <MessageSquare className="h-5 w-5" />, color: 'text-purple-600', bg: 'bg-purple-50' },
                ].map(c => (
                  <div key={c.label} className="bg-white rounded-xl p-4 border border-gray-100">
                    <div className={`w-9 h-9 rounded-lg ${c.bg} flex items-center justify-center ${c.color} mb-3`}>
                      {c.icon}
                    </div>
                    <p className="text-2xl font-bold text-primary">{c.value}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{c.label}</p>
                  </div>
                ))}
              </div>

              {/* Registration progress steps */}
              {(() => {
                const steps = [
                  { label: 'Email verified',          done: !!user?.isVerified },
                  { label: 'Profile photo uploaded',  done: !!user?.profile?.photo },
                  { label: 'ID card uploaded',        done: !!user?.profile?.idCard },
                  { label: 'Phone number added',      done: !!user?.profile?.phone },
                  { label: 'Institution filled in',   done: !!user?.profile?.institution },
                  { label: 'Specialization added',    done: !!user?.profile?.specialization },
                  { label: 'Bio written',             done: !!user?.profile?.bio },
                  { label: 'Account approved by admin', done: user?.status === 'verified' },
                ];
                const done = steps.filter(s => s.done).length;
                const pct  = Math.round((done / steps.length) * 100);
                return (
                  <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-primary">Registration Progress</h3>
                        <p className="text-xs text-gray-400 mt-0.5">{done} of {steps.length} steps completed</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${pct === 100 ? 'bg-emerald-500' : 'bg-secondary'}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className={`text-sm font-bold ${pct === 100 ? 'text-emerald-600' : 'text-secondary'}`}>{pct}%</span>
                      </div>
                    </div>
                    <div className="divide-y divide-gray-50">
                      {steps.map((step, i) => (
                        <div key={i} className="flex items-center gap-3 px-5 py-3">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${step.done ? 'bg-emerald-100' : 'bg-gray-100'}`}>
                            {step.done
                              ? <Check className="h-3 w-3 text-emerald-600" />
                              : <span className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
                            }
                          </div>
                          <span className={`text-sm flex-1 ${step.done ? 'text-gray-700' : 'text-gray-400'}`}>{step.label}</span>
                          {!step.done && (
                            <button
                              onClick={() => setActiveTab(step.label.includes('approved') ? 'overview' : 'profile')}
                              className="text-[10px] font-semibold text-secondary hover:text-secondary/80"
                            >
                              {step.label.includes('approved') ? 'Pending' : 'Add'}
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    {pct < 100 && (
                      <div className="px-5 py-3 bg-amber-50 border-t border-amber-100 flex items-center justify-between">
                        <p className="text-xs text-amber-700 font-medium">Complete all steps to get your membership approved.</p>
                        <button onClick={() => setActiveTab('profile')} className="text-xs font-semibold text-amber-800 flex items-center gap-1 hover:underline">
                          Update profile <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Announcements */}
              <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Megaphone className="h-4 w-4 text-secondary" />
                    <h3 className="text-sm font-bold text-primary">Recent Announcements</h3>
                  </div>
                  <Link to="/announcements" className="text-xs text-secondary font-medium hover:underline">View all</Link>
                </div>
                <div className="divide-y divide-gray-50">
                  {loadingOverview ? (
                    <div className="flex justify-center py-8"><div className="animate-spin h-6 w-6 border-2 border-secondary border-t-transparent rounded-full" /></div>
                  ) : announcements.length > 0 ? announcements.map((a: any) => (
                    <div key={a._id} className="px-5 py-3.5 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-primary">{a.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{a.description}</p>
                        </div>
                        <span className="text-[10px] text-gray-400 whitespace-nowrap mt-0.5">
                          {new Date(a.date || a.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                    </div>
                  )) : (
                    <p className="text-sm text-gray-400 italic px-5 py-4">No announcements yet.</p>
                  )}
                </div>
              </div>

              {/* Upcoming events */}
              <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-secondary" />
                    <h3 className="text-sm font-bold text-primary">Upcoming Events</h3>
                  </div>
                  <Link to="/events" className="text-xs text-secondary font-medium hover:underline">View all</Link>
                </div>
                <div className="divide-y divide-gray-50">
                  {loadingOverview ? (
                    <div className="flex justify-center py-8"><div className="animate-spin h-6 w-6 border-2 border-secondary border-t-transparent rounded-full" /></div>
                  ) : events.length > 0 ? events.map((ev: any) => (
                    <div key={ev._id} className="px-5 py-3.5 hover:bg-gray-50 transition-colors flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex flex-col items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-primary leading-none">
                          {new Date(ev.date).toLocaleDateString('en-GB', { day: 'numeric' })}
                        </span>
                        <span className="text-[9px] text-primary/60 uppercase">
                          {new Date(ev.date).toLocaleDateString('en-GB', { month: 'short' })}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-primary truncate">{ev.title}</p>
                        <p className="text-xs text-gray-500">{ev.venue || ev.type}</p>
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        ev.type === 'Virtual' ? 'bg-blue-50 text-blue-700' :
                        ev.type === 'Physical' ? 'bg-green-50 text-green-700' :
                        'bg-purple-50 text-purple-700'
                      }`}>{ev.type || 'Event'}</span>
                    </div>
                  )) : (
                    <p className="text-sm text-gray-400 italic px-5 py-4">No upcoming events.</p>
                  )}
                </div>
              </div>

              {/* Forum categories */}
              <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-secondary" />
                    <h3 className="text-sm font-bold text-primary">Forum Categories</h3>
                  </div>
                  <Link to="/forums" className="text-xs text-secondary font-medium hover:underline">Open forums</Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 divide-y sm:divide-y-0 divide-gray-50">
                  {loadingOverview ? (
                    <div className="col-span-2 flex justify-center py-8"><div className="animate-spin h-6 w-6 border-2 border-secondary border-t-transparent rounded-full" /></div>
                  ) : forums.length > 0 ? forums.map((f: any, i: number) => (
                    <div key={f._id} className={`px-5 py-4 hover:bg-gray-50 transition-colors ${i % 2 === 0 && forums.length > 1 ? 'sm:border-r border-gray-100' : ''}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-6 h-6 rounded-md bg-secondary/10 flex items-center justify-center">
                          <MessageSquare className="h-3 w-3 text-secondary" />
                        </div>
                        <p className="text-sm font-semibold text-primary">{f.name}</p>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-1 ml-8">{f.description}</p>
                    </div>
                  )) : (
                    <p className="col-span-2 text-sm text-gray-400 italic px-5 py-4">No forums available.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── PROFILE ────────────────────────────────────────────────────── */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Photo card */}
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="text-sm font-bold text-primary mb-4">Profile Photo</h3>
                <div className="flex items-center gap-5">
                  <div className="relative group">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-secondary/30 bg-secondary/10">
                      {(photoPreview || user?.profile?.photo) ? (
                        <img src={photoPreview || user?.profile?.photo} alt={user?.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-secondary font-bold text-2xl">
                          {user?.name?.split(' ').map((w:string) => w[0]).join('').slice(0, 2).toUpperCase() || '?'}
                        </div>
                      )}
                    </div>
                    {photoUploading && (
                      <div className="absolute inset-0 rounded-2xl bg-black/40 flex items-center justify-center">
                        <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                      </div>
                    )}
                  </div>
                  <div>
                    <button
                      onClick={() => photoInputRef.current?.click()}
                      disabled={photoUploading}
                      className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all disabled:opacity-50"
                    >
                      <Upload className="h-4 w-4" />
                      {photoUploading ? 'Uploading...' : 'Upload Photo'}
                    </button>
                    <p className="text-xs text-gray-400 mt-1.5">JPG, PNG or GIF · max 5 MB</p>
                    <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoSelect} />
                  </div>
                </div>
              </div>

              {/* Info form */}
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="text-sm font-bold text-primary mb-4">Personal Information</h3>

                {profileMsg && (
                  <div className={`mb-4 flex items-center gap-2 text-sm px-4 py-3 rounded-xl border ${profileMsg.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                    {profileMsg.type === 'success' ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                    {profileMsg.text}
                  </div>
                )}

                <form onSubmit={handleProfileSave} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input type="text" value={profileForm.name} onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))} placeholder="Dr. Jane Doe" className={`${inputCls} pl-9`} />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Email Address</label>
                      <div className="relative">
                        <Edit3 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input type="email" value={profileForm.email} onChange={e => setProfileForm(p => ({ ...p, email: e.target.value }))} placeholder="you@example.com" className={`${inputCls} pl-9`} />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input type="tel" value={profileForm.phone} onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))} placeholder="+1 234 567 8900" className={`${inputCls} pl-9`} />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Institution / Organisation</label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input type="text" value={profileForm.institution} onChange={e => setProfileForm(p => ({ ...p, institution: e.target.value }))} placeholder="Company or university" className={`${inputCls} pl-9`} />
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <label className={labelCls}>Specialization</label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input type="text" value={profileForm.specialization} onChange={e => setProfileForm(p => ({ ...p, specialization: e.target.value }))} placeholder="e.g. Penetration Testing, SOC Analysis…" className={`${inputCls} pl-9`} />
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <label className={labelCls}>Bio</label>
                      <textarea value={profileForm.bio} onChange={e => setProfileForm(p => ({ ...p, bio: e.target.value }))} rows={3} placeholder="Tell the community about yourself…" className={`${inputCls} resize-none`} />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button type="submit" disabled={profileSaving} className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all disabled:opacity-50">
                      {profileSaving ? <><svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Saving…</> : <><Check className="h-3.5 w-3.5" />Save Changes</>}
                    </button>
                  </div>
                </form>
              </div>

              {/* ID card */}
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="text-sm font-bold text-primary mb-1">Identity Document</h3>
                <p className="text-xs text-gray-400 mb-4">Required for account verification. Upload a clear photo of your ID.</p>
                {user?.profile?.idCard ? (
                  <div className="flex items-center gap-4">
                    <img src={user.profile.idCard} alt="ID Card" className="w-40 h-24 object-cover rounded-xl border border-gray-200" />
                    <div>
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-green-50 border border-green-200 text-green-700">
                        <Check className="h-3 w-3" /> Uploaded
                      </span>
                      <p className="text-xs text-gray-400 mt-1.5">Contact support to update your ID.</p>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center">
                    <FileText className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">No ID uploaded yet</p>
                    <p className="text-xs text-gray-300 mt-1">Complete your profile to submit verification</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── SECURITY ───────────────────────────────────────────────────── */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="text-sm font-bold text-primary mb-1">Change Password</h3>
                <p className="text-xs text-gray-400 mb-5">Use a strong password you don't use elsewhere.</p>

                {secMsg && (
                  <div className={`mb-4 flex items-center gap-2 text-sm px-4 py-3 rounded-xl border ${secMsg.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                    {secMsg.type === 'success' ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                    {secMsg.text}
                  </div>
                )}

                <form onSubmit={handleSecuritySave} className="space-y-4 max-w-md">
                  {([
                    { key: 'current', label: 'Current Password', placeholder: 'Enter current password' },
                    { key: 'newPwd',  label: 'New Password',     placeholder: 'At least 6 characters' },
                    { key: 'confirm', label: 'Confirm New Password', placeholder: 'Repeat new password' },
                  ] as const).map(({ key, label, placeholder }) => (
                    <div key={key}>
                      <label className={labelCls}>{label}</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type={showPwd[key] ? 'text' : 'password'}
                          value={secForm[key]}
                          onChange={e => setSecForm(p => ({ ...p, [key]: e.target.value }))}
                          placeholder={placeholder}
                          className={`${inputCls} pl-9 pr-10`}
                        />
                        <button type="button" onClick={() => setShowPwd(p => ({ ...p, [key]: !p[key] }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                          {showPwd[key] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  ))}

                  <div className="flex justify-end pt-1">
                    <button type="submit" disabled={secSaving} className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all disabled:opacity-50">
                      {secSaving ? <><svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Saving…</> : <><Lock className="h-3.5 w-3.5" />Update Password</>}
                    </button>
                  </div>
                </form>
              </div>

              {/* Session info */}
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="text-sm font-bold text-primary mb-4">Account Details</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Email', value: user?.email },
                    { label: 'Role', value: user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : '—' },
                    { label: 'Status', value: statusCfg.label },
                    { label: 'Member Since', value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '—' },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                      <span className="text-xs text-gray-400 font-medium">{label}</span>
                      <span className="text-sm text-primary font-semibold">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── SETTINGS ───────────────────────────────────────────────────── */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="text-sm font-bold text-primary mb-1">Notification Preferences</h3>
                <p className="text-xs text-gray-400 mb-5">Choose what updates you receive by email.</p>

                {prefsMsg && (
                  <div className={`mb-4 flex items-center gap-2 text-sm px-4 py-3 rounded-xl border ${prefsMsg.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                    {prefsMsg.type === 'success' ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                    {prefsMsg.text}
                  </div>
                )}

                <form onSubmit={handlePrefsSave} className="space-y-0">
                  {([
                    { key: 'emailAnnouncements', label: 'Announcements',       desc: 'Get notified about new ACSP announcements' },
                    { key: 'emailEvents',         label: 'Events',             desc: 'Upcoming event reminders and new event alerts' },
                    { key: 'emailForum',          label: 'Forum activity',     desc: 'Replies to your threads and mentions' },
                    { key: 'profileVisible',      label: 'Public profile',     desc: 'Allow other members to view your profile' },
                  ] as const).map(({ key, label, desc }) => (
                    <div key={key} className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0">
                      <div>
                        <p className="text-sm font-semibold text-primary">{label}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPrefs(p => ({ ...p, [key]: !p[key] }))}
                        className={`relative w-10 h-5.5 rounded-full transition-colors duration-200 flex-shrink-0 ${prefs[key] ? 'bg-secondary' : 'bg-gray-200'}`}
                        style={{ height: '22px', width: '40px' }}
                      >
                        <span className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 rounded-full bg-white shadow transition-transform duration-200 ${prefs[key] ? 'translate-x-[18px]' : 'translate-x-0'}`} style={{ width: '18px', height: '18px' }} />
                      </button>
                    </div>
                  ))}

                  <div className="flex justify-end pt-4">
                    <button type="submit" disabled={prefsSaving} className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all disabled:opacity-50">
                      {prefsSaving ? <><svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Saving…</> : <><Check className="h-3.5 w-3.5" />Save Preferences</>}
                    </button>
                  </div>
                </form>
              </div>

              {/* Danger zone */}
              <div className="bg-white rounded-xl border border-red-100 p-6">
                <h3 className="text-sm font-bold text-red-600 mb-1">Danger Zone</h3>
                <p className="text-xs text-gray-400 mb-4">Irreversible actions — proceed with caution.</p>
                <div className="flex items-center justify-between py-3 border border-red-100 rounded-xl px-4">
                  <div>
                    <p className="text-sm font-semibold text-primary">Sign out</p>
                    <p className="text-xs text-gray-400">Log out of all sessions on this device.</p>
                  </div>
                  <button onClick={logout} className="flex items-center gap-1.5 text-xs font-semibold text-red-600 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">
                    <LogOut className="h-3.5 w-3.5" /> Logout
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default Dashboard;
