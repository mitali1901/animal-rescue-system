import React, { useState } from 'react';
import { X, Heart, Send, CheckCircle2 } from 'lucide-react';
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
  const [success, setSuccess] = useState(false);

  if (!isOpen || !pet) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitAdoptionApplication({
        petId: pet.id,
        ...formData
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 3000);
    } catch (err) {
      alert('Error submitting application: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        
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

        {success ? (
          <div style={{ background: '#D8F3DC', color: '#1B4332', padding: '24px', borderRadius: '20px', textAlign: 'center' }}>
            <CheckCircle2 size={48} color="#52B788" style={{ margin: '0 auto 12px auto' }} />
            <h4 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>Application Received! 🎉</h4>
            <p style={{ fontSize: '0.95rem', color: '#1B4332' }}>
              Thank you for opening your heart to adopt <strong>{pet.name}</strong>! Our shelter coordinator will contact you within 24 hours.
            </p>
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
                <span>{submitting ? 'Submitting...' : 'Submit Adoption Application'}</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
