import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaHeartbeat, 
  FaChild, 
  FaHeart, 
  FaUserMd, 
  FaXRay, 
  FaSyringe, 
  FaBolt, 
  FaRunning,
  FaStethoscope
} from 'react-icons/fa';
import OptimizedVideo from '../../components/OptimizedVideo';
import './Services.css';

const Services = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    // Set visible immediately when component mounts
    setIsVisible(true);
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('services');
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  const openServicePopup = (service) => {
    setSelectedService(service);
  };

  const closeServicePopup = () => {
    setSelectedService(null);
  };

  const services = [
    {
      id: 1,
      name: "Cardiac Consultation",
      description: "Comprehensive heart health assessment and personalized treatment planning",
      doctors: [
        {
          name: "Dr. Sarah Johnson",
          specialty: "Interventional Cardiologist",
          image: "https://res.cloudinary.com/dvybb2xnc/image/upload/v1756216185/d206ac53273ccf64b50c776db6d333692fe4a0e0-1920x1280_lqh5zq.jpg"
        }
      ],
      icon: <FaHeartbeat />,
      features: ["Heart Health Assessment", "Risk Evaluation", "Treatment Planning", "Follow-up Care"]
    },
    {
      id: 2,
      name: "Pediatric Cardiology",
      description: "Specialized cardiac care for children from infancy through adolescence",
      doctors: [
        {
          name: "Dr. Lisa Park",
          specialty: "Pediatric Cardiologist",
          image: "https://res.cloudinary.com/dvybb2xnc/image/upload/v1756216187/Signs-Good-Dentist_zmorau.jpg"
        }
      ],
      icon: <FaChild />,
      features: ["Congenital Heart Defects", "Child-Friendly Environment", "Family-Centered Care", "Growth Monitoring"]
    },
    {
      id: 3,
      name: "Heart Surgery",
      description: "Advanced surgical procedures for complex cardiac conditions",
      doctors: [
        {
          name: "Dr. Michael Chen",
          specialty: "Cardiac Surgeon",
          image: "https://res.cloudinary.com/dvybb2xnc/image/upload/v1756215713/898905_gdo9db.jpg"
        }
      ],
      icon: <FaHeart />,
      features: ["Open Heart Surgery", "Minimally Invasive Procedures", "Valve Repair", "Bypass Surgery"]
    },
    {
      id: 4,
      name: "Preventive Cardiology",
      description: "Comprehensive heart disease prevention and lifestyle management",
      doctors: [
        {
          name: "Dr. Amanda Foster",
          specialty: "Preventive Cardiologist",
          image: "https://res.cloudinary.com/dvybb2xnc/image/upload/v1756216190/vsm_1277540215_k6i0jh.jpg"
        }
      ],
      icon: <FaUserMd />,
      features: ["Risk Assessment", "Lifestyle Counseling", "Nutrition Guidance", "Exercise Programs"]
    },
    {
      id: 5,
      name: "Cardiac Imaging",
      description: "State-of-the-art diagnostic imaging for accurate heart assessment",
      doctors: [
        {
          name: "Dr. Robert Wilson",
          specialty: "Cardiac Imaging Specialist",
          image: "https://res.cloudinary.com/dvybb2xnc/image/upload/v1756216191/How-Often-Should-I-See-the-Dentist-scaled_etmpkb.jpg"
        }
      ],
      icon: <FaXRay />,
      features: ["Echocardiography", "Cardiac MRI", "CT Angiography", "Nuclear Imaging"]
    },
    {
      id: 6,
      name: "Interventional Cardiology",
      description: "Minimally invasive procedures for heart and blood vessel conditions",
      doctors: [
        {
          name: "Dr. Sarah Johnson",
          specialty: "Interventional Cardiologist",
          image: "https://res.cloudinary.com/dvybb2xnc/image/upload/v1756216185/d206ac53273ccf64b50c776db6d333692fe4a0e0-1920x1280_lqh5zq.jpg"
        }
      ],
      icon: <FaSyringe />,
      features: ["Angioplasty", "Stent Placement", "Catheter Procedures", "Balloon Valvuloplasty"]
    },
    {
      id: 7,
      name: "Electrophysiology",
      description: "Specialized treatment for heart rhythm disorders and arrhythmias",
      doctors: [
        {
          name: "Dr. Emily Rodriguez",
          specialty: "Electrophysiologist",
          image: "https://res.cloudinary.com/dvybb2xnc/image/upload/v1756216190/vsm_1277540215_k6i0jh.jpg"
        }
      ],
      icon: <FaBolt />,
      features: ["Ablation Therapy", "Pacemaker Implantation", "ICD Placement", "Arrhythmia Management"]
    },
    {
      id: 8,
      name: "Cardiac Rehabilitation",
      description: "Comprehensive recovery program for heart patients",
      doctors: [
        {
          name: "Dr. James Martinez",
          specialty: "Cardiac Rehabilitation Specialist",
          image: "https://res.cloudinary.com/dvybb2xnc/image/upload/v1756216183/dental-associate-job-1170x780_ipoxli.jpg"
        }
      ],
      icon: <FaRunning />,
      features: ["Exercise Training", "Education Programs", "Lifestyle Modification", "Psychological Support"]
    },
    {
      id: 9,
      name: "Heart Transplant",
      description: "Advanced surgical procedures for end-stage heart failure",
      doctors: [
        {
          name: "Dr. David Thompson",
          specialty: "Heart Transplant Surgeon",
          image: "https://res.cloudinary.com/dvybb2xnc/image/upload/v1756215714/Alex_in_the_surgery_at_Munro_Dental_eawjzy.webp"
        }
      ],
      icon: <FaStethoscope />,
      features: ["Heart Transplant Surgery", "VAD Implantation", "Pre-Transplant Evaluation", "Post-Transplant Care"]
    }
  ];

  return (
    <div className="services-page">
      {/* Hero Section - Outside container for full width */}
      <div className="services-hero">
        {/* Video Background */}
        <div className="services-hero-video-background">
          <OptimizedVideo
            src="https://res.cloudinary.com/dvybb2xnc/video/upload/v1757920204/WhatsApp_Video_2025-09-15_at_10.09.52_cf4b595d_tjwsuf.mp4"
            className="services-hero-video"
            autoPlay={true}
            muted={true}
            loop={true}
            playsInline={true}
          />
          <div className="services-hero-video-overlay"></div>
        </div>
        
        <div className="services-hero-container">
          <div className="services-hero-content">
            <h1 className="services-hero-title">
              Our Services
            </h1>
            <p className="services-hero-description">
              Comprehensive cardiac care provided by our expert team of specialists
            </p>
            <div className="services-hero-buttons">
              <Link to="/contact" className="services-hero-button contact-button">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Moving Services Bar */}
      <div className="moving-services-bar">
        <div className="moving-services-content">
          <span>Cardiac Consultation</span>
          <span>•</span>
          <span>Heart Surgery</span>
          <span>•</span>
          <span>Cardiac Rehabilitation</span>
          <span>•</span>
          <span>Preventive Cardiology</span>
          <span>•</span>
          <span>Emergency Cardiac Care</span>
          <span>•</span>
          <span>Interventional Cardiology</span>
          <span>•</span>
          <span>Electrophysiology</span>
          <span>•</span>
          <span>Cardiac Imaging</span>
          <span>•</span>
          <span>Heart Transplant</span>
          <span>•</span>
          <span>Cardiac Consultation</span>
          <span>•</span>
          <span>Heart Surgery</span>
          <span>•</span>
          <span>Cardiac Rehabilitation</span>
          <span>•</span>
          <span>Preventive Cardiology</span>
          <span>•</span>
          <span>Emergency Cardiac Care</span>
          <span>•</span>
          <span>Interventional Cardiology</span>
          <span>•</span>
          <span>Electrophysiology</span>
          <span>•</span>
          <span>Cardiac Imaging</span>
          <span>•</span>
          <span>Heart Transplant</span>
          <span>•</span>
          <span>Cardiac Consultation</span>
          <span>•</span>
          <span>Heart Surgery</span>
          <span>•</span>
          <span>Cardiac Rehabilitation</span>
          <span>•</span>
          <span>Preventive Cardiology</span>
          <span>•</span>
          <span>Emergency Cardiac Care</span>
          <span>•</span>
          <span>Interventional Cardiology</span>
          <span>•</span>
          <span>Electrophysiology</span>
          <span>•</span>
          <span>Cardiac Imaging</span>
          <span>•</span>
          <span>Heart Transplant</span>
        </div>
      </div>

      {/* Services Section */}
      <section id="services" className={`services ${isVisible ? 'services-visible' : ''}`}>
        <div className="services-container">
          
          <div className="services-grid">
            {services.map((service, index) => (
              <div 
                key={service.id}
                className="service-card"
                onClick={() => openServicePopup(service)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="service-icon">
                  {service.iconImage ? (
                    <img 
                      src={service.iconImage} 
                      alt={service.name}
                      className="service-icon-image"
                    />
                  ) : (
                    <span className="service-icon-text">{service.icon}</span>
                  )}
                </div>
                
                <div className="service-content">
                  <h3 className="service-name">{service.name}</h3>
                  <p className="service-description">{service.description}</p>
                  

                  
                  <div className="service-features">
                    <h4 className="features-title">Services Include:</h4>
                    <ul className="features-list">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="feature-item">
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <button className="service-button">
                    Book Appointment
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Doctors Popup */}
      {selectedService && (
        <div className="service-popup-overlay" onClick={closeServicePopup}>
          <div className="service-popup" onClick={(e) => e.stopPropagation()}>
            <button className="service-popup-close-btn" onClick={closeServicePopup}>×</button>
            
            <div className="service-popup-content">
              <div className="service-popup-header">
                <div className="service-popup-icon">
                  {selectedService.iconImage ? (
                    <img 
                      src={selectedService.iconImage} 
                      alt={selectedService.name}
                      className="service-popup-icon-image"
                    />
                  ) : (
                    <span className="service-popup-icon-text">{selectedService.icon}</span>
                  )}
                </div>
                <h3 className="service-popup-name">{selectedService.name}</h3>
                <p className="service-popup-description">{selectedService.description}</p>
              </div>
              
              <div className="service-popup-doctors">
                <h4 className="doctors-title">Doctors who perform this service:</h4>
                <div className="doctors-list">
                  {selectedService.doctors.map((doctor, index) => (
                    <div key={index} className="doctor-item">
                      <div className="doctor-image">
                        <img 
                          src={doctor.image} 
                          alt={doctor.name}
                          className="doctor-avatar"
                        />
                      </div>
                      <div className="doctor-info">
                        <span className="doctor-name">{doctor.name}</span>
                        <span className="doctor-specialty">{doctor.specialty}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="service-popup-features">
                <h4 className="features-title">Services Include:</h4>
                <ul className="features-list">
                  {selectedService.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="feature-item">
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;
