import React, { useState, useEffect } from 'react';
import { contentAPI } from '../../services/api';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';
import { Plus, Trash2, Image, X } from 'lucide-react';
import { toast } from 'sonner';

interface GalleryImage {
  _id: string;
  title: string;
  category: string;
  url: string;
}

const INPUT = 'w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary';
const LABEL = 'block text-xs font-medium text-gray-700 mb-1';

export const GalleryManagement: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ title: '', category: '' });
  const [file, setFile] = useState<File | null>(null);

  const fetchImages = async () => {
    setLoading(true);
    try { setImages(await contentAPI.getGallery()); }
    catch (err: any) { toast.error(err.message || 'Failed to fetch images.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchImages(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const openModal = () => { setForm({ title: '', category: '' }); setFile(null); setError(''); setIsModalOpen(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.category || !file) { setError('All fields are required.'); return; }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('title', form.title); fd.append('category', form.category); fd.append('image', file);
      await contentAPI.createGalleryImage(fd);
      setIsModalOpen(false);
      toast.success('Image uploaded successfully.');
      fetchImages();
    } catch (err: any) {
      const msg = err.message || 'Failed to upload image.';
      setError(msg);
      toast.error(msg);
    }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this image?')) return;
    try { await contentAPI.deleteGalleryImage(id); toast.success('Image deleted.'); fetchImages(); }
    catch (err: any) { toast.error(err.message || 'Failed to delete image.'); }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-bold text-primary">Gallery</h2>
        <Button onClick={openModal}><Plus className="h-4 w-4 mr-1.5" /> Add Image</Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-10"><LoadingSpinner /></div>
      ) : images.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
            <Image className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-900">No images yet</p>
          <p className="text-xs text-gray-500 mt-1">Add images to the gallery to get started.</p>
          <div className="mt-4"><Button onClick={openModal}><Plus className="h-4 w-4 mr-1.5" /> Add Image</Button></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {images.map(img => (
            <div key={img._id} className="relative group rounded-xl overflow-hidden border border-gray-100">
              <img src={img.url} alt={img.title} className="w-full h-32 object-cover" />
              <div className="p-2">
                <p className="text-xs font-semibold text-gray-800 truncate">{img.title}</p>
                <p className="text-[10px] text-gray-500">{img.category}</p>
              </div>
              <button
                onClick={() => handleDelete(img._id)}
                className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                title="Delete"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="text-sm font-bold text-primary">Upload Image</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="h-4 w-4" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {error && <p className="text-xs text-red-500">{error}</p>}
              <div>
                <label className={LABEL}>Title *</label>
                <input name="title" value={form.title} onChange={handleChange} className={INPUT} placeholder="Image title" />
              </div>
              <div>
                <label className={LABEL}>Category *</label>
                <input name="category" value={form.category} onChange={handleChange} className={INPUT} placeholder="e.g. Conference, Training" />
              </div>
              <div>
                <label className={LABEL}>Image *</label>
                <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} className={INPUT + ' py-1.5'} />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={submitting}>{submitting ? 'Uploading…' : 'Upload'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
