import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import { forumAPI } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import { MessageSquare, Calendar, User, ArrowLeftCircle, ThumbsUp, Flag, Trash2, Lock } from 'lucide-react';
import Button from '../common/Button';
import { useAuth } from '../../context/AuthContext';

const ThreadDetail = () => {
  const { threadId } = useParams<{ threadId: string }>();
  const { state: authState } = useAuth();
  const isVerifiedMember = authState.isAuthenticated && authState.user?.status === 'verified';

  const { data: thread, loading, error, refetch: refetchThread } = useApi(
    () => forumAPI.getThread(threadId!),
    [threadId]
  );

  const [replyContent, setReplyContent] = useState('');

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) {
      alert('Reply content cannot be empty.');
      return;
    }

    try {
      await forumAPI.createReply(threadId!, replyContent);
      setReplyContent('');
      refetchThread(); // Refetch thread to show new reply
    } catch (err) {
      console.error('Error creating reply:', err);
      alert('Failed to post reply.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading thread: {error.message}</p>
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Thread not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <Link to="/forums" className="inline-flex items-center text-primary hover:text-secondary mb-6">
        <ArrowLeftCircle className="h-5 w-5 mr-2" />
        Back to Forums
      </Link>

      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h1 className="text-3xl font-bold text-primary mb-4">{thread.title}</h1>
        <div className="flex items-center text-sm text-gray-600 mb-4 space-x-4">
          <div className="flex items-center">
            <User className="h-4 w-4 mr-1" />
            <span>{thread.author?.name || 'Anonymous'}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{new Date(thread.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center">
            <MessageSquare className="h-4 w-4 mr-1" />
            <span>{thread.replies?.length || 0} replies</span>
          </div>
        </div>
        <div className="flex items-center space-x-4 mb-4 text-gray-600">
            <button onClick={() => alert('Like functionality coming soon!')} className="flex items-center hover:text-primary transition-colors">
                <ThumbsUp className="h-4 w-4 mr-1" />
                <span>Like (0)</span> {/* Placeholder for like count */}
            </button>
            <button onClick={() => alert('Report functionality coming soon!')} className="flex items-center hover:text-red-500 transition-colors">
                <Flag className="h-4 w-4 mr-1" />
                <span>Report</span>
            </button>
            {authState.user?.role === 'admin' && (
                <>
                    <button onClick={() => alert('Delete Thread functionality coming soon!')} className="flex items-center text-red-500 hover:text-red-700 transition-colors">
                        <Trash2 className="h-4 w-4 mr-1" />
                        <span>Delete</span>
                    </button>
                    <button onClick={() => alert('Lock Thread functionality coming soon!')} className="flex items-center hover:text-orange-500 transition-colors">
                        <Lock className="h-4 w-4 mr-1" />
                        <span>Lock</span>
                    </button>
                </>
            )}
        </div>
        <div className="prose prose-lg max-w-none text-gray-800 border-t border-gray-200 pt-4" dangerouslySetInnerHTML={{ __html: thread.content }}></div>
      </div>

      {/* Replies Section */}
      <h2 className="text-2xl font-bold text-primary mb-6">Replies</h2>
      <div className="space-y-6 mb-8">
        {thread.replies && thread.replies.length > 0 ? (
          thread.replies.map((reply: any) => (
            <div key={reply._id} className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-secondary">
              <div className="flex items-center text-sm text-gray-600 mb-2 space-x-3">
                <User className="h-4 w-4" />
                <span>{reply.author?.name || 'Anonymous'}</span>
                <span>•</span>
                <span>{new Date(reply.createdAt).toLocaleDateString()}</span>
                <span className="flex-grow"></span> {/* Spacer */}
                <button onClick={() => alert('Like functionality coming soon!')} className="flex items-center hover:text-primary transition-colors">
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    <span>(0)</span> {/* Placeholder for like count */}
                </button>
                <button onClick={() => alert('Report functionality coming soon!')} className="flex items-center hover:text-red-500 transition-colors">
                    <Flag className="h-4 w-4 mr-1" />
                </button>
                {authState.user?.role === 'admin' && (
                    <button onClick={() => alert(`Delete Reply functionality coming soon! Reply ID: ${reply._id}`)} className="flex items-center text-red-500 hover:text-red-700 transition-colors">
                        <Trash2 className="h-4 w-4 mr-1" />
                    </button>
                )}
              </div>
              <p className="text-gray-700">{reply.content}</p>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-4 text-center text-gray-500">
            No replies yet. Be the first to respond!
          </div>
        )}
      </div>

      {/* Reply Form */}
      {isVerifiedMember && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-primary mb-4">Post a Reply</h2>
          <form onSubmit={handleReplySubmit}>
            <div className="mb-4">
              <label htmlFor="replyContent" className="sr-only">Your Reply</label>
              <textarea
                id="replyContent"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Write your reply here..."
                required
              ></textarea>
            </div>
            <div className="flex justify-end">
              <Button type="submit">Submit Reply</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ThreadDetail;
