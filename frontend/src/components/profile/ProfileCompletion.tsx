import React, { useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Upload, X } from 'lucide-react';
import { userAPI } from '../../services/api';
import Button from '../common/Button';

interface ProfileFormData {
  photo: File | null;
  idCard: File | null;
  phone: string;
  institution: string;
  specialization: string;
  bio: string;
}

const ProfileCompletion: React.FC = () => {
  const [formData, setFormData] = useState<ProfileFormData>({
    photo: null,
    idCard: null,
    phone: '',
    institution: '',
    specialization: '',
    bio: ''
  });
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);
  const [previewIdCard, setPreviewIdCard] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, type: 'photo' | 'idCard') => {
    const file = e.target.files?.[0] || null;

    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      setFormData({
        ...formData,
        [type]: file
      });

      // Create preview
      const previewUrl = URL.createObjectURL(file);
      if (type === 'photo') {
        setPreviewPhoto(previewUrl);
      } else {
        setPreviewIdCard(previewUrl);
      }
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const removeFile = (type: 'photo' | 'idCard') => {
    setFormData({
      ...formData,
      [type]: null
    });

    if (type === 'photo') {
      setPreviewPhoto(null);
    } else {
      setPreviewIdCard(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Create form data object
      const profileData = new FormData();
      profileData.append('phone', formData.phone);
      profileData.append('institution', formData.institution);
      profileData.append('specialization', formData.specialization);
      profileData.append('bio', formData.bio);

      if (formData.photo) {
        profileData.append('photo', formData.photo);
      }

      if (formData.idCard) {
        profileData.append('idCard', formData.idCard);
      }

      await userAPI.updateProfile(profileData);
      alert('Profile updated successfully!');
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold text-primary mb-6">Complete Your Profile</h2>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Photo Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Passport Photo
            </label>
            <div className="flex items-center space-x-4">
              <div className="relative">
                {previewPhoto ? (
                  <div className="relative">
                    <img
                      src={previewPhoto}
                      alt="Preview"
                      className="w-24 h-24 rounded-md object-cover border border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile('photo')}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-md w-24 h-24 flex items-center justify-center">
                    <User className="text-gray-400" size={32} />
                  </div>
                )}
              </div>

              <label className="flex flex-col items-center justify-center cursor-pointer">
                <div className="flex flex-col items-center justify-center text-center p-4 border border-gray-300 rounded-md hover:bg-gray-50">
                  <Upload size={20} className="text-gray-400 mb-1" />
                  <span className="text-sm text-gray-600">Upload Photo</span>
                  <span className="text-xs text-gray-500">Max 5MB</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'photo')}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* ID Card Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              ID Card
            </label>
            <div className="flex items-center space-x-4">
              <div className="relative">
                {previewIdCard ? (
                  <div className="relative">
                    <img
                      src={previewIdCard}
                      alt="Preview"
                      className="w-24 h-24 rounded-md object-cover border border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile('idCard')}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-md w-24 h-24 flex items-center justify-center">
                    <User className="text-gray-400" size={32} />
                  </div>
                )}
              </div>

              <label className="flex flex-col items-center justify-center cursor-pointer">
                <div className="flex flex-col items-center justify-center text-center p-4 border border-gray-300 rounded-md hover:bg-gray-50">
                  <Upload size={20} className="text-gray-400 mb-1" />
                  <span className="text-sm text-gray-600">Upload ID</span>
                  <span className="text-xs text-gray-500">Max 5MB</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'idCard')}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div>
            <label htmlFor="institution" className="block text-sm font-medium text-gray-700 mb-1">
              Institution/Organization
            </label>
            <input
              type="text"
              id="institution"
              name="institution"
              value={formData.institution}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              placeholder="Your company or organization"
            />
          </div>
        </div>

        <div>
          <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-1">
            Area of Specialization
          </label>
          <input
            type="text"
            id="specialization"
            name="specialization"
            value={formData.specialization}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            placeholder="e.g., Network Security, Incident Response, etc."
          />
        </div>

        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
            Short Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            placeholder="Tell us about your background and interests in cybersecurity..."
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update Profile'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfileCompletion;