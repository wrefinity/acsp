import React from 'react';
import PageHeader from '../components/PageHeader';
import { useApi } from '../hooks/useApi';
import { contentAPI } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Gallery = () => {
  const { data: images, loading, error } = useApi(contentAPI.getGallery);

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
        <p>Error loading gallery images: {error.message}</p>
      </div>
    );
  }

  if (!images || images.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center text-gray-500">
        <p>No gallery images available at the moment.</p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader 
        title="Gallery" 
        subtitle="Highlights from our events, conferences, and community gatherings."
        backgroundImage="https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
      />
      
      <section className="py-16 bg-neutral">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((img: any, idx: any) => (
              <div key={img._id || idx} className="relative group overflow-hidden rounded-lg shadow-md aspect-video cursor-pointer">
                <img 
                  src={img.url} 
                  alt={img.category} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{img.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Gallery;
