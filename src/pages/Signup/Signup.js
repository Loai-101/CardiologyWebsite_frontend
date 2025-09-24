import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import StyledAlert from '../../components/StyledAlert';
import './Signup.css';

const Signup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    countryCode: '+973',
    dateOfBirth: '',
    gender: '',
    address: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: ''
    },
    agreeToTerms: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertData, setAlertData] = useState({ title: '', message: '', type: 'success' });
  const navigate = useNavigate();
  const { signup, isAuthenticated } = useAuth();

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

    const element = document.getElementById('signup');
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [isAuthenticated, navigate]);

  // GCC country codes for phone validation
  const gccCountries = [
    { code: '+973', country: 'Bahrain', flag: '🇧🇭', localPattern: /^\d{4}\s?\d{4}$/, fullPattern: /^(\+973|973)\s?\d{4}\s?\d{4}$/ },
    { code: '+966', country: 'Saudi Arabia', flag: '🇸🇦', localPattern: /^\d{2}\s?\d{3}\s?\d{4}$/, fullPattern: /^(\+966|966)\s?\d{2}\s?\d{3}\s?\d{4}$/ },
    { code: '+971', country: 'UAE', flag: '🇦🇪', localPattern: /^\d{2}\s?\d{3}\s?\d{4}$/, fullPattern: /^(\+971|971)\s?\d{2}\s?\d{3}\s?\d{4}$/ },
    { code: '+965', country: 'Kuwait', flag: '🇰🇼', localPattern: /^\d{4}\s?\d{4}$/, fullPattern: /^(\+965|965)\s?\d{4}\s?\d{4}$/ },
    { code: '+968', country: 'Oman', flag: '🇴🇲', localPattern: /^\d{4}\s?\d{4}$/, fullPattern: /^(\+968|968)\s?\d{4}\s?\d{4}$/ },
    { code: '+974', country: 'Qatar', flag: '🇶🇦', localPattern: /^\d{4}\s?\d{4}$/, fullPattern: /^(\+974|974)\s?\d{4}\s?\d{4}$/ }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle nested address fields
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  // Phone number validation based on selected country
  const validatePhoneNumber = (phone, countryCode) => {
    const country = gccCountries.find(c => c.code === countryCode);
    if (!country) return false;
    
    if (country.localPattern.test(phone)) {
      return true;
    }
    
    if (country.fullPattern.test(phone)) {
      return true;
    }
    
    return false;
  };

  const validateForm = () => {
    const errors = [];
    
    if (!formData.firstName.trim()) errors.push('First name is required');
    if (!formData.lastName.trim()) errors.push('Last name is required');
    if (!formData.email.trim()) errors.push('Email is required');
    if (!formData.phone.trim()) errors.push('Phone number is required');
    if (!formData.dateOfBirth) errors.push('Date of birth is required');
    if (!formData.gender) errors.push('Gender is required');
    if (!formData.address || !formData.address.street || !formData.address.street.trim()) errors.push('Street address is required');
    if (!formData.address || !formData.address.city || !formData.address.city.trim()) errors.push('City is required');
    if (!formData.address || !formData.address.state || !formData.address.state.trim()) errors.push('State/Province is required');
    if (!formData.address || !formData.address.postalCode || !formData.address.postalCode.trim()) errors.push('Postal code is required');
    if (!formData.address || !formData.address.country || !formData.address.country.trim()) errors.push('Country is required');
    if (!formData.agreeToTerms) errors.push('You must agree to the terms and conditions');
    
    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailPattern.test(formData.email)) {
      errors.push('Please enter a valid email address');
    }
    
    // Validate phone number
    if (formData.phone && !validatePhoneNumber(formData.phone, formData.countryCode)) {
      const selectedCountry = gccCountries.find(c => c.code === formData.countryCode);
      errors.push(`Please enter a valid ${selectedCountry?.country} phone number`);
    }
    
    
    // Validate age (must be at least 18)
    if (formData.dateOfBirth) {
      const today = new Date();
      const birthDate = new Date(formData.dateOfBirth);
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      if (age < 18) {
        errors.push('You must be at least 18 years old to register');
      }
    }
    
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
      // Prepare user data for signup
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        countryCode: formData.countryCode,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        address: formData.address || {
          street: '',
          city: '',
          state: '',
          postalCode: '',
          country: ''
        }
      };
      
      // Use the AuthContext signup function
      const result = await signup(userData);
      
      if (result.success) {
        setSubmitStatus('success');
        
        // Reset form after successful submission
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          countryCode: '+973',
          dateOfBirth: '',
          gender: '',
          address: {
            street: '',
            city: '',
            state: '',
            postalCode: '',
            country: ''
          },
          agreeToTerms: false
        });
        
        // Show styled success alert after form reset
        setTimeout(() => {
          setAlertData({
            title: 'Registration Successful!',
            message: 'Your information has been submitted successfully.\n\nOur admin will review your registration and contact you if needed.',
            type: 'success'
          });
          setShowAlert(true);
        }, 100);
      } else {
        setSubmitStatus('error');
        // Show specific error message
        if (result.error && result.error.includes('already exists')) {
          setSubmitStatus('duplicate_email');
          setAlertData({
            title: 'Email Already Exists',
            message: 'An account with this email address already exists.\n\nPlease use a different email address or contact support if you believe this is an error.',
            type: 'error'
          });
          setShowAlert(true);
        } else {
          setAlertData({
            title: 'Registration Failed',
            message: 'There was an error creating your account. Please try again.\n\nIf the problem persists, please contact our support team.',
            type: 'error'
          });
          setShowAlert(true);
        }
      }

    } catch (error) {
      console.error('❌ Error during signup:', error);
      setSubmitStatus('error');
      setAlertData({
        title: 'Connection Error',
        message: 'Unable to connect to the server. Please check your internet connection and try again.\n\nIf the problem persists, please contact our support team.',
        type: 'error'
      });
      setShowAlert(true);
    } finally {
      setIsSubmitting(false);
    }
  };


  const getMaxDate = () => {
    const today = new Date();
    const maxDate = new Date();
    maxDate.setFullYear(today.getFullYear() - 18);
    return maxDate.toISOString().split('T')[0];
  };

  const getMinDate = () => {
    const minDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - 120);
    return minDate.toISOString().split('T')[0];
  };

  return (
    <div className="signup-page">
      <section id="signup" className={`signup ${isVisible ? 'signup-visible' : ''}`}>
        <div className="signup-container">
          <div className="signup-header">
            <h2 className="signup-title">Create Your Account</h2>
            <p className="signup-subtitle">
              Join Dental Clinic to manage your health information
            </p>
          </div>
          
          <div className="signup-content">
            <div className="signup-form-container">
              <form className="signup-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName" className="form-label">First Name *</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName" className="form-label">Last Name *</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                    placeholder="Enter your email address"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone" className="form-label">Phone Number (GCC Country) *</label>
                  <div className="phone-input-group">
                    <select
                      name="countryCode"
                      value={formData.countryCode}
                      onChange={handleInputChange}
                      className="country-select"
                    >
                      {gccCountries.map(country => (
                        <option key={country.code} value={country.code}>
                          {country.flag} {country.code}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="form-input phone-input"
                      required
                      placeholder={(() => {
                        const selectedCountry = gccCountries.find(c => c.code === formData.countryCode);
                        if (selectedCountry?.code === '+973' || selectedCountry?.code === '+965' || selectedCountry?.code === '+968' || selectedCountry?.code === '+974') {
                          return 'XXXX XXXX';
                        } else if (selectedCountry?.code === '+966' || selectedCountry?.code === '+971') {
                          return 'XX XXX XXXX';
                        }
                        return 'XXXX XXXX';
                      })()}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="dateOfBirth" className="form-label">Date of Birth *</label>
                    <input
                      type="date"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                      max={getMaxDate()}
                      min={getMinDate()}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="gender" className="form-label">Gender *</label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="form-select"
                      required
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                  </div>
                </div>

                {/* Address Information Section */}
                <div className="form-section">
                  <h3 className="form-section-title">Address Information</h3>
                  
                  <div className="form-group">
                    <label htmlFor="address.street" className="form-label">Street Address *</label>
                    <input
                      type="text"
                      id="address.street"
                      name="address.street"
                      value={formData.address?.street || ''}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                      placeholder="Enter your street address"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="address.city" className="form-label">City *</label>
                      <input
                        type="text"
                        id="address.city"
                        name="address.city"
                        value={formData.address?.city || ''}
                        onChange={handleInputChange}
                        className="form-input"
                        required
                        placeholder="Enter your city"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="address.state" className="form-label">State/Province *</label>
                      <input
                        type="text"
                        id="address.state"
                        name="address.state"
                        value={formData.address?.state || ''}
                        onChange={handleInputChange}
                        className="form-input"
                        required
                        placeholder="Enter your state/province"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="address.postalCode" className="form-label">Postal Code *</label>
                      <input
                        type="text"
                        id="address.postalCode"
                        name="address.postalCode"
                        value={formData.address?.postalCode || ''}
                        onChange={handleInputChange}
                        className="form-input"
                        required
                        placeholder="Enter your postal code"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="address.country" className="form-label">Country *</label>
                      <input
                        type="text"
                        id="address.country"
                        name="address.country"
                        value={formData.address?.country || ''}
                        onChange={handleInputChange}
                        className="form-input"
                        required
                        placeholder="Enter your country"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="checkbox-container">
                    <input 
                      type="checkbox" 
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleInputChange}
                      className="checkbox-input" 
                      required
                    />
                    <span className="checkbox-label">
                      I agree to the <Link to="/terms" className="terms-link">Terms of Service</Link> and <Link to="/privacy" className="terms-link">Privacy Policy</Link> *
                    </span>
                  </label>
                </div>

                <div className="form-submit">
                  <button 
                    type="submit" 
                    className={`submit-button ${isSubmitting ? 'submitting' : ''}`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Creating Account...' : 'Create Account'}
                  </button>
                </div>

                {submitStatus === 'success' && (
                  <div className="success-message">
                    <p>✅ Registration completed successfully!</p>
                    <p><small>Form has been reset. You can register another user if needed.</small></p>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="error-message">
                    <p>❌ There was an error creating your account. Please try again.</p>
                  </div>
                )}

                {submitStatus === 'duplicate_email' && (
                  <div className="error-message">
                    <p>❌ An account with this email address already exists.</p>
                    <p><small>Please use a different email address or contact support if you believe this is an error.</small></p>
                  </div>
                )}
              </form>

              {/* Admin Login Section */}
              <div className="admin-login-section">
                <div className="admin-login-divider">
                  <span>Admin Access</span>
                </div>
                <div className="admin-login-info">
                  <p className="admin-login-text">
                    <strong>For Administrators Only</strong><br />
                    Access the admin dashboard to manage user registrations and view patient information.
                  </p>
                  <Link to="/login" className="admin-login-button">
                    🔐 Admin Login
                  </Link>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Styled Alert Modal */}
      <StyledAlert
        isOpen={showAlert}
        onClose={handleCloseAlert}
        title={alertData.title}
        message={alertData.message}
        type={alertData.type}
        showIcon={true}
      />
    </div>
  );
};

export default Signup;