import React, { useState, useEffect } from 'react';
import { executiveService, ExecutiveMember } from '../../services/executiveService';
import LoadingSpinner from '../common/LoadingSpinner';
import Button from '../common/Button';
import { Plus, Edit, Trash2, Upload, Users } from 'lucide-react';

interface ExecutiveManagementProps {}

export const ExecutiveManagement: React.FC<ExecutiveManagementProps> = () => {
  const [executives, setExecutives] = useState<ExecutiveMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExecutive, setEditingExecutive] = useState<ExecutiveMember | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    bio: '',
    order: 0,
    isActive: true,
    image: null as File | null,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchExecutives();
  }, []);

  const fetchExecutives = async () => {
    try {
      setLoading(true);
      const data = await executiveService.getExecutives();
      setExecutives(data.sort((a, b) => a.order - b.order));
    } catch (err) {
      setError('Failed to load executive members');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : val
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        image: e.target.files![0]
      }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.position.trim()) errors.position = 'Position is required';
    if (!formData.bio.trim()) errors.bio = 'Bio is required';
    if (formData.image === null && !editingExecutive) errors.image = 'Image is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('position', formData.position);
      formDataToSend.append('bio', formData.bio);
      formDataToSend.append('order', formData.order.toString());
      formDataToSend.append('isActive', formData.isActive.toString());
      
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      if (editingExecutive) {
        await executiveService.updateExecutive(editingExecutive._id, formDataToSend);
      } else {
        await executiveService.createExecutive(formDataToSend);
      }

      resetForm();
      fetchExecutives();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving executive:', err);
      setFormErrors({ submit: 'Failed to save executive member' });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      position: '',
      bio: '',
      order: 0,
      isActive: true,
      image: null,
    });
    setEditingExecutive(null);
    setFormErrors({});
  };

  const handleEdit = (executive: ExecutiveMember) => {
    setEditingExecutive(executive);
    setFormData({
      name: executive.name,
      position: executive.position,
      bio: executive.bio,
      order: executive.order,
      isActive: executive.isActive,
      image: null,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this executive member?')) {
      try {
        await executiveService.deleteExecutive(id);
        fetchExecutives();
      } catch (err) {
        console.error('Error deleting executive:', err);
        alert('Failed to delete executive member');
      }
    }
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
        <Button onClick={fetchExecutives} className="mt-4">Retry</Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-primary">Executive Members Management</h2>
        <Button onClick={openAddModal}>
          <Plus className="h-4 w-4 mr-2" />
          Add Executive
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Photo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {executives.map((executive) => (
              <tr key={executive._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <img 
                    src={executive.imageUrl} 
                    alt={executive.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{executive.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{executive.position}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{executive.order}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    executive.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {executive.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(executive)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                    title="Edit"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(executive._id)}
                    className="text-red-600 hover:text-red-900"
                    title="Delete"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {executives.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
            <div className="text-gray-400">
              <Users className="h-6 w-6" />
            </div>
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No executive members</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by adding a new executive member.</p>
          <div className="mt-6">
            <Button onClick={openAddModal}>
              <Plus className="h-4 w-4 mr-2" />
              Add Executive
            </Button>
          </div>
        </div>
      )}

      {/* Modal for adding/editing executive */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-bold text-primary mb-4">
                {editingExecutive ? 'Edit Executive Member' : 'Add New Executive Member'}
              </h3>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                        formErrors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter full name"
                    />
                    {formErrors.name && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Position *
                    </label>
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                        formErrors.position ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter position"
                    />
                    {formErrors.position && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.position}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bio *
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={3}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                        formErrors.bio ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter bio"
                    ></textarea>
                    {formErrors.bio && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.bio}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Display Order
                    </label>
                    <input
                      type="number"
                      name="order"
                      value={formData.order}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Display order (lower numbers appear first)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
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
                      Photo {(!editingExecutive && '*')}
                    </label>
                    <div className="flex items-center">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 text-gray-400" />
                          <p className="text-sm text-gray-500 mt-2">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, GIF (MAX. 5MB)
                          </p>
                        </div>
                        <input 
                          type="file" 
                          name="image" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={handleImageChange}
                        />
                      </label>
                    </div>
                    {formErrors.image && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.image}</p>
                    )}
                    
                    {formData.image && (
                      <div className="mt-2 text-sm text-gray-600">
                        Selected file: {formData.image.name}
                      </div>
                    )}
                    
                    {editingExecutive && !formData.image && (
                      <div className="mt-2 flex items-center">
                        <img 
                          src={editingExecutive.imageUrl} 
                          alt={editingExecutive.name}
                          className="w-16 h-16 rounded-full object-cover mr-3"
                        />
                        <span className="text-sm text-gray-600">Current image</span>
                      </div>
                    )}
                  </div>
                </div>

                {formErrors.submit && (
                  <div className="mb-4 text-red-600 text-sm">{formErrors.submit}</div>
                )}

                <div className="flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setIsModalOpen(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingExecutive ? 'Update Executive' : 'Add Executive'}
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

