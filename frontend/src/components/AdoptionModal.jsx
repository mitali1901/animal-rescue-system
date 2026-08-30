import React, { useState } from 'react';
import { X, Heart, Send, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { submitAdoptionApplication } from '../api/client';

export default function AdoptionModal({ isOpen, onClose, pet }) {
  const [formData, setFormData] = useState({
    applicantName: '',
    email: '',
    phone: '',
    housingType: 'Apartment with Yard',
    hasOtherPets: 'Yes, 1 cat',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [submittedPetName, setSubmittedPetName] = useState('');

  if (!isOpen || !pet) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSubmitting(true);

    try {
      const response = await submitAdoptionApplication({
        petId: pet.id,
        petName: pet.name,
        applicantName: formData.applicantName,
        email: formData.email,
        phone: formData.phone,
        housingType: formData.housingType,
        hasOtherPets: formData.hasOtherPets,
        message: formData.message
      });

      if (response && response.success !== false) {
        setSubmittedPetName(pet.name);
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 4000);
      } else {
        setErrorMessage(response.message || 'Failed to submit adoption request. Please check your details.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Unable to submit application. Please verify your connection.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: success ? '540px' : '520px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: '#D8F3DC', padding: '10px', borderRadius: '14px' }}>
              <Heart size={22} color="#1B4332" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.4rem', margin: 0 }}>Adopt {pet.name}</h3>
              <p style={{ fontSize: '0.85rem', color: '#5C677D', margin: 0 }}>{pet.breed} • {pet.age}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{ border: 'none', background: '#FAF6F0', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <X size={20} color="#5C677D" />
          </button>
        </div>

        {/* Error Alert Message */}
        {errorMessage && (
          <div style={{
            background: '#FEE2E2',
            border: '2px solid #EF4444',
            color: '#991B1B',
            padding: '12px 16px',
            borderRadius: '16px',
            marginBottom: '16px',
            fontSize: '0.88rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <AlertCircle size={20} color="#DC2626" style={{ flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Website Success Confirmation Message */}
        {success ? (
          <div style={{
            background: 'linear-gradient(135deg, #D8F3DC 0%, #B7E4C7 100%)',
            color: '#1B4332',
            padding: '28px 24px',
            borderRadius: '24px',
            textAlign: 'center',
            border: '2px solid #74C69D',
            boxShadow: '0 8px 24px rgba(82, 183, 136, 0.2)'
          }}>
            <div style={{
              background: '#FFFFFF',
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '14px',
              boxShadow: '0 4px 14px rgba(0,0,0,0.06)'
            }}>
              <CheckCircle2 size={38} color="#2D6A4F" />
            </div>

            <h4 style={{ fontSize: '1.45rem', margin: '0 0 8px 0', fontWeight: 800, color: '#1B4332' }}>
              Application Submitted Successfully! 🐾
            </h4>

            <p style={{ fontSize: '1.05rem', fontWeight: 700, color: '#2D6A4F', margin: '0 0 12px 0' }}>
              Thank you for connecting with PawsCare!
            </p>

            <div style={{ background: 'rgba(255, 255, 255, 0.85)', padding: '16px', borderRadius: '16px', margin: '14px 0', fontSize: '0.92rem', lineHeight: '1.6', color: '#2B2D42' }}>
              <p style={{ margin: '0 0 8px 0' }}>
                We've received your adoption request for <strong>{submittedPetName || pet.name}</strong>.
              </p>
              <p style={{ margin: '0 0 8px 0', fontWeight: 700, color: '#1B4332' }}>
                Our team will review your request and get back to you within 1–2 days with the next steps.
              </p>
              <p style={{ margin: 0, color: '#5C677D' }}>
                We look forward to connecting with you!
              </p>
            </div>

            <div style={{ fontSize: '0.82rem', color: '#2D6A4F', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Sparkles size={14} /> Confirmation email dispatched to admin team
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Your Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Johnson"
                  value={formData.applicantName}
                  onChange={e => setFormData({ ...formData, applicantName: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid #CCC' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid #CCC' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Email Address *</label>
              <input
                type="email"
                required
                placeholder="alex@example.com"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid #CCC' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Housing Type</label>
                <select
                  value={formData.housingType}
                  onChange={e => setFormData({ ...formData, housingType: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '12px', border: '1px solid #CCC' }}
                >
                  <option value="Apartment with Yard">Apartment with Yard</option>
                  <option value="Single Family House">Single Family House</option>
                  <option value="Condo / Townhouse">Condo / Townhouse</option>
                  <option value="Rented Apartment">Rented Apartment</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Do you currently have pets?</label>
                <input
                  type="text"
                  placeholder="e.g. 1 Dog, 0 Cats"
                  value={formData.hasOtherPets}
                  onChange={e => setFormData({ ...formData, hasOtherPets: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid #CCC' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Why would you be a great match for {pet.name}?</label>
              <textarea
                rows={3}
                placeholder="Tell us a little about your home life, schedule, and experience with pets..."
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid #CCC' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
              <button type="button" onClick={onClose} className="btn-pastel-outline" style={{ flex: 1, justifyContent: 'center' }}>
                Cancel
              </button>
              <button type="submit" className="btn-pastel-mint" disabled={submitting} style={{ flex: 2, justifyContent: 'center' }}>
                <Send size={18} />
                <span>{submitting ? 'Submitting & Sending Email...' : 'Submit Adoption Application'}</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
