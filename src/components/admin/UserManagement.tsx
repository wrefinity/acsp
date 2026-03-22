import React, { useState, useEffect, useCallback } from 'react';
import { userAPI } from '../../services/api';
import {
  Eye, Ban, RotateCcw, CheckCircle, XCircle, Search, X,
  ChevronLeft, ChevronRight, Shield, Phone, Building,
  Briefcase, Clock, User as UserIcon,
} from 'lucide-react';
import { toast } from 'sonner';

interface IUser {
  id: string;
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  isVerified: boolean;
  profile?: {
    photo?: string;
    idCard?: string;
    phone?: string;
    institution?: string;
    specialization?: string;
    bio?: string;
  };
  rejectionReason?: string;
  createdAt: string;
}

type FilterTab = 'all' | 'pending_verification' | 'verified' | 'pending' | 'banned';

const STATUS_TABS: { key: FilterTab; label: string }[] = [
  { key: 'all',                  label: 'All' },
  { key: 'pending_verification', label: 'Pending Verification' },
  { key: 'pending',              label: 'Pending' },
  { key: 'verified',             label: 'Verified' },
  { key: 'banned',               label: 'Banned' },
];

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    verified:             'bg-emerald-50 text-emerald-700 border-emerald-200',
    pending_verification: 'bg-amber-50 text-amber-700 border-amber-200',
    pending:              'bg-amber-50 text-amber-700 border-amber-200',
    rejected:             'bg-red-50 text-red-700 border-red-200',
    banned:               'bg-red-50 text-red-700 border-red-200',
    suspended:            'bg-orange-50 text-orange-700 border-orange-200',
  };
  return `inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${map[status] || 'bg-gray-50 text-gray-600 border-gray-200'}`;
};


// ── Reject reason modal ────────────────────────────────────────────────────
const RejectModal = ({ name, onConfirm, onCancel }: { name: string; onConfirm: (reason: string) => void; onCancel: () => void }) => {
  const [reason, setReason] = useState('');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <h3 className="text-sm font-bold text-primary mb-1">Reject {name}</h3>
        <p className="text-xs text-gray-400 mb-4">Provide a reason that will be shown to the user.</p>
        <textarea
          value={reason}
          onChange={e => setReason(e.target.value)}
          rows={3}
          placeholder="e.g. ID document is unclear, please resubmit…"
          className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400 resize-none"
        />
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onCancel} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-xl">Cancel</button>
          <button
            onClick={() => reason.trim() && onConfirm(reason.trim())}
            disabled={!reason.trim()}
            className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl disabled:opacity-40"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Ban reason modal ────────────────────────────────────────────────────────
