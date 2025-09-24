import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import OptimizedImage from '../../components/OptimizedImage';
import { useAuth } from '../../contexts/AuthContext';
import './Header.css';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isAdminDropdownOpen && !event.target.closest('.header-nav-item-dropdown')) {
        setIsAdminDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isAdminDropdownOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMobileMenu();
    setIsAdminDropdownOpen(false);
  };

  const toggleAdminDropdown = () => {
    setIsAdminDropdownOpen(!isAdminDropdownOpen);
  };

  const closeAdminDropdown = () => {
    setIsAdminDropdownOpen(false);
  };

  return (
    <header className={`header ${isScrolled ? 'header-scrolled' : ''}`}>
      <div className="header-container">
        <div className="header-logo">
          <Link to="/" className="header-logo-link" onClick={closeMobileMenu}>
            <OptimizedImage 
              src="https://res.cloudinary.com/dvybb2xnc/image/upload/v1756213851/Dental-Logo-Design_i2ir19.jpg" 
              alt="Dental Clinic Logo" 
              className="header-logo-image"
              lazy={false}
            />
            <h1 className="header-title">Dental Clinic</h1>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="header-navigation desktop-nav">
          <ul className="header-nav-list">
            <li className="header-nav-item">
              <Link
                to="/"
                className={`header-nav-link ${location.pathname === '/' ? 'header-nav-link-active' : ''}`}
              >
                Home
              </Link>
            </li>
            <li className="header-nav-item">
              <Link
                to="/services"
                className={`header-nav-link ${location.pathname === '/services' ? 'header-nav-link-active' : ''}`}
              >
                Services
              </Link>
            </li>
            <li className="header-nav-item">
              <Link
                to="/team"
                className={`header-nav-link ${location.pathname === '/team' ? 'header-nav-link-active' : ''}`}
              >
                Team
              </Link>
            </li>
            <li className="header-nav-item">
              <Link
                to="/contact"
                className={`header-nav-link ${location.pathname === '/contact' ? 'header-nav-link-active' : ''}`}
              >
                Contact
              </Link>
            </li>
            <li className="header-nav-item">
              <Link
                to="/appointment"
                className={`header-nav-link ${location.pathname === '/appointment' ? 'header-nav-link-active' : ''}`}
              >
                Appointment
              </Link>
            </li>
            <li className="header-nav-item">
              <Link
                to="/offers"
                className={`header-nav-link ${location.pathname === '/offers' ? 'header-nav-link-active' : ''}`}
              >
                Offers
              </Link>
            </li>
            {!isAuthenticated ? (
              <li className="header-nav-item">
                <Link
                  to="/signup"
                  className={`header-nav-link header-nav-link-signup ${location.pathname === '/signup' ? 'header-nav-link-active' : ''}`}
                >
                  Sign Up
                </Link>
              </li>
            ) : (
              <>
                <li className="header-nav-item header-nav-item-dropdown">
                  <button
                    onClick={toggleAdminDropdown}
                    className="header-nav-welcome header-nav-welcome-clickable"
                    title="Admin Menu"
                  >
                    Welcome, {user?.firstName || user?.name || 'User'} ▼
                  </button>
                  {isAdminDropdownOpen && (
                    <div className="admin-dropdown">
                      <Link
                        to="/admin"
                        className="admin-dropdown-item"
                        onClick={closeAdminDropdown}
                      >
                        🏥 Dashboard
                      </Link>
                      <Link
                        to="/control-panel"
                        className="admin-dropdown-item"
                        onClick={closeAdminDropdown}
                      >
                        ⚙️ Control Panel
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="admin-dropdown-item admin-dropdown-logout"
                      >
                        🚪 Logout
                      </button>
                    </div>
                  )}
                </li>
              </>
            )}
          </ul>
        </nav>

        {/* Mobile Hamburger Button */}
        <button 
          className={`mobile-menu-button ${isMobileMenuOpen ? 'mobile-menu-button-active' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      <div className={`mobile-navigation ${isMobileMenuOpen ? 'mobile-navigation-open' : ''}`}>
        <nav className="mobile-nav">
          <ul className="mobile-nav-list">
            <li className="mobile-nav-item">
              <Link
                to="/"
                className={`mobile-nav-link ${location.pathname === '/' ? 'mobile-nav-link-active' : ''}`}
                onClick={closeMobileMenu}
              >
                Home
              </Link>
            </li>
            <li className="mobile-nav-item">
              <Link
                to="/services"
                className={`mobile-nav-link ${location.pathname === '/services' ? 'mobile-nav-link-active' : ''}`}
                onClick={closeMobileMenu}
              >
                Services
              </Link>
            </li>
            <li className="mobile-nav-item">
              <Link
                to="/team"
                className={`mobile-nav-link ${location.pathname === '/team' ? 'mobile-nav-link-active' : ''}`}
                onClick={closeMobileMenu}
              >
                Team
              </Link>
            </li>
            <li className="mobile-nav-item">
              <Link
                to="/contact"
                className={`mobile-nav-link ${location.pathname === '/contact' ? 'mobile-nav-link-active' : ''}`}
                onClick={closeMobileMenu}
              >
                Contact
              </Link>
            </li>
            <li className="mobile-nav-item">
              <Link
                to="/appointment"
                className={`mobile-nav-link ${location.pathname === '/appointment' ? 'mobile-nav-link-active' : ''}`}
                onClick={closeMobileMenu}
              >
                Appointment
              </Link>
            </li>
            <li className="mobile-nav-item">
              <Link
                to="/offers"
                className={`mobile-nav-link ${location.pathname === '/offers' ? 'mobile-nav-link-active' : ''}`}
                onClick={closeMobileMenu}
              >
                Offers
              </Link>
            </li>
            {!isAuthenticated ? (
              <li className="mobile-nav-item">
                <Link
                  to="/signup"
                  className={`mobile-nav-link mobile-nav-link-signup ${location.pathname === '/signup' ? 'mobile-nav-link-active' : ''}`}
                  onClick={closeMobileMenu}
                >
                  Sign Up
                </Link>
              </li>
            ) : (
              <>
                <li className="mobile-nav-item">
                  <span className="mobile-nav-welcome">
                    Welcome, {user?.firstName || user?.name || 'User'}
                  </span>
                </li>
                <li className="mobile-nav-item">
                  <Link
                    to="/admin"
                    className={`mobile-nav-link mobile-nav-link-admin ${location.pathname === '/admin' ? 'mobile-nav-link-active' : ''}`}
                    onClick={closeMobileMenu}
                  >
                    🏥 Dashboard
                  </Link>
                </li>
                <li className="mobile-nav-item">
                  <Link
                    to="/control-panel"
                    className={`mobile-nav-link mobile-nav-link-control ${location.pathname === '/control-panel' ? 'mobile-nav-link-active' : ''}`}
                    onClick={closeMobileMenu}
                  >
                    ⚙️ Control Panel
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
