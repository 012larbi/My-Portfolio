import React, { useState, useEffect } from 'react';
import { RiMap2Line, RiUser3Line, RiMailLine, RiBook2Line, RiSendPlaneLine } from "react-icons/ri";
import './contact.css';
import emailjs from '@emailjs/browser';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [messageColor, setMessageColor] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Initialiser EmailJS
  useEffect(() => {
    emailjs.init('FeQPe9QTmtkgB8_kK');
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setMessageColor('color-red');
      setFeedbackMessage('Name is required');
      return false;
    }
    
    if (!formData.email.trim()) {
      setMessageColor('color-red');
      setFeedbackMessage('Email is required');
      return false;
    }
    
    // Validation basique d'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setMessageColor('color-red');
      setFeedbackMessage('Please enter a valid email address');
      return false;
    }
    
    if (!formData.subject.trim()) {
      setMessageColor('color-red');
      setFeedbackMessage('Subject is required');
      return false;
    }
    
    if (!formData.message.trim()) {
      setMessageColor('color-red');
      setFeedbackMessage('Message is required');
      return false;
    }
    
    return true;
  };

  const sendEmail = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!validateForm()) {
      setTimeout(() => setFeedbackMessage(''), 3000);
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await emailjs.send(
        'service_57bqbn8',
        'template_z8hx1l7',
        {
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        },
        'FeQPe9QTmtkgB8_kK'
      );
      
      console.log('Email sent successfully!', response.status, response.text);
      
      setMessageColor('color-first');
      setFeedbackMessage('Message sent successfully! ✔');
      
      // Réinitialiser le formulaire
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
      
      // Effacer le message après 5 secondes
      setTimeout(() => {
        setFeedbackMessage('');
      }, 5000);
      
    } catch (error) {
      console.error('Email sending failed:', error);
      setMessageColor('color-red');
      
      if (error.status === 412) {
        setFeedbackMessage('Configuration error. Please check your EmailJS settings.');
      } else if (error.status === 400) {
        setFeedbackMessage('Invalid data. Please check your input.');
      } else if (error.status === 500) {
        setFeedbackMessage('Server error. Please try again later.');
      } else {
        setFeedbackMessage('Failed to send message. Please try again.');
      }
      
      // Effacer le message d'erreur après 5 secondes
      setTimeout(() => {
        setFeedbackMessage('');
      }, 5000);
      
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="contact-section">
      <h2 className="section-title">Contact <span>Me</span></h2>

      <div className="contact-container container grid">
        <div className="contact-content grid">
          <div className="contact-card">
            <span className="contact-icon">
              <RiMap2Line />
            </span>
            <div>
              <h3 className="contact-title">Address</h3>
              <p className="contact-data">Casablanca, Rabat, Tanger, Marrakech</p>
            </div>
          </div>

          <div className="contact-card">
            <span className="contact-icon">
              <RiUser3Line />
            </span>
            <div>
              <h3 className="contact-title">Freelance</h3>
              <p className="contact-data">Available Right now</p>
            </div>
          </div>

          <div className="contact-card">
            <span className="contact-icon">
              <RiMailLine />
            </span>
            <div>
              <h3 className="contact-title">Email</h3>
              <p className="contact-data">Larbi.elad@gmail.com</p>
            </div>
          </div>

          <div className="contact-card">
            <span className="contact-icon">
              <RiBook2Line />
            </span>
            <div>
              <h3 className="contact-title">Phone</h3>
              <p className="contact-data">+212600000000</p>
            </div>
          </div>
        </div>

        <form className="contact-form grid" onSubmit={sendEmail}>
          <div className="contact-form-group grid">
            <div className="contact-form-div">
              <label htmlFor="name" className="contact-form-label">
                Your full Name <b>*</b>
              </label>
              <input 
                type="text" 
                id="name"
                name="name"
                onChange={handleChange}
                value={formData.name}
                className="contact-form-input"
                placeholder="Enter your name"
                disabled={isLoading}
              />
            </div>
            
            <div className="contact-form-div">
              <label htmlFor="email" className="contact-form-label">
                Your Email Address <b>*</b>
              </label>
              <input 
                type="email" 
                id="email"
                name="email"
                onChange={handleChange}
                value={formData.email}
                className="contact-form-input"
                placeholder="Enter your email"
                disabled={isLoading}
              />
            </div>
            
            <div className="contact-form-div full-width">
              <label htmlFor="subject" className="contact-form-label">
                Your Subject <b>*</b>
              </label>
              <input 
                type="text" 
                id="subject"
                name="subject"
                onChange={handleChange}
                value={formData.subject}
                className="contact-form-input"
                placeholder="Enter subject"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="contact-form-div">
            <label htmlFor="message" className="contact-form-label">
              Your Message <b>*</b>
            </label>
            <textarea 
              id="message"
              name="message"
              onChange={handleChange}
              value={formData.message}
              className="contact-form-input contact-form-area"
              placeholder="Enter your message"
              rows="6"
              disabled={isLoading}
            ></textarea>
          </div>

          <div className="contact-button">
            <button 
              type="submit" 
              className="button"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Message'}
              <span className="button-icon">
                <RiSendPlaneLine />
              </span>
            </button>
          </div>

          {feedbackMessage && (
            <div className={`contact-message ${messageColor}`}>
              {feedbackMessage}
            </div>
          )}
        </form>
      </div>
    </section>
  );
};

export default Contact;