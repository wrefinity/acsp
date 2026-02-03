import axios from 'axios';

export interface ExecutiveMember {
  _id: string;
  name: string;
  position: string;
  bio: string;
  imageUrl: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Helper function to get token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to create headers with auth token
const getAuthHeaders = (includeContentType = true) => {
  const token = getAuthToken();
  const headers: any = {};

  if (includeContentType) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

export const executiveService = {
  getExecutives: async (): Promise<ExecutiveMember[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/content/executives`, {
        headers: getAuthHeaders(false),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching executives:', error);
      throw error;
    }
  },

  createExecutive: async (data: FormData): Promise<ExecutiveMember> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/content/executives`, data, {
        headers: {
          ...(getAuthToken() && { Authorization: `Bearer ${getAuthToken()}` })
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating executive:', error);
      throw error;
    }
  },

  updateExecutive: async (id: string, data: FormData): Promise<ExecutiveMember> => {
    try {
      const response = await axios.put(`${API_BASE_URL}/content/executives/${id}`, data, {
        headers: {
          ...(getAuthToken() && { Authorization: `Bearer ${getAuthToken()}` })
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating executive:', error);
      throw error;
    }
  },

  deleteExecutive: async (id: string): Promise<void> => {
    try {
      await axios.delete(`${API_BASE_URL}/content/executives/${id}`, {
        headers: getAuthHeaders(false),
      });
    } catch (error) {
      console.error('Error deleting executive:', error);
      throw error;
    }
  },
};