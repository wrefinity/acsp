import React, { useState, useEffect } from 'react';
import { contentAPI } from '../../services/api';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';
import { Plus, Trash2, Megaphone, X } from 'lucide-react';
import { toast } from 'sonner';

interface Announcement {
  _id: string;
  title: string;
  category: string;
  description: string;
  date: string;
}

const INPUT = 'w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary';
const LABEL = 'block text-xs font-medium text-gray-700 mb-1';

export const AnnouncementManagement: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ title: '', category: '', description: '', date: '' });

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      setAnnouncements(await contentAPI.getAnnouncements());
    } catch (err: any) { toast.error(err.message || 'Failed to fetch announcements.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAnnouncements(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { title, category, description, date } = form;
    if (!title || !category || !description || !date) { setError('All fields are required.'); return; }
    setSubmitting(true);
    try {
      await contentAPI.createAnnouncement(form);
      setForm({ title: '', category: '', description: '', date: '' });
      setError('');
      setIsModalOpen(false);
      toast.success('Announcement created.');
      fetchAnnouncements();
    } catch (err: any) {
      const msg = err.message || 'Failed to create announcement.';
      setError(msg);
      toast.error(msg);
    }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this announcement?')) return;
    try {
      await contentAPI.deleteAnnouncement(id);
      toast.success('Announcement deleted.');
      fetchAnnouncements();
    } catch (err: any) { toast.error(err.message || 'Failed to delete announcement.'); }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-bold text-primary">Announcements</h2>
        <Button onClick={() => { setError(''); setIsModalOpen(true); }}>
          <Plus className="h-4 w-4 mr-1.5" /> Add Announcement
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-10"><LoadingSpinner /></div>
      ) : announcements.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
            <Megaphone className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-900">No announcements yet</p>
          <p className="text-xs text-gray-500 mt-1">Add an announcement to get started.</p>
          <div className="mt-4"><Button onClick={() => setIsModalOpen(true)}><Plus className="h-4 w-4 mr-1.5" /> Add Announcement</Button></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['Title', 'Category', 'Date', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {announcements.map(a => (
                <tr key={a._id}>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{a.title}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{a.category}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{a.date ? new Date(a.date).toLocaleDateString() : '—'}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleDelete(a._id)} className="text-red-500 hover:text-red-700" title="Delete">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="text-sm font-bold text-primary">New Announcement</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="h-4 w-4" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {error && <p className="text-xs text-red-500">{error}</p>}
              <div>
                <label className={LABEL}>Title *</label>
                <input name="title" value={form.title} onChange={handleChange} className={INPUT} placeholder="Announcement title" />
              </div>
              <div>
                <label className={LABEL}>Category *</label>
                <input name="category" value={form.category} onChange={handleChange} className={INPUT} placeholder="e.g. General, Events" />
              </div>
              <div>
                <label className={LABEL}>Date *</label>
                <input name="date" type="date" value={form.date} onChange={handleChange} className={INPUT} />
              </div>
              <div>
                <label className={LABEL}>Description *</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={4} className={INPUT} placeholder="Full announcement text" />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={submitting}>{submitting ? 'Saving…' : 'Create'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
