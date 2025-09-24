import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Login.css';

const Login = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    setIsVisible(true);
    
    // Redirect if already authenticated
    if (isAuthenticated) {
      navigate('/');
      return;
    }
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('login');
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const errors = [];
    
    if (!formData.username.trim()) errors.push('Username is required');
    if (!formData.password.trim()) errors.push('Password is required');
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('');

    // Validate form before submission
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setSubmitStatus('error');
      alert('Please fix the following errors:\n' + validationErrors.join('\n'));
      setIsSubmitting(false);
      return;
    }

    try {
      // Use the AuthContext login function
      const result = await login(formData.username, formData.password);
      
      if (result.success) {
        setSubmitStatus('success');
        
        // Redirect to admin dashboard after successful login
        setTimeout(() => {
          navigate('/admin');
        }, 1500);
      } else {
        setSubmitStatus('error');
      }

    } catch (error) {
      console.error('❌ Error during login:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-page">
      <section id="login" className={`login ${isVisible ? 'login-visible' : ''}`}>
        <div className="login-container">
          <div className="login-header">
            <h2 className="login-title">Admin Login</h2>
            <p className="login-subtitle">
              Sign in to access the Cardiology Hospital admin panel
            </p>
          </div>
          
          <div className="login-content">
            <div className="login-form-container">
              <form className="login-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="username" className="form-label">Admin Username *</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                    placeholder="Enter admin username"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password" className="form-label">Password *</label>
                  <div className="password-input-group">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="form-input password-input"
                      required
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      className="password-toggle-button"
                      onClick={togglePasswordVisibility}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                </div>

                <div className="form-options">
                  <label className="checkbox-container">
                    <input type="checkbox" className="checkbox-input" />
                    <span className="checkbox-label">Remember me</span>
                  </label>
                  <Link to="/forgot-password" className="forgot-password-link">
                    Forgot Password?
                  </Link>
                </div>

                <div className="form-submit">
                  <button 
                    type="submit" 
                    className={`submit-button ${isSubmitting ? 'submitting' : ''}`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Signing In...' : 'Sign In'}
                  </button>
                </div>

                {submitStatus === 'success' && (
                  <div className="success-message">
                    <p>✅ Login successful! Redirecting...</p>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="error-message">
                    <p>❌ Invalid email or password. Please try again.</p>
                  </div>
                )}
              </form>

            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
