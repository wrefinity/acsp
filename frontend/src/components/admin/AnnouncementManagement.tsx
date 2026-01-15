import React, { useState, useEffect } from 'react';
import { contentAPI } from '../../services/api';
import Button from '../common/Button';
import Input from '../common/Input';
import LoadingSpinner from '../common/LoadingSpinner';

interface Announcement {
  _id: string;
  title: string;
  category: string;
  description: string;
}

export const AnnouncementManagement: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(''); // New state for date
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const data = await contentAPI.getAnnouncements();
      setAnnouncements(data);
    } catch (err) {
      setError('Failed to fetch announcements.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !category || !description || !date) { // Check for date as well
      setError('All fields are required.');
      return;
    }
    setLoading(true);
    try {
      await contentAPI.createAnnouncement({ title, category, description, date }); // Include date
      setTitle('');
      setCategory('');
      setDescription('');
      setDate(''); // Reset date
      setError('');
      fetchAnnouncements();
    } catch (err) {
      setError('Failed to create announcement.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await contentAPI.deleteAnnouncement(id);
      fetchAnnouncements();
    } catch (err) {
      setError('Failed to delete announcement.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Announcement Management</h2>
      {error && <p className="text-red-500">{error}</p>}
      
      <form onSubmit={handleSubmit} className="mb-8 p-4 border rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Create New Announcement</h3>
        <div className="mb-4">
          <Input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <Input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <Input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="mb-4"> {/* New input for date */}
          <Input
            type="date"
            placeholder="Date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create'}
        </Button>
      </form>

      <div>
        <h3 className="text-xl font-semibold mb-4">Existing Announcements</h3>
        {loading && <LoadingSpinner />}
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <div key={announcement._id} className="border rounded-lg p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold">{announcement.title}</p>
                <p className="text-gray-600">{announcement.category}</p>
              </div>
              <Button onClick={() => handleDelete(announcement._id)} disabled={loading} className="bg-red-500 hover:bg-red-600">
                Delete
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};