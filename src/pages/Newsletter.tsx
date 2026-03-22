import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, Calendar } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { contentAPI } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Newsletter = () => {
  const { data: messages, loading, error } = useApi(contentAPI.getFounderMessages);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-primary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/20 mb-4">
            <BookOpen className="h-8 w-8 text-secondary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">ACSP Newsletter</h1>
          <div className="h-1 w-20 bg-secondary mx-auto mb-4"></div>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Stay informed with messages from our Founder and the latest news from the Association of Cybersecurity Practitioners.
          </p>
        </div>
      </section>

      {/* Messages */}
      <section className="py-16 bg-neutral">
        <div className="container mx-auto px-4 max-w-4xl">
          {loading && (
            <div className="flex justify-center py-16">
              <LoadingSpinner />
            </div>
          )}

          {error && (
            <div className="text-center py-16 text-red-500">
              <p>Error loading newsletters: {error}</p>
            </div>
          )}

          {!loading && !error && (!messages || messages.length === 0) && (
            <div className="text-center py-16 text-gray-500">
              <BookOpen className="h-14 w-14 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No newsletters published yet.</p>
              <p className="text-sm mt-1">Check back soon for updates from our Founder.</p>
            </div>
          )}

          {!loading && !error && messages && messages.length > 0 && (
            <div className="space-y-6">
              {messages.map((msg: any, index: number) => {
                const isExpanded = expandedId === msg._id;
                const isLatest = index === 0;
                const paragraphs = msg.content.split('\n').filter((p: string) => p.trim());

                return (
                  <div
                    key={msg._id}
                    className={`bg-white rounded-2xl shadow-md overflow-hidden transition-shadow hover:shadow-lg ${isLatest ? 'border-l-4 border-secondary' : ''}`}
                  >
                    {/* Header */}
                    <div className="p-6 pb-4">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        {isLatest && (
                          <span className="bg-secondary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">Latest</span>
                        )}
                        <span className="bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full">{msg.edition}</span>
                        <span className="flex items-center text-gray-500 text-xs">
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          {msg.date}
                        </span>
                      </div>
                      <h2 className="text-xl font-bold text-primary leading-snug">{msg.newsletterTitle}</h2>
                    </div>

                    {/* Founder's Message Label */}
                    <div className="px-6 pb-2">
                      <h3 className="text-base font-semibold text-secondary border-b border-gray-100 pb-2">Founder's Message</h3>
                    </div>

                    {/* Content */}
                    <div className="px-6 pb-4">
                      <div className={`text-gray-700 leading-relaxed text-sm space-y-3 ${!isExpanded ? 'line-clamp-4' : ''}`}>
                        {paragraphs.map((para: string, i: number) => (
                          <p key={i}>{para}</p>
                        ))}
                      </div>

                      <button
                        onClick={() => toggleExpand(msg._id)}
                        className="mt-3 flex items-center text-primary font-medium text-sm hover:text-secondary transition-colors"
                      >
                        {isExpanded ? (
                          <>Show Less <ChevronUp className="h-4 w-4 ml-1" /></>
                        ) : (
                          <>Read Full Message <ChevronDown className="h-4 w-4 ml-1" /></>
                        )}
                      </button>
                    </div>

                    {/* Signature */}
                    <div className="px-6 py-4 bg-primary/5 border-t border-gray-100">
                      <p className="font-bold text-primary text-sm">{msg.authorName}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{msg.authorTitle}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Newsletter;
