import React, { useState, useEffect } from 'react';
import { foundingLeaderService, FoundingLeader } from '../../services/foundingLeaderService';
import LoadingSpinner from '../common/LoadingSpinner';
import Button from '../common/Button';
import { Plus, Edit, Trash2, Upload, Star } from 'lucide-react';
import { toast } from 'sonner';

export const FoundingLeaderManagement: React.FC = () => {
  const [leaders, setLeaders] = useState<FoundingLeader[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<FoundingLeader | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    bio: '',
    order: 0,
    isActive: true,
    image: null as File | null,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchLeaders();
  }, []);

  const fetchLeaders = async () => {
    try {
      setLoading(true);
      const data = await foundingLeaderService.getAllFoundingLeaders();
      setLeaders(data.sort((a, b) => a.order - b.order));
    } catch (err: any) {
      toast.error(err.message || 'Failed to load founding leaders');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: type === 'number' ? Number(value) : val }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFormData(prev => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.role.trim()) errors.role = 'Role is required';
    if (!formData.bio.trim()) errors.bio = 'Bio is required';
    if (!formData.image && !editing) errors.image = 'Photo is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const fd = new FormData();
      fd.append('name', formData.name);
      fd.append('role', formData.role);
      fd.append('bio', formData.bio);
      fd.append('order', formData.order.toString());
      fd.append('isActive', formData.isActive.toString());
      if (formData.image) fd.append('image', formData.image);

      if (editing) {
        await foundingLeaderService.updateFoundingLeader(editing._id, fd);
      } else {
        await foundingLeaderService.createFoundingLeader(fd);
      }

      resetForm();
      setIsModalOpen(false);
      fetchLeaders();
      toast.success(editing ? 'Founding leader updated.' : 'Founding leader added.');
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.response?.data?.errors?.[0]?.msg || err?.message || 'Failed to save founding leader';
      setFormErrors({ submit: msg });
      toast.error(msg);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', role: '', bio: '', order: 0, isActive: true, image: null });
    setEditing(null);
    setFormErrors({});
  };

  const handleEdit = (leader: FoundingLeader) => {
    setEditing(leader);
    setFormData({ name: leader.name, role: leader.role, bio: leader.bio, order: leader.order, isActive: leader.isActive, image: null });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this founding leader?')) return;
    try {
      await foundingLeaderService.deleteFoundingLeader(id);
      toast.success('Founding leader deleted.');
      fetchLeaders();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete founding leader');
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64"><LoadingSpinner /></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-sm font-bold text-primary">Founding Leadership</h2>
        <Button onClick={() => { resetForm(); setIsModalOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" /> Add Leader
        </Button>
      </div>

      {leaders.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
            <Star className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="text-sm font-medium text-gray-900">No founding leaders</h3>
          <p className="mt-1 text-sm text-gray-500">Add the founding leaders to display on the About page.</p>
          <div className="mt-6">
            <Button onClick={() => { resetForm(); setIsModalOpen(true); }}>
              <Plus className="h-4 w-4 mr-2" /> Add Leader
            </Button>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Photo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leaders.map((leader) => (
                <tr key={leader._id}>
                  <td className="px-6 py-4">
                    <img src={leader.imageUrl} alt={leader.name} className="w-12 h-12 rounded-full object-cover border-2 border-secondary" />
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{leader.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{leader.role}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{leader.order}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${leader.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {leader.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <button onClick={() => handleEdit(leader)} className="text-blue-600 hover:text-blue-900 mr-3" title="Edit">
                      <Edit className="h-5 w-5" />
                    </button>
                    <button onClick={() => handleDelete(leader._id)} className="text-red-600 hover:text-red-900" title="Delete">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-sm font-bold text-primary mb-3">
                {editing ? 'Edit Founding Leader' : 'Add Founding Leader'}
              </h3>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${formErrors.name ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="e.g. Professor Peter Okebukola"
                    />
                    {formErrors.name && <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role / Title *</label>
                    <input
                      type="text"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${formErrors.role ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="e.g. Founding Leader"
                    />
                    {formErrors.role && <p className="mt-1 text-sm text-red-600">{formErrors.role}</p>}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio *</label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={3}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${formErrors.bio ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Brief biography"
                    />
                    {formErrors.bio && <p className="mt-1 text-sm text-red-600">{formErrors.bio}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                    <input
                      type="number"
                      name="order"
                      value={formData.order}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      name="isActive"
                      value={formData.isActive ? 'true' : 'false'}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Photo {!editing && '*'}
                    </label>
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 text-gray-400" />
                        <p className="text-sm text-gray-500 mt-2">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG (MAX. 5MB)</p>
                      </div>
                      <input type="file" name="image" accept="image/*" className="hidden" onChange={handleImageChange} />
                    </label>
                    {formErrors.image && <p className="mt-1 text-sm text-red-600">{formErrors.image}</p>}
                    {formData.image && <p className="mt-2 text-sm text-gray-600">Selected: {formData.image.name}</p>}
                    {editing && !formData.image && (
                      <div className="mt-2 flex items-center">
                        <img src={editing.imageUrl} alt={editing.name} className="w-16 h-16 rounded-full object-cover mr-3 border-2 border-secondary" />
                        <span className="text-sm text-gray-600">Current photo</span>
                      </div>
                    )}
                  </div>
                </div>

                {formErrors.submit && <div className="mb-4 text-red-600 text-sm">{formErrors.submit}</div>}

                <div className="flex justify-end space-x-3">
                  <Button type="button" variant="secondary" onClick={() => { setIsModalOpen(false); resetForm(); }}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editing ? 'Update Leader' : 'Add Leader'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
