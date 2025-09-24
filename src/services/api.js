// API Configuration - Updated to use correct backend URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://cardiology-website-backend.vercel.app/api';

// API service class
class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    console.log('🔧 API Service initialized with URL:', this.baseURL);
  }

  // Get auth token from localStorage
  getAuthToken() {
    return localStorage.getItem('authToken');
  }

  // Set auth token in localStorage
  setAuthToken(token) {
    localStorage.setItem('authToken', token);
  }

  // Remove auth token from localStorage
  removeAuthToken() {
    localStorage.removeItem('authToken');
  }

  // Make HTTP request
  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getAuthToken();

    console.log('🌐 Making API request:', {
      url,
      method: options.method || 'GET',
      endpoint,
      hasToken: !!token
    });

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      console.log('📡 Response received:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('='.repeat(60));
      console.error('❌ API REQUEST FAILED');
      console.error('='.repeat(60));
      console.error('Request URL:', url);
      console.error('Request Method:', options.method || 'GET');
      console.error('Error Type:', error.name);
      console.error('Error Message:', error.message);
      
      if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
        console.error('🔍 DIAGNOSIS: Connection Failed');
        console.error('Possible Causes:');
        console.error('1. Backend server is not running');
        console.error('2. Wrong server URL/port');
        console.error('3. CORS policy blocking the request');
        console.error('4. Network connectivity issues');
        console.error('Solutions:');
        console.error('1. Start the backend server: cd CardiologyWebsite_backend && node server.js');
        console.error('2. Check if server is running on http://localhost:5000');
        console.error('3. Verify CORS configuration in backend');
      }
      
      console.error('='.repeat(60));
      throw error;
    }
  }

  // Admin login
  async adminLogin(username, password) {
    try {
      const response = await this.makeRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });

      if (response.success && response.token) {
        this.setAuthToken(response.token);
      }

      return response;
    } catch (error) {
      throw new Error(error.message || 'Login failed');
    }
  }

  // User signup
  async userSignup(userData) {
    try {
      const response = await this.makeRequest('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(userData),
      });

      return response;
    } catch (error) {
      throw new Error(error.message || 'Signup failed');
    }
  }

  // Verify token
  async verifyToken() {
    try {
      const token = this.getAuthToken();
      if (!token) {
        throw new Error('No token found');
      }
      const response = await this.makeRequest('/auth/verify');
      return response;
    } catch (error) {
      this.removeAuthToken();
      throw new Error(error.message || 'Token verification failed');
    }
  }

  // Get all users (Admin only)
  async getUsers(page = 1, limit = 50) {
    try {
      const response = await this.makeRequest(`/users?page=${page}&limit=${limit}`);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch users');
    }
  }

  // Get user statistics (Admin only)
  async getUserStats() {
    try {
      const response = await this.makeRequest('/users/stats');
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch user statistics');
    }
  }

  // Update user status (Admin only)
  async updateUserStatus(userId, status) {
    try {
      const response = await this.makeRequest(`/users/${userId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });

      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to update user status');
    }
  }

  // Delete user (Admin only)
  async deleteUser(userId) {
    try {
      const response = await this.makeRequest(`/users/${userId}`, {
        method: 'DELETE',
      });

      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to delete user');
    }
  }

  // Get all appointments (Admin only)
  async getAppointments() {
    try {
      const response = await this.makeRequest('/appointments');
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch appointments');
    }
  }

  // Update appointment status (Admin only)
  async updateAppointmentStatus(appointmentId, status) {
    try {
      const response = await this.makeRequest(`/appointments/${appointmentId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });

      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to update appointment status');
    }
  }

  // Book appointment (Public)
  async bookAppointment(appointmentData) {
    try {
      const response = await this.makeRequest('/appointments', {
        method: 'POST',
        body: JSON.stringify(appointmentData),
      });

      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to book appointment');
    }
  }

  // Health check
  async healthCheck() {
    try {
      const response = await this.makeRequest('/health');
      return response;
    } catch (error) {
      throw new Error(error.message || 'Health check failed');
    }
  }

  // Offers API
  async getOffers() {
    try {
      const response = await this.makeRequest('/offers');
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch offers');
    }
  }

  async getAllOffers() {
    try {
      const response = await this.makeRequest('/offers/all');
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch all offers');
    }
  }

  async createOffer(offerData) {
    try {
      const response = await this.makeRequest('/offers', {
        method: 'POST',
        body: JSON.stringify(offerData),
      });
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to create offer');
    }
  }

  async updateOffer(offerId, offerData) {
    try {
      const response = await this.makeRequest(`/offers/${offerId}`, {
        method: 'PUT',
        body: JSON.stringify(offerData),
      });
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to update offer');
    }
  }

  async deleteOffer(offerId) {
    try {
      const response = await this.makeRequest(`/offers/${offerId}`, {
        method: 'DELETE',
      });
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to delete offer');
    }
  }

  // Slider Images API
  async getSliderImages() {
    try {
      const response = await this.makeRequest('/slider');
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch slider images');
    }
  }

  async getAllSliderImages() {
    try {
      const response = await this.makeRequest('/slider/all');
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch all slider images');
    }
  }

  async createSliderImage(sliderData) {
    try {
      const response = await this.makeRequest('/slider', {
        method: 'POST',
        body: JSON.stringify(sliderData),
      });
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to create slider image');
    }
  }

  async updateSliderImage(sliderId, sliderData) {
    try {
      const response = await this.makeRequest(`/slider/${sliderId}`, {
        method: 'PUT',
        body: JSON.stringify(sliderData),
      });
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to update slider image');
    }
  }

  async deleteSliderImage(sliderId) {
    try {
      const response = await this.makeRequest(`/slider/${sliderId}`, {
        method: 'DELETE',
      });
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to delete slider image');
    }
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;
