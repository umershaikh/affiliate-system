import React, { useState } from 'react';
import './CreateAccounts.css';

const CreateAccounts = () => {
  const [formData, setFormData] = useState({
    pin: '',
    username: '',
    email: '',
    accountNumber: '',
    paymentMethod: '',
    accountTitle: '',
    underUserId: '',
    position: 'Right',
    agreeTerms: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
  };

  return (
    <div className="ca-unique-wrapper">
      {/* Top Header/Breadcrumb */}
      <div className="ca-top-nav">
        <div className="ca-breadcrumb">
          <span className="ca-home-icon">🏠</span> / Join a User
        </div>
        <h2 className="ca-nav-title">Join a User</h2>
      </div>

      <div className="ca-main-content">
        <div className="ca-form-card">
          <h1 className="ca-card-heading">Create Account</h1>
          
          <p className="ca-urdu-instruction">
            تمام ڈیٹا تسلی سے لکھ کر چیک کریں اور پھر کریٹ اکاؤنٹ پر کلک کریں۔ اکاؤنٹ بننے کے بعد ڈیٹا تبدیل نہیں ہوتا!
          </p>

          <form onSubmit={handleSubmit} className="ca-registration-form">
            
            {/* Pin/Token Field */}
            <div className="ca-input-field">
              <label>Pin/Token</label>
              <div className="ca-input-inner">
                <span className="ca-icon">🔑</span>
                <input 
                  type="text" 
                  name="pin" 
                  placeholder="یہاں نئے صارف کا پن کوڈ لکھیں" 
                  onChange={handleInputChange} 
                />
              </div>
            </div>

            {/* Username Field */}
            <div className="ca-input-field">
              <label>Username</label>
              <div className="ca-input-inner">
                <span className="ca-icon">👤</span>
                <input 
                  type="text" 
                  name="username" 
                  placeholder="یہاں نام لکھیں" 
                  onChange={handleInputChange} 
                />
              </div>
            </div>

            {/* Gmail Field */}
            <div className="ca-input-field">
              <label>New user Gmail</label>
              <div className="ca-input-inner">
                <span className="ca-icon">📧</span>
                <input 
                  type="email" 
                  name="email" 
                  placeholder="یہاں نئے صارف کی جی میل لکھیں" 
                  onChange={handleInputChange} 
                />
              </div>
            </div>

            {/* Account Number Field */}
            <div className="ca-input-field">
              <label>Account Number</label>
              <div className="ca-input-inner">
                <span className="ca-icon">🏦</span>
                <input 
                  type="text" 
                  name="accountNumber" 
                  placeholder="نئے صارف کا اکاؤنٹ نمبر لکھیں" 
                  onChange={handleInputChange} 
                />
              </div>
            </div>

            {/* Payment Method Select */}
            <div className="ca-input-field no-label">
              <select name="paymentMethod" onChange={handleInputChange} className="ca-select-box">
                <option value="">Payment Method</option>
                <option value="easyPaisa">EasyPaisa</option>
                <option value="jazzCash">JazzCash</option>
                <option value="bank">Bank Transfer</option>
              </select>
            </div>

            {/* Account Title Field */}
            <div className="ca-input-field">
              <label>Account Title</label>
              <div className="ca-input-inner">
                <span className="ca-icon">💼</span>
                <input 
                  type="text" 
                  name="accountTitle" 
                  placeholder="یہاں اپنے اکاؤنٹ کا نام لکھیں" 
                  onChange={handleInputChange} 
                />
              </div>
            </div>

            {/* Under User ID Field */}
            <div className="ca-input-field">
              <label>Under User ID</label>
              <div className="ca-input-inner">
                <span className="ca-icon">👤</span>
                <input 
                  type="text" 
                  name="underUserId" 
                  placeholder="جس کے نیچے اکاؤنٹ لگانا ہے، اس کی جی میل لکھیں" 
                  onChange={handleInputChange} 
                />
              </div>
            </div>

            {/* Radio Buttons */}
            <div className="ca-radio-row">
              <label className="ca-radio-container">
                <input type="radio" name="position" value="Left" onChange={handleInputChange} />
                <span className="ca-radio-mark"></span> Left
              </label>
              <label className="ca-radio-container">
                <input type="radio" name="position" value="Right" defaultChecked onChange={handleInputChange} />
                <span className="ca-radio-mark"></span> Right
              </label>
            </div>

            {/* Terms Checkbox */}
            <div className="ca-checkbox-row">
              <input type="checkbox" id="terms" name="agreeTerms" onChange={handleInputChange} />
              <label htmlFor="terms">I accept the Terms and Conditions</label>
            </div>

            {/* Submit Button */}
            <button type="submit" className="ca-submit-btn">
              CREATE ACCOUNT
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateAccounts;