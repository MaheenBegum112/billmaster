import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { contactApi } from '../services/api';
import { useToast } from '../context/ToastContext';

const ContactPage = () => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Name is required';
    if (!formData.email.trim()) {
      errs.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please provide a valid email address';
    }
    if (!formData.subject.trim()) errs.subject = 'Subject is required';
    if (!formData.message.trim()) {
      errs.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      errs.message = 'Message must be at least 10 characters';
    }
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (serverError) setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setServerError('');

    try {
      const response = await contactApi.submit(formData);
      setSubmitted(true);
      showToast(response.data?.message || 'Message sent successfully!', 'success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit contact message. Please try again.';
      setServerError(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '4rem 2rem 5rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--slate-900)', letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
          Contact BillMaster Support
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--slate-600)', maxWidth: '600px', margin: '0 auto' }}>
          Have inquiries regarding deployment, custom POS integrations, or AI settings? Our engineering team is here to assist.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '3rem',
        alignItems: 'start'
      }}>
        {/* Contact Info Card */}
        <div style={{
          backgroundColor: '#ffffff',
          padding: '2.5rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--slate-900)', marginBottom: '1.5rem' }}>
            Store Headquarters
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--primary-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)',
                flexShrink: 0
              }}>
                <MapPin size={20} />
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.9rem', color: 'var(--slate-800)' }}>Location</strong>
                <span style={{ fontSize: '0.875rem', color: 'var(--slate-600)', lineHeight: 1.5 }}>
                  100 Market Boulevard, Metro Retail Park<br />Suite 400, NY 10001
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#ecfdf5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--success)',
                flexShrink: 0
              }}>
                <Phone size={20} />
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.9rem', color: 'var(--slate-800)' }}>Direct Helpline</strong>
                <span style={{ fontSize: '0.875rem', color: 'var(--slate-600)' }}>
                  +1 (800) 555-BILL &bull; Mon-Sat (8am - 10pm)
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#eff6ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#1e40af',
                flexShrink: 0
              }}>
                <Mail size={20} />
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.9rem', color: 'var(--slate-800)' }}>Email Inquiries</strong>
                <span style={{ fontSize: '0.875rem', color: 'var(--slate-600)' }}>
                  support@billmaster.com
                </span>
              </div>
            </div>
          </div>

          <div style={{
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--slate-50)',
            border: '1px solid var(--border-color)',
            fontSize: '0.825rem',
            color: 'var(--slate-600)',
            lineHeight: 1.5
          }}>
            <strong>Direct MySQL Persistence:</strong> Submissions through this form are validated by Spring Boot and saved into the <code>contact_messages</code> database table.
          </div>
        </div>

        {/* Contact Form */}
        <div style={{
          backgroundColor: '#ffffff',
          padding: '2.5rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: '#ecfdf5',
                color: 'var(--success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem'
              }}>
                <CheckCircle2 size={32} />
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '0.5rem' }}>
                Message Sent Successfully!
              </h3>
              <p style={{ color: 'var(--slate-600)', fontSize: '0.925rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                Your message has been stored in MySQL. Our supermarket support desk will review it and reply via email.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                style={{
                  padding: '0.6rem 1.5rem',
                  backgroundColor: 'var(--primary)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--slate-900)', marginBottom: '1.5rem' }}>
                Send Us a Message
              </h3>

              {serverError && (
                <div style={{
                  padding: '0.85rem 1rem',
                  backgroundColor: 'var(--danger-bg)',
                  border: '1px solid var(--danger-border)',
                  color: 'var(--danger)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.875rem',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <AlertCircle size={18} />
                  <span>{serverError}</span>
                </div>
              )}

              {/* Name Field */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '0.4rem' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Robert Smith"
                  style={{
                    width: '100%',
                    padding: '0.7rem 0.9rem',
                    borderRadius: 'var(--radius-md)',
                    border: `1px solid ${errors.name ? 'var(--danger)' : 'var(--border-color)'}`,
                    fontSize: '0.9rem',
                    outline: 'none',
                    transition: 'border-color var(--transition-fast)'
                  }}
                />
                {errors.name && (
                  <span style={{ fontSize: '0.78rem', color: 'var(--danger)', display: 'block', marginTop: '0.25rem' }}>
                    {errors.name}
                  </span>
                )}
              </div>

              {/* Email Field */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '0.4rem' }}>
                  Work Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="robert@supermarket.com"
                  style={{
                    width: '100%',
                    padding: '0.7rem 0.9rem',
                    borderRadius: 'var(--radius-md)',
                    border: `1px solid ${errors.email ? 'var(--danger)' : 'var(--border-color)'}`,
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
                {errors.email && (
                  <span style={{ fontSize: '0.78rem', color: 'var(--danger)', display: 'block', marginTop: '0.25rem' }}>
                    {errors.email}
                  </span>
                )}
              </div>

              {/* Subject Field */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '0.4rem' }}>
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="e.g. POS Hardware Integration Inquiry"
                  style={{
                    width: '100%',
                    padding: '0.7rem 0.9rem',
                    borderRadius: 'var(--radius-md)',
                    border: `1px solid ${errors.subject ? 'var(--danger)' : 'var(--border-color)'}`,
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
                {errors.subject && (
                  <span style={{ fontSize: '0.78rem', color: 'var(--danger)', display: 'block', marginTop: '0.25rem' }}>
                    {errors.subject}
                  </span>
                )}
              </div>

              {/* Message Field */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '0.4rem' }}>
                  Message *
                </label>
                <textarea
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="How can we assist your supermarket operations?"
                  style={{
                    width: '100%',
                    padding: '0.7rem 0.9rem',
                    borderRadius: 'var(--radius-md)',
                    border: `1px solid ${errors.message ? 'var(--danger)' : 'var(--border-color)'}`,
                    fontSize: '0.9rem',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                />
                {errors.message && (
                  <span style={{ fontSize: '0.78rem', color: 'var(--danger)', display: 'block', marginTop: '0.25rem' }}>
                    {errors.message}
                  </span>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  backgroundColor: 'var(--primary)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.75 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                    <span>Submitting Message...</span>
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    <span>Send Message to Database</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
