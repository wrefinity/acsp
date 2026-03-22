import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  isVerified?: boolean;
  createdAt?: string;
  profile?: {
    photo?: string;
    idCard?: string;
    phone?: string;
    institution?: string;
    specialization?: string;
    bio?: string;
  };
  preferences?: {
    emailAnnouncements?: boolean;
    emailEvents?: boolean;
    emailForum?: boolean;
    profileVisible?: boolean;
  };
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

interface AuthAction {
  type: string;
  payload?: any;
}

interface AuthContextType {
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  updateUserProfile: (updatedUser: User) => void;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, loading: true };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
      };
    case 'AUTH_ERROR':
      return { ...state, loading: false, isAuthenticated: false };
    case 'LOGOUT':
      return { ...state, user: null, token: null, isAuthenticated: false, loading: false };
    case 'SET_USER':
      return { ...state, user: action.payload, isAuthenticated: true, loading: false };
    case 'VERIFICATION_COMPLETE':
      return { ...state, loading: false };
    default:
      return state;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Verify stored token on initial load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      dispatch({ type: 'AUTH_ERROR' });
      return;
    }
    authService.getProfile()
      .then(userData => {
        const user = { ...userData, id: userData.id || userData._id };
        dispatch({ type: 'AUTH_SUCCESS', payload: { token, user } });
      })
      .catch(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        dispatch({ type: 'AUTH_ERROR' });
      });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const data = await authService.login({ email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);
      const user = { ...data.user, id: data.user.id || data.user._id };
      dispatch({ type: 'AUTH_SUCCESS', payload: { token: data.token, user } });
      return data;
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR' });
      throw error;
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const data = await authService.register({ name, email, password });
      dispatch({ type: 'AUTH_ERROR' });
      return data;
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR' });
      throw error;
    }
  }, []);

  const verifyEmail = useCallback(async (token: string) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const data = await authService.verifyRegistrationOtp('', token); // token param is unused here
      if (data.token) {
        localStorage.setItem('token', data.token);
        if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
        dispatch({ type: 'AUTH_SUCCESS', payload: data });
      } else {
        dispatch({ type: 'VERIFICATION_COMPLETE' });
      }
      return data;
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR' });
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    authService.logout().catch(() => null);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    dispatch({ type: 'LOGOUT' });
  }, []);

  const updateUserProfile = useCallback((updatedUser: User) => {
    dispatch({ type: 'SET_USER', payload: updatedUser });
  }, []);

  return (
    <AuthContext.Provider value={{ state, login, logout, register, verifyEmail, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
