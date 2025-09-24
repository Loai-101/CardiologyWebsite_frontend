import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import OptimizedVideo from '../../components/OptimizedVideo';
import './Home.css';

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [counts, setCounts] = useState({
    experience: 0,
    patients: 0,
    satisfaction: 0,
    emergency: 0
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsVisible(true);
          // Start counting animation only once when statistics section becomes visible
          startCounting();
          setHasAnimated(true);
        }
      },
      { threshold: 0.3 }
    );

    const element = document.getElementById('stats');
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [hasAnimated]);

  const startCounting = () => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      
      const progress = currentStep / steps;
      
      setCounts({
        experience: Math.floor(14 * progress),
        patients: Math.floor(4875 * progress),
        satisfaction: Math.floor(97 * progress),
        emergency: 24 // Keep this static as it's "24/7"
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        // Ensure final values are exact
        setCounts({
          experience: 14,
          patients: 4875,
          satisfaction: 97,
          emergency: 24
        });
      }
    }, stepDuration);
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section id="home" className="hero">
        {/* Video Background */}
        <div className="hero-video-background">
          <OptimizedVideo
            src="https://res.cloudinary.com/dvybb2xnc/video/upload/v1757917079/WhatsApp_Video_2025-09-15_at_09.15.43_ebcab0e5_dgx4my.mp4"
            className="hero-video"
            autoPlay={true}
            muted={true}
            loop={true}
            playsInline={true}
          />
          <div className="hero-video-overlay"></div>
        </div>
        
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Welcome to Cardiology Hospital
            </h1>
            <p className="hero-description">
              Professional cardiac care hospital for you and your family
            </p>
            <div className="hero-buttons">
              <Link to="/services" className="hero-button hero-button-primary">
                Our Services
              </Link>
              <Link to="/appointment" className="hero-button hero-button-secondary">
                Book Appointment
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Moving Text Bar */}
      <section className="moving-text-section">
        <div className="moving-text-container">
          <div className="moving-text-content">
            <span className="moving-text-item">Cardiology Hospital - Your heart health is our priority.</span>
            <span className="moving-text-item">At Cardiology Hospital, a healthy heart means a better quality of life.</span>
            <span className="moving-text-item">Cardiology Hospital - Advanced technology and specialized cardiologists.</span>
            <span className="moving-text-item">Cardiology Hospital provides comprehensive, compassionate cardiac care.</span>
            <span className="moving-text-item">Cardiology Hospital - Because your heart is precious, we offer exceptional care.</span>
            <span className="moving-text-item">From routine checkups to complex procedures at Cardiology Hospital.</span>
            <span className="moving-text-item">Cardiology Hospital cares for your heart with expertise and compassion.</span>
            <span className="moving-text-item">Cardiology Hospital - A healthy heart is the foundation of a happy life.</span>
            <span className="moving-text-item">Cardiology Hospital uses the latest equipment for safe treatment and excellent outcomes.</span>
            <span className="moving-text-item">Cardiology Hospital - Restoring your heart health and improving your quality of life.</span>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section id="stats" className="stats-section">
        <div className="stats-container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">{counts.experience}+</div>
              <div className="stat-label">Years Experience</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{counts.patients}+</div>
              <div className="stat-label">Happy Patients</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{counts.satisfaction}%</div>
              <div className="stat-label">Satisfaction Rate</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{counts.emergency}/7</div>
              <div className="stat-label">Emergency Care</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className={`about ${isVisible ? 'about-visible' : ''}`}>
        <div className="about-container">
          <div className="about-header">
            <h2 className="about-title">About Our Hospital</h2>
            <p className="about-subtitle">
              Providing exceptional cardiac care with compassion and expertise
            </p>
          </div>
          
          <div className="about-content">
            <div className="about-text">
              <div className="about-section">
                <h3 className="about-section-title">Our Mission</h3>
                <p className="about-description">
                  At Cardiology Hospital, we are committed to providing the highest quality 
                  cardiac care in a comfortable and welcoming environment. Our mission is to 
                  help our patients achieve optimal heart health and better quality of life through 
                  personalized treatment plans and state-of-the-art technology.
                </p>
              </div>
              
              <div className="about-section">
                <h3 className="about-section-title">Why Choose Us</h3>
                <div className="about-features">
                  <div className="about-feature">
                    <div className="about-feature-icon">
                      <img 
                        src="https://res.cloudinary.com/dvybb2xnc/image/upload/v1756195644/Screenshot_2025-08-26_110705_ap8z4i.png" 
                        alt="Experienced Team" 
                        className="about-feature-image"
                      />
                    </div>
                    <div className="about-feature-content">
                      <h4 className="about-feature-title">Experienced Team</h4>
                      <p className="about-feature-text">
                        Our hospital team of cardiac professionals has years of experience and 
                        continues to stay updated with the latest cardiac care techniques.
                      </p>
                    </div>
                  </div>
                  
                  <div className="about-feature">
                    <div className="about-feature-icon">
                      <img 
                        src="https://res.cloudinary.com/dvybb2xnc/image/upload/v1757919746/1e9cf8b336ea20ae05cbe7adc62da5c034c4ec8f-6000x4500_cqjivk.avif" 
                        alt="Modern Technology" 
                        className="about-feature-image"
                      />
                    </div>
                    <div className="about-feature-content">
                      <h4 className="about-feature-title">Modern Technology</h4>
                      <p className="about-feature-text">
                        Our hospital uses the latest cardiac technology and equipment to ensure 
                        precise, comfortable, and efficient treatments.
                      </p>
                    </div>
                  </div>
                  
                  <div className="about-feature">
                    <div className="about-feature-icon">
                      <img 
                        src="https://res.cloudinary.com/dvybb2xnc/image/upload/v1756116278/387577_ixnm8c.png" 
                        alt="Patient-Centered Care" 
                        className="about-feature-image"
                      />
                    </div>
                    <div className="about-feature-content">
                      <h4 className="about-feature-title">Patient-Centered Care</h4>
                      <p className="about-feature-text">
                        Every patient is unique, and our hospital creates personalized treatment 
                        plans that address individual cardiac needs and concerns.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
