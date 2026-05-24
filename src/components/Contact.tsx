'use client';
import { useState, useEffect } from 'react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) {
      setForm({ ...form, phone: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.phone.length !== 10) {
      alert('Please enter a valid 10-digit phone number');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setSubmitted(true);
        setForm({ name: '', phone: '', email: '', message: '' });
        setTimeout(() => setSubmitted(false), 5000);
      }
    } catch (error) {
      console.error('Failed to submit:', error);
    }
    setSubmitting(false);
  };

  return (
    <section className="contact-section" id="contact" suppressHydrationWarning>
      <div className="contact-decor">
        <div className="decor-circle decor-circle-1"></div>
        <div className="decor-circle decor-circle-2"></div>
        <div className="decor-dots decor-dots-1"></div>
        <div className="decor-dots decor-dots-2"></div>
      </div>

      <div className="contact-container">
        <div className="contact-info">
          <div className="contact-info-bg">
            <div className="info-bg-pattern"></div>
          </div>

          <div className="contact-badge">
            <span className="badge-icon"><i className="fas fa-headset"></i></span>
            <span>Get In Touch</span>
          </div>

          <h2 className="contact-title">
            Need Help? <span className="highlight">We Are Here for You</span>
          </h2>

          <p className="contact-description">
            Whether you need help choosing the right antivirus plan or have questions about your license, our security experts are ready to assist you.
          </p>

          <div className="contact-stats">
            <div className="stat-item">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Support Available</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">30 min</span>
              <span className="stat-label">Response Time</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">100%</span>
              <span className="stat-label">Satisfaction</span>
            </div>
          </div>

          <div className="contact-details">
            <div className="contact-detail-card">
              <div className="detail-card-icon">
                <i className="fas fa-phone-alt"></i>
              </div>
              <div className="detail-card-content">
                <span className="detail-label">Call Us</span>
                <span className="detail-value">+91 93218 12823</span>
              </div>
            </div>

            <div className="contact-detail-card">
              <div className="detail-card-icon">
                <i className="fas fa-envelope-open-text"></i>
              </div>
              <div className="detail-card-content">
                <span className="detail-label">Email Us</span>
                {mounted ? (
                  <a href="mailto:support@secureguardantivirus.com" className="detail-value">support@secureguardantivirus.com</a>
                ) : (
                  <span className="detail-value">support@secureguardantivirus.com</span>
                )}
              </div>
            </div>

            <div className="contact-detail-card">
              <div className="detail-card-icon">
                <i className="fas fa-clock"></i>
              </div>
              <div className="detail-card-content">
                <span className="detail-label">Working Hours</span>
                <span className="detail-value">Mon - Sun: 24 Hours</span>
              </div>
            </div>
          </div>
        </div>

        <div className="contact-form-wrapper">
          <div className="contact-form-card">
            <div className="form-card-accent"></div>

            <div className="contact-form-header">
              <div className="header-icon">
                <i className="fas fa-paper-plane"></i>
              </div>
              <h3>Send Us a Message</h3>
              <p>Fill in the form below and we will get back to you within 30 minutes.</p>
            </div>

            {submitted ? (
              <div className="contact-success-message">
                <div className="success-animation">
                  <div className="success-circle">
                    <i className="fas fa-check"></i>
                  </div>
                </div>
                <h4>Message Sent Successfully!</h4>
                <p>Thank you for reaching out. Our team will contact you shortly.</p>
                <button onClick={() => setSubmitted(false)} className="reset-btn">
                  <i className="fas fa-plus"></i> Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-input-wrap">
                    <i className="fas fa-user"></i>
                    <input
                      type="text"
                      placeholder="Enter your name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-input-wrap">
                    <i className="fas fa-phone-alt"></i>
                    <input
                      type="tel"
                      placeholder="Enter 10-digit mobile number"
                      value={form.phone}
                      onChange={handlePhoneChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-input-wrap textarea-wrap">
                  <i className="fas fa-envelope"></i>
                  <input
                    type="email"
                    placeholder="Enter email address"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>

                <div className="form-input-wrap textarea-wrap">
                  <i className="fas fa-comment-alt"></i>
                  <textarea
                    rows={5}
                    placeholder="Tell us about your requirements, number of devices, or any questions you have..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                  ></textarea>
                </div>

                <div className="form-footer">
                  <div className="form-trust">
                    <i className="fas fa-shield-alt"></i>
                    <span>Your information is secure & confidential</span>
                  </div>

                  <button type="submit" className="contact-submit-btn" disabled={submitting}>
                    {submitting ? (
                      <>
                        <span className="btn-loader"></span>
                        Sending...
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <i className="fas fa-paper-plane"></i>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
