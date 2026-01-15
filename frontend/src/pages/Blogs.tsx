import React from 'react';
import PageHeader from '../components/PageHeader';
import { User, Calendar, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { contentAPI } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Blogs = () => {
  const { data: posts, loading, error } = useApi(contentAPI.getBlogs);

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
        <p>Error loading blog posts: {error.message}</p>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center text-gray-500">
        <p>No blog posts available at the moment.</p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader 
        title="Blog & Insights" 
        subtitle="Latest news, research, and expert opinions from the cybersecurity world."
        backgroundImage="https://images.unsplash.com/photo-1499750310159-5b5f226932b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
      />
      
      <section className="py-16 bg-neutral">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post: any) => (
              <article key={post._id || post.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <div className="flex items-center text-xs text-gray-500 mb-3 space-x-4">
                    <span className="flex items-center"><Calendar size={14} className="mr-1" /> {new Date(post.date).toLocaleDateString()}</span>
                    <span className="flex items-center text-secondary font-medium"><Tag size={14} className="mr-1" /> {post.category}</span>
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-3 hover:text-secondary transition-colors">
                    <Link to={`/blogs/${post._id || post.id}`}>{post.title}</Link>
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <User size={14} className="mr-2" />
                      {post.author}
                    </div>
                    <Link to={`/blogs/${post._id || post.id}`} className="text-secondary font-bold text-sm hover:underline">Read More</Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blogs;
