import React, { useState, useEffect } from 'react';
import { contentAPI } from '../../services/api';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';
import { Plus, Trash2, Layers, X } from 'lucide-react';
import { toast } from 'sonner';

interface CarouselSlide {
  _id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  order: number;
  imageUrl: string;
}

const INPUT = 'w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary';
const LABEL = 'block text-xs font-medium text-gray-700 mb-1';

export const CarouselManagement: React.FC = () => {
  const [slides, setSlides] = useState<CarouselSlide[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ title: '', subtitle: '', ctaText: '', ctaLink: '', order: '0' });
  const [file, setFile] = useState<File | null>(null);

  const fetchSlides = async () => {
    setLoading(true);
    try { setSlides(await contentAPI.getCarouselSlides()); }
    catch (err: any) { toast.error(err.message || 'Failed to fetch slides.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchSlides(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const openModal = () => { setForm({ title: '', subtitle: '', ctaText: '', ctaLink: '', order: '0' }); setFile(null); setError(''); setIsModalOpen(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { title, subtitle, ctaText, ctaLink } = form;
    if (!title || !subtitle || !ctaText || !ctaLink || !file) { setError('All fields are required.'); return; }
    if (!/^https?:\/\/.+/.test(ctaLink)) { setError('CTA Link must be a valid URL.'); return; }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('title', title); fd.append('subtitle', subtitle);
      fd.append('ctaText', ctaText); fd.append('ctaLink', ctaLink);
      fd.append('order', form.order); fd.append('image', file);
      await contentAPI.createCarouselSlide(fd);
      setIsModalOpen(false);
      toast.success('Slide created successfully.');
      fetchSlides();
    } catch (err: any) {
      const msg = err.message || 'Failed to create slide.';
      setError(msg);
      toast.error(msg);
    } finally { setSubmitting(false); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this slide?')) return;
    try { await contentAPI.deleteCarouselSlide(id); toast.success('Slide deleted.'); fetchSlides(); }
    catch (err: any) { toast.error(err.message || 'Failed to delete slide.'); }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-bold text-primary">Carousel Slides</h2>
        <Button onClick={openModal}><Plus className="h-4 w-4 mr-1.5" /> Add Slide</Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-10"><LoadingSpinner /></div>
      ) : slides.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
            <Layers className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-900">No slides yet</p>
          <p className="text-xs text-gray-500 mt-1">Add a carousel slide to get started.</p>
          <div className="mt-4"><Button onClick={openModal}><Plus className="h-4 w-4 mr-1.5" /> Add Slide</Button></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['Image', 'Title', 'Subtitle', 'Order', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {slides.map(s => (
                <tr key={s._id}>
                  <td className="px-4 py-3">
                    <img src={s.imageUrl} alt={s.title} className="w-14 h-9 object-cover rounded" />
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{s.title}</td>
                  <td className="px-4 py-3 text-xs text-gray-500 max-w-xs truncate">{s.subtitle}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{s.order}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleDelete(s._id)} className="text-red-500 hover:text-red-700" title="Delete">
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
              <h3 className="text-sm font-bold text-primary">New Carousel Slide</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="h-4 w-4" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {error && <p className="text-xs text-red-500">{error}</p>}
              <div>
                <label className={LABEL}>Title *</label>
                <input name="title" value={form.title} onChange={handleChange} className={INPUT} placeholder="Slide title" />
              </div>
              <div>
                <label className={LABEL}>Subtitle *</label>
                <input name="subtitle" value={form.subtitle} onChange={handleChange} className={INPUT} placeholder="Slide subtitle" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={LABEL}>CTA Text *</label>
                  <input name="ctaText" value={form.ctaText} onChange={handleChange} className={INPUT} placeholder="Learn More" />
                </div>
                <div>
                  <label className={LABEL}>Order</label>
                  <input name="order" type="number" min="0" value={form.order} onChange={handleChange} className={INPUT} />
                </div>
              </div>
              <div>
                <label className={LABEL}>CTA Link *</label>
                <input name="ctaLink" value={form.ctaLink} onChange={handleChange} className={INPUT} placeholder="https://..." />
              </div>
              <div>
                <label className={LABEL}>Image *</label>
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
