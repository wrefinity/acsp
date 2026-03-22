import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { User, Calendar, Tag, ArrowLeft } from 'lucide-react';
import { contentAPI } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const blogs = await contentAPI.getBlogs();
        const found = blogs.find((b: any) => b._id === id || b.id === id);
        if (found) setPost(found);
        else setError('Blog post not found.');
      } catch {
        setError('Failed to load blog post.');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-16 text-center text-gray-500">
        <p className="mb-4">{error || 'Post not found.'}</p>
        <Link to="/blogs" className="text-secondary font-medium hover:underline">
          &larr; Back to Blogs
        </Link>
      </div>
    );
  }

  const paragraphs = post.content.split('\n').filter((p: string) => p.trim());

  return (
    <div className="flex flex-col">
      {/* Hero image */}
      <div className="relative h-64 md:h-96 w-full overflow-hidden">
        <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-primary/60"></div>
        <div className="absolute inset-0 flex items-end pb-8 px-4 md:px-0">
          <div className="container mx-auto">
            <Link to="/blogs" className="inline-flex items-center text-white/80 hover:text-white text-sm mb-4 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Blogs
            </Link>
            <h1 className="text-2xl md:text-4xl font-bold text-white leading-tight max-w-3xl">{post.title}</h1>
          </div>
        </div>
      </div>

      {/* Meta */}
      <div className="bg-white border-b border-gray-100 py-4">
        <div className="container mx-auto px-4 flex flex-wrap gap-4 text-sm text-gray-500">
          <span className="flex items-center"><User size={14} className="mr-1.5" /> {post.author}</span>
          <span className="flex items-center"><Calendar size={14} className="mr-1.5" /> {new Date(post.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          <span className="flex items-center text-secondary font-medium"><Tag size={14} className="mr-1.5" /> {post.category}</span>
        </div>
      </div>

      {/* Content */}
      <section className="py-12 bg-neutral">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-white rounded-2xl shadow-md p-8 md:p-12">
            <p className="text-lg text-gray-600 italic border-l-4 border-secondary pl-4 mb-8">{post.excerpt}</p>
            <div className="prose prose-gray max-w-none space-y-4 text-gray-700 leading-relaxed">
              {paragraphs.map((para: string, i: number) => {
                // Render bullet points
                if (para.startsWith('•')) {
                  return (
                    <p key={i} className="pl-4 border-l-2 border-secondary/30">
                      {para}
                    </p>
                  );
                }
                // Section headings (lines ending without period / short lines)
                if (para.length < 80 && !para.endsWith('.') && !para.endsWith(',') && !para.match(/^\d\./)) {
                  return <h3 key={i} className="text-lg font-bold text-primary mt-6">{para}</h3>;
                }
                return <p key={i}>{para}</p>;
              })}
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link to="/blogs" className="inline-flex items-center text-primary font-medium hover:text-secondary transition-colors">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to all posts
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogDetail;
