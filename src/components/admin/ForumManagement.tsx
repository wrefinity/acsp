import React, { useState, useEffect } from 'react';
import { forumAPI } from '../../services/api';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';
import { Plus, Trash2, MessageSquare, X } from 'lucide-react';
import { toast } from 'sonner';

interface Forum {
  _id: string;
  name: string;
  description: string;
}

const INPUT = 'w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary';
const LABEL = 'block text-xs font-medium text-gray-700 mb-1';

export const ForumManagement: React.FC = () => {
  const [forums, setForums] = useState<Forum[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', description: '' });

  const fetchForums = async () => {
    setLoading(true);
    try { setForums(await forumAPI.getForums()); }
    catch (err: any) { toast.error(err.message || 'Failed to fetch forums.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchForums(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const openModal = () => { setForm({ name: '', description: '' }); setError(''); setIsModalOpen(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.description) { setError('All fields are required.'); return; }
    setSubmitting(true);
    try {
      await forumAPI.createForum(form);
      setIsModalOpen(false);
      toast.success('Forum created.');
      fetchForums();
    } catch (err: any) {
      const msg = err.message || 'Failed to create forum.';
      setError(msg);
      toast.error(msg);
    }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this forum?')) return;
    try { await forumAPI.deleteForum(id); toast.success('Forum deleted.'); fetchForums(); }
    catch (err: any) { toast.error(err.message || 'Failed to delete forum.'); }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-bold text-primary">Forums</h2>
        <Button onClick={openModal}><Plus className="h-4 w-4 mr-1.5" /> Add Forum</Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-10"><LoadingSpinner /></div>
      ) : forums.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
            <MessageSquare className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-900">No forums yet</p>
          <p className="text-xs text-gray-500 mt-1">Create a forum category to get started.</p>
          <div className="mt-4"><Button onClick={openModal}><Plus className="h-4 w-4 mr-1.5" /> Add Forum</Button></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['Name', 'Description', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {forums.map(f => (
                <tr key={f._id}>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{f.name}</td>
                  <td className="px-4 py-3 text-xs text-gray-500 max-w-xs truncate">{f.description}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleDelete(f._id)} className="text-red-500 hover:text-red-700" title="Delete">
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
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="text-sm font-bold text-primary">New Forum</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="h-4 w-4" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {error && <p className="text-xs text-red-500">{error}</p>}
              <div>
                <label className={LABEL}>Name *</label>
                <input name="name" value={form.name} onChange={handleChange} className={INPUT} placeholder="Forum name" />
              </div>
              <div>
                <label className={LABEL}>Description *</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={3} className={INPUT} placeholder="What is this forum about?" />
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
