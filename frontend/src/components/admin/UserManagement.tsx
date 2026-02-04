import React, { useState, useEffect } from 'react';
import { userAPI } from '../../services/api';
import { User, Eye, Ban, RotateCcw, CheckCircle, XCircle } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  isVerified: boolean;
  profile: {
    photo?: string;
    idCard?: string;
    phone?: string;
    institution?: string;
    specialization?: string;
    bio?: string;
  };
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Note: The actual API returns { users: [...], pagination: {...} }
      // This is a simplified version - you may need to adjust based on actual API response
      const response: any = await userAPI.getAllUsers(currentPage, 10);
      setUsers(response.users || response.data || []);
      setTotalPages(Math.ceil((response.pagination?.total || 10) / 10));
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (user: User) => {
    try {
      // Get full user details including sensitive info
      const userDetails = await userAPI.getUserDetails(user.id);
      setSelectedUser(userDetails);
      setViewMode('detail');
    } catch (error) {
      console.error('Error fetching user details:', error);
      alert('Failed to fetch user details');
    }
  };

  const handleBanUser = async (userId: string, action: 'ban' | 'unban') => {
    const reason = action === 'ban' ? prompt('Enter reason for banning:') : undefined;
    
    try {
      await userAPI.banUser(userId, action, reason);
      alert(`User ${action}ned successfully`);
      fetchUsers(); // Refresh the user list
      if (selectedUser?.id === userId) {
        // Refresh the selected user details if it's the one being viewed
        const userDetails = await userAPI.getUserDetails(userId);
        setSelectedUser(userDetails);
      }
    } catch (error) {
      console.error(`Error ${action}ning user:`, error);
      alert(`Failed to ${action} user`);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (viewMode === 'detail' && selectedUser) {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-primary">User Details</h2>
          <button
            onClick={() => setViewMode('list')}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
          >
            Back to List
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <p className="mt-1 text-sm text-gray-900">{selectedUser.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="mt-1 text-sm text-gray-900">{selectedUser.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <p className="mt-1 text-sm text-gray-900 capitalize">{selectedUser.role}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <p className="mt-1 text-sm text-gray-900 capitalize">{selectedUser.status}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Verified</label>
              <p className="mt-1 text-sm text-gray-900">{selectedUser.isVerified ? 'Yes' : 'No'}</p>
            </div>
            {selectedUser.rejectionReason && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Rejection/Ban Reason</label>
                <p className="mt-1 text-sm text-gray-900">{selectedUser.rejectionReason}</p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {selectedUser.profile?.photo && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Passport Photo</label>
                <div className="mt-1">
                  <img 
                    src={selectedUser.profile.photo} 
                    alt="Passport" 
                    className="w-32 h-32 object-cover border rounded-md"
                  />
                </div>
              </div>
            )}
            {selectedUser.profile?.idCard && (
              <div>
                <label className="block text-sm font-medium text-gray-700">ID Card</label>
                <div className="mt-1">
                  <img 
                    src={selectedUser.profile.idCard} 
                    alt="ID Card" 
                    className="w-32 h-32 object-cover border rounded-md"
                  />
                </div>
              </div>
            )}
            {selectedUser.profile?.phone && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <p className="mt-1 text-sm text-gray-900">{selectedUser.profile.phone}</p>
              </div>
            )}
            {selectedUser.profile?.institution && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Institution</label>
                <p className="mt-1 text-sm text-gray-900">{selectedUser.profile.institution}</p>
              </div>
            )}
            {selectedUser.profile?.specialization && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Specialization</label>
                <p className="mt-1 text-sm text-gray-900">{selectedUser.profile.specialization}</p>
              </div>
            )}
            {selectedUser.profile?.bio && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Bio</label>
                <p className="mt-1 text-sm text-gray-900">{selectedUser.profile.bio}</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex space-x-4">
          {selectedUser.status === 'banned' ? (
            <button
              onClick={() => handleBanUser(selectedUser.id, 'unban')}
              className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
            >
              <RotateCcw size={18} className="mr-2" />
              Unban User
            </button>
          ) : (
            <button
              onClick={() => handleBanUser(selectedUser.id, 'ban')}
              className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
            >
              <Ban size={18} className="mr-2" />
              Ban User
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold text-primary mb-6">User Management</h2>
      
      <div className="mb-6 flex justify-between items-center">
        <div className="relative">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Verified
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 capitalize">{user.role}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${user.status === 'verified' ? 'bg-green-100 text-green-800' :
                          user.status === 'banned' ? 'bg-red-100 text-red-800' :
                          user.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'}`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.isVerified ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewDetails(user)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        <Eye size={18} />
                      </button>
                      {user.status === 'banned' ? (
                        <button
                          onClick={() => handleBanUser(user.id, 'unban')}
                          className="text-green-600 hover:text-green-900"
                        >
                          <RotateCcw size={18} />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleBanUser(user.id, 'ban')}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Ban size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{(currentPage - 1) * 10 + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(currentPage * 10, users.length + (currentPage - 1) * 10)}
              </span>{' '}
              of <span className="font-medium">{users.length}</span> results
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-md ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-primary text-white hover:bg-primary-light'
                }`}
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-md ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-primary text-white hover:bg-primary-light'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserManagement;