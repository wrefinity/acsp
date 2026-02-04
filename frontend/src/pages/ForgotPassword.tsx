import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import Button from '../components/common/Button';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await authAPI.forgotPassword(email);
      setMessage(response.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send password reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-primary">Forgot Password</h2>
        <p className="text-center text-gray-600">
          Enter your email address and we will send you a link to reset your password.
        </p>

        {message && (
          <div className="p-4 text-green-700 bg-green-100 border border-green-300 rounded-md">
            {message}
          </div>
        )}

        {error && (
          <div className="p-4 text-red-700 bg-red-100 border border-red-300 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </div>
        </form>

        <div className="text-sm text-center">
          <button onClick={() => navigate('/login')} className="font-medium text-primary hover:underline">
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
