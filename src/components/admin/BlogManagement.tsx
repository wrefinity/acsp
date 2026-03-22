import React, { useState, useEffect } from 'react';
import { contentAPI } from '../../services/api';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';
import { Plus, Trash2, Newspaper, X } from 'lucide-react';
import { toast } from 'sonner';

interface Blog {
  _id: string;
  title: string;
  author: string;
  category: string;
  excerpt: string;
  imageUrl?: string;
}

const INPUT = 'w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary';
const LABEL = 'block text-xs font-medium text-gray-700 mb-1';

export const BlogManagement: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ title: '', author: '', category: '', excerpt: '', content: '' });
  const [file, setFile] = useState<File | null>(null);

  const fetchBlogs = async () => {
    setLoading(true);
    try { setBlogs(await contentAPI.getBlogs()); }
    catch (err: any) { toast.error(err.message || 'Failed to fetch blogs.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchBlogs(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const openModal = () => { setForm({ title: '', author: '', category: '', excerpt: '', content: '' }); setFile(null); setError(''); setIsModalOpen(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { title, author, category, excerpt, content } = form;
    if (!title || !author || !category || !excerpt || !content || !file) { setError('All fields are required.'); return; }
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append('image', file);
      await contentAPI.createBlog(fd);
      setIsModalOpen(false);
      toast.success('Blog post created.');
      fetchBlogs();
    } catch (err: any) {
      const msg = err.message || 'Failed to create blog.';
      setError(msg);
      toast.error(msg);
    }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this blog post?')) return;
    try { await contentAPI.deleteBlog(id); toast.success('Blog post deleted.'); fetchBlogs(); }
    catch (err: any) { toast.error(err.message || 'Failed to delete blog.'); }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-bold text-primary">Blog Posts</h2>
        <Button onClick={openModal}><Plus className="h-4 w-4 mr-1.5" /> Add Blog</Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-10"><LoadingSpinner /></div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
            <Newspaper className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-900">No blog posts yet</p>
          <p className="text-xs text-gray-500 mt-1">Add a blog post to get started.</p>
          <div className="mt-4"><Button onClick={openModal}><Plus className="h-4 w-4 mr-1.5" /> Add Blog</Button></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['Title', 'Author', 'Category', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {blogs.map(b => (
                <tr key={b._id}>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{b.title}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{b.author}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{b.category}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleDelete(b._id)} className="text-red-500 hover:text-red-700" title="Delete">
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
              <h3 className="text-sm font-bold text-primary">New Blog Post</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="h-4 w-4" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {error && <p className="text-xs text-red-500">{error}</p>}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={LABEL}>Title *</label>
                  <input name="title" value={form.title} onChange={handleChange} className={INPUT} placeholder="Post title" />
                </div>
                <div>
                  <label className={LABEL}>Author *</label>
                  <input name="author" value={form.author} onChange={handleChange} className={INPUT} placeholder="Author name" />
                </div>
                <div>
                  <label className={LABEL}>Category *</label>
                  <input name="category" value={form.category} onChange={handleChange} className={INPUT} placeholder="e.g. Security" />
                </div>
                <div>
                  <label className={LABEL}>Cover Image *</label>
                  <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} className={INPUT + ' py-1.5'} />
                </div>
              </div>
              <div>
                <label className={LABEL}>Excerpt *</label>
                <textarea name="excerpt" value={form.excerpt} onChange={handleChange} rows={2} className={INPUT} placeholder="Short summary" />
              </div>
              <div>
                <label className={LABEL}>Content *</label>
                <textarea name="content" value={form.content} onChange={handleChange} rows={5} className={INPUT} placeholder="Full blog content" />
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
