import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { contentAPI } from '../../services/api';
import { useApi } from '../../hooks/useApi';
import { ErrorBoundary } from '../common/ErrorBoundary';
import {
  Users, Settings, Shield, LogOut, Image, MessageSquare,
  Megaphone, Newspaper, Calendar, User, BookOpen, Star,
  LayoutDashboard, ChevronRight, Menu, X, Bell,
  TrendingUp, UserCheck, FileText, Layers, Activity,
  Globe, Hash, CheckCircle, Clock, Ban, BarChart2,
} from 'lucide-react';
import { GalleryManagement } from './GalleryManagement';
import { ForumManagement } from './ForumManagement';
import { AnnouncementManagement } from './AnnouncementManagement';
import { BlogManagement } from './BlogManagement';
import { CarouselManagement } from './CarouselManagement';
import { EventManagement } from './EventManagement';
import { ExecutiveManagement } from './ExecutiveManagement';
import UserManagement from './UserManagement';
import { FounderMessageManagement } from './FounderMessageManagement';
import { FoundingLeaderManagement } from './FoundingLeaderManagement';

const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [
      { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'users', label: 'Users', icon: Users },
    ],
  },
  {
    label: 'Content',
    items: [
      { id: 'blogs', label: 'Blogs', icon: Newspaper },
      { id: 'founder-messages', label: 'Newsletters', icon: BookOpen },
      { id: 'announcements', label: 'Announcements', icon: Megaphone },
      { id: 'events', label: 'Events', icon: Calendar },
      { id: 'carousel', label: 'Carousel', icon: Layers },
      { id: 'gallery', label: 'Gallery', icon: Image },
    ],
  },
  {
    label: 'Team',
    items: [
      { id: 'executives', label: 'Executives', icon: User },
      { id: 'founding-leaders', label: 'Founding Leaders', icon: Star },
    ],
  },
  {
    label: 'Community',
    items: [
      { id: 'forums', label: 'Forums', icon: MessageSquare },
    ],
  },
  {
    label: 'System',
    items: [
      { id: 'settings', label: 'Settings', icon: Settings },
    ],
  },
];

const TAB_LABELS: Record<string, string> = {
  overview: 'Dashboard Overview',
  users: 'User Management',
  blogs: 'Blog Management',
  'founder-messages': 'Newsletter Management',
  announcements: 'Announcements',
  events: 'Event Management',
  carousel: 'Carousel',
  gallery: 'Gallery',
  executives: 'Executive Members',
  'founding-leaders': 'Founding Leadership',
  forums: 'Forum Management',
  settings: 'Settings',
};

const STATUS_BADGE: Record<string, string> = {
  verified: 'bg-green-100 text-green-700',
  pending: 'bg-amber-100 text-amber-700',
  pending_verification: 'bg-amber-100 text-amber-700',
  banned: 'bg-red-100 text-red-700',
  rejected: 'bg-red-100 text-red-700',
  suspended: 'bg-orange-100 text-orange-700',
  unverified_profile: 'bg-blue-100 text-blue-700',
  deactivated: 'bg-gray-100 text-gray-600',
};

