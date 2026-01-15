import React, { useState, useEffect } from 'react';
import { contentAPI } from '../../services/api'; // Import contentAPI
import Button from '../common/Button';
import Input from '../common/Input';
import LoadingSpinner from '../common/LoadingSpinner';

interface Event {
  _id: string;
  title: string;
  date: string;
  time: string; // Added
  venue: string;
  type: 'Physical' | 'Virtual' | 'Hybrid';
  description: string; // Added
  imageUrl: string;
}

export const EventManagement: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState(''); // Added
  const [venue, setVenue] = useState('');
  const [type, setType] = useState<'Physical' | 'Virtual' | 'Hybrid'>('Physical');
  const [description, setDescription] = useState(''); // Added
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Manage loading state locally

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await contentAPI.getEvents(); // Use contentAPI
      setEvents(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch events.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !time || !venue || !type || !description || !file) { // Updated validation
      setError('All fields are required.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('date', date);
    formData.append('time', time); // Added to formData
    formData.append('venue', venue);
    formData.append('type', type);
    formData.append('description', description); // Added to formData
    formData.append('image', file);

    try {
      await contentAPI.createEvent(formData); // Use contentAPI
      setTitle('');
      setDate('');
      setTime(''); // Cleared
      setVenue('');
      setType('Physical');
      setDescription(''); // Cleared
      setFile(null);
      setError('');
      fetchEvents();
    } catch (err: any) {
      setError(err.message || 'Failed to create event.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await contentAPI.deleteEvent(id); // Use contentAPI
      fetchEvents();
    } catch (err: any) {
      setError(err.message || 'Failed to delete event.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Event Management</h2>
      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="mb-8 p-4 border rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Create New Event</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            type="date"
            placeholder="Select Date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <Input
            type="time" // Added time input
            placeholder="Event Time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Venue"
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value as 'Physical' | 'Virtual' | 'Hybrid')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          >
            <option value="Physical">Physical</option>
            <option value="Virtual">Virtual</option>
            <option value="Hybrid">Hybrid</option>
          </select>
          <textarea // Added description textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="col-span-full w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            rows={3}
          ></textarea>
        </div>
        <div className="mt-4">
          <Input
            type="file"
            onChange={handleFileChange}
          />
        </div>
        <Button type="submit" disabled={loading} className="mt-4">
          {loading ? 'Creating...' : 'Create Event'}
        </Button>
      </form>

      <div>
        <h3 className="text-xl font-semibold mb-4">Existing Events</h3>
        {loading && <LoadingSpinner />}
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event._id} className="border rounded-lg p-4">
              <img src={event.imageUrl} alt={event.title} className="w-full h-48 object-cover rounded-md mb-2" />
              <h4 className="font-semibold text-lg">{event.title}</h4>
              <p className="text-gray-600">{event.date} at {event.venue}</p>
              <p className="text-sm mt-2">Type: {event.type}</p>
              <p className="text-sm text-gray-700 mt-1">{event.description}</p> {/* Display description */}
              <Button onClick={() => handleDelete(event._id)} disabled={loading} className="mt-4 bg-red-500 hover:bg-red-600">
                Delete
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};