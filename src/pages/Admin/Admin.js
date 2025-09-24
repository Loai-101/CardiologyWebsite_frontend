import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/api';
import StyledAlert from '../../components/StyledAlert';
import './Admin.css';

const Admin = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showEmailWindow, setShowEmailWindow] = useState(false);
  const [showPhoneWindow, setShowPhoneWindow] = useState(false);
  const [showGenderChart, setShowGenderChart] = useState(false);
  const [showCountryChart, setShowCountryChart] = useState(false);
  const [showAppointments, setShowAppointments] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showAppointmentDetails, setShowAppointmentDetails] = useState(false);
  const [tempStatus, setTempStatus] = useState(null);
  const [showStatusConfirm, setShowStatusConfirm] = useState(false);
  const [dateFilter, setDateFilter] = useState({
    period: '',
    fromDate: '',
    toDate: ''
  });
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [deleteAlertData, setDeleteAlertData] = useState({ userId: '', userName: '' });
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, getRegisteredUsers, logout } = useAuth();

  useEffect(() => {
    setIsVisible(true);
    
    // Check if user is admin
    if (!isAuthenticated || !isAdmin()) {
      navigate('/login');
      return;
    }
    
    // Load registered users
    loadRegisteredUsers();
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('admin');
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [isAuthenticated, isAdmin, navigate]);

  const loadRegisteredUsers = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getUsers();
      if (response.success) {
        setRegisteredUsers(response.data.users);
        setFilteredUsers(response.data.users);
      } else {
        console.error('Failed to load users:', response.message);
        setRegisteredUsers([]);
        setFilteredUsers([]);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setIsLoading(false);
    }
  };


  const handleShowEmails = () => {
    setShowEmailWindow(true);
  };

  const handleCloseEmailWindow = () => {
    setShowEmailWindow(false);
  };

  const handleShowPhones = () => {
    setShowPhoneWindow(true);
  };

  const handleClosePhoneWindow = () => {
    setShowPhoneWindow(false);
  };

  const handleShowGenderChart = () => {
    setShowGenderChart(true);
  };

  const handleCloseGenderChart = () => {
    setShowGenderChart(false);
  };

  const handleShowCountryChart = () => {
    setShowCountryChart(true);
  };

  const handleCloseCountryChart = () => {
    setShowCountryChart(false);
  };

  const handleShowAppointments = () => {
    setShowAppointments(true);
    loadAppointments();
  };

  const handleCloseAppointments = () => {
    setShowAppointments(false);
    setSelectedAppointment(null);
  };

  const loadAppointments = async () => {
    try {
      const response = await apiService.getAppointments();
      if (response.success) {
        setAppointments(response.appointments);
      } else {
        console.error('Failed to load appointments:', response.message);
        setAppointments([]);
      }
    } catch (error) {
      console.error('Error loading appointments:', error);
      setAppointments([]);
    }
  };

  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      const response = await apiService.updateAppointmentStatus(appointmentId, newStatus);
      if (response.success) {
        // Update local state
        setAppointments(prev => 
          prev.map(appointment => 
            appointment._id === appointmentId 
              ? { ...appointment, status: newStatus }
              : appointment
          )
        );
        
        if (selectedAppointment && selectedAppointment._id === appointmentId) {
          setSelectedAppointment(prev => ({ ...prev, status: newStatus }));
        }
      } else {
        console.error('Failed to update appointment status:', response.message);
      }
    } catch (error) {
      console.error('Error updating appointment status:', error);
    }
  };

  const handleStatusSelect = (newStatus) => {
    setTempStatus(newStatus);
  };

  const handleSaveStatus = () => {
    if (tempStatus && selectedAppointment) {
      setShowStatusConfirm(true);
    }
  };

  const confirmStatusChange = async () => {
    if (tempStatus && selectedAppointment) {
      await handleStatusChange(selectedAppointment._id, tempStatus);
      setTempStatus(null);
      setShowStatusConfirm(false);
    }
  };

  const cancelStatusChange = () => {
    setTempStatus(null);
    setShowStatusConfirm(false);
  };

  const getAppointmentStats = () => {
    const stats = {
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0,
      total: appointments.length
    };

    appointments.forEach(appointment => {
      if (stats.hasOwnProperty(appointment.status)) {
        stats[appointment.status]++;
      }
    });

    return stats;
  };

  const getGenderStats = () => {
    const maleCount = registeredUsers.filter(user => user.gender === 'male').length;
    const femaleCount = registeredUsers.filter(user => user.gender === 'female').length;
    const total = registeredUsers.length;
    
    return {
      male: maleCount,
      female: femaleCount,
      total: total,
      malePercentage: total > 0 ? Math.round((maleCount / total) * 100) : 0,
      femalePercentage: total > 0 ? Math.round((femaleCount / total) * 100) : 0
    };
  };

  const getCountryStats = () => {
    const countryCounts = {};
    registeredUsers.forEach(user => {
      const country = user.countryCode || 'Unknown';
      countryCounts[country] = (countryCounts[country] || 0) + 1;
    });
    
    const total = registeredUsers.length;
    const countries = Object.entries(countryCounts)
      .map(([country, count]) => ({
        country,
        flag: getCountryFlag(country),
        count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0
      }))
      .sort((a, b) => b.count - a.count);
    
    return {
      countries,
      total,
      uniqueCountries: countries.length
    };
  };

  const getCountryFlag = (countryCode) => {
    const flagMap = {
      '+973': '🇧🇭', // Bahrain
      '+1': '🇺🇸',   // United States
      '+44': '🇬🇧',  // United Kingdom
      '+33': '🇫🇷',  // France
      '+49': '🇩🇪',  // Germany
      '+39': '🇮🇹',  // Italy
      '+34': '🇪🇸',  // Spain
      '+31': '🇳🇱',  // Netherlands
      '+46': '🇸🇪',  // Sweden
      '+47': '🇳🇴',  // Norway
      '+45': '🇩🇰',  // Denmark
      '+41': '🇨🇭',  // Switzerland
      '+43': '🇦🇹',  // Austria
      '+32': '🇧🇪',  // Belgium
      '+351': '🇵🇹', // Portugal
      '+30': '🇬🇷',  // Greece
      '+48': '🇵🇱',  // Poland
      '+420': '🇨🇿', // Czech Republic
      '+36': '🇭🇺',  // Hungary
      '+40': '🇷🇴',  // Romania
      '+359': '🇧🇬', // Bulgaria
      '+385': '🇭🇷', // Croatia
      '+386': '🇸🇮', // Slovenia
      '+421': '🇸🇰', // Slovakia
      '+370': '🇱🇹', // Lithuania
      '+371': '🇱🇻', // Latvia
      '+372': '🇪🇪', // Estonia
      '+358': '🇫🇮', // Finland
      '+353': '🇮🇪', // Ireland
      '+352': '🇱🇺', // Luxembourg
      '+356': '🇲🇹', // Malta
      '+357': '🇨🇾', // Cyprus
      '+20': '🇪🇬',  // Egypt
      '+966': '🇸🇦', // Saudi Arabia
      '+971': '🇦🇪', // UAE
      '+965': '🇰🇼', // Kuwait
      '+974': '🇶🇦', // Qatar
      '+968': '🇴🇲', // Oman
      '+973': '🇧🇭', // Bahrain
      '+962': '🇯🇴', // Jordan
      '+961': '🇱🇧', // Lebanon
      '+963': '🇸🇾', // Syria
      '+964': '🇮🇶', // Iraq
      '+98': '🇮🇷',  // Iran
      '+90': '🇹🇷',  // Turkey
      '+7': '🇷🇺',   // Russia
      '+86': '🇨🇳',  // China
      '+81': '🇯🇵',  // Japan
      '+82': '🇰🇷',  // South Korea
      '+65': '🇸🇬',  // Singapore
      '+60': '🇲🇾',  // Malaysia
      '+66': '🇹🇭',  // Thailand
      '+84': '🇻🇳',  // Vietnam
      '+63': '🇵🇭',  // Philippines
      '+62': '🇮🇩',  // Indonesia
      '+91': '🇮🇳',  // India
      '+92': '🇵🇰',  // Pakistan
      '+880': '🇧🇩', // Bangladesh
      '+94': '🇱🇰',  // Sri Lanka
      '+977': '🇳🇵', // Nepal
      '+975': '🇧🇹', // Bhutan
      '+960': '🇲🇻', // Maldives
      '+93': '🇦🇫',  // Afghanistan
      '+998': '🇺🇿', // Uzbekistan
      '+996': '🇰🇬', // Kyrgyzstan
      '+992': '🇹🇯', // Tajikistan
      '+993': '🇹🇲', // Turkmenistan
      '+7': '🇰🇿',   // Kazakhstan
      '+976': '🇲🇳', // Mongolia
      '+850': '🇰🇵', // North Korea
      '+886': '🇹🇼', // Taiwan
      '+852': '🇭🇰', // Hong Kong
      '+853': '🇲🇴', // Macau
      '+55': '🇧🇷',  // Brazil
      '+54': '🇦🇷',  // Argentina
      '+56': '🇨🇱',  // Chile
      '+57': '🇨🇴',  // Colombia
      '+51': '🇵🇪',  // Peru
      '+58': '🇻🇪',  // Venezuela
      '+52': '🇲🇽',  // Mexico
      '+1': '🇨🇦',   // Canada
      '+61': '🇦🇺',  // Australia
      '+64': '🇳🇿',  // New Zealand
      '+27': '🇿🇦',  // South Africa
      '+234': '🇳🇬', // Nigeria
      '+254': '🇰🇪', // Kenya
      '+20': '🇪🇬',  // Egypt
      '+212': '🇲🇦', // Morocco
      '+213': '🇩🇿', // Algeria
      '+216': '🇹🇳', // Tunisia
      '+218': '🇱🇾', // Libya
      '+249': '🇸🇩', // Sudan
      '+251': '🇪🇹', // Ethiopia
      '+255': '🇹🇿', // Tanzania
      '+256': '🇺🇬', // Uganda
      '+250': '🇷🇼', // Rwanda
      '+257': '🇧🇮', // Burundi
      '+258': '🇲🇿', // Mozambique
      '+260': '🇿🇲', // Zambia
      '+263': '🇿🇼', // Zimbabwe
      '+264': '🇳🇦', // Namibia
      '+267': '🇧🇼', // Botswana
      '+268': '🇸🇿', // Eswatini
      '+266': '🇱🇸', // Lesotho
      '+265': '🇲🇼', // Malawi
      '+261': '🇲🇬', // Madagascar
      '+230': '🇲🇺', // Mauritius
      '+248': '🇸🇨', // Seychelles
      '+269': '🇰🇲', // Comoros
      '+262': '🇷🇪', // Réunion
      '+590': '🇬🇵', // Guadeloupe
      '+596': '🇲🇶', // Martinique
      '+594': '🇬🇫', // French Guiana
      '+508': '🇵🇲', // Saint Pierre and Miquelon
      '+262': '🇾🇹', // Mayotte
      'Unknown': '❓'
    };
    
    return flagMap[countryCode] || '🌍';
  };

  const getDateRange = (period) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (period) {
      case 'lastDay':
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        return {
          fromDate: yesterday.toISOString().split('T')[0],
          toDate: today.toISOString().split('T')[0]
        };
      
      case 'last3Days':
        const threeDaysAgo = new Date(today);
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
        return {
          fromDate: threeDaysAgo.toISOString().split('T')[0],
          toDate: today.toISOString().split('T')[0]
        };
      
      case 'lastWeek':
        const oneWeekAgo = new Date(today);
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return {
          fromDate: oneWeekAgo.toISOString().split('T')[0],
          toDate: today.toISOString().split('T')[0]
        };
      
      case 'lastMonth':
        const oneMonthAgo = new Date(today);
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        return {
          fromDate: oneMonthAgo.toISOString().split('T')[0],
          toDate: today.toISOString().split('T')[0]
        };
      
      case 'last3Months':
        const threeMonthsAgo = new Date(today);
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        return {
          fromDate: threeMonthsAgo.toISOString().split('T')[0],
          toDate: today.toISOString().split('T')[0]
        };
      
      case 'last6Months':
        const sixMonthsAgo = new Date(today);
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        return {
          fromDate: sixMonthsAgo.toISOString().split('T')[0],
          toDate: today.toISOString().split('T')[0]
        };
      
      case 'lastYear':
        const oneYearAgo = new Date(today);
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        return {
          fromDate: oneYearAgo.toISOString().split('T')[0],
          toDate: today.toISOString().split('T')[0]
        };
      
      default:
        return { fromDate: '', toDate: '' };
    }
  };

  const handleDateFilterChange = (period) => {
    const dateRange = getDateRange(period);
    const newFilter = {
      period,
      fromDate: dateRange.fromDate,
      toDate: dateRange.toDate
    };
    setDateFilter(newFilter);
    
    // Filter users based on date range
    let filtered = registeredUsers;
    
    if (newFilter.fromDate) {
      const fromDate = new Date(newFilter.fromDate);
      filtered = filtered.filter(user => new Date(user.signupTime) >= fromDate);
    }
    
    if (newFilter.toDate) {
      const toDate = new Date(newFilter.toDate);
      toDate.setHours(23, 59, 59, 999); // Include the entire day
      filtered = filtered.filter(user => new Date(user.signupTime) <= toDate);
    }
    
    setFilteredUsers(filtered);
  };

  const clearDateFilter = () => {
    setDateFilter({ period: '', fromDate: '', toDate: '' });
    setFilteredUsers(registeredUsers);
  };

  const getPeriodLabel = (period) => {
    const labels = {
      'lastDay': 'Last Day',
      'last3Days': 'Last 3 Days',
      'lastWeek': 'Last Week',
      'lastMonth': 'Last Month',
      'last3Months': 'Last 3 Months',
      'last6Months': 'Last 6 Months',
      'lastYear': 'Last Year'
    };
    return labels[period] || period;
  };

  const handleDeleteUser = (userId, userName) => {
    setDeleteAlertData({ userId, userName });
    setShowDeleteAlert(true);
  };

  const confirmDeleteUser = async () => {
    const { userId, userName } = deleteAlertData;
    setShowDeleteAlert(false);
    
    try {
      const response = await apiService.deleteUser(userId);
      if (response.success) {
        // Reload users after successful deletion
        await loadRegisteredUsers();
        // Show success message
        setDeleteAlertData({
          title: 'User Deleted Successfully',
          message: `User "${userName}" has been deleted successfully.`,
          type: 'success'
        });
        setShowDeleteAlert(true);
      } else {
        // Show error message
        setDeleteAlertData({
          title: 'Delete Failed',
          message: 'Failed to delete user. Please try again.',
          type: 'error'
        });
        setShowDeleteAlert(true);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      // Show error message
      setDeleteAlertData({
        title: 'Delete Error',
        message: 'Error deleting user. Please try again.',
        type: 'error'
      });
      setShowDeleteAlert(true);
    }
  };

  const handleCloseDeleteAlert = () => {
    setShowDeleteAlert(false);
    setDeleteAlertData({ userId: '', userName: '' });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  if (isLoading) {
    return (
      <div className="admin-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <section id="admin" className={`admin ${isVisible ? 'admin-visible' : ''}`}>
        <div className="admin-container">
          <div className="admin-header">
            <div className="admin-header-content">
              <h2 className="admin-title">Admin Dashboard</h2>
              <p className="admin-subtitle">
                Welcome, {user?.name || 'Admin'} - Manage registered users
              </p>
            </div>
            <div className="admin-actions">
              <button onClick={loadRegisteredUsers} className="refresh-button">
                Refresh
              </button>
            </div>
          </div>
          
          <div className="admin-content">
            <div className="stats-cards">
              <div className="stat-card">
                <h3>Total Users</h3>
                <p className="stat-number">{registeredUsers.length}</p>
              </div>
              <div className="stat-card">
                <h3>New This Week</h3>
                <p className="stat-number">
                  {registeredUsers.filter(user => {
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return new Date(user.signupTime) > weekAgo;
                  }).length}
                </p>
              </div>
              <div className="stat-card">
                <h3>Male Users</h3>
                <p className="stat-number">
                  {registeredUsers.filter(user => user.gender === 'male').length}
                </p>
              </div>
              <div className="stat-card">
                <h3>Female Users</h3>
                <p className="stat-number">
                  {registeredUsers.filter(user => user.gender === 'female').length}
                </p>
              </div>
            </div>

            <div className="users-section">
              <h3 className="section-title">Registered Users</h3>
              
              {/* Date Filter */}
              <div className="date-filter-container">
                <div className="date-filter-row">
                  <div className="date-filter-group">
                    <label htmlFor="datePeriod" className="date-filter-label">Filter by Period:</label>
                    <select
                      id="datePeriod"
                      value={dateFilter.period}
                      onChange={(e) => handleDateFilterChange(e.target.value)}
                      className="date-filter-select"
                    >
                      <option value="">All Time</option>
                      <option value="lastDay">Last Day</option>
                      <option value="last3Days">Last 3 Days</option>
                      <option value="lastWeek">Last Week</option>
                      <option value="lastMonth">Last Month</option>
                      <option value="last3Months">Last 3 Months</option>
                      <option value="last6Months">Last 6 Months</option>
                      <option value="lastYear">Last Year</option>
                    </select>
                  </div>
                  <button
                    onClick={clearDateFilter}
                    className="clear-filter-button"
                    title="Clear Date Filter"
                  >
                    🗑️ Clear Filter
                  </button>
                  {registeredUsers.length > 0 && (
                    <>
                      <button
                        onClick={handleShowEmails}
                        className="show-emails-button"
                        title="View All User Emails"
                      >
                        📧 View All Emails
                      </button>
                      <button
                        onClick={handleShowPhones}
                        className="show-phones-button"
                        title="View All User Phone Numbers"
                      >
                        📱 View All Phones
                      </button>
                      <button
                        onClick={handleShowGenderChart}
                        className="show-gender-chart-button"
                        title="View Gender Distribution Chart"
                      >
                        📊 Gender Chart
                      </button>
                      <button
                        onClick={handleShowCountryChart}
                        className="show-country-chart-button"
                        title="View Country Distribution Chart"
                      >
                        🌍 Country Chart
                      </button>
                      <button
                        onClick={handleShowAppointments}
                        className="show-appointments-button"
                        title="View and Manage Appointments"
                      >
                        📅 Appointments
                      </button>
                    </>
                  )}
                </div>
                {dateFilter.period && (
                  <div className="filter-info">
                    Showing {filteredUsers.length} of {registeredUsers.length} users
                    {dateFilter.period && ` for ${getPeriodLabel(dateFilter.period)}`}
                    {dateFilter.fromDate && dateFilter.toDate && (
                      <span className="date-range-info">
                        ({new Date(dateFilter.fromDate).toLocaleDateString()} - {new Date(dateFilter.toDate).toLocaleDateString()})
                      </span>
                    )}
                  </div>
                )}
              </div>
              
              {filteredUsers.length === 0 ? (
                <div className="no-users">
                  <p>
                    {registeredUsers.length === 0 
                      ? 'No users have registered yet.' 
                      : 'No users found matching the selected date range.'
                    }
                  </p>
                </div>
              ) : (
                <div className="users-table-container">
                  <table className="users-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Age</th>
                        <th>Gender</th>
                        <th>Registration Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user, index) => (
                        <tr key={user.id || index}>
                          <td className="user-number-cell">{index + 1}</td>
                          <td>{user.firstName} {user.lastName}</td>
                          <td>{user.email}</td>
                          <td>{user.phone}</td>
                          <td>{getAge(user.dateOfBirth)}</td>
                          <td className={`gender-cell gender-${user.gender}`}>
                            {user.gender}
                          </td>
                          <td>{formatDate(user.signupTime)}</td>
                          <td className="status-cell">
                            <span className={`status-badge status-${user.status || 'registered'}`}>
                              {user.status || 'Registered'}
                            </span>
                          </td>
                          <td>
                            <button 
                              className="delete-user-btn"
                              onClick={() => handleDeleteUser(user._id, `${user.firstName} ${user.lastName}`)}
                              title="Delete User"
                            >
                              🗑️ Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Email Window Modal */}
      {showEmailWindow && (
        <div className="email-window-overlay" onClick={handleCloseEmailWindow}>
          <div className="email-window" onClick={(e) => e.stopPropagation()}>
            <div className="email-window-header">
              <h3>All User Emails</h3>
              <button 
                className="email-window-close"
                onClick={handleCloseEmailWindow}
                title="Close"
              >
                ×
              </button>
            </div>
            
            <div className="email-window-body">
              <div className="email-list">
                {registeredUsers.map((user, index) => (
                  <div key={user._id || index} className="email-item">
                    <span className="email-address">{user.email}</span>
                    <span className="email-name">{user.firstName} {user.lastName}</span>
                  </div>
                ))}
              </div>
              
              <div className="email-actions">
                <button
                  onClick={() => {
                    const emails = registeredUsers.map(user => user.email).join('\n');
                    navigator.clipboard.writeText(emails);
                    alert('All emails copied to clipboard!');
                  }}
                  className="copy-emails-button"
                >
                  📋 Copy All Emails
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Phone Window Modal */}
      {showPhoneWindow && (
        <div className="phone-window-overlay" onClick={handleClosePhoneWindow}>
          <div className="phone-window" onClick={(e) => e.stopPropagation()}>
            <div className="phone-window-header">
              <h3>All User Phone Numbers</h3>
              <button 
                className="phone-window-close"
                onClick={handleClosePhoneWindow}
                title="Close"
              >
                ×
              </button>
            </div>
            
            <div className="phone-window-body">
              <div className="phone-list">
                {registeredUsers.map((user, index) => (
                  <div key={user._id || index} className="phone-item">
                    <span className="phone-number">{user.countryCode ? `${user.countryCode} ${user.phone}` : user.phone}</span>
                    <span className="phone-name">{user.firstName} {user.lastName}</span>
                  </div>
                ))}
              </div>
              
              <div className="phone-window-actions">
                <button
                  onClick={() => {
                    const phoneNumbers = registeredUsers.map(user => 
                      user.countryCode ? `${user.countryCode} ${user.phone}` : user.phone
                    ).join('\n');
                    navigator.clipboard.writeText(phoneNumbers);
                    alert('All phone numbers copied to clipboard!');
                  }}
                  className="copy-phones-button"
                >
                  📋 Copy All Phones
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gender Chart Modal */}
      {showGenderChart && (
        <div className="gender-chart-overlay" onClick={handleCloseGenderChart}>
          <div className="gender-chart-window" onClick={(e) => e.stopPropagation()}>
            <div className="gender-chart-header">
              <h3>Gender Distribution Chart</h3>
              <button 
                className="gender-chart-close"
                onClick={handleCloseGenderChart}
                title="Close"
              >
                ×
              </button>
            </div>
            
            <div className="gender-chart-body">
              {(() => {
                const stats = getGenderStats();
                return (
                  <div className="gender-chart-content">
                    <div className="gender-stats-summary">
                      <div className="stat-item">
                        <span className="stat-label">Total Users:</span>
                        <span className="stat-value">{stats.total}</span>
                      </div>
                    </div>
                    
                    <div className="gender-chart-container">
                      <div className="gender-pie-chart">
                        <div className="pie-chart-wrapper">
                          <svg className="pie-chart" viewBox="0 0 200 200">
                            <circle
                              className="pie-background"
                              cx="100"
                              cy="100"
                              r="80"
                              fill="none"
                              stroke="#e9ecef"
                              strokeWidth="40"
                            />
                            <circle
                              className="pie-segment male-segment"
                              cx="100"
                              cy="100"
                              r="80"
                              fill="none"
                              stroke="#3498db"
                              strokeWidth="40"
                              strokeDasharray={`${stats.malePercentage * 5.02} 502`}
                              strokeDashoffset="0"
                              transform="rotate(-90 100 100)"
                            />
                            <circle
                              className="pie-segment female-segment"
                              cx="100"
                              cy="100"
                              r="80"
                              fill="none"
                              stroke="#e91e63"
                              strokeWidth="40"
                              strokeDasharray={`${stats.femalePercentage * 5.02} 502`}
                              strokeDashoffset={`-${stats.malePercentage * 5.02}`}
                              transform="rotate(-90 100 100)"
                            />
                            <text
                              className="pie-center-text"
                              x="100"
                              y="100"
                              textAnchor="middle"
                              dominantBaseline="middle"
                              fontSize="24"
                              fontWeight="bold"
                              fill="#2c3e50"
                            >
                              {stats.total}
                            </text>
                            <text
                              className="pie-center-label"
                              x="100"
                              y="120"
                              textAnchor="middle"
                              dominantBaseline="middle"
                              fontSize="12"
                              fill="#6c757d"
                            >
                              Total Users
                            </text>
                          </svg>
                        </div>
                        <div className="pie-legend">
                          <div className="legend-item male-legend">
                            <div className="legend-color male-color"></div>
                            <span className="legend-label">👨 Male: {stats.male} ({stats.malePercentage}%)</span>
                          </div>
                          <div className="legend-item female-legend">
                            <div className="legend-color female-color"></div>
                            <span className="legend-label">👩 Female: {stats.female} ({stats.femalePercentage}%)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="gender-details">
                      <div className="gender-detail-item male-detail">
                        <div className="gender-icon">👨</div>
                        <div className="gender-info">
                          <div className="gender-label">Male</div>
                          <div className="gender-count">{stats.male} users</div>
                          <div className="gender-percentage">{stats.malePercentage}%</div>
                        </div>
                      </div>
                      
                      <div className="gender-detail-item female-detail">
                        <div className="gender-icon">👩</div>
                        <div className="gender-info">
                          <div className="gender-label">Female</div>
                          <div className="gender-count">{stats.female} users</div>
                          <div className="gender-percentage">{stats.femalePercentage}%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Country Chart Modal */}
      {showCountryChart && (
        <div className="country-chart-overlay" onClick={handleCloseCountryChart}>
          <div className="country-chart-window" onClick={(e) => e.stopPropagation()}>
            <div className="country-chart-header">
              <h3>Country Distribution Chart</h3>
              <button 
                className="country-chart-close"
                onClick={handleCloseCountryChart}
                title="Close"
              >
                ×
              </button>
            </div>
            
            <div className="country-chart-body">
              {(() => {
                const stats = getCountryStats();
                return (
                  <div className="country-chart-content">
                    <div className="country-stats-summary">
                      <div className="stat-item">
                        <span className="stat-label">Total Users:</span>
                        <span className="stat-value">{stats.total}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Countries:</span>
                        <span className="stat-value">{stats.uniqueCountries}</span>
                      </div>
                    </div>
                    
                    <div className="country-chart-container">
                      <div className="country-bar-chart">
                        {stats.countries.map((country, index) => (
                          <div key={country.country} className="country-bar-item">
                            <div className="country-bar-wrapper">
                              <div 
                                className="country-bar" 
                                style={{ 
                                  width: `${country.percentage}%`,
                                  backgroundColor: `hsl(${(index * 137.5) % 360}, 70%, 50%)`
                                }}
                              >
                                <span className="country-bar-label">
                                  {country.flag} {country.country}: {country.count} ({country.percentage}%)
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="country-details">
                      {stats.countries.map((country, index) => (
                        <div key={country.country} className="country-detail-item">
                          <div className="country-flag-display">
                            <span className="country-flag">{country.flag}</span>
                          </div>
                          <div 
                            className="country-color-indicator"
                            style={{ backgroundColor: `hsl(${(index * 137.5) % 360}, 70%, 50%)` }}
                          ></div>
                          <div className="country-info">
                            <div className="country-label">{country.country}</div>
                            <div className="country-count">{country.count} users</div>
                            <div className="country-percentage">{country.percentage}%</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Appointments Modal */}
      {showAppointments && (
        <div className="appointments-overlay" onClick={handleCloseAppointments}>
          <div className="appointments-window" onClick={(e) => e.stopPropagation()}>
            <div className="appointments-header">
              <h3>Appointment Management</h3>
              <button 
                className="appointments-close"
                onClick={handleCloseAppointments}
                title="Close"
              >
                ×
              </button>
            </div>
            
            <div className="appointments-body">
              <div className="appointments-content">
                <div className="appointments-list">
                  <h4>All Appointments</h4>
                  
                  {/* Appointment Statistics Dashboard */}
                  <div className="appointment-stats-dashboard">
                    {(() => {
                      const stats = getAppointmentStats();
                      return (
                        <div className="stats-cards">
                          <div className="stat-card pending">
                            <div className="stat-icon">🕐</div>
                            <div className="stat-info">
                              <div className="stat-number">{stats.pending}</div>
                              <div className="stat-label">Pending</div>
                            </div>
                          </div>
                          <div className="stat-card confirmed">
                            <div className="stat-icon">✓</div>
                            <div className="stat-info">
                              <div className="stat-number">{stats.confirmed}</div>
                              <div className="stat-label">Confirmed</div>
                            </div>
                          </div>
                          <div className="stat-card completed">
                            <div className="stat-icon">🎯</div>
                            <div className="stat-info">
                              <div className="stat-number">{stats.completed}</div>
                              <div className="stat-label">Completed</div>
                            </div>
                          </div>
                          <div className="stat-card cancelled">
                            <div className="stat-icon">🚫</div>
                            <div className="stat-info">
                              <div className="stat-number">{stats.cancelled}</div>
                              <div className="stat-label">Cancelled</div>
                            </div>
                          </div>
                          <div className="stat-card total">
                            <div className="stat-icon">📈</div>
                            <div className="stat-info">
                              <div className="stat-number">{stats.total}</div>
                              <div className="stat-label">Total</div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                  
                  <div className="appointments-table-container">
                    <table className="appointments-table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Patient Name</th>
                          <th>Date</th>
                          <th>Time</th>
                          <th>Doctor</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {appointments.map((appointment, index) => (
                          <tr 
                            key={appointment._id} 
                            className={`appointment-row ${appointment.status}`}
                          >
                            <td className="appointment-number-cell">{index + 1}</td>
                            <td className="patient-name-cell">{appointment.patientName}</td>
                            <td className="appointment-date-cell">{new Date(appointment.appointmentDate).toLocaleDateString()}</td>
                            <td className="appointment-time-cell">{appointment.appointmentTime}</td>
                            <td className="appointment-doctor-cell">{appointment.doctor}</td>
                            <td className="appointment-status-cell">
                              <span className={`appointment-status status-${appointment.status}`}>
                                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                              </span>
                            </td>
                            <td className="appointment-actions-cell">
                              <button 
                                className="show-details-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedAppointment(appointment);
                                  setShowAppointmentDetails(true);
                                }}
                                title="Show Appointment Details"
                              >
                                📋 Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Appointment Details Window */}
      {showAppointmentDetails && selectedAppointment && (
        <div className="appointment-details-overlay" onClick={() => setShowAppointmentDetails(false)}>
          <div className="appointment-details-window" onClick={(e) => e.stopPropagation()}>
            <div className="appointment-details-header">
              <h3>Appointment Details</h3>
              <button 
                className="appointment-details-close"
                onClick={() => setShowAppointmentDetails(false)}
                title="Close"
              >
                ×
              </button>
            </div>
            
            <div className="appointment-details-body">
              <div className="appointment-details-content">
                <div className="detail-section">
                  <h5>Patient Information</h5>
                  <div className="detail-item">
                    <span className="detail-label">Name:</span>
                    <span className="detail-value">{selectedAppointment.patientName}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">
                      {selectedAppointment.patientEmail}
                      <button 
                        className="copy-email-btn"
                        onClick={(e) => {
                          navigator.clipboard.writeText(selectedAppointment.patientEmail);
                          // Optional: Show a brief success message
                          const btn = e.target;
                          const originalText = btn.innerHTML;
                          btn.innerHTML = '✅ Copied!';
                          setTimeout(() => {
                            btn.innerHTML = originalText;
                          }, 1500);
                        }}
                        title="Copy email address"
                      >
                        📋 Copy
                      </button>
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Phone:</span>
                    <span className="detail-value">
                      {selectedAppointment.patientPhone}
                      <button 
                        className="whatsapp-btn"
                        onClick={() => {
                          const phoneNumber = selectedAppointment.patientPhone.replace(/\D/g, ''); // Remove non-digits
                          const whatsappUrl = `https://wa.me/${phoneNumber}`;
                          window.open(whatsappUrl, '_blank');
                        }}
                        title="Send WhatsApp message"
                      >
                        📱 WhatsApp
                      </button>
                    </span>
                  </div>
                </div>
                
                <div className="detail-section">
                  <h5>Appointment Information</h5>
                  <div className="detail-item">
                    <span className="detail-label">Date:</span>
                    <span className="detail-value">{new Date(selectedAppointment.appointmentDate).toLocaleDateString()}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Time:</span>
                    <span className="detail-value">{selectedAppointment.appointmentTime}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Doctor:</span>
                    <span className="detail-value">{selectedAppointment.doctor}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Department:</span>
                    <span className="detail-value">{selectedAppointment.department}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Reason:</span>
                    <span className="detail-value">{selectedAppointment.reason}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Notes:</span>
                    <span className="detail-value">{selectedAppointment.notes}</span>
                  </div>
                </div>
                
                <div className="detail-section">
                  <h5>Status Management</h5>
                  <div className="status-buttons">
                    <button
                      className={`status-btn ${(tempStatus || selectedAppointment.status) === 'pending' ? 'active' : ''}`}
                      onClick={() => handleStatusSelect('pending')}
                    >
                      Pending
                    </button>
                    <button
                      className={`status-btn ${(tempStatus || selectedAppointment.status) === 'confirmed' ? 'active' : ''}`}
                      onClick={() => handleStatusSelect('confirmed')}
                    >
                      Confirmed
                    </button>
                    <button
                      className={`status-btn ${(tempStatus || selectedAppointment.status) === 'completed' ? 'active' : ''}`}
                      onClick={() => handleStatusSelect('completed')}
                    >
                      Completed
                    </button>
                    <button
                      className={`status-btn ${(tempStatus || selectedAppointment.status) === 'cancelled' ? 'active' : ''}`}
                      onClick={() => handleStatusSelect('cancelled')}
                    >
                      Cancelled
                    </button>
                  </div>
                  {tempStatus && tempStatus !== selectedAppointment.status && (
                    <div className="status-save-section">
                      <button
                        className="save-status-btn"
                        onClick={handleSaveStatus}
                      >
                        💾 Save Status Change
                      </button>
                      <button
                        className="cancel-status-btn"
                        onClick={() => setTempStatus(null)}
                      >
                        ❌ Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Alert */}
      <StyledAlert
        isOpen={showDeleteAlert}
        title={deleteAlertData.title || 'Confirm Delete User'}
        message={deleteAlertData.message || `Are you sure you want to delete user "${deleteAlertData.userName}"? This action cannot be undone.`}
        type={deleteAlertData.type || 'warning'}
        onClose={handleCloseDeleteAlert}
        onConfirm={deleteAlertData.type ? undefined : confirmDeleteUser}
        showCancel={!deleteAlertData.type}
        confirmText="Delete"
        cancelText="Cancel"
      />

      {/* Status Change Confirmation Alert */}
      <StyledAlert
        isOpen={showStatusConfirm}
        title="Confirm Status Change"
        message={`Are you sure you want to change the appointment status from "${selectedAppointment?.status}" to "${tempStatus}"?`}
        type="info"
        onClose={cancelStatusChange}
        onConfirm={confirmStatusChange}
        showCancel={true}
        confirmText="Confirm Change"
        cancelText="Cancel"
      />
    </div>
  );
};

export default Admin;
