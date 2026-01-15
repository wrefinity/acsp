import React, { useState, useEffect } from 'react';
import { contentAPI } from '../../services/api';
import Button from '../common/Button';
import Input from '../common/Input';
import LoadingSpinner from '../common/LoadingSpinner';

interface Blog {
  _id: string;
  title: string;
  excerpt: string;
  author: string;
  category: string;
  content: string;
  image: string;
}

export const BlogManagement: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const data = await contentAPI.getBlogs();
      setBlogs(data);
    } catch (err) {
      setError('Failed to fetch blogs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !excerpt || !author || !category || !content || !file) {
      setError('All fields are required.');
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('excerpt', excerpt);
    formData.append('author', author);
    formData.append('category', category);
    formData.append('content', content);
    formData.append('image', file);

    try {
      await contentAPI.createBlog(formData);
      setTitle('');
      setExcerpt('');
      setAuthor('');
      setCategory('');
      setContent('');
      setFile(null);
      setError('');
      fetchBlogs();
    } catch (err) {
      setError('Failed to create blog.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await contentAPI.deleteBlog(id);
      fetchBlogs();
    } catch (err) {
      setError('Failed to delete blog.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Blog Management</h2>
      {error && <p className="text-red-500">{error}</p>}
      
      <form onSubmit={handleSubmit} className="mb-8 p-4 border rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Create New Blog Post</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
        <div className="mt-4">
          <Input
            type="text"
            placeholder="Excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
          />
        </div>
        <div className="mt-4">
          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            rows={6}
          ></textarea>
        </div>
        <div className="mt-4">
          <Input
            type="file"
            onChange={handleFileChange}
          />
        </div>
        <Button type="submit" disabled={loading} className="mt-4">
          {loading ? 'Creating...' : 'Create Post'}
        </Button>
      </form>

      <div>
        <h3 className="text-xl font-semibold mb-4">Existing Blog Posts</h3>
        {loading && <LoadingSpinner />}
        <div className="space-y-4">
          {blogs.map((blog) => (
            <div key={blog._id} className="border rounded-lg p-4">
              <h4 className="font-semibold text-lg">{blog.title}</h4>
              <p className="text-gray-600">by {blog.author} in {blog.category}</p>
              <p className="text-sm mt-2">{blog.excerpt}</p>
              <Button onClick={() => handleDelete(blog._id)} disabled={loading} className="mt-4 bg-red-500 hover:bg-red-600">
                Delete
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
