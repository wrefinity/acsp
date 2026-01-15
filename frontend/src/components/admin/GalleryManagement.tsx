import React, { useState, useEffect } from 'react';
import { contentAPI } from '../../services/api';
import Button from '../common/Button';
import Input from '../common/Input';
import LoadingSpinner from '../common/LoadingSpinner';

interface GalleryImage {
  _id: string;
  title: string;
  category: string;
  url: string;
}

export const GalleryManagement: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const data = await contentAPI.getGallery();
      setImages(data);
    } catch (err) {
      setError('Failed to fetch images.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !category || !file) {
      setError('All fields are required.');
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('image', file);

    try {
      await contentAPI.createGalleryImage(formData);
      setTitle('');
      setCategory('');
      setFile(null);
      setError('');
      fetchImages();
    } catch (err) {
      setError('Failed to upload image.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await contentAPI.deleteGalleryImage(id);
      fetchImages();
    } catch (err) {
      setError('Failed to delete image.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Gallery Management</h2>
      {error && <p className="text-red-500">{error}</p>}
      
      <form onSubmit={handleSubmit} className="mb-8 p-4 border rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Upload New Image</h3>
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
            type="file"
            onChange={handleFileChange}
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload'}
        </Button>
      </form>

      <div>
        <h3 className="text-xl font-semibold mb-4">Existing Images</h3>
        {loading && <LoadingSpinner />}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((image) => (
            <div key={image._id} className="border rounded-lg p-2">
              <img src={image.url} alt={image.title} className="w-full h-48 object-cover rounded-md mb-2" />
              <p className="font-semibold">{image.title}</p>
              <p className="text-gray-600">{image.category}</p>
              <Button onClick={() => handleDelete(image._id)} disabled={loading} className="mt-2 bg-red-500 hover:bg-red-600">
                Delete
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};