import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Stethoscope, ArrowRight, Sparkles, CheckCircle } from 'lucide-react';

export default function CureAnimalsPage({ onOpenRescueModal }) {
  return (
    <div className="container" style={{ padding: '30px 20px 60px 20px' }}>
      
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #FFE5D9 0%, #FFF1C5 50%, #D8F3DC 100%)',
        borderRadius: '28px',
        padding: '36px 32px',
        marginBottom: '36px',
        border: '2px solid rgba(255,255,255,0.8)',
        boxShadow: '0 8px 30px rgba(255, 202, 212, 0.2)'
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#FFFFFF', padding: '6px 14px', borderRadius: '50px', fontSize: '0.85rem', fontWeight: 700, color: '#E07A5F', marginBottom: '12px' }}>
          <Sparkles size={16} /> Animal Healthcare & Healing Center
        </div>
        <h1 style={{ fontSize: '2.5rem', margin: '0 0 10px 0', color: '#2B2D42', fontWeight: 700 }}>
          Cure Animals 🌸
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#5C677D', maxWidth: '750px', margin: 0, lineHeight: '1.6' }}>
          Choose how you would like to help: report and cure an injured stray animal on the street, or get expert veterinary remedies and consultations for your own pet.
        </p>
      </div>

      {/* The Two Main Dedicated Pathways */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '28px' }}>
        
        {/* Option 1: Cure Injured Animal */}
        <div className="card-pastel" style={{ background: '#FFF0F3', borderColor: '#FFCAD4', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '32px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
              <div style={{ background: '#FFCAD4', width: '56px', height: '56px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldAlert size={30} color="#7A3B2E" />
              </div>
              <div>
                <span className="badge-pastel-peach" style={{ marginBottom: '4px' }}>Stray Emergency SOS</span>
                <h2 style={{ fontSize: '1.6rem', margin: 0 }}>Cure Injured Animal</h2>
              </div>
            </div>

            <p style={{ fontSize: '0.98rem', color: '#5C677D', lineHeight: '1.6', marginBottom: '20px' }}>
              Found an injured stray dog, cat, or bird on the street? Report location, upload injury photos, dispatch nearest volunteer ambulances, and track live recovery status through vet care.
            </p>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', color: '#2B2D42' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={16} color="#52B788" /> GPS Auto-Location & Landmark Pinning
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={16} color="#52B788" /> Live Recovery Status Timeline Tracker
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={16} color="#52B788" /> Emergency Volunteer & Vet Dispatch
              </li>
            </ul>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link to="/rescue" className="btn-pastel-primary" style={{ textDecoration: 'none', flex: 1, justifyContent: 'center' }}>
              <span>Open Cure Injured Animal</span>
              <ArrowRight size={18} />
            </Link>
            <button className="btn-pastel-outline" onClick={onOpenRescueModal}>
              Quick Report
            </button>
          </div>
        </div>

        {/* Option 2: Help My Pet */}
        <div className="card-pastel" style={{ background: '#F3E8FF', borderColor: '#E8DEF8', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '32px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
              <div style={{ background: '#E8DEF8', width: '56px', height: '56px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Stethoscope size={30} color="#4A148C" />
              </div>
              <div>
                <span className="badge-pastel-lilac" style={{ marginBottom: '4px' }}>Personal Pet Healthcare</span>
                <h2 style={{ fontSize: '1.6rem', margin: 0 }}>Help My Pet</h2>
              </div>
            </div>

            <p style={{ fontSize: '0.98rem', color: '#5C677D', lineHeight: '1.6', marginBottom: '20px' }}>
              Is your pet feeling sick or in pain? Access instant veterinary first-aid guides, home remedies for common symptoms, or book a home visit / virtual vet consultation.
            </p>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', color: '#2B2D42' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={16} color="#52B788" /> Searchable Home Remedies by Symptom
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={16} color="#52B788" /> Step-by-Step First Aid Instructions
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={16} color="#52B788" /> Book Certified Home/Online Vet Consult
              </li>
            </ul>
          </div>

          <Link to="/petcare" className="btn-pastel-lilac" style={{ textDecoration: 'none', width: '100%', justifyContent: 'center' }}>
            <span>Open Help My Pet</span>
            <ArrowRight size={18} />
          </Link>
        </div>

      </div>

    </div>
  );
}
