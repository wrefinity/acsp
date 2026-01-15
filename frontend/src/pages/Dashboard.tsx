import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ProfileCompletion from '../components/profile/ProfileCompletion';
import { User, Settings, FileText, Users, MessageSquare, Bell, LogOut, Shield, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { userAPI, forumAPI, contentAPI } from '../services/api';

const Dashboard = () => {
  const { state, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [forumCategories, setForumCategories] = useState<any[]>([]);
  const [loadingForums, setLoadingForums] = useState(true);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loadingContent, setLoadingContent] = useState(true);

  // Fetch content when component mounts
  useEffect(() => {
    const fetchContent = async () => {
      try {
        // Fetch forum categories
        const categories = await forumAPI.getForums();

        // For each category, fetch thread counts to get real-time data
        const categoriesWithCounts = await Promise.all(
          categories.map(async (category: any) => {
            try {
              const threads = await forumAPI.getThreads(category.id);
              return {
                ...category,
                threadCount: threads.length,
                // In a real app, you might also want to calculate post counts
                postCount: threads.reduce((acc: number, thread: any) => acc + (thread.replies || 0), 0)
              };
            } catch (err) {
              console.error(`Error fetching threads for category ${category.id}:`, err);
              return {
                ...category,
                threadCount: 0,
                postCount: 0
              };
            }
          })
        );

        setForumCategories(categoriesWithCounts);

        // Fetch announcements
        const announcementsData = await contentAPI.getAnnouncements();
        setAnnouncements(announcementsData);

        // Fetch events
        const eventsData = await contentAPI.getEvents();
        setEvents(eventsData);
      } catch (error) {
        console.error('Error fetching content:', error);
        // Set empty arrays in case of error
        setForumCategories([]);
        setAnnouncements([]);
        setEvents([]);
      } finally {
        setLoadingForums(false);
        setLoadingContent(false);
      }
    };

    if (state.isAuthenticated) {
      fetchContent();
    }
  }, [state.isAuthenticated]);

  // Check if user needs to complete profile
  const needsProfileCompletion = state.user?.status === 'unverified_profile' ||
                                (state.user?.status === 'pending_verification' &&
                                (!state.user?.profile?.photo || !state.user?.profile?.idCard));

  // Check if user is an admin
  const isAdmin = state.user?.role === 'admin';

  if (needsProfileCompletion) {
    return (
      <div className="min-h-screen bg-neutral py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-center text-yellow-600 bg-yellow-50 p-4 rounded-lg">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span>Please complete your profile to get verified and access all features</span>
              </div>
            </div>

            <ProfileCompletion />
          </div>
        </div>
      </div>
    );
  }

  // If user is admin, redirect to admin dashboard
  if (isAdmin) {
    window.location.href = '/admin';
    return null; // Return null while redirecting
  }

  return (
    <div className="min-h-screen bg-neutral">
      <div className="bg-primary text-white pb-32">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Shield className="h-8 w-8 text-secondary" />
              <span className="text-xl font-bold">ACSP Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-primary-light rounded-full relative">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center space-x-2">
                <img
                  src={state.user?.profile?.photo || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
                  alt={state.user?.name}
                  className="w-8 h-8 rounded-full border-2 border-secondary"
                />
                <span className="font-medium hidden md:block">{state.user?.name}</span>
              </div>
              <button
                onClick={logout}
                className="p-2 hover:bg-primary-light rounded-full"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="-mt-24">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Dashboard Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {['overview', 'profile', 'notifications', 'settings'].map((tab) => (
                  <button
                    key={tab}
                    className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                      activeTab === tab
                        ? 'border-secondary text-secondary'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'overview' && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Dashboard Overview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-primary/10 p-6 rounded-lg">
                      <div className="flex items-center">
                        <div className="bg-primary p-3 rounded-full mr-4">
                          <User className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Profile Status</p>
                          <p className="text-xl font-semibold text-primary capitalize">{state.user?.status}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-primary/10 p-6 rounded-lg">
                      <div className="flex items-center">
                        <div className="bg-secondary p-3 rounded-full mr-4">
                          <MessageSquare className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Forum Posts</p>
                          <p className="text-xl font-semibold text-primary">0</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-primary/10 p-6 rounded-lg">
                      <div className="flex items-center">
                        <div className="bg-primary p-3 rounded-full mr-4">
                          <FileText className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Documents</p>
                          <p className="text-xl font-semibold text-primary">0</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h4 className="text-md font-medium text-gray-900 mb-4">Available Forums</h4>
                    {loadingForums ? (
                      <div className="flex justify-center items-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {forumCategories.map((category: any) => (
                          <div key={category._id || category.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-center mb-2">
                              <MessageSquare className="text-secondary mr-2" />
                              <h3 className="font-bold text-primary">{category.name}</h3>
                            </div>
                            <p className="text-gray-600 text-sm mb-2">{category.description}</p>
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-xs text-gray-400">{category.threadCount || 0} topics • {category.postCount || 0} posts</span>
                              <button
                                onClick={() => window.location.href = '/forums'}
                                className="text-sm bg-primary hover:bg-primary-light text-white px-3 py-1 rounded-md"
                              >
                                Join
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-8">
                    <h4 className="text-md font-medium text-gray-900 mb-4">Recent Announcements</h4>
                    {loadingContent ? (
                      <div className="flex justify-center items-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                      </div>
                    ) : (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        {announcements.length > 0 ? (
                          <div className="space-y-4">
                            {announcements.slice(0, 3).map((announcement: any) => (
                              <div key={announcement._id || announcement.id} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                                <h5 className="font-bold text-primary">{announcement.title}</h5>
                                <p className="text-sm text-gray-600 mt-1">{announcement.description}</p>
                                <div className="flex items-center text-xs text-gray-500 mt-2">
                                  <span>{new Date(announcement.date).toLocaleDateString()}</span>
                                  <span className="mx-2">•</span>
                                  <span>{announcement.category}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 italic">No recent announcements.</p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="mt-8">
                    <h4 className="text-md font-medium text-gray-900 mb-4">Upcoming Events</h4>
                    {loadingContent ? (
                      <div className="flex justify-center items-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                      </div>
                    ) : (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        {events.length > 0 ? (
                          <div className="space-y-4">
                            {events.slice(0, 3).map((event: any) => (
                              <div key={event._id || event.id} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                                <h5 className="font-bold text-primary">{event.title}</h5>
                                <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                                <div className="flex items-center text-xs text-gray-500 mt-2">
                                  <span>{new Date(event.date).toLocaleDateString()}</span>
                                  <span className="mx-2">•</span>
                                  <span>{event.venue}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 italic">No upcoming events.</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'profile' && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <p className="mt-1 text-sm text-gray-900">{state.user?.name}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <p className="mt-1 text-sm text-gray-900">{state.user?.email}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Role</label>
                        <p className="mt-1 text-sm text-gray-900 capitalize">{state.user?.role}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Status</label>
                        <p className="mt-1 text-sm text-gray-900 capitalize">{state.user?.status}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Institution</label>
                        <p className="mt-1 text-sm text-gray-900">{state.user?.profile?.institution || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Specialization</label>
                        <p className="mt-1 text-sm text-gray-900">{state.user?.profile?.specialization || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Bio</label>
                        <p className="mt-1 text-sm text-gray-900">{state.user?.profile?.bio || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Notifications</h3>
                  <p className="text-gray-500 italic">No new notifications. Check back later for updates.</p>
                </div>
              )}

              {activeTab === 'settings' && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Account Settings</h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-md font-medium text-gray-900">Profile Picture</h4>
                      <div className="mt-2 flex items-center">
                        <img
                          className="h-12 w-12 rounded-full"
                          src={state.user?.profile?.photo || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
                          alt={state.user?.name}
                        />
                        <button
                          onClick={() => document.getElementById('profile-photo-upload')?.click()}
                          className="ml-4 bg-primary hover:bg-primary-light text-white px-4 py-2 rounded-md text-sm font-medium"
                        >
                          Change
                        </button>
                        <input
                          id="profile-photo-upload"
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const formData = new FormData();
                              formData.append('photo', file);
                              userAPI.updateProfile(formData)
                                .then(() => {
                                  alert('Profile picture updated successfully!');
                                  // In a real app, you would update the user state here
                                })
                                .catch(err => alert(`Error updating profile picture: ${err.message}`));
                            }
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <h4 className="text-md font-medium text-gray-900">Account Information</h4>
                      <div className="mt-2 space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Name</label>
                          <input
                            type="text"
                            defaultValue={state.user?.name}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                            placeholder="Enter your name"
                            id="update-name-input"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Email</label>
                          <input
                            type="email"
                            defaultValue={state.user?.email}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                            placeholder="Enter your email"
                            id="update-email-input"
                          />
                        </div>
                        <button
                          onClick={() => {
                            const newName = (document.getElementById('update-name-input') as HTMLInputElement)?.value;
                            const newEmail = (document.getElementById('update-email-input') as HTMLInputElement)?.value;

                            if (newName && newEmail) {
                              userAPI.updateProfileInfo({ name: newName, email: newEmail })
                                .then(() => {
                                  alert('Account information updated successfully!');
                                  // In a real app, you would update the user state here
                                })
                                .catch(err => alert(`Error updating account: ${err.message}`));
                            } else {
                              alert('Please fill in both name and email fields');
                            }
                          }}
                          className="bg-secondary hover:bg-secondary-light text-white px-4 py-2 rounded-md text-sm font-medium"
                        >
                          Update Account
                        </button>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-md font-medium text-gray-900">Security</h4>
                      <div className="mt-2 space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Current Password</label>
                          <input
                            type="password"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                            placeholder="Enter current password"
                            id="current-password-input"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">New Password</label>
                          <input
                            type="password"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                            placeholder="Enter new password (at least 6 characters)"
                            id="new-password-input"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                          <input
                            type="password"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                            placeholder="Confirm new password"
                            id="confirm-password-input"
                          />
                        </div>
                        <button
                          onClick={() => {
                            const currentPassword = (document.getElementById('current-password-input') as HTMLInputElement)?.value;
                            const newPassword = (document.getElementById('new-password-input') as HTMLInputElement)?.value;
                            const confirmPassword = (document.getElementById('confirm-password-input') as HTMLInputElement)?.value;

                            if (!currentPassword || !newPassword || !confirmPassword) {
                              alert('Please fill in all password fields');
                              return;
                            }

                            if (newPassword !== confirmPassword) {
                              alert('New passwords do not match');
                              return;
                            }

                            if (newPassword.length < 6) {
                              alert('New password must be at least 6 characters long');
                              return;
                            }

                            userAPI.changePassword({
                              currentPassword,
                              newPassword
                            })
                              .then(() => alert('Password changed successfully!'))
                              .catch(err => alert(`Error changing password: ${err.message}`));
                          }}
                          className="bg-primary hover:bg-primary-light text-white px-4 py-2 rounded-md text-sm font-medium"
                        >
                          Change Password
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;