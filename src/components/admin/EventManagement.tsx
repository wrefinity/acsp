import React, { useState, useEffect } from 'react';
import { contentAPI } from '../../services/api';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';
import { Plus, Trash2, Calendar, X } from 'lucide-react';
import { toast } from 'sonner';

interface Event {
  _id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  type: 'Physical' | 'Virtual' | 'Hybrid';
  description: string;
  imageUrl: string;
}

const INPUT = 'w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary';
const LABEL = 'block text-xs font-medium text-gray-700 mb-1';

export const EventManagement: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ title: '', date: '', time: '', venue: '', type: 'Physical' as const, description: '' });
  const [file, setFile] = useState<File | null>(null);

  const fetchEvents = async () => {
    setLoading(true);
    try { setEvents(await contentAPI.getEvents()); }
    catch (err: any) { toast.error(err.message || 'Failed to fetch events.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchEvents(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const openModal = () => {
    setForm({ title: '', date: '', time: '', venue: '', type: 'Physical', description: '' });
    setFile(null); setError(''); setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { title, date, time, venue, type, description } = form;
    if (!title || !date || !time || !venue || !description || !file) { setError('All fields are required.'); return; }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('title', title); fd.append('date', date); fd.append('time', time);
      fd.append('venue', venue); fd.append('type', type); fd.append('description', description);
      fd.append('image', file);
      await contentAPI.createEvent(fd);
      setIsModalOpen(false);
      toast.success('Event created successfully.');
      fetchEvents();
    } catch (err: any) {
      const msg = err.message || 'Failed to create event.';
      setError(msg);
      toast.error(msg);
    }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this event?')) return;
    try { await contentAPI.deleteEvent(id); toast.success('Event deleted.'); fetchEvents(); }
    catch (err: any) { toast.error(err.message || 'Failed to delete event.'); }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-bold text-primary">Events</h2>
        <Button onClick={openModal}><Plus className="h-4 w-4 mr-1.5" /> Add Event</Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-10"><LoadingSpinner /></div>
      ) : events.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-900">No events yet</p>
          <p className="text-xs text-gray-500 mt-1">Add an event to get started.</p>
          <div className="mt-4"><Button onClick={openModal}><Plus className="h-4 w-4 mr-1.5" /> Add Event</Button></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['Title', 'Date', 'Venue', 'Type', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {events.map(ev => (
                <tr key={ev._id}>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{ev.title}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{ev.date ? new Date(ev.date).toLocaleDateString() : '—'}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{ev.venue}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">{ev.type}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleDelete(ev._id)} className="text-red-500 hover:text-red-700" title="Delete">
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
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="text-sm font-bold text-primary">New Event</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="h-4 w-4" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {error && <p className="text-xs text-red-500">{error}</p>}
              <div>
                <label className={LABEL}>Title *</label>
                <input name="title" value={form.title} onChange={handleChange} className={INPUT} placeholder="Event title" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={LABEL}>Date *</label>
                  <input name="date" type="date" value={form.date} onChange={handleChange} className={INPUT} />
                </div>
                <div>
                  <label className={LABEL}>Time *</label>
                  <input name="time" type="time" value={form.time} onChange={handleChange} className={INPUT} />
                </div>
                <div>
                  <label className={LABEL}>Venue *</label>
                  <input name="venue" value={form.venue} onChange={handleChange} className={INPUT} placeholder="Venue / link" />
                </div>
                <div>
                  <label className={LABEL}>Type *</label>
                  <select name="type" value={form.type} onChange={handleChange} className={INPUT}>
                    <option value="Physical">Physical</option>
                    <option value="Virtual">Virtual</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
              </div>
              <div>
                <label className={LABEL}>Description *</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={3} className={INPUT} placeholder="Event description" />
              </div>
              <div>
                <label className={LABEL}>Cover Image *</label>
                <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} className={INPUT + ' py-1.5'} />
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
