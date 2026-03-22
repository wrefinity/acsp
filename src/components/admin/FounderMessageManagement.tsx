import React, { useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { contentAPI } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import Button from '../common/Button';
import { Trash2, Plus, Edit, BookOpen, Calendar, X } from 'lucide-react';
import { toast } from 'sonner';

interface FormData {
  newsletterTitle: string;
  edition: string;
  date: string;
  content: string;
  authorName: string;
  authorTitle: string;
  isPublished: boolean;
}

const defaultForm: FormData = {
  newsletterTitle: '',
  edition: '',
  date: '',
  content: '',
  authorName: 'Professor Peter A. Okebukola, OFR',
  authorTitle: 'Founder, Association of Cybersecurity Practitioners (ACSP)',
  isPublished: true,
};

export const FounderMessageManagement: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState<FormData>(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const { data: messages, loading, refetch } = useApi(contentAPI.getAllFounderMessages, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let parsed: string | boolean = value;
    if (type === 'checkbox') parsed = (e.target as HTMLInputElement).checked;
    else if (name === 'isPublished') parsed = value === 'true';
    setForm(prev => ({ ...prev, [name]: parsed }));
  };

  const openAdd = () => {
    setEditing(null);
    setForm(defaultForm);
    setFormError('');
    setIsModalOpen(true);
  };

  const openEdit = (msg: any) => {
    setEditing(msg);
    setForm({
      newsletterTitle: msg.newsletterTitle,
      edition: msg.edition,
      date: msg.date,
      content: msg.content,
      authorName: msg.authorName,
      authorTitle: msg.authorTitle,
      isPublished: msg.isPublished,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditing(null);
    setForm(defaultForm);
    setFormError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError('');
    try {
      if (editing) {
        await contentAPI.updateFounderMessage(editing._id, form);
      } else {
        await contentAPI.createFounderMessage(form);
      }
      closeModal();
      toast.success(editing ? 'Newsletter updated.' : 'Newsletter published.');
      refetch();
    } catch (err: any) {
      const msg = err.message || 'Failed to save newsletter';
      setFormError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this newsletter? This cannot be undone.')) return;
    try {
      await contentAPI.deleteFounderMessage(id);
      toast.success('Newsletter deleted.');
      refetch();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete newsletter.');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-sm font-bold text-primary">Newsletter Management</h2>
        <Button onClick={openAdd}>
          <Plus className="h-4 w-4 mr-2" /> Add Newsletter
        </Button>
      </div>

      {loading && (
        <div className="flex justify-center py-10">
          <LoadingSpinner />
        </div>
      )}

      {!loading && (!messages || messages.length === 0) && (
        <div className="text-center py-16 text-gray-500">
          <BookOpen className="h-14 w-14 mx-auto mb-4 text-gray-300" />
          <p className="font-medium">No newsletters yet.</p>
          <p className="text-sm mt-1">Click "Add Newsletter" to create the first one.</p>
        </div>
      )}

      {!loading && messages && messages.length > 0 && (
        <div className="space-y-4">
          {messages.map((msg: any) => (
            <div key={msg._id} className="border border-gray-200 rounded-xl p-5 bg-white hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-xs font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded">{msg.edition}</span>
                    <span className="flex items-center text-xs text-gray-500">
                      <Calendar className="h-3 w-3 mr-1" />{msg.date}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${msg.isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {msg.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <h3 className="font-bold text-primary text-sm leading-snug">{msg.newsletterTitle}</h3>
                  <p className="text-xs text-gray-500 mt-1">{msg.authorName} &middot; {msg.authorTitle}</p>
                  <p className="text-gray-600 text-sm mt-2 line-clamp-2">{msg.content}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => openEdit(msg)}
                    className="text-blue-500 hover:text-blue-700 transition-colors"
                    title="Edit"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(msg._id)}
                    className="text-red-400 hover:text-red-600 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[92vh] flex flex-col">
            {/* Modal header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h3 className="text-sm font-bold text-primary">
                {editing ? 'Edit Newsletter' : 'Add Newsletter'}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="overflow-y-auto flex-1 px-6 py-5">
              <form id="newsletter-form" onSubmit={handleSubmit} className="space-y-5">
                {formError && <p className="text-red-500 text-sm">{formError}</p>}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Newsletter Title *</label>
                    <input
                      type="text"
                      name="newsletterTitle"
                      value={form.newsletterTitle}
                      onChange={handleChange}
                      required
                      placeholder="e.g. ACSP Newsletter | March 2026 | Vol. 2, No. 3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Edition *</label>
                    <input
                      type="text"
                      name="edition"
                      value={form.edition}
                      onChange={handleChange}
                      required
                      placeholder="e.g. Vol. 2, No. 3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                    <input
                      type="text"
                      name="date"
                      value={form.date}
                      onChange={handleChange}
                      required
                      placeholder="e.g. March 2026"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Author Name *</label>
                    <input
                      type="text"
                      name="authorName"
                      value={form.authorName}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Author Title *</label>
                    <input
                      type="text"
                      name="authorTitle"
                      value={form.authorTitle}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      name="isPublished"
                      value={form.isPublished ? 'true' : 'false'}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="true">Published</option>
                      <option value="false">Draft</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Founder's Message Content *
                  </label>
                  <textarea
                    name="content"
                    value={form.content}
                    onChange={handleChange}
                    rows={14}
                    required
                    placeholder="Paste the full founder's message here..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                  />
                  <p className="text-xs text-gray-400 mt-1">Each paragraph on a new line will be rendered separately on the newsletter page.</p>
                </div>
              </form>
            </div>

            {/* Modal footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={closeModal}>
                Cancel
              </Button>
              <Button type="submit" form="newsletter-form" disabled={submitting}>
                {submitting ? 'Saving...' : editing ? 'Update Newsletter' : 'Publish Newsletter'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
