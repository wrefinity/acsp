import React, { useState, useEffect } from 'react';
import { contentAPI } from '../../services/api';
import Button from '../common/Button';
import Input from '../common/Input';
import LoadingSpinner from '../common/LoadingSpinner';

interface CarouselSlide {
  _id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  order: number;
  imageUrl: string;
}

export const CarouselManagement: React.FC = () => {
  const [slides, setSlides] = useState<CarouselSlide[]>([]);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [ctaText, setCtaText] = useState('');
  const [ctaLink, setCtaLink] = useState('');
  const [order, setOrder] = useState<number>(0); // Initialize as number
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchSlides = async () => {
    setLoading(true);
    try {
      const data = await contentAPI.getCarouselSlides();
      setSlides(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch carousel slides.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const validateForm = () => {
    if (!title || !subtitle || !ctaText || !ctaLink || !file) {
      setError('All fields are required.');
      return false;
    }
    if (!/^(ftp|http|https):\/\/[^ "]+$/.test(ctaLink)) { // Basic URL validation
      setError('CTA Link must be a valid URL.');
      return false;
    }
    if (typeof order !== 'number' || order < 0) {
      setError('Order must be a non-negative number.');
      return false;
    }
    setError('');
    return true;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('subtitle', subtitle);
    formData.append('ctaText', ctaText);
    formData.append('ctaLink', ctaLink);
    formData.append('order', order.toString());
    formData.append('image', file);

    try {
      await contentAPI.createCarouselSlide(formData);
      setTitle('');
      setSubtitle('');
      setCtaText('');
      setCtaLink('');
      setOrder(0);
      setFile(null);
      setError('');
      fetchSlides();
    } catch (err: any) {
      setError(err.message || 'Failed to create carousel slide.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await contentAPI.deleteCarouselSlide(id);
      fetchSlides();
    } catch (err: any) {
      setError(err.message || 'Failed to delete carousel slide.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Carousel Management</h2>
      {error && <p className="text-red-500">{error}</p>}
      
      <form onSubmit={handleSubmit} className="mb-8 p-4 border rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Create New Slide</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Subtitle"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
          />
          <Input
            type="text"
            placeholder="CTA Text"
            value={ctaText}
            onChange={(e) => setCtaText(e.target.value)}
          />
          <Input
            type="text"
            placeholder="CTA Link (e.g., https://example.com)"
            value={ctaLink}
            onChange={(e) => setCtaLink(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Order (e.g., 0)"
            value={order}
            onChange={(e) => setOrder(parseInt(e.target.value, 10) || 0)} // Ensure number and default to 0
          />
        </div>
        <div className="mt-4">
          <Input
            type="file"
            onChange={handleFileChange}
          />
        </div>
        <Button type="submit" disabled={loading} className="mt-4">
          {loading ? 'Creating...' : 'Create Slide'}
        </Button>
      </form>

      <div>
        <h3 className="text-xl font-semibold mb-4">Existing Slides</h3>
        {loading && <LoadingSpinner />}
        <div className="space-y-4">
          {slides.map((slide) => (
            <div key={slide._id} className="border rounded-lg p-4">
              <img src={slide.imageUrl} alt={slide.title} className="w-full h-48 object-cover rounded-md mb-2" />
              <h4 className="font-semibold text-lg">{slide.title}</h4>
              <p className="text-gray-600">{slide.subtitle}</p>
              <p className="text-sm mt-2">Order: {slide.order}</p>
              <Button onClick={() => handleDelete(slide._id)} disabled={loading} className="mt-4 bg-red-500 hover:bg-red-600">
                Delete
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};