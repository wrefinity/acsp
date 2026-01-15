import React from 'react';
import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/PageHeader';
import Forum from '../components/forum/Forum';
import { Lock, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const Forums = () => {
  const { state } = useAuth();

  // Check if user is authenticated and verified
  const isVerifiedMember = state.isAuthenticated && state.user?.status === 'verified';

  return (
    <div>
      <PageHeader
        title="Member Forums"
        subtitle="Connect, discuss, and collaborate with fellow cybersecurity professionals."
        backgroundImage="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
      />

      <section className="py-16 bg-neutral min-h-[60vh]">
        <div className="container mx-auto px-4">
          {!isVerifiedMember ? (
            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 text-gray-400 mb-6">
                <Lock size={40} />
              </div>
              <h2 className="text-2xl font-bold text-primary mb-4">Members Only Area</h2>
              <p className="text-gray-600 mb-8">
                The discussion forums are exclusively available to verified ACSP members.
                Please log in to access the discussions or register to become a member.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/login" className="bg-primary hover:bg-primary-light text-white font-bold py-3 px-8 rounded-lg transition-colors">
                  Login
                </Link>
                <Link to="/register" className="bg-white border-2 border-primary text-primary hover:bg-gray-50 font-bold py-3 px-8 rounded-lg transition-colors">
                  Register
                </Link>
              </div>
            </div>
          ) : (
            <Forum />
          )}
        </div>
      </section>
    </div>
  );
};

export default Forums;