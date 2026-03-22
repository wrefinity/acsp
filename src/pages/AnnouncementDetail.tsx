import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Tag, ArrowLeft } from 'lucide-react';
import { contentAPI } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const AnnouncementDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [announcement, setAnnouncement] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const announcements = await contentAPI.getAnnouncements();
        const found = announcements.find((a: any) => a._id === id || a.id === id);
        if (found) setAnnouncement(found);
        else setError('Announcement not found.');
      } catch {
        setError('Failed to load announcement.');
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncement();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !announcement) {
    return (
      <div className="container mx-auto px-4 py-16 text-center text-gray-500">
        <p className="mb-4">{error || 'Announcement not found.'}</p>
        <Link to="/" className="text-secondary font-medium hover:underline">
          &larr; Back to Home
        </Link>
      </div>
    );
  }

  const paragraphs = announcement.description.split('\n').filter((p: string) => p.trim());

  return (
    <div className="flex flex-col">
      {/* Header banner */}
      <div className="bg-primary py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <Link to="/" className="inline-flex items-center text-white/80 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Home
          </Link>
          <div className="inline-block bg-secondary/20 text-secondary-light text-xs font-semibold px-3 py-1 rounded-full mb-4">
            {announcement.category}
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-white leading-tight">
            {announcement.title}
          </h1>
        </div>
      </div>

      {/* Meta */}
      <div className="bg-white border-b border-gray-100 py-4">
        <div className="container mx-auto px-4 max-w-3xl flex flex-wrap gap-4 text-sm text-gray-500">
          <span className="flex items-center"><Calendar size={14} className="mr-1.5" /> {announcement.date}</span>
          <span className="flex items-center text-secondary font-medium"><Tag size={14} className="mr-1.5" /> {announcement.category}</span>
        </div>
      </div>

      {/* Content */}
      <section className="py-12 bg-neutral">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-white rounded-2xl shadow-md p-8 md:p-12">
            <div className="prose prose-gray max-w-none space-y-4 text-gray-700 leading-relaxed">
              {paragraphs.map((para: string, i: number) => {
                if (para.startsWith('•') || para.startsWith('-')) {
                  return (
                    <p key={i} className="pl-4 border-l-2 border-secondary/30">
                      {para}
                    </p>
                  );
                }
                if (para.length < 80 && !para.endsWith('.') && !para.endsWith(',') && !para.match(/^\d\./)) {
                  return <h3 key={i} className="text-lg font-bold text-primary mt-6">{para}</h3>;
                }
                return <p key={i}>{para}</p>;
              })}
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link to="/" className="inline-flex items-center text-primary font-medium hover:text-secondary transition-colors">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AnnouncementDetail;