const AdminDashboard = () => {
  const { state, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: stats, loading: statsLoading } = useApi(() => contentAPI.getStats(), []);

  const initials = state.user?.name
    ? state.user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'AD';

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <aside className={`
      ${mobile ? 'flex' : 'hidden lg:flex'}
      flex-col w-60 bg-[#0A1A4A] h-screen sticky top-0 flex-shrink-0 overflow-hidden
    `}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
        <div className="w-8 h-8 rounded-lg bg-[#1DB954]/20 flex items-center justify-center flex-shrink-0">
          <Shield className="h-4.5 w-4.5 text-[#1DB954]" style={{ height: 18, width: 18 }} />
        </div>
        <div>
          <p className="text-white font-bold text-sm leading-tight">ACSP Admin</p>
          <p className="text-white/40 text-[11px]">Control Panel</p>
        </div>
        {mobile && (
          <button onClick={() => setSidebarOpen(false)} className="ml-auto text-white/40 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-5">
        {NAV_GROUPS.map(group => (
          <div key={group.label}>
            <p className="text-white/30 text-[10px] font-semibold uppercase tracking-widest px-3 mb-1.5">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map(item => {
                const active = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                      active
                        ? 'bg-[#1DB954]/15 text-[#1DB954]'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <item.icon className={`h-4 w-4 flex-shrink-0 ${active ? 'text-[#1DB954]' : ''}`} />
                    <span className="flex-1 text-left">{item.label}</span>
                    {active && <ChevronRight className="h-3.5 w-3.5 text-[#1DB954]" />}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User section */}
      <div className="px-3 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors">
          <div className="w-8 h-8 rounded-full bg-[#1DB954]/20 border border-[#1DB954]/30 flex items-center justify-center flex-shrink-0">
            <span className="text-[#1DB954] text-xs font-bold">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-semibold truncate">{state.user?.name}</p>
            <p className="text-[10px] font-semibold capitalize" style={{ color: state.user?.role === 'super_admin' ? '#1DB954' : 'rgba(255,255,255,0.4)' }}>
              {state.user?.role === 'super_admin' ? 'Super Admin' : 'Administrator'}
            </p>
          </div>
          <button
            onClick={logout}
            title="Logout"
            className="flex items-center gap-1.5 text-white/50 hover:text-red-400 transition-colors flex-shrink-0 text-xs font-medium"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );

  const OverviewTab = () => {
    const u = stats?.users;
    const c = stats?.content;
    const recent: any[] = stats?.recentUsers || [];

    const userCards = [
      { label: 'Total Members', value: u?.total ?? '—', icon: Users, color: 'bg-blue-50 text-blue-600', border: 'border-blue-100', ring: 'ring-blue-100' },
      { label: 'Verified', value: u?.verified ?? '—', icon: UserCheck, color: 'bg-green-50 text-green-700', border: 'border-green-100', ring: 'ring-green-100' },
      { label: 'Pending Review', value: u?.pending ?? '—', icon: Clock, color: 'bg-amber-50 text-amber-600', border: 'border-amber-100', ring: 'ring-amber-100' },
      { label: 'Banned', value: u?.banned ?? '—', icon: Ban, color: 'bg-red-50 text-red-500', border: 'border-red-100', ring: 'ring-red-100' },
    ];

    const contentCards = [
      { label: 'Blogs', value: c?.blogs ?? '—', icon: Newspaper, color: 'text-violet-600', bg: 'bg-violet-50' },
      { label: 'Events', value: c?.events ?? '—', icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
      { label: 'Announcements', value: c?.announcements ?? '—', icon: Megaphone, color: 'text-amber-600', bg: 'bg-amber-50' },
      { label: 'Gallery', value: c?.gallery ?? '—', icon: Image, color: 'text-pink-600', bg: 'bg-pink-50' },
      { label: 'Newsletters', value: c?.newsletters ?? '—', icon: BookOpen, color: 'text-teal-600', bg: 'bg-teal-50' },
      { label: 'Forums', value: c?.forums ?? '—', icon: MessageSquare, color: 'text-indigo-600', bg: 'bg-indigo-50' },
      { label: 'Threads', value: c?.threads ?? '—', icon: Hash, color: 'text-orange-600', bg: 'bg-orange-50' },
    ];

    const totalContent = c
      ? (c.blogs + c.events + c.announcements + c.gallery + c.newsletters + c.forums)
      : 0;

    return (
      <div className="space-y-6">

        {/* Greeting */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Good day, {state.user?.name?.split(' ')[0]} 👋</h1>
            <p className="text-sm text-gray-500 mt-0.5">Here's what's happening with your platform.</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-4 py-2 text-sm text-gray-500 shadow-sm">
            <Activity className="h-4 w-4 text-[#1DB954]" />
            <span>Live data</span>
          </div>
        </div>

        {/* User stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {userCards.map(stat => (
            <div key={stat.label} className={`bg-white rounded-2xl border ${stat.border} p-5 flex items-center gap-4 shadow-sm`}>
              <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center flex-shrink-0`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {statsLoading ? <span className="inline-block w-8 h-6 bg-gray-100 rounded animate-pulse" /> : stat.value}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Content stats + summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Content breakdown */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <BarChart2 className="h-4 w-4 text-gray-400" /> Content Overview
              </h3>
              <span className="text-xs text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">
                {totalContent} total items
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {contentCards.map(item => (
                <div key={item.label} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-gray-50/70 border border-gray-100">
                  <div className={`w-9 h-9 rounded-lg ${item.bg} flex items-center justify-center`}>
                    <item.icon className={`h-4 w-4 ${item.color}`} />
                  </div>
                  <p className="text-lg font-bold text-gray-800">
                    {statsLoading ? <span className="inline-block w-6 h-5 bg-gray-200 rounded animate-pulse" /> : item.value}
                  </p>
                  <p className="text-[11px] text-gray-500">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Platform summary */}
          <div className="bg-[#0A1A4A] rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#1DB954]/20 flex items-center justify-center mb-4">
                <Globe className="h-5 w-5 text-[#1DB954]" />
              </div>
              <h3 className="text-white font-bold text-lg leading-tight">Platform Health</h3>
              <p className="text-white/50 text-sm mt-1">Member & content summary</p>
            </div>
            <div className="mt-6 space-y-3">
              {[
                { label: 'Verified rate', value: u ? `${Math.round((u.verified / Math.max(u.total, 1)) * 100)}%` : '—', icon: CheckCircle, color: 'text-[#1DB954]' },
                { label: 'Pending action', value: u?.pending ?? '—', icon: Clock, color: 'text-amber-400' },
                { label: 'Content items', value: totalContent || '—', icon: FileText, color: 'text-blue-400' },
                { label: 'Forum threads', value: c?.threads ?? '—', icon: TrendingUp, color: 'text-purple-400' },
              ].map(row => (
                <div key={row.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <row.icon className={`h-3.5 w-3.5 ${row.color}`} />
                    <span className="text-white/60 text-xs">{row.label}</span>
                  </div>
                  <span className="text-white text-sm font-semibold">
                    {statsLoading ? <span className="inline-block w-6 h-4 bg-white/10 rounded animate-pulse" /> : row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent registrations */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-400" /> Recent Registrations
            </h3>
            <button
              onClick={() => setActiveTab('users')}
              className="text-xs text-[#1DB954] hover:underline font-medium"
            >
              View all →
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {statsLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="px-5 py-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 bg-gray-100 rounded w-32 animate-pulse" />
                    <div className="h-2.5 bg-gray-50 rounded w-48 animate-pulse" />
                  </div>
                  <div className="h-5 w-16 bg-gray-100 rounded-full animate-pulse" />
                </div>
              ))
            ) : recent.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-gray-400">No users yet</div>
            ) : (
              recent.map((user: any) => {
                const uInitials = user.name ? user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() : '??';
                const badge = STATUS_BADGE[user.status] || 'bg-gray-100 text-gray-600';
                return (
                  <div key={user._id} className="px-5 py-3 flex items-center gap-3 hover:bg-gray-50/50 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/15 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary text-[10px] font-bold">{uInitials}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{user.name}</p>
                      <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${badge} capitalize flex-shrink-0`}>
                      {user.status?.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] text-gray-400 flex-shrink-0 hidden sm:block">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="relative z-10">
            <Sidebar mobile />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-5 py-3 flex items-center gap-4 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-400 hover:text-primary transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm">
            <LayoutDashboard className="h-4 w-4 text-gray-400" />
            <ChevronRight className="h-3.5 w-3.5 text-gray-300" />
            <span className="font-semibold text-primary">{TAB_LABELS[activeTab]}</span>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <button className="relative p-2 rounded-lg text-gray-400 hover:text-primary hover:bg-gray-50 transition-colors">
              <Bell className="h-4.5 w-4.5" style={{ height: 18, width: 18 }} />
              {(stats?.users?.pending ?? 0) > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400"></span>
              )}
            </button>
            <div className="flex items-center gap-2.5 pl-3 border-l border-gray-100">
              <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                <span className="text-primary text-xs font-bold">{initials}</span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-gray-800 leading-tight">{state.user?.name}</p>
                <p className="text-xs text-gray-400">Administrator</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 ml-1 pl-3 border-l border-gray-100 text-gray-400 hover:text-red-500 transition-colors text-xs font-medium"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-5 lg:p-6 overflow-auto">
          {activeTab === 'overview' && (
            <ErrorBoundary key="overview">
              <OverviewTab />
            </ErrorBoundary>
          )}

          {activeTab !== 'overview' && activeTab !== 'settings' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-50">
                <h2 className="text-base font-bold text-gray-800">{TAB_LABELS[activeTab]}</h2>
              </div>
              <div className="p-6">
                <ErrorBoundary key={activeTab}>
                  {activeTab === 'users' && <UserManagement />}
                  {activeTab === 'gallery' && <GalleryManagement />}
                  {activeTab === 'forums' && <ForumManagement />}
                  {activeTab === 'announcements' && <AnnouncementManagement />}
                  {activeTab === 'blogs' && <BlogManagement />}
                  {activeTab === 'carousel' && <CarouselManagement />}
                  {activeTab === 'events' && <EventManagement />}
                  {activeTab === 'executives' && <ExecutiveManagement />}
                  {activeTab === 'founder-messages' && <FounderMessageManagement />}
                  {activeTab === 'founding-leaders' && <FoundingLeaderManagement />}
                </ErrorBoundary>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-50">
                <h2 className="text-base font-bold text-gray-800">Settings</h2>
              </div>
              <div className="p-6">
                <div className="space-y-8 max-w-2xl">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">General</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Site Name</label>
                        <input
                          type="text"
                          defaultValue="ACSP - Association of Cybersecurity Practitioners"
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#1DB954]/30 focus:border-[#1DB954] focus:bg-white transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Contact Email</label>
                        <input
                          type="email"
                          defaultValue="admin@acsp.org"
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#1DB954]/30 focus:border-[#1DB954] focus:bg-white transition-all"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Security</h3>
                    <div className="space-y-4">
                      {[
                        { label: 'Require Email Verification', desc: 'New users must verify their email before accessing the platform' },
                        { label: 'Enable User Registration', desc: 'Allow new users to register for accounts' },
                      ].map(setting => (
                        <div key={setting.label} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50">
                          <div>
                            <p className="text-sm font-medium text-gray-800">{setting.label}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{setting.desc}</p>
                          </div>
                          <button className="relative inline-flex h-6 w-11 flex-shrink-0 border-2 border-transparent rounded-full cursor-pointer transition-colors duration-200 bg-[#0A1A4A] focus:outline-none">
                            <span className="pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform translate-x-5 transition duration-200" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-end pt-2">
                    <button className="bg-[#0A1A4A] hover:bg-[#0D47A1] text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-all shadow-sm hover:-translate-y-0.5">
                      Save Settings
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