const BanModal = ({ name, onConfirm, onCancel }: { name: string; onConfirm: (reason: string) => void; onCancel: () => void }) => {
  const [reason, setReason] = useState('');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <h3 className="text-sm font-bold text-primary mb-1">Ban {name}</h3>
        <p className="text-xs text-gray-400 mb-4">Provide a reason for the ban.</p>
        <textarea
          value={reason}
          onChange={e => setReason(e.target.value)}
          rows={3}
          placeholder="e.g. Violation of community guidelines…"
          className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400 resize-none"
        />
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onCancel} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-xl">Cancel</button>
          <button
            onClick={() => reason.trim() && onConfirm(reason.trim())}
            disabled={!reason.trim()}
            className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl disabled:opacity-40"
          >
            Ban User
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Detail drawer ──────────────────────────────────────────────────────────
const DetailDrawer = ({
  user, onClose, onVerify, onReject, onBan, onUnban, actionLoading,
}: {
  user: IUser;
  onClose: () => void;
  onVerify: (id: string) => void;
  onReject: (id: string, reason: string) => void;
  onBan: (id: string, reason: string) => void;
  onUnban: (id: string) => void;
  actionLoading: boolean;
}) => {
  const [showReject, setShowReject] = useState(false);
  const [showBan, setShowBan] = useState(false);
  const uid = user._id || user.id;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full z-50 w-full max-w-lg bg-white shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-primary">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
              <UserIcon className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">{user.name}</p>
              <p className="text-white/50 text-xs">{user.email}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Status + meta */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Status', value: <span className={statusBadge(user.status)}>{user.status.replace('_', ' ')}</span> },
              { label: 'Role', value: <span className="text-xs font-semibold text-primary capitalize">{user.role}</span> },
              { label: 'Email Verified', value: user.isVerified
                ? <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1"><CheckCircle className="h-3.5 w-3.5" />Yes</span>
                : <span className="text-xs font-semibold text-red-500 flex items-center gap-1"><XCircle className="h-3.5 w-3.5" />No</span> },
              { label: 'Joined', value: <span className="text-xs text-gray-500">{new Date(user.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span> },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 rounded-xl px-3 py-2.5">
                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide mb-1">{label}</p>
                {value}
              </div>
            ))}
          </div>

          {/* Profile info */}
          {user.profile && (
            <div className="space-y-3">
              <p className="text-xs font-bold text-primary uppercase tracking-wider">Profile</p>
              {[
                { icon: <Phone className="h-3.5 w-3.5" />, label: 'Phone', val: user.profile.phone },
                { icon: <Building className="h-3.5 w-3.5" />, label: 'Institution', val: user.profile.institution },
                { icon: <Briefcase className="h-3.5 w-3.5" />, label: 'Specialization', val: user.profile.specialization },
              ].filter(r => r.val).map(({ icon, label, val }) => (
                <div key={label} className="flex items-center gap-2.5 text-sm">
                  <span className="text-gray-400">{icon}</span>
                  <span className="text-gray-500 text-xs w-24 flex-shrink-0">{label}</span>
                  <span className="text-primary text-xs font-medium">{val}</span>
                </div>
              ))}
              {user.profile.bio && (
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide mb-1">Bio</p>
                  <p className="text-xs text-gray-600 leading-relaxed">{user.profile.bio}</p>
                </div>
              )}
            </div>
          )}

          {/* Photos */}
          {(user.profile?.photo || user.profile?.idCard) && (
            <div className="space-y-3">
              <p className="text-xs font-bold text-primary uppercase tracking-wider">Documents</p>
              <div className="grid grid-cols-2 gap-3">
                {user.profile?.photo && (
                  <div>
                    <p className="text-[10px] text-gray-400 mb-1.5">Passport Photo</p>
                    <img src={user.profile.photo} alt="Photo" className="w-full h-32 object-cover rounded-xl border border-gray-200" />
                  </div>
                )}
                {user.profile?.idCard && (
                  <div>
                    <p className="text-[10px] text-gray-400 mb-1.5">ID Card</p>
                    <img src={user.profile.idCard} alt="ID" className="w-full h-32 object-cover rounded-xl border border-gray-200" />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Rejection reason */}
          {user.rejectionReason && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3">
              <p className="text-[10px] text-red-500 font-semibold uppercase tracking-wide mb-1">Rejection / Ban Reason</p>
              <p className="text-xs text-red-700">{user.rejectionReason}</p>
            </div>
          )}
        </div>

        {/* Action footer */}
        <div className="px-6 py-4 border-t border-gray-100 space-y-2">
          {user.status === 'pending_verification' && (
            <div className="flex gap-2">
              <button
                onClick={() => onVerify(uid)}
                disabled={actionLoading}
                className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold py-2.5 rounded-xl transition-all disabled:opacity-50"
              >
                <CheckCircle className="h-4 w-4" /> Approve
              </button>
              <button
                onClick={() => setShowReject(true)}
                disabled={actionLoading}
                className="flex-1 flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-sm font-semibold py-2.5 rounded-xl transition-all disabled:opacity-50"
              >
                <XCircle className="h-4 w-4" /> Reject
              </button>
            </div>
          )}
          {user.status === 'banned' ? (
            <button
              onClick={() => onUnban(uid)}
              disabled={actionLoading}
              className="w-full flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-sm font-semibold py-2.5 rounded-xl transition-all disabled:opacity-50"
            >
              <RotateCcw className="h-4 w-4" /> Unban User
            </button>
          ) : user.status !== 'pending_verification' && (
            <button
              onClick={() => setShowBan(true)}
              disabled={actionLoading}
              className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-sm font-semibold py-2.5 rounded-xl transition-all disabled:opacity-50"
            >
              <Ban className="h-4 w-4" /> Ban User
            </button>
          )}
        </div>
      </div>

      {showReject && <RejectModal name={user.name} onCancel={() => setShowReject(false)} onConfirm={r => { setShowReject(false); onReject(uid, r); }} />}
      {showBan    && <BanModal    name={user.name} onCancel={() => setShowBan(false)}    onConfirm={r => { setShowBan(false);    onBan(uid, r);    }} />}
    </>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────
const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTab, setFilterTab] = useState<FilterTab>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [detailUser, setDetailUser] = useState<IUser | null>(null);
  const [rejectTarget, setRejectTarget] = useState<string | null>(null);
  const [bulkRejectOpen, setBulkRejectOpen] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res: any = await userAPI.getAllUsers(currentPage, 15);
      setUsers(res.users || res.data || []);
      setTotal(res.pagination?.total || 0);
      setTotalPages(Math.ceil((res.pagination?.total || 1) / 15));
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  // ── Filtered list ──────────────────────────────────────────────────────
  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchTab = filterTab === 'all' || u.status === filterTab;
    return matchSearch && matchTab;
  });

  const pendingCount = users.filter(u => u.status === 'pending_verification').length;

  // ── Selection ──────────────────────────────────────────────────────────
  const getId = (u: IUser) => u._id || u.id;

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    const visibleIds = filtered.map(getId);
    const allSelected = visibleIds.every(id => selectedIds.has(id));
    if (allSelected) {
      setSelectedIds(prev => { const n = new Set(prev); visibleIds.forEach(id => n.delete(id)); return n; });
    } else {
      setSelectedIds(prev => { const n = new Set(prev); visibleIds.forEach(id => n.add(id)); return n; });
    }
  };

  const allVisibleSelected = filtered.length > 0 && filtered.every(u => selectedIds.has(getId(u)));
  const someSelected = selectedIds.size > 0;

  // ── Actions ────────────────────────────────────────────────────────────
  const handleVerify = async (id: string) => {
    setActionLoading(true);
    try {
      await userAPI.verifyUser(id, 'approve');
      toast.success('User approved successfully');
      setDetailUser(null);
      setSelectedIds(prev => { const n = new Set(prev); n.delete(id); return n; });
      await fetchUsers();
    } catch (err: any) {
      toast.error(err.message || 'Failed to approve user');
    } finally { setActionLoading(false); }
  };

  const handleReject = async (id: string, reason: string) => {
    setActionLoading(true);
    try {
      await userAPI.verifyUser(id, 'reject', reason);
      toast.success('User rejected');
      setDetailUser(null);
      setSelectedIds(prev => { const n = new Set(prev); n.delete(id); return n; });
      await fetchUsers();
    } catch (err: any) {
      toast.error(err.message || 'Failed to reject user');
    } finally { setActionLoading(false); }
  };

  const handleBan = async (id: string, reason: string) => {
    setActionLoading(true);
    try {
      await userAPI.banUser(id, 'ban', reason);
      toast.success('User banned');
      setDetailUser(null);
      await fetchUsers();
    } catch (err: any) {
      toast.error(err.message || 'Failed to ban user');
    } finally { setActionLoading(false); }
  };

  const handleUnban = async (id: string) => {
    setActionLoading(true);
    try {
      await userAPI.banUser(id, 'unban');
      toast.success('User unbanned');
      setDetailUser(null);
      await fetchUsers();
    } catch (err: any) {
      toast.error(err.message || 'Failed to unban user');
    } finally { setActionLoading(false); }
  };

  // Bulk approve
  const handleBulkVerify = async () => {
    setActionLoading(true);
    const ids = Array.from(selectedIds);
    let done = 0;
    for (const id of ids) {
      try { await userAPI.verifyUser(id, 'approve'); done++; } catch { /* skip */ }
    }
    toast.success(`${done} of ${ids.length} users approved`);
    setSelectedIds(new Set());
    setActionLoading(false);
    await fetchUsers();
  };

  // Bulk reject
  const handleBulkReject = async (reason: string) => {
    setBulkRejectOpen(false);
    setActionLoading(true);
    const ids = Array.from(selectedIds);
    let done = 0;
    for (const id of ids) {
      try { await userAPI.verifyUser(id, 'reject', reason); done++; } catch { /* skip */ }
    }
    toast.success(`${done} of ${ids.length} users rejected`);
    setSelectedIds(new Set());
    setActionLoading(false);
    await fetchUsers();
  };

  const handleViewDetail = async (u: IUser) => {
    try {
      const full = await userAPI.getUserDetails(u._id || u.id);
      setDetailUser(full);
    } catch { setDetailUser(u); }
  };

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="max-w-6xl mx-auto space-y-4">

      {/* Header row */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-primary">User Management</h2>
          <p className="text-xs text-gray-400 mt-0.5">{total} total members</p>
        </div>
        {pendingCount > 0 && (
          <button
            onClick={() => setFilterTab('pending_verification')}
            className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold px-3 py-2 rounded-xl hover:bg-amber-100 transition-colors"
          >
            <Clock className="h-3.5 w-3.5" />
            {pendingCount} awaiting verification
          </button>
        )}
      </div>

      {/* Filter tabs + search */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl overflow-x-auto flex-shrink-0">
          {STATUS_TABS.map(t => (
            <button
              key={t.key}
              onClick={() => { setFilterTab(t.key); setSelectedIds(new Set()); }}
              className={`whitespace-nowrap px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                filterTab === t.key ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {t.label}
              {t.key === 'pending_verification' && pendingCount > 0 && (
                <span className="ml-1.5 bg-amber-400 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">{pendingCount}</span>
              )}
            </button>
          ))}
        </div>
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email…"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs bg-gray-50 focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Bulk action bar */}
      {someSelected && (
        <div className="flex items-center gap-3 bg-primary/5 border border-primary/10 rounded-xl px-4 py-2.5">
          <span className="text-xs font-semibold text-primary">{selectedIds.size} selected</span>
          <div className="flex gap-2 ml-auto">
            <button
              onClick={handleBulkVerify}
              disabled={actionLoading}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all disabled:opacity-50"
            >
              <CheckCircle className="h-3.5 w-3.5" /> Approve Selected
            </button>
            <button
              onClick={() => setBulkRejectOpen(true)}
              disabled={actionLoading}
              className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all disabled:opacity-50"
            >
              <XCircle className="h-3.5 w-3.5" /> Reject Selected
            </button>
            <button onClick={() => setSelectedIds(new Set())} className="text-xs text-gray-400 hover:text-gray-700 px-2">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin h-8 w-8 border-2 border-secondary border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="w-10 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={allVisibleSelected}
                      onChange={toggleSelectAll}
                      className="h-3.5 w-3.5 accent-secondary rounded"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider">User</th>
                  <th className="px-4 py-3 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">Role</th>
                  <th className="px-4 py-3 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider hidden lg:table-cell">Joined</th>
                  <th className="px-4 py-3 text-right text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-sm text-gray-400">No users found.</td>
                  </tr>
                ) : filtered.map(u => {
                  const uid = getId(u);
                  const isSelected = selectedIds.has(uid);
                  return (
                    <tr key={uid} className={`hover:bg-gray-50/60 transition-colors ${isSelected ? 'bg-secondary/5' : ''}`}>
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(uid)}
                          className="h-3.5 w-3.5 accent-secondary rounded"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {u.profile?.photo ? (
                            <img src={u.profile.photo} alt={u.name} className="w-8 h-8 rounded-full object-cover border border-gray-200" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-bold text-xs flex-shrink-0">
                              {u.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <p className="text-xs font-semibold text-primary">{u.name}</p>
                            <p className="text-[10px] text-gray-400">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={statusBadge(u.status)}>
                          {u.status === 'verified' && <CheckCircle className="h-3 w-3" />}
                          {u.status === 'pending_verification' && <Clock className="h-3 w-3" />}
                          {u.status === 'banned' && <Ban className="h-3 w-3" />}
                          {u.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="flex items-center gap-1 text-[10px] text-gray-500">
                          {u.role === 'admin' && <Shield className="h-3 w-3 text-secondary" />}
                          <span className="capitalize">{u.role}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell text-[10px] text-gray-400">
                        {new Date(u.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Verify inline — only for pending_verification */}
                          {u.status === 'pending_verification' && (
                            <>
                              <button
                                onClick={() => handleVerify(uid)}
                                disabled={actionLoading}
                                title="Approve"
                                className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 transition-colors disabled:opacity-40"
                              >
                                <CheckCircle className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => setRejectTarget(uid)}
                                disabled={actionLoading}
                                title="Reject"
                                className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors disabled:opacity-40"
                              >
                                <XCircle className="h-3.5 w-3.5" />
                              </button>
                            </>
                          )}
                          {/* Ban / Unban */}
                          {u.status === 'banned' ? (
                            <button
                              onClick={() => handleUnban(uid)}
                              disabled={actionLoading}
                              title="Unban"
                              className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 transition-colors disabled:opacity-40"
                            >
                              <RotateCcw className="h-3.5 w-3.5" />
                            </button>
                          ) : u.status !== 'pending_verification' && (
                            <button
                              onClick={() => setRejectTarget(`ban:${uid}`)}
                              disabled={actionLoading}
                              title="Ban"
                              className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors disabled:opacity-40"
                            >
                              <Ban className="h-3.5 w-3.5" />
                            </button>
                          )}
                          {/* View details */}
                          <button
                            onClick={() => handleViewDetail(u)}
                            title="View details"
                            className="p-1.5 rounded-lg bg-primary/5 hover:bg-primary/10 text-primary transition-colors"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-[10px] text-gray-400">
              Page {currentPage} of {totalPages} · {total} users
            </p>
            <div className="flex gap-1">
              <button
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 transition-colors"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inline reject modal (from table row) */}
      {rejectTarget && !rejectTarget.startsWith('ban:') && (
        <RejectModal
          name={filtered.find(u => getId(u) === rejectTarget)?.name || 'User'}
          onCancel={() => setRejectTarget(null)}
          onConfirm={r => { const id = rejectTarget; setRejectTarget(null); handleReject(id, r); }}
        />
      )}

      {/* Inline ban modal (from table row) */}
      {rejectTarget?.startsWith('ban:') && (
        <BanModal
          name={filtered.find(u => getId(u) === rejectTarget.slice(4))?.name || 'User'}
          onCancel={() => setRejectTarget(null)}
          onConfirm={r => { const id = rejectTarget.slice(4); setRejectTarget(null); handleBan(id, r); }}
        />
      )}

      {/* Bulk reject modal */}
      {bulkRejectOpen && (
        <RejectModal
          name={`${selectedIds.size} users`}
          onCancel={() => setBulkRejectOpen(false)}
          onConfirm={handleBulkReject}
        />
      )}

      {/* Detail drawer */}
      {detailUser && (
        <DetailDrawer
          user={detailUser}
          onClose={() => setDetailUser(null)}
          onVerify={handleVerify}
          onReject={handleReject}
          onBan={handleBan}
          onUnban={handleUnban}
          actionLoading={actionLoading}
        />
      )}

    </div>
  );
};

export default UserManagement;
