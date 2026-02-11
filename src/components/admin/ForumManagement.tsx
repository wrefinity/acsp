import React, { useState, useEffect } from 'react';
import { forumAPI } from '../../services/api';
import Button from '../common/Button';
import Input from '../common/Input';
import LoadingSpinner from '../common/LoadingSpinner';

interface Forum {
  _id: string;
  name: string;
  description: string;
}

export const ForumManagement: React.FC = () => {
  const [forums, setForums] = useState<Forum[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchForums = async () => {
    setLoading(true);
    try {
      const data = await forumAPI.getForums();
      setForums(data);
    } catch (err) {
      setError('Failed to fetch forums.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForums();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description) {
      setError('All fields are required.');
      return;
    }
    setLoading(true);
    try {
      await forumAPI.createForum({ name, description });
      setName('');
      setDescription('');
      setError('');
      fetchForums();
    } catch (err) {
      setError('Failed to create forum.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await forumAPI.deleteForum(id);
      fetchForums();
    } catch (err) {
      setError('Failed to delete forum.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Forum Management</h2>
      {error && <p className="text-red-500">{error}</p>}
      
      <form onSubmit={handleSubmit} className="mb-8 p-4 border rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Create New Forum</h3>
        <div className="mb-4">
          <Input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
        <Button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create'}
        </Button>
      </form>

      <div>
        <h3 className="text-xl font-semibold mb-4">Existing Forums</h3>
        {loading && <LoadingSpinner />}
        <div className="space-y-4">
          {forums.map((forum) => (
            <div key={forum._id} className="border rounded-lg p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold">{forum.name}</p>
                <p className="text-gray-600">{forum.description}</p>
              </div>
              <Button onClick={() => handleDelete(forum._id)} disabled={loading} className="bg-red-500 hover:bg-red-600">
                Delete
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};