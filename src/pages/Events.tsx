import React, { useState } from 'react';
import PageHeader from '../components/PageHeader';
import { Calendar, MapPin, Clock, Filter } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { contentAPI } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { format, isPast } from 'date-fns';

interface EventData {
  _id: string;
  title: string;
  description: string;
  date: string; // Assuming ISO string or YYYY-MM-DD from backend
  venue: string;
  type: 'Physical' | 'Virtual' | 'Hybrid';
  imageUrl: string;
}

const Events = () => {
  const [filter, setFilter] = useState<'upcoming' | 'past' | 'all'>('upcoming');
  const { data: fetchedEvents, loading, error } = useApi<EventData[]>(contentAPI.getEvents);

  const now = new Date();

  const filteredEvents = (fetchedEvents || [])
    .filter(event => {
      const eventDate = new Date(event.date); // Parse date from backend
      if (filter === 'upcoming') {
        return eventDate >= now;
      } else if (filter === 'past') {
        return eventDate < now;
      }
      return true; // 'all' filter
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Sort by date

  return (
    <div>
      <PageHeader 
        title="Events & Conferences" 
        subtitle="Join our conferences, workshops, and seminars to stay ahead in cybersecurity."
        backgroundImage="https://images.unsplash.com/photo-1544531586-fde5298cdd40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
      />
      
      <section className="py-12 bg-neutral min-h-screen">
        <div className="container mx-auto px-4">
          {/* Filters */}
          <div className="flex justify-center mb-12">
            <div className="bg-white p-1 rounded-lg shadow-sm inline-flex">
              <button 
                onClick={() => setFilter('upcoming')}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${filter === 'upcoming' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                Upcoming
              </button>
              <button 
                onClick={() => setFilter('past')}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${filter === 'past' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                Past Events
              </button>
              <button 
                onClick={() => setFilter('all')}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${filter === 'all' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                All Events
              </button>
            </div>
          </div>

          {loading && (
            <div className="flex justify-center items-center py-20">
              <LoadingSpinner />
            </div>
          )}

          {error && (
            <div className="text-center py-20 text-red-500 text-lg">
              <p>Error fetching events: {error}</p>
              <p>Please try again later.</p>
            </div>
          )}

          {!loading && !error && filteredEvents.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No events found in this category.</p>
            </div>
          )}

          {!loading && !error && filteredEvents.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event) => (
                <div key={event._id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
                  <div className="relative h-48">
                    <img src={event?.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                    <div className="absolute top-4 right-4 bg-secondary text-primary text-xs font-bold px-3 py-1 rounded-full uppercase">
                      {event.type}
                    </div>
                  </div>
                  <div className="p-6 flex-grow flex flex-col">
                    <h3 className="text-xl font-bold text-primary mb-3">{event.title}</h3>
                    
                    <div className="space-y-2 mb-6 text-gray-600 text-sm">
                      <div className="flex items-center">
                        <Calendar size={16} className="mr-2 text-secondary" />
                        <span>{format(new Date(event.date), 'MMMM dd, yyyy')}</span>
                      </div>
                      {/* Assuming time is not separately available, or can be extracted from date if needed */}
                      {/* <div className="flex items-center">
                        <Clock size={16} className="mr-2 text-secondary" />
                        <span>{event.time}</span>
                      </div> */}
                      <div className="flex items-center">
                        <MapPin size={16} className="mr-2 text-secondary" />
                        <span>{event.venue}</span>
                      </div>
                    </div>
                    
                    <div className="mt-auto">
                      <button className="w-full bg-primary hover:bg-primary-light text-white font-bold py-2 rounded-lg transition-colors">
                        {isPast(new Date(event.date)) ? 'View Details' : 'Register Now'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Events;

