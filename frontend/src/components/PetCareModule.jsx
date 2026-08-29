import React, { useState } from 'react';
import { Stethoscope, Search, AlertCircle, BookOpen, Send, CheckCircle2, User, Phone, Calendar } from 'lucide-react';
import { submitConsultationRequest } from '../api/client';

export default function PetCareModule({ guides }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showConsultForm, setShowConsultForm] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    petOwnerName: '',
    petName: '',
    animalType: 'Dog',
    symptomDescription: '',
    preferredTime: 'As soon as possible',
    phone: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const categories = ['All', 'First Aid', 'Emergency', 'General Remedy', 'Orphan Care'];

  const filteredGuides = guides.filter(g => {
    const matchCat = categoryFilter === 'All' || g.category.toLowerCase() === categoryFilter.toLowerCase();
    const matchQuery = !searchQuery ||
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.symptoms.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchQuery;
  });

  const handleConsultSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMsg('');
    try {
      const res = await submitConsultationRequest(formData);
      setSuccessMsg(res.message);
      setFormData({
        petOwnerName: '',
        petName: '',
        animalType: 'Dog',
        symptomDescription: '',
        preferredTime: 'As soon as possible',
        phone: ''
      });
      setTimeout(() => setShowConsultForm(false), 3000);
    } catch (err) {
      alert('Error submitting request: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section style={{ padding: '20px 0 40px 0' }}>
      <div className="container">
        
        {/* Module Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge-pastel-lilac">🩺 Pet Healthcare & Cure Hub</span>
              <span style={{ fontSize: '0.85rem', color: '#5C677D' }}>Home Pet Remedies & Vet Consult</span>
            </div>
            <h2 style={{ fontSize: '2rem', marginTop: '6px', margin: 0 }}>Help Cure Your Pets at Home</h2>
            <p style={{ color: '#5C677D', fontSize: '0.95rem' }}>
              Instant remedies for common pet issues or request a certified online/home vet visit to cure your pet.
            </p>
          </div>

          <button className="btn-pastel-lilac" onClick={() => setShowConsultForm(!showConsultForm)}>
            <Stethoscope size={20} />
            <span>{showConsultForm ? 'Close Vet Request' : 'Ask Vet / Request Consultation'}</span>
          </button>
        </div>

        {/* Vet Consultation Request Form Banner */}
        {showConsultForm && (
          <div className="card-pastel" style={{ background: '#F3E8FF', borderColor: '#E8DEF8', marginBottom: '32px' }}>
            <h3 style={{ fontSize: '1.4rem', color: '#3B1C54', marginBottom: '8px' }}>🩺 Request Pet Cure Consultation</h3>
            <p style={{ fontSize: '0.9rem', color: '#5C677D', marginBottom: '20px' }}>
              Fill out your pet's symptoms and our veterinary partner will get back to you with prescription advice or home visit guidance.
            </p>

            {successMsg ? (
              <div style={{ background: '#D8F3DC', color: '#1B4332', padding: '16px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={24} color="#52B788" />
                <strong>{successMsg}</strong>
              </div>
            ) : (
              <form onSubmit={handleConsultSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maria Garcia"
                    value={formData.petOwnerName}
                    onChange={e => setFormData({ ...formData, petOwnerName: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid #CCC' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Pet Name & Species</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Max (Dog - Golden Retriever)"
                    value={formData.petName}
                    onChange={e => setFormData({ ...formData, petName: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid #CCC' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid #CCC' }}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Describe Pet Symptoms / Injury</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe what's wrong with your pet (e.g., eye watery, not eating, limping left leg)..."
                    value={formData.symptomDescription}
                    onChange={e => setFormData({ ...formData, symptomDescription: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid #CCC' }}
                  />
                </div>

                <button type="submit" className="btn-pastel-lilac" disabled={submitting} style={{ gridColumn: '1 / -1', justifyContent: 'center' }}>
                  <Send size={18} />
                  <span>{submitting ? 'Submitting...' : 'Submit Vet Cure Request'}</span>
                </button>
              </form>
            )}
          </div>
        )}

        {/* Search & Category Filter */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '24px', alignItems: 'center' }}>
          
          <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
            <Search size={18} color="#8D99AE" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search symptoms (e.g. limping, eye infection, dehydration)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px 12px 42px',
                borderRadius: '30px',
                border: '1px solid #E0E0E0',
                background: '#FFFFFF',
                fontSize: '0.95rem',
                outline: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                style={{
                  border: 'none',
                  background: categoryFilter === cat ? '#E8DEF8' : '#FFFFFF',
                  color: categoryFilter === cat ? '#3B1C54' : '#5C677D',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontWeight: categoryFilter === cat ? 700 : 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>

        {/* Pet Care Guides Grid */}
        <div className="grid-cards">
          {filteredGuides.map(guide => (
            <div key={guide.id} className="card-pastel" style={{ background: '#FFFFFF' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span className="badge-pastel-lilac">{guide.category}</span>
                <span style={{ fontSize: '0.8rem', color: '#5C677D', fontWeight: 600 }}>For: {guide.targetAnimal}</span>
              </div>

              <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>{guide.title}</h3>

              {/* Symptoms Pills */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#8D99AE', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Target Symptoms:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {guide.symptoms.map((sym, idx) => (
                    <span key={idx} style={{ background: '#FFE5D9', color: '#7A3B2E', fontSize: '0.78rem', padding: '3px 10px', borderRadius: '12px', fontWeight: 600 }}>
                      • {sym}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Steps */}
              <div style={{ background: '#FAF6F0', padding: '14px', borderRadius: '14px', marginBottom: '16px' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#2B2D42', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <BookOpen size={16} color="#74C69D" /> Step-by-Step Cure Instructions:
                </div>
                <ol style={{ paddingLeft: '18px', margin: 0, fontSize: '0.88rem', color: '#5C677D' }}>
                  {guide.steps.map((step, idx) => (
                    <li key={idx} style={{ marginBottom: '4px' }}>{step}</li>
                  ))}
                </ol>
              </div>

              {/* Danger / Warning Sign */}
              {guide.warningSign && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', background: '#FFF1C5', padding: '10px 12px', borderRadius: '12px', fontSize: '0.82rem', color: '#5C4000' }}>
                  <AlertCircle size={16} color="#E07A5F" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <strong>Vet Alert Sign:</strong> {guide.warningSign}
                  </div>
                </div>
              )}

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
