import React, { useState } from 'react';
import { X, ShieldAlert, MapPin, Send, Navigation, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { submitRescueReport } from '../api/client';

export default function RescueModal({ isOpen, onClose, onReportSuccess }) {
  const [formData, setFormData] = useState({
    animalType: 'Dog',
    breed: '',
    title: '',
    description: '',
    locationName: '',
    lat: 40.758,
    lng: -73.9855,
    severity: 'Medium',
    reporterName: '',
    reporterEmail: '',
    contactPhone: '',
    imageUrl: ''
  });
  
  const [imagePreview, setImagePreview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [successInfo, setSuccessInfo] = useState('');

  if (!isOpen) return null;

  const handleAutoLocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setFormData(prev => ({
            ...prev,
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            locationName: prev.locationName || `GPS: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`
          }));
          alert('GPS coordinates auto-detected!');
        },
        () => alert('Could not fetch location automatically. Please enter landmark manually.')
      );
    }
  };

  // Real File Upload Handler (converts to Base64 data URL)
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setFormError('Image file is too large. Please select a photo under 5MB.');
        return;
      }
      setFormError('');
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({ ...prev, imageUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccessInfo('');

    if (!formData.title.trim() || !formData.locationName.trim() || !formData.description.trim()) {
      setFormError('Please fill in the title, location landmark, and injury description.');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        ...formData,
        imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=600&q=80'
      };

      const result = await submitRescueReport(payload);
      onReportSuccess(result.rescue);
      
      setSuccessInfo(`🌸 Report #${result.rescue.id} logged in Database & emailed to admin!`);
      setTimeout(() => {
        setSuccessInfo('');
        onClose();
      }, 2500);
    } catch (err) {
      setFormError('Error submitting report: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: '#FFCAD4', padding: '10px', borderRadius: '14px' }}>
              <ShieldAlert size={22} color="#7A3B2E" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.4rem', margin: 0 }}>Report Injured Animal</h3>
              <p style={{ fontSize: '0.85rem', color: '#5C677D', margin: 0 }}>
                Emergency stray rescue dispatch
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{ border: 'none', background: '#FAF6F0', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <X size={20} color="#5C677D" />
          </button>
        </div>

        {/* Error Alert */}
        {formError && (
          <div style={{ background: '#FFE5D9', border: '1px solid #FFCAD4', color: '#7A3B2E', padding: '10px 14px', borderRadius: '14px', marginBottom: '14px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={16} color="#E07A5F" />
            <span>{formError}</span>
          </div>
        )}

        {/* Success Alert */}
        {successInfo ? (
          <div style={{ background: '#D8F3DC', color: '#1B4332', padding: '24px', borderRadius: '20px', textAlign: 'center', margin: '20px 0' }}>
            <CheckCircle size={48} color="#52B788" style={{ margin: '0 auto 12px auto' }} />
            <h4 style={{ fontSize: '1.25rem', marginBottom: '6px' }}>Report Dispatched Successfully!</h4>
            <p style={{ fontSize: '0.92rem', margin: 0 }}>{successInfo}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Animal Type *</label>
                <select
                  value={formData.animalType}
                  onChange={e => setFormData({ ...formData, animalType: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '12px', border: '1px solid #CCC' }}
                >
                  <option value="Dog">Dog 🐶</option>
                  <option value="Cat">Cat 🐱</option>
                  <option value="Bird">Bird 🐦</option>
                  <option value="Cow">Cow / Cattle 🐮</option>
                  <option value="Rabbit">Rabbit 🐰</option>
                  <option value="Other">Other Animal</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Injury Severity *</label>
                <select
                  value={formData.severity}
                  onChange={e => setFormData({ ...formData, severity: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '12px', border: '1px solid #CCC' }}
                >
                  <option value="High">🚨 High (Bleeding / Fracture)</option>
                  <option value="Medium">⚠️ Moderate (Limping / Weak)</option>
                  <option value="Low">💚 Low (Minor scratch / Sick)</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Report Title / Summary *</label>
              <input
                type="text"
                required
                placeholder="e.g. Injured stray puppy limping near bus stop"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid #CCC' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>Location Address / Landmark *</label>
                <button type="button" onClick={handleAutoLocate} style={{ border: 'none', background: 'none', color: '#E07A5F', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Navigation size={12} /> Auto-Detect GPS
                </button>
              </div>
              <input
                type="text"
                required
                placeholder="e.g. Corner of 5th Ave & 42nd St near Bakery"
                value={formData.locationName}
                onChange={e => setFormData({ ...formData, locationName: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid #CCC' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Complete Description of Injury & Symptoms *</label>
              <textarea
                rows={2}
                required
                placeholder="Describe condition, behavior, surroundings..."
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid #CCC' }}
              />
            </div>

            {/* Photo Upload with Instant Preview */}
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Upload Animal Photo / Evidence</label>
              
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{
                  background: '#FAF6F0',
                  border: '1px dashed #FFCAD4',
                  padding: '8px 16px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#E07A5F'
                }}>
                  <Upload size={16} /> Choose Photo File
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />
                </label>
                <span style={{ fontSize: '0.8rem', color: '#8D99AE' }}>or paste image URL</span>
              </div>

              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={formData.imageUrl.startsWith('data:') ? '' : formData.imageUrl}
                onChange={e => {
                  setFormData({ ...formData, imageUrl: e.target.value });
                  setImagePreview(e.target.value);
                }}
                style={{ width: '100%', padding: '8px 14px', borderRadius: '12px', border: '1px solid #CCC', fontSize: '0.85rem' }}
              />

              {imagePreview && (
                <div style={{ marginTop: '8px', position: 'relative', width: '110px', height: '75px', borderRadius: '10px', overflow: 'hidden', border: '2px solid #52B788' }}>
                  <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: 2, right: 2, background: '#52B788', borderRadius: '50%', color: '#FFF', padding: '2px' }}>
                    <CheckCircle size={12} />
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Reporter Name</label>
                <input
                  type="text"
                  placeholder="e.g. Sarah J."
                  value={formData.reporterName}
                  onChange={e => setFormData({ ...formData, reporterName: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid #CCC' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Reporter Contact Phone</label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={formData.contactPhone}
                  onChange={e => setFormData({ ...formData, contactPhone: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid #CCC' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button type="button" onClick={onClose} className="btn-pastel-outline" style={{ flex: 1, justifyContent: 'center' }}>
                Cancel
              </button>
              <button type="submit" className="btn-pastel-primary" disabled={submitting} style={{ flex: 2, justifyContent: 'center' }}>
                <Send size={18} />
                <span>{submitting ? 'Saving & Notifying...' : 'Submit Rescue Report'}</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
