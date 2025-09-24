import React, { useState, useEffect } from 'react';
import OptimizedImage from '../../components/OptimizedImage';
import './Team.css';

const Team = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

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

    const element = document.getElementById('team');
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  const doctors = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialty: "Interventional Cardiologist",
      experience: "12 years",
      description: "Dr. Sarah specializes in minimally invasive cardiac procedures and advanced interventional techniques. She is known for her expertise in complex coronary interventions and patient-centered care.",
      skills: ["Angioplasty", "Stent Placement", "Catheter Procedures", "Coronary Interventions", "Structural Heart Disease", "Patient Education"],
      image: "https://res.cloudinary.com/dvybb2xnc/image/upload/v1756216185/d206ac53273ccf64b50c776db6d333692fe4a0e0-1920x1280_lqh5zq.jpg"
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      specialty: "Cardiac Surgeon",
      experience: "15 years",
      description: "Dr. Michael is a leading cardiac surgeon with expertise in complex heart surgeries and advanced surgical techniques for life-threatening cardiac conditions.",
      skills: ["Open Heart Surgery", "Valve Repair", "Bypass Surgery", "Aortic Surgery", "Heart Transplant", "Minimally Invasive Surgery"],
      image: "https://res.cloudinary.com/dvybb2xnc/image/upload/v1756215713/898905_gdo9db.jpg"
    },
    {
      id: 3,
      name: "Dr. Emily Rodriguez",
      specialty: "Electrophysiologist",
      experience: "10 years",
      description: "Dr. Emily is passionate about treating heart rhythm disorders through advanced electrophysiology procedures and personalized treatment plans.",
      skills: ["Ablation Therapy", "Pacemaker Implantation", "ICD Placement", "Arrhythmia Management", "Cardiac Mapping", "Device Therapy"],
      image: "https://res.cloudinary.com/dvybb2xnc/image/upload/v1756216190/vsm_1277540215_k6i0jh.jpg"
    },
    {
      id: 4,
      name: "Dr. David Thompson",
      specialty: "Heart Transplant Surgeon",
      experience: "18 years",
      description: "Dr. David is a highly skilled transplant surgeon specializing in heart transplantation and advanced mechanical circulatory support devices.",
      skills: ["Heart Transplant", "VAD Implantation", "ECMO Management", "Pre-Transplant Evaluation", "Post-Transplant Care", "Mechanical Support"],
      image: "https://res.cloudinary.com/dvybb2xnc/image/upload/v1756215714/Alex_in_the_surgery_at_Munro_Dental_eawjzy.webp"
    },
    {
      id: 5,
      name: "Dr. Lisa Park",
      specialty: "Pediatric Cardiologist",
      experience: "8 years",
      description: "Dr. Lisa creates a compassionate environment for children with heart conditions while providing excellent cardiac care and family education.",
      skills: ["Congenital Heart Defects", "Child-Friendly Care", "Family Education", "Growth Monitoring", "Fetal Cardiology", "Pediatric Interventions"],
      image: "https://res.cloudinary.com/dvybb2xnc/image/upload/v1756216187/Signs-Good-Dentist_zmorau.jpg"
    },
    {
      id: 6,
      name: "Dr. Robert Wilson",
      specialty: "Cardiac Imaging Specialist",
      experience: "14 years",
      description: "Dr. Robert specializes in advanced cardiac imaging techniques and diagnostic procedures to provide accurate heart assessments.",
      skills: ["Echocardiography", "Cardiac MRI", "CT Angiography", "Nuclear Imaging", "Stress Testing", "Advanced Diagnostics"],
      image: "https://res.cloudinary.com/dvybb2xnc/image/upload/v1756216191/How-Often-Should-I-See-the-Dentist-scaled_etmpkb.jpg"
    },
    {
      id: 7,
      name: "Dr. Amanda Foster",
      specialty: "Preventive Cardiologist",
      experience: "11 years",
      description: "Dr. Amanda is an expert in heart disease prevention and lifestyle medicine, helping patients maintain optimal cardiovascular health.",
      skills: ["Risk Assessment", "Lifestyle Counseling", "Prevention Strategies", "Lipid Management", "Diabetes Care", "Hypertension Treatment"],
      image: "https://res.cloudinary.com/dvybb2xnc/image/upload/v1756216190/vsm_1277540215_k6i0jh.jpg"
    },
    {
      id: 8,
      name: "Dr. James Martinez",
      specialty: "Cardiac Rehabilitation Specialist",
      experience: "16 years",
      description: "Dr. James specializes in cardiac rehabilitation and recovery programs, helping patients regain strength and improve their quality of life after cardiac events.",
      skills: ["Exercise Training", "Recovery Programs", "Lifestyle Modification", "Psychological Support", "Nutrition Counseling", "Medication Management"],
      image: "https://res.cloudinary.com/dvybb2xnc/image/upload/v1756216183/dental-associate-job-1170x780_ipoxli.jpg"
    }
  ];

  const openPopup = (doctor) => {
    setSelectedDoctor(doctor);
  };

  const closePopup = () => {
    setSelectedDoctor(null);
  };

  return (
    <div className="team-page">
      <section id="team" className={`team ${isVisible ? 'team-visible' : ''}`}>
        <div className="team-container">
          <div className="team-header">
            <h2 className="team-title">Meet Our Team</h2>
            <p className="team-subtitle">
              Experienced cardiac specialists dedicated to your heart health
            </p>
          </div>
          
          <div className="team-content">
            <div className="doctors-grid">
              {doctors.map((doctor, index) => (
                <div 
                  key={doctor.id}
                  className="doctor-card"
                  onClick={() => openPopup(doctor)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="doctor-image">
                    {doctor.image.startsWith('http') ? (
                      <OptimizedImage 
                        src={doctor.image} 
                        alt={doctor.name}
                        className="doctor-avatar-image"
                        lazy={true}
                      />
                    ) : (
                      <span className="doctor-avatar">{doctor.image}</span>
                    )}
                  </div>
                  
                  <div className="doctor-info">
                    <h3 className="doctor-name">{doctor.name}</h3>
                    <p className="doctor-specialty">{doctor.specialty}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Doctor Popup */}
      {selectedDoctor && (
        <div className="doctor-popup-overlay" onClick={closePopup}>
          <div className="doctor-popup" onClick={(e) => e.stopPropagation()}>
            <button className="popup-close-btn" onClick={closePopup}>×</button>
            
            <div className="popup-content">
                             <div className="popup-header">
                 {selectedDoctor.image.startsWith('http') ? (
                   <img 
                     src={selectedDoctor.image} 
                     alt={selectedDoctor.name}
                     className="popup-avatar-image"
                   />
                 ) : (
                   <span className="popup-avatar">{selectedDoctor.image}</span>
                 )}
                 <h3 className="popup-name">{selectedDoctor.name}</h3>
                 <p className="popup-specialty">{selectedDoctor.specialty}</p>
               </div>
              
              <div className="popup-details">
                <div className="popup-experience">
                  <h4>Experience</h4>
                  <p>{selectedDoctor.experience}</p>
                </div>
                
                <div className="popup-description">
                  <h4>About</h4>
                  <p>{selectedDoctor.description}</p>
                </div>
                
                <div className="popup-skills">
                  <h4>Specializations</h4>
                  <div className="skills-grid">
                    {selectedDoctor.skills.map((skill, index) => (
                      <span key={index} className="skill-tag">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Team;
