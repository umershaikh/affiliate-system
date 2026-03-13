import React, { useRef, useState } from 'react';
import ReCAPTCHA from "react-google-recaptcha";
import apiFetch from '../../utils/api';
import './ContactSection.css';

const ContactSection = () => {
  const recaptchaRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '', email: '', subject: '', message: ''
  });
  const [submitStatus, setSubmitStatus] = useState({ message: '', error: false });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus({ message: '', error: false });

    // Get reCAPTCHA token
    const recaptchaToken = recaptchaRef.current?.getValue();
    if (!recaptchaToken) {
      setSubmitStatus({ message: 'Please complete the reCAPTCHA.', error: true });
      return;
    }

    try {
      const response = await apiFetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, recaptchaToken }),
      });
      const data = await response.json();
      setSubmitStatus({ message: data.message || 'Message sent!', error: !data.success });
      if (data.success) {
        setFormData({ name: '', email: '', subject: '', message: '' });
        recaptchaRef.current?.reset();
      }
    } catch (err) {
      setSubmitStatus({ message: 'Server error. Please try again.', error: true });
    }
  };

  return (
    <section className="ct-ui-wrapper">
      <div className="ct-ui-container">
        <div className="ct-ui-flex-grid">
          
          {/* Sidebar Section */}
          <div className="ct-ui-sidebar">
            <div className="ct-ui-info-card">
              <div className="ct-ui-icon-box"><i className="fas fa-map-marker-alt"></i></div>
              <div className="ct-ui-text-box">
                <h4 className="ct-ui-heading">Office Address</h4>
                <p className="ct-ui-desc">Demo World Expo/Demo Enterprise Events</p>
              </div>
            </div>

            <div className="ct-ui-info-card">
              <div className="ct-ui-icon-box"><i className="fas fa-envelope"></i></div>
              <div className="ct-ui-text-box">
                <h4 className="ct-ui-heading">Email Address</h4>
                <p className="ct-ui-desc">demo@gmail.com</p>
              </div>
            </div>

            <div className="ct-ui-info-card">
              <div className="ct-ui-icon-box"><i className="fas fa-phone-alt"></i></div>
              <div className="ct-ui-text-box">
                <h4 className="ct-ui-heading">Phone Number</h4>
                <p className="ct-ui-desc">00123547895</p>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="ct-ui-main-content">
            {submitStatus.message && (
              <div style={{ 
                padding: '10px', 
                marginBottom: '15px', 
                borderRadius: '5px',
                background: submitStatus.error ? '#ffe0e0' : '#e0ffe0',
                color: submitStatus.error ? '#c00' : '#060'
              }}>
                {submitStatus.message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="ct-ui-form">
              <div className="ct-ui-row ct-ui-split">
                <div className="ct-ui-field-group">
                  <input type="text" name="name" value={formData.name} placeholder="Your name" className="ct-ui-input" required onChange={handleChange} />
                </div>
                <div className="ct-ui-field-group">
                  <input type="email" name="email" value={formData.email} placeholder="Enter email address" className="ct-ui-input" required onChange={handleChange} />
                </div>
              </div>

              <div className="ct-ui-row">
                <input type="text" name="subject" value={formData.subject} placeholder="Write your subject" className="ct-ui-input" required onChange={handleChange} />
              </div>

              <div className="ct-ui-row">
                <textarea name="message" value={formData.message} placeholder="Write your message" className="ct-ui-input ct-ui-textarea" required onChange={handleChange}></textarea>
              </div>

              <div className="ct-ui-captcha-container">
                <div className="ct-ui-captcha-scaler">
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                  />
                </div>
              </div>

              <button type="submit" className="ct-ui-submit-btn">Send Message</button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ContactSection;