// api.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Helper function to get token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to create headers with auth token
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// Authentication API calls
export const authAPI = {
  // Register a new user
  register: async (userData: { name: string; email: string; password: string }) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    return response.json();
  },

  // Login user
  login: async (credentials: { email: string; password: string }) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    return response.json();
  },

  // Verify email
  verifyEmail: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/verify/${token}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Email verification failed');
    }

    return response.json();
  },

  // Get current user profile
  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get profile');
    }

    return response.json();
  },
};

// User API calls
export const userAPI = {
  // Get current user profile
  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get profile');
    }

    return response.json();
  },

  // Update user profile with files
  updateProfile: async (formData: FormData) => {
    const response = await fetch(`${API_BASE_URL}/users/profile/upload`, {
      method: 'PUT',
      headers: {
        // Don't set Content-Type header when using FormData
        // It will be set automatically with the correct boundary
        ...(getAuthToken() && { Authorization: `Bearer ${getAuthToken()}` })
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update profile');
    }

    return response.json();
  },

  // Update user profile without files
  updateProfileInfo: async (profileData: any) => {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update profile');
    }

    return response.json();
  },

  // Update account information
  updateAccount: async (accountData: { name?: string; email?: string }) => {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(accountData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update account');
    }

    return response.json();
  },

  // Change password
  changePassword: async (passwordData: { currentPassword: string; newPassword: string }) => {
    const response = await fetch(`${API_BASE_URL}/users/change-password`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(passwordData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to change password');
    }

    return response.json();
  },

  // Get all users (admin only)
  getAllUsers: async (page = 1, limit = 10) => {
    const response = await fetch(`${API_BASE_URL}/users?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get users');
    }

    return response.json();
  },

  // Verify/reject user (admin only)
  verifyUser: async (userId: string, action: 'approve' | 'reject', reason?: string) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/verify`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ action, reason }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to verify user');
    }

    return response.json();
  },
};

// Forum API calls
export const forumAPI = {
  // Get all forums
  getForums: async () => {
    const response = await fetch(`${API_BASE_URL}/forums`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get forums');
    }

    return response.json();
  },

  // Create a new forum
  createForum: async (forumData: { name: string; description: string }) => {
    const response = await fetch(`${API_BASE_URL}/forums`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(forumData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create forum');
    }

    return response.json();
  },

  // Delete a forum
  deleteForum: async (forumId: string) => {
    const response = await fetch(`${API_BASE_URL}/forums/${forumId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete forum');
    }

    return response.json();
  },

  // Get threads in a forum
  getThreads: async (forumId: string) => {
    const response = await fetch(`${API_BASE_URL}/forums/${forumId}/threads`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get threads');
    }

    return response.json();
  },

  // Get a specific thread
  getThread: async (threadId: string) => {
    const response = await fetch(`${API_BASE_URL}/forums/threads/${threadId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get thread');
    }

    return response.json();
  },

  // Create a new thread
  createThread: async (threadData: { title: string; content: string; forumId: string }) => {
    const response = await fetch(`${API_BASE_URL}/forums/${threadData.forumId}/threads`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({title: threadData.title, content: threadData.content}),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create thread');
    }

    return response.json();
  },

  // Create a reply to a thread
  createReply: async (threadId: string, content: string) => {
    const response = await fetch(`${API_BASE_URL}/forums/threads/${threadId}/reply`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create reply');
    }

    return response.json();
  },
};

// Content API calls
export const contentAPI = {
  // Get carousel slides
  getCarouselSlides: async () => {
    const response = await fetch(`${API_BASE_URL}/content/carousel`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get carousel slides');
    }

    return response.json();
  },

  // Create carousel slide
  createCarouselSlide: async (slideData: FormData) => {
    const response = await fetch(`${API_BASE_URL}/content/carousel`, {
      method: 'POST',
      headers: {
        ...(getAuthToken() && { Authorization: `Bearer ${getAuthToken()}` })
      },
      body: slideData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create carousel slide');
    }

    return response.json();
  },

  // Delete carousel slide
  deleteCarouselSlide: async (slideId: string) => {
    const response = await fetch(`${API_BASE_URL}/content/carousel/${slideId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete carousel slide');
    }

    return response.json();
  },

  // Get announcements
  getAnnouncements: async () => {
    const response = await fetch(`${API_BASE_URL}/content/announcements`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get announcements');
    }

    return response.json();
  },

  // Create announcement
  createAnnouncement: async (announcementData: any) => {
    const response = await fetch(`${API_BASE_URL}/content/announcements`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(announcementData),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create announcement');
    }

    return response.json();
  },

  // Delete announcement
  deleteAnnouncement: async (announcementId: string) => {
    const response = await fetch(`${API_BASE_URL}/content/announcements/${announcementId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete announcement');
    }

    return response.json();
  },

  // Get events
  getEvents: async () => {
    const response = await fetch(`${API_BASE_URL}/content/events`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get events');
    }

    return response.json();
  },

  // Create event
    createEvent: async (eventData: FormData) => {
        const response = await fetch(`${API_BASE_URL}/content/events`, {
            method: 'POST',
            headers: {
                ...(getAuthToken() && { Authorization: `Bearer ${getAuthToken()}` })
            },
            body: eventData,
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create event');
        }

        return response.json();
    },

  // Delete event
    deleteEvent: async (eventId: string) => {
        const response = await fetch(`${API_BASE_URL}/content/events/${eventId}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to delete event');
        }

        return response.json();
    },


  // Get blogs
  getBlogs: async () => {
    const response = await fetch(`${API_BASE_URL}/content/blogs`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get blogs');
    }

    return response.json();
  },

  // Create blog
    createBlog: async (blogData: FormData) => {
        const response = await fetch(`${API_BASE_URL}/content/blogs`, {
            method: 'POST',
            headers: {
                ...(getAuthToken() && { Authorization: `Bearer ${getAuthToken()}` })
            },
            body: blogData,
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create blog');
        }

        return response.json();
    },

  // Delete blog
    deleteBlog: async (blogId: string) => {
        const response = await fetch(`${API_BASE_URL}/content/blogs/${blogId}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to delete blog');
        }

        return response.json();
    },

  // Get gallery images
  getGallery: async () => {
    const response = await fetch(`${API_BASE_URL}/content/gallery`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get gallery');
    }

    return response.json();
  },

  // Create gallery image
    createGalleryImage: async (imageData: FormData) => {
        const response = await fetch(`${API_BASE_URL}/content/gallery`, {
            method: 'POST',
            headers: {
                ...(getAuthToken() && { Authorization: `Bearer ${getAuthToken()}` })
            },
            body: imageData,
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create gallery image');
        }

        return response.json();
    },

    // Delete gallery image
    deleteGalleryImage: async (imageId: string) => {
        const response = await fetch(`${API_BASE_URL}/content/gallery/${imageId}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to delete gallery image');
        }

        return response.json();
    },
};