import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { CheckCircle, XCircle } from 'lucide-react';

const EmailVerification = () => {
  const { token } = useParams<{ token: string }>();
  const { verifyEmail } = useAuth();
  const [status, setStatus] = React.useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = React.useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      try {
        if (!token) {
          throw new Error('Verification token is missing');
        }
        
        const result = await verifyEmail(token);
        setStatus('success');
        setMessage(result.message || 'Email verified successfully. Please complete your profile.');
      } catch (error) {
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'Verification failed');
      }
    };

    verify();
  }, [token, verifyEmail]);

  return (
    <div className="min-h-screen bg-neutral flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="bg-primary p-3 rounded-full">
            <CheckCircle className="h-12 w-12 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-primary">
          Email Verification
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {status === 'loading' && (
            <div className="flex flex-col items-center">
              <LoadingSpinner size="lg" />
              <p className="mt-4 text-gray-600">Verifying your email address...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Verification Successful!</h3>
              <p className="mt-2 text-gray-600">{message}</p>
              <div className="mt-6">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full flex justify-center bg-primary hover:bg-primary-light text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
                <XCircle className="h-10 w-10 text-red-600" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Verification Failed</h3>
              <p className="mt-2 text-gray-600">{message}</p>
              <div className="mt-6">
                <button
                  onClick={() => navigate('/login')}
                  className="w-full flex justify-center bg-primary hover:bg-primary-light text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Go to Login
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;