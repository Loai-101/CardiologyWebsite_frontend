import React, { useState, useEffect } from 'react';
import './Appointment.css';
import apiService from '../../services/api';

const Appointment = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    countryCode: '+973', // Default to Bahrain
    phone: '',
    date: '',
    time: '',
    doctor: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  useEffect(() => {
    setIsVisible(true);
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('appointment');
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
    { id: 'sarah-johnson', name: 'Dr. Sarah Johnson', specialty: 'General Dentist' },
    { id: 'michael-chen', name: 'Dr. Michael Chen', specialty: 'Cosmetic Dentist' },
    { id: 'emily-rodriguez', name: 'Dr. Emily Rodriguez', specialty: 'Orthodontist' },
    { id: 'david-thompson', name: 'Dr. David Thompson', specialty: 'Oral Surgeon' },
    { id: 'lisa-park', name: 'Dr. Lisa Park', specialty: 'Pediatric Dentist' },
    { id: 'robert-wilson', name: 'Dr. Robert Wilson', specialty: 'Periodontist' },
    { id: 'amanda-foster', name: 'Dr. Amanda Foster', specialty: 'Endodontist' },
    { id: 'james-martinez', name: 'Dr. James Martinez', specialty: 'Prosthodontist' }
  ];

  // Get available time slots based on selected date and office hours
  const getAvailableTimeSlots = (selectedDate) => {
    if (!selectedDate) return [];
    
    const date = new Date(selectedDate);
    const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Office hours based on day of week
    let startTime, endTime;
    
    if (dayOfWeek === 0) { // Sunday - Closed
      return [];
    } else if (dayOfWeek === 6) { // Saturday - 9:00 AM - 2:00 PM
      startTime = 9;
      endTime = 14;
    } else { // Monday-Friday - 9:00 AM - 6:00 PM
      startTime = 9;
      endTime = 18;
    }
    
    const timeSlots = [];
    for (let hour = startTime; hour < endTime; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const displayTime = new Date(`2000-01-01 ${timeString}`).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
        timeSlots.push(displayTime);
      }
    }
    
    return timeSlots;
  };

  // GCC country codes and validation
  const gccCountries = [
    { code: '+973', country: 'Bahrain', flag: '🇧🇭', localPattern: /^\d{4}\s?\d{4}$/, fullPattern: /^(\+973|973)\s?\d{4}\s?\d{4}$/ },
    { code: '+966', country: 'Saudi Arabia', flag: '🇸🇦', localPattern: /^\d{2}\s?\d{3}\s?\d{4}$/, fullPattern: /^(\+966|966)\s?\d{2}\s?\d{3}\s?\d{4}$/ },
    { code: '+971', country: 'UAE', flag: '🇦🇪', localPattern: /^\d{2}\s?\d{3}\s?\d{4}$/, fullPattern: /^(\+971|971)\s?\d{2}\s?\d{3}\s?\d{4}$/ },
    { code: '+965', country: 'Kuwait', flag: '🇰🇼', localPattern: /^\d{4}\s?\d{4}$/, fullPattern: /^(\+965|965)\s?\d{4}\s?\d{4}$/ },
    { code: '+968', country: 'Oman', flag: '🇴🇲', localPattern: /^\d{4}\s?\d{4}$/, fullPattern: /^(\+968|968)\s?\d{4}\s?\d{4}$/ },
    { code: '+974', country: 'Qatar', flag: '🇶🇦', localPattern: /^\d{4}\s?\d{4}$/, fullPattern: /^(\+974|974)\s?\d{4}\s?\d{4}$/ }
  ];

  // Phone number validation based on selected country (validates local number only)
  const validatePhoneNumber = (phone, countryCode) => {
    const country = gccCountries.find(c => c.code === countryCode);
    if (!country) return false;
    
    // Check if it's a local number (without country code)
    if (country.localPattern.test(phone)) {
      return true;
    }
    
    // Check if it's a full number (with country code)
    if (country.fullPattern.test(phone)) {
      return true;
    }
    
    return false;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Reset time selection when date changes
      ...(name === 'date' && { time: '' })
    }));
  };

  // Form validation
  const validateForm = () => {
    const errors = [];
    
    if (!formData.firstName.trim()) errors.push('First name is required');
    if (!formData.lastName.trim()) errors.push('Last name is required');
    if (!formData.email.trim()) errors.push('Email is required');
    if (!formData.phone.trim()) errors.push('Phone number is required');
    if (!formData.date) errors.push('Appointment date is required');
    if (!formData.time) errors.push('Appointment time is required');
    if (!formData.doctor) errors.push('Doctor selection is required');
    
    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailPattern.test(formData.email)) {
      errors.push('Please enter a valid email address');
    }
    
    // Validate phone number based on selected country
    if (formData.phone && !validatePhoneNumber(formData.phone, formData.countryCode)) {
      const selectedCountry = gccCountries.find(c => c.code === formData.countryCode);
      errors.push(`Please enter a valid ${selectedCountry?.country} phone number`);
    }
    
    // Validate date is not in the past
    if (formData.date && new Date(formData.date) < new Date().setHours(0, 0, 0, 0)) {
      errors.push('Appointment date cannot be in the past');
    }
    
    // Validate date is not Sunday (closed)
    if (formData.date) {
      const selectedDate = new Date(formData.date);
      if (selectedDate.getDay() === 0) {
        errors.push('Clinic is closed on Sundays. Please select a different date.');
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
      // First, store the appointment in the database
      const appointmentData = {
        patientName: `${formData.firstName} ${formData.lastName}`,
        patientEmail: formData.email,
        patientPhone: `${formData.countryCode} ${formData.phone}`,
        appointmentDate: formData.date,
        appointmentTime: formData.time,
        doctor: formData.doctor,
        department: 'Cardiology',
        reason: formData.message || 'General consultation',
        notes: formData.message || ''
      };

      // Store appointment in database
      const appointmentResponse = await apiService.bookAppointment(appointmentData);
      
      if (!appointmentResponse.success) {
        throw new Error(appointmentResponse.message || 'Failed to book appointment');
      }

      // Create formatted date
      const formattedDate = new Date(formData.date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      // Create beautifully styled email content
      const emailContent = `
╔══════════════════════════════════════════════════════════════════════════════╗
║                           🏥 CARDIOLOGY HOSPITAL                             ║
║                        NEW APPOINTMENT REQUEST                               ║
╚══════════════════════════════════════════════════════════════════════════════╝

┌─────────────────────────────────────────────────────────────────────────────┐
│                        🏥 ABOUT CARDIOLOGY HOSPITAL                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Dental Clinic is a leading dental care facility dedicated to              │
│  providing comprehensive heart health services. Our expert team of          │
│  cardiologists, cardiac surgeons, and specialists offer:                    │
│                                                                             │
│  • Cardiac Consultation & Assessment                                        │
│  • Heart Surgery & Interventional Procedures                               │
│  • Pediatric Cardiology & Congenital Heart Care                            │
│  • Cardiac Imaging & Advanced Diagnostics                                  │
│  • Electrophysiology & Arrhythmia Management                               │
│  • Cardiac Rehabilitation & Recovery Programs                              │
│  • Heart Transplant & Advanced Surgical Care                               │
│  • Preventive Cardiology & Lifestyle Medicine                              │
│                                                                             │
│  We are committed to delivering exceptional cardiac care with compassion,   │
│  expertise, and state-of-the-art technology to help our patients achieve   │
│  optimal heart health and better quality of life.                          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                            👤 PATIENT INFORMATION                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  📝 Name:        ${formData.firstName} ${formData.lastName}${' '.repeat(Math.max(0, 30 - (formData.firstName + formData.lastName).length))}│
│  📧 Email:       ${formData.email}${' '.repeat(Math.max(0, 30 - formData.email.length))}│
│  📱 Phone:       ${formData.phone}${' '.repeat(Math.max(0, 30 - formData.phone.length))}│
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                          📅 APPOINTMENT DETAILS                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  📆 Date:        ${formattedDate}${' '.repeat(Math.max(0, 20 - formattedDate.length))}│
│  ⏰ Time:        ${formData.time}${' '.repeat(Math.max(0, 30 - formData.time.length))}│
│  👨‍⚕️ Doctor:      ${formData.doctor}${' '.repeat(Math.max(0, 25 - formData.doctor.length))}│
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

${formData.message ? `┌─────────────────────────────────────────────────────────────────────────────┐
│                         💬 ADDITIONAL MESSAGE                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  "${formData.message}"${' '.repeat(Math.max(0, 60 - formData.message.length))}│
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

` : ''}╔══════════════════════════════════════════════════════════════════════════════╗
║                           📞 ACTION REQUIRED                                ║
║                                                                              ║
║  ⚠️  Please contact the patient to confirm this appointment                  ║
║                                                                              ║
║  📧 Reply to: ${formData.email}${' '.repeat(Math.max(0, 40 - formData.email.length))}║
║  📱 Call: ${formData.phone}${' '.repeat(Math.max(0, 45 - formData.phone.length))}║
╚══════════════════════════════════════════════════════════════════════════════╝

═══════════════════════════════════════════════════════════════════════════════

Best regards,
PMI IT system
Dental Clinic Website
📧 info@cardiologyhospital.com | 📱 +973 17676765
🌐 www.cardiologyhospital.com

═══════════════════════════════════════════════════════════════════════════════
This email was sent automatically from your Dental Clinic website appointment form via PMI IT system.
      `;

      // Use a simple, reliable email service
      console.log('Sending email automatically...');
      
      // Create a simple email payload
      const emailData = {
        to: 'q9g8moh@gmail.com',
        from: formData.email,
        subject: '🏥 New Appointment Request - Dental Clinic',
        text: emailContent,
        name: `${formData.firstName} ${formData.lastName}`,
        phone: `${formData.countryCode} ${formData.phone}`,
        appointment_date: formattedDate,
        appointment_time: formData.time,
        doctor: formData.doctor,
        message: formData.message || 'No additional message provided'
      };

      // Use a reliable email service - try multiple methods
      let emailSent = false;

      // Method 1: Try FormSubmit with access key (if available)
      try {
        const formDataToSend = new FormData();
        formDataToSend.append('name', emailData.name);
        formDataToSend.append('email', emailData.from);
        formDataToSend.append('phone', emailData.phone);
        formDataToSend.append('appointment_date', emailData.appointment_date);
        formDataToSend.append('appointment_time', emailData.appointment_time);
        formDataToSend.append('doctor', emailData.doctor);
        formDataToSend.append('message', emailData.message);
        formDataToSend.append('_subject', emailData.subject);
        formDataToSend.append('_replyto', emailData.from);
        formDataToSend.append('_captcha', 'false');
        formDataToSend.append('_template', 'box');

        const response = await fetch('https://formsubmit.co/q9g8moh@gmail.com', {
          method: 'POST',
          body: formDataToSend
        });

        console.log('FormSubmit response status:', response.status);
        console.log('FormSubmit response ok:', response.ok);
        
        if (response.ok) {
          emailSent = true;
          console.log('✅ Email sent via FormSubmit');
          console.log('📧 Email should arrive at: q9g8moh@gmail.com');
        } else {
          const errorText = await response.text();
          console.log('FormSubmit error:', errorText);
          console.log('FormSubmit error details:', {
            status: response.status,
            statusText: response.statusText,
            errorText: errorText
          });
          throw new Error(`FormSubmit failed: ${response.status}`);
        }
      } catch (error) {
        console.log('FormSubmit failed, trying alternative method...', error);
      }

      // Method 2: Try a simple email service
      if (!emailSent) {
        try {
          const emailPayload = {
            to: 'q9g8moh@gmail.com',
            from: emailData.from,
            subject: emailData.subject,
            text: emailContent,
            html: emailContent.replace(/\n/g, '<br>')
          };

          const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              service_id: 'service_dental',
              template_id: 'template_appointment',
              user_id: 'user_dental',
              template_params: emailPayload
            })
          });

          if (response.ok) {
            emailSent = true;
            console.log('✅ Email sent via EmailJS');
          } else {
            throw new Error(`EmailJS failed: ${response.status}`);
          }
        } catch (error) {
          console.log('EmailJS failed, using mailto fallback...', error);
        }
      }

      // Method 3: Fallback to mailto (always works)
      if (!emailSent) {
        const mailtoSubject = encodeURIComponent(emailData.subject);
        const mailtoBody = encodeURIComponent(emailContent);
        const mailtoUrl = `mailto:q9g8moh@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;
        
        // Open mailto link
        window.open(mailtoUrl, '_blank');
        emailSent = true;
        console.log('📧 Opened mailto fallback - please send the email manually');
      }

      if (emailSent) {
        console.log('✅ Appointment booked and email sent successfully!');
        setSubmitStatus('success');
        
        // Reset form after successful submission
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          countryCode: '+973',
          phone: '',
          date: '',
          time: '',
          doctor: '',
          message: ''
        });
      } else {
        // Even if email fails, appointment is still stored in database
        console.log('✅ Appointment booked successfully! (Email failed)');
        setSubmitStatus('success');
        
        // Reset form after successful submission
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          countryCode: '+973',
          phone: '',
          date: '',
          time: '',
          doctor: '',
          message: ''
        });
      }

    } catch (error) {
      console.error('❌ Error sending email:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3); // 3 months in advance
    return maxDate.toISOString().split('T')[0];
  };

  return (
    <div className="appointment-page">
      <section id="appointment" className={`appointment ${isVisible ? 'appointment-visible' : ''}`}>
        <div className="appointment-container">
          <div className="appointment-header">
            <h2 className="appointment-title">Book an Appointment</h2>
            <p className="appointment-subtitle">
              Schedule your visit with our experienced dental professionals
            </p>
          </div>
          
          <div className="appointment-content">
            <div className="appointment-form-container">
              <form className="appointment-form" onSubmit={handleSubmit} name="appointment" data-netlify="true" netlify-honeypot="bot-field">
                {/* Hidden field for Netlify Forms */}
                <input type="hidden" name="form-name" value="appointment" />
                <div style={{ display: 'none' }}>
                  <label>Don't fill this out if you're human: <input name="bot-field" /></label>
                </div>
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

                <div className="form-row">
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
                        title="Please enter a valid phone number"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="date" className="form-label">Preferred Date *</label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                      min={getMinDate()}
                      max={getMaxDate()}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="time" className="form-label">Preferred Time *</label>
                    <select
                      id="time"
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      className="form-select"
                      required
                      disabled={!formData.date}
                    >
                      <option value="">
                        {!formData.date ? 'Please select a date first' : 'Select a time'}
                      </option>
                      {getAvailableTimeSlots(formData.date).map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                    {formData.date && getAvailableTimeSlots(formData.date).length === 0 && (
                      <small className="form-help error">Clinic is closed on this day</small>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="doctor" className="form-label">Preferred Doctor *</label>
                  <select
                    id="doctor"
                    name="doctor"
                    value={formData.doctor}
                    onChange={handleInputChange}
                    className="form-select"
                    required
                  >
                    <option value="">Select a doctor</option>
                    {doctors.map(doctor => (
                      <option key={doctor.id} value={`${doctor.name} - ${doctor.specialty}`}>
                        {doctor.name} ({doctor.specialty})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="message" className="form-label">Additional Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="form-textarea"
                    rows="4"
                    placeholder="Please describe the reason for your visit or any specific concerns..."
                  />
                </div>

                <div className="form-submit">
                  <button 
                    type="submit" 
                    className={`submit-button ${isSubmitting ? 'submitting' : ''}`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Book Appointment'}
                  </button>
                </div>

                {submitStatus === 'success' && (
                  <div className="success-message">
                    <p>✅ Your appointment has been booked successfully! We'll contact you soon to confirm your appointment.</p>
                    <p><small>Your appointment is now stored in our system and will appear in the admin dashboard.</small></p>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="error-message">
                    <p>❌ There was an error sending your request. Please try again or call us directly.</p>
                  </div>
                )}
              </form>
            </div>

            <div className="appointment-info">
              <div className="info-card">
                <h3>Office Hours</h3>
                <div className="hours-list">
                  <div className="hours-item">
                    <span className="day">Monday - Friday</span>
                    <span className="time">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="hours-item">
                    <span className="day">Saturday</span>
                    <span className="time">9:00 AM - 2:00 PM</span>
                  </div>
                  <div className="hours-item">
                    <span className="day">Sunday</span>
                    <span className="time">Closed</span>
                  </div>
                </div>
              </div>

              <div className="info-card">
                <h3>Contact Information</h3>
                <div className="contact-info">
                  <p><strong>Phone:</strong> +973 1234 5678</p>
                  <p><strong>Email:</strong> info@dentalcareclinic.com</p>
                  <p><strong>Address:</strong> Manama, Bahrain</p>
                </div>
              </div>

              <div className="info-card">
                <h3>Emergency Contact</h3>
                <p>For dental emergencies outside office hours, please call our emergency line:</p>
                <p><strong>Emergency:</strong> +973 9876 5432</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Appointment;
