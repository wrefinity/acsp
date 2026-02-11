import React, { useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { forumAPI } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import { MessageSquare, Plus, ThumbsUp, MessageCircle, Calendar, User } from 'lucide-react';
import Button from '../common/Button';

const Forum = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showNewThread, setShowNewThread] = useState(false);
  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [newThreadContent, setNewThreadContent] = useState('');

  // Fetch categories
  const { data: categories, loading: categoriesLoading, error: categoriesError } = useApi(
    () => forumAPI.getForums(),
    []
  );

  // Fetch threads for selected category
  const { 
    data: threads, 
    loading: threadsLoading, 
    error: threadsError,
    refetch: refetchThreads 
  } = useApi(
    () => selectedCategory ? forumAPI.getThreads(selectedCategory) : Promise.resolve([]),
    [selectedCategory]
  );

  const handleCreateThread = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCategory || !newThreadTitle.trim() || !newThreadContent.trim()) {
      alert('Please fill in all fields');
      return;
    }

    try {
      await forumAPI.createThread({
        title: newThreadTitle,
        content: newThreadContent,
        forumId: selectedCategory // Changed from categoryId to forumId to match API
      });
      
      // Reset form
      setNewThreadTitle('');
      setNewThreadContent('');
      setShowNewThread(false);
      
      // Refetch threads
      refetchThreads();
    } catch (error) {
      console.error('Error creating thread:', error);
      alert('Failed to create thread');
    }
  };

  if (categoriesLoading || (selectedCategory && threadsLoading)) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (categoriesError || threadsError) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading forum data: {categoriesError || threadsError}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Member Forums</h1>
        <p className="text-gray-600">Connect, discuss, and collaborate with fellow cybersecurity professionals.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Categories sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-bold text-primary mb-4">Categories</h2>
            <ul className="space-y-2">
              {categories?.map((category: any) => (
                <li key={category._id || category.id}>
                  <button
                    onClick={() => {
                      setSelectedCategory(category._id);
                      setShowNewThread(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      selectedCategory === category._id
                        ? 'bg-primary text-white'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className="font-medium">{category.name}</div>
                    <div className="text-sm opacity-75">{category.description}</div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:col-span-3">
          {selectedCategory ? (
            <div>
              {/* New thread button */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-primary">
                  {categories?.find((cat: any) => cat._id === selectedCategory)?.name}
                </h2>
                <Button 
                  variant="secondary" 
                  onClick={() => setShowNewThread(!showNewThread)}
                  className="flex items-center"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  New Thread
                </Button>
              </div>

              {/* New thread form */}
              {showNewThread && (
                <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                  <h3 className="text-lg font-bold text-primary mb-4">Create New Thread</h3>
                  <form onSubmit={handleCreateThread}>
                    <div className="mb-4">
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        id="title"
                        value={newThreadTitle}
                        onChange={(e) => setNewThreadTitle(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        placeholder="Enter thread title..."
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                        Content
                      </label>
                      <textarea
                        id="content"
                        value={newThreadContent}
                        onChange={(e) => setNewThreadContent(e.target.value)}
                        rows={5}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        placeholder="Enter thread content..."
                      />
                    </div>
                    <div className="flex justify-end space-x-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowNewThread(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">Create Thread</Button>
                    </div>
                  </form>
                </div>
              )}

              {/* Threads list */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="divide-y divide-gray-200">
                  {threads?.length > 0 ? (
                    threads.map((thread: any) => (
                      <div key={thread._id || thread.id} className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between">
                          <h3 className="text-lg font-bold text-primary hover:text-secondary cursor-pointer">
                            {thread.title}
                          </h3>
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(thread.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-600">
                          <User className="h-4 w-4 mr-1" />
                          <span className="mr-4">{thread.author}</span>
                          <MessageCircle className="h-4 w-4 mr-1" />
                          <span>{thread.replies} replies</span>
                        </div>
                        <div className="mt-3 text-gray-700 line-clamp-2">
                          {thread.content ? String(thread.content).substring(0, 150) : ''}...
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-12 text-center">
                      <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-1">No threads yet</h3>
                      <p className="text-gray-500">Be the first to start a discussion in this category.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">Welcome to the Forums</h3>
              <p className="text-gray-500 mb-6">Select a category from the sidebar to view or create discussions.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                {categories?.slice(0, 4).map((category: any) => (
                  <button
                    key={category._id || category.id}
                    onClick={() => setSelectedCategory(category._id)}
                    className="bg-primary/10 hover:bg-primary/20 p-4 rounded-lg text-left transition-colors"
                  >
                    <h4 className="font-medium text-primary">{category.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Forum;