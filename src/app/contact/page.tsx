'use client';
import CloseButton from '@/components/CloseButton';
import { useState } from 'react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(false);

    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setSubmitted(true);
        setForm({ name: '', phone: '', email: '', message: '' });
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    }
    setSubmitting(false);
  };

  return (
    <div className="contact-page">
      <div className="contact-page-hero">
        <CloseButton href="/" />
        <h1>Contact <span>Us</span></h1>
        <p>Get in touch with our security experts. We are available 24/7 to help you.</p>
      </div>

      <div className="contact-page-layout">
        <div className="contact-page-left">
          <div className="contact-page-info">
            <div className="contact-info-item">
              <div className="contact-info-icon">
                <i className="fas fa-phone"></i>
              </div>
              <div>
                <h4>Call Us</h4>
                <p><a href="tel:+919321812823">+91 93218 12823</a></p>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="contact-info-icon">
                <i className="fas fa-envelope"></i>
              </div>
              <div>
                <h4>Email Us</h4>
                <p><a href="mailto:support@secureguardantivirus.com">support@secureguardantivirus.com</a></p>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="contact-info-icon">
                <i className="fas fa-clock"></i>
              </div>
              <div>
                <h4>Working Hours</h4>
                <p>Mon - Sun: 24 Hours</p>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="contact-info-icon">
                <i className="fas fa-shield-alt"></i>
              </div>
              <div>
                <h4>License Support</h4>
                <p>Instant key delivery via email</p>
              </div>
            </div>
          </div>
        </div>

        <div className="contact-page-right">
          {submitted ? (
            <div className="contact-success">
              <div className="contact-success-icon">
                <svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="26" cy="26" r="25" stroke="var(--primary-color)" strokeWidth="2"/>
                  <path d="M14 27L22 35L38 19" stroke="var(--primary-color)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2>Message Sent!</h2>
              <p>Thank you for reaching out. Our team will contact you within 30 minutes.</p>
              <button className="btn" onClick={() => setSubmitted(false)}>
                Send Another Message
              </button>
            </div>
          ) : (
            <div className="contact-page-form-wrap">
              <h2>Get in Touch</h2>
              <p className="contact-form-subtitle">Fill out the form below and we will get back to you shortly.</p>

              <form className="contact-page-form" onSubmit={handleSubmit}>
                <div className="cpf-row">
                  <div className="cpf-field">
                    <label>Your Name</label>
                    <input
                      type="text"
                      className="cpf-input"
                      placeholder="e.g. Rahul Sharma"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="cpf-field">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      className="cpf-input"
                      placeholder="e.g. +91 98765 43210"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="cpf-field">
                  <label>Email Address</label>
                  <input
                    type="email"
                    className="cpf-input"
                    placeholder="e.g. rahul@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>

                <div className="cpf-field">
                  <label>Your Message</label>
                  <textarea
                    className="cpf-textarea"
                    placeholder="Tell us about your requirements, number of devices, or any questions about our antivirus plans..."
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                  />
                </div>

                {error && (
                  <div className="cpf-error">
                    <i className="fas fa-exclamation-circle"></i>
                    Something went wrong. Please try again or contact us directly.
                  </div>
                )}

                <button type="submit" className="cpf-submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <span className="cpf-spinner"></span>
                      Sending...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane"></i>
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
