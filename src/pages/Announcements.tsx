import React from 'react';
import PageHeader from '../components/PageHeader';
import { Calendar, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { contentAPI } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Announcements = () => {
  const { data: announcements, loading, error } = useApi(contentAPI.getAnnouncements);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center text-red-500">
        <p>Error loading announcements.</p>
      </div>
    );
  }

  if (!announcements || announcements.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center text-gray-500">
        <p>No announcements available at the moment.</p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Announcements"
        subtitle="Stay up to date with the latest news, alerts, and updates from ACSP."
        backgroundImage="https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1920&q=80"
      />

      <section className="py-16 bg-neutral">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {announcements.map((item: any) => (
              <div
                key={item._id || item.id}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border-l-4 border-secondary flex flex-col"
              >
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span className="flex items-center text-secondary font-semibold">
                      <Tag size={13} className="mr-1" /> {item.category}
                    </span>
                    <span className="flex items-center">
                      <Calendar size={13} className="mr-1" /> {item.date}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-primary mb-3 hover:text-secondary transition-colors">
                    <Link to={`/announcements/${item._id || item.id}`}>{item.title}</Link>
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 flex-1 line-clamp-3">{item.description}</p>
                  <Link
                    to={`/announcements/${item._id || item.id}`}
                    className="text-secondary font-bold text-sm hover:underline self-start"
                  >
                    Read More
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Announcements;
