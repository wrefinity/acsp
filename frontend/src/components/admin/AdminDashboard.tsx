import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userAPI } from '../../services/api';
import { useApi } from '../../hooks/useApi';
import LoadingSpinner from '../common/LoadingSpinner';
import { Users, FileText, Settings, Shield, Search, Filter, Eye, Check, X, LogOut, Image, MessageSquare, Megaphone, Newspaper, Calendar, User } from 'lucide-react';
import Button from '../common/Button';
import { GalleryManagement } from './GalleryManagement';
import { ForumManagement } from './ForumManagement';
import { AnnouncementManagement } from './AnnouncementManagement';
import { BlogManagement } from './BlogManagement';
import { CarouselManagement } from './CarouselManagement';
import { EventManagement } from './EventManagement';
import { ExecutiveManagement } from './ExecutiveManagement';
import UserManagement from './UserManagement';

const AdminDashboard = () => {
  const { state, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const {
    data: usersData,
    loading: usersLoading,
    error: usersError,
    refetch: refetchUsers
  } = useApi(
    () => userAPI.getAllUsers(1, 50), // Get first 50 users
    []
  );

  const users = usersData?.users || [];

  // Filter users based on search and status
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleVerifyUser = async (userId: string, action: 'approve' | 'reject', reason?: string) => {
    try {
      await userAPI.verifyUser(userId, action, reason);
      refetchUsers(); // Refresh the user list
    } catch (error) {
      console.error(`Error ${action}ing user:`, error);
      alert(`Failed to ${action} user`);
    }
  };

  if (usersLoading && activeTab === 'users') {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (usersError && activeTab === 'users') {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading users: {usersError}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Manage users, content, and system settings.</p>
          </div>
          <button
            onClick={logout}
            className="flex items-center text-sm font-medium text-gray-700 hover:text-primary"
          >
            <LogOut className="h-5 w-5 mr-1" />
            Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center mb-6">
              <div className="bg-primary p-3 rounded-full mr-4">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-primary">{state.user?.name}</h2>
                <p className="text-sm text-gray-500">Administrator</p>
              </div>
            </div>

            <nav className="space-y-2">
              {[
                { id: 'users', label: 'User Management', icon: Users },
                { id: 'executives', label: 'Executive Members', icon: User },
                { id: 'gallery', label: 'Gallery Management', icon: Image },
                { id: 'forums', label: 'Forum Management', icon: MessageSquare },
                { id: 'announcements', label: 'Announcements', icon: Megaphone },
                { id: 'blogs', label: 'Blog Management', icon: Newspaper },
                { id: 'carousel', label: 'Carousel Management', icon: Image },
                { id: 'events', label: 'Event Management', icon: Calendar },
                { id: 'settings', label: 'System Settings', icon: Settings }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary/10 text-primary border-l-4 border-primary'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="h-5 w-5 mr-3" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-md p-6">
            {activeTab === 'users' && <UserManagement />}

            {activeTab === 'gallery' && <GalleryManagement />}
            {activeTab === 'forums' && <ForumManagement />}
            {activeTab === 'announcements' && <AnnouncementManagement />}
            {activeTab === 'blogs' && <BlogManagement />}
            {activeTab === 'carousel' && <CarouselManagement />}
            {activeTab === 'events' && <EventManagement />}
            {activeTab === 'executives' && <ExecutiveManagement />}

            {activeTab === 'settings' && (
              <div>
                <h2 className="text-xl font-bold text-primary mb-6">System Settings</h2>
                <p className="text-gray-600">Configure system-wide settings and preferences.</p>

                <div className="mt-6 space-y-6">
                  <div className="border-b border-gray-200 pb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">General Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
                        <input
                          type="text"
                          defaultValue="ACSP - Association of Cybersecurity Practitioners"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                        <input
                          type="email"
                          defaultValue="admin@acsp.org"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-b border-gray-200 pb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Security Settings</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Require Email Verification</p>
                          <p className="text-sm text-gray-500">New users must verify their email before accessing the platform</p>
                        </div>
                        <button className="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary bg-primary">
                          <span className="sr-only">Use setting</span>
                          <span className="pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 translate-x-5"></span>
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Enable User Registration</p>
                          <p className="text-sm text-gray-500">Allow new users to register for accounts</p>
                        </div>
                        <button className="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary bg-primary">
                          <span className="sr-only">Use setting</span>
                          <span className="pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 translate-x-5"></span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button>Save Settings</Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;