import React, { useRef } from 'react';
import ReCAPTCHA from "react-google-recaptcha";
import './ContactSection.css';

const ContactSection = () => {
  const recaptchaRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
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
            <form onSubmit={handleSubmit} className="ct-ui-form">
              <div className="ct-ui-row ct-ui-split">
                <div className="ct-ui-field-group">
                  <input type="text" placeholder="Your name" className="ct-ui-input" required />
                </div>
                <div className="ct-ui-field-group">
                  <input type="email" placeholder="Enter email address" className="ct-ui-input" required />
                </div>
              </div>

              <div className="ct-ui-row">
                <input type="text" placeholder="Write your subject" className="ct-ui-input" required />
              </div>

              <div className="ct-ui-row">
                <textarea placeholder="Write your message" className="ct-ui-input ct-ui-textarea" required></textarea>
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