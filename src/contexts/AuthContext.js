import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';

// Create the AuthContext
const AuthContext = createContext();

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing authentication on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const storedAuth = localStorage.getItem('isAuthenticated');
        const token = apiService.getAuthToken();
        
        if (storedUser && storedAuth === 'true' && token) {
          // Verify token with backend
          try {
            await apiService.verifyToken();
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
          } catch (error) {
            // Token is invalid, clear everything
            console.log('Token verification failed, clearing auth data:', error.message);
            localStorage.removeItem('user');
            localStorage.removeItem('isAuthenticated');
            apiService.removeAuthToken();
            setUser(null);
            setIsAuthenticated(false);
          }
        } else {
          // No token or user data, ensure clean state
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        // Clear invalid data
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
        apiService.removeAuthToken();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login function - Admin only
  const login = async (username, password) => {
    try {
      setIsLoading(true);
      
      // Call backend API
      const response = await apiService.adminLogin(username, password);
      
      if (response.success) {
        const adminData = {
          id: response.user.id,
          username: response.user.username,
          role: response.user.role,
          name: response.user.name,
          loginTime: new Date().toISOString()
        };
        
        // Store in localStorage
        localStorage.setItem('user', JSON.stringify(adminData));
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userRole', 'admin');
        
        setUser(adminData);
        setIsAuthenticated(true);
        
        return { success: true, user: adminData };
      } else {
        return { success: false, error: response.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message || 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  };

  // Signup function - Store user data for admin viewing
  const signup = async (userData) => {
    try {
      setIsLoading(true);
      
      // Call backend API
      const response = await apiService.userSignup(userData);
      
      if (response.success) {
        return { success: true, user: response.user };
      } else {
        return { success: false, error: response.message || 'Signup failed' };
      }
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: error.message || 'Signup failed' };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    try {
      // Clear localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userRole');
      apiService.removeAuthToken();
      
      setUser(null);
      setIsAuthenticated(false);
      
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    }
  };

  // Update user function
  const updateUser = (updatedUserData) => {
    try {
      const newUserData = { ...user, ...updatedUserData };
      localStorage.setItem('user', JSON.stringify(newUserData));
      setUser(newUserData);
      return { success: true, user: newUserData };
    } catch (error) {
      console.error('Update user error:', error);
      return { success: false, error: error.message };
    }
  };

  // Check if user is authenticated
  const checkAuth = () => {
    const storedAuth = localStorage.getItem('isAuthenticated');
    return storedAuth === 'true';
  };

  // Get user info
  const getUserInfo = () => {
    return user;
  };

  // Check if user has specific role or permission
  const hasRole = (role) => {
    return user && user.role === role;
  };

  // Check if user has specific permission
  const hasPermission = (permission) => {
    return user && user.permissions && user.permissions.includes(permission);
  };

  // Get registered users (admin only)
  const getRegisteredUsers = async () => {
    if (!isAuthenticated || user?.role !== 'admin') {
      return [];
    }
    
    try {
      const response = await apiService.getUsers();
      return response.success ? response.data.users : [];
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  };

  // Check if user is admin
  const isAdmin = () => {
    return isAuthenticated && user?.role === 'admin';
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    signup,
    logout,
    updateUser,
    checkAuth,
    getUserInfo,
    hasRole,
    hasPermission,
    getRegisteredUsers,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
