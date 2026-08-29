import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Stethoscope, MapPin, ShieldAlert, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function HeroSection({ onOpenRescueModal }) {
  return (
    <section style={{ padding: '30px 0 20px 0' }}>
      <div className="container">
        
        {/* Banner Box */}
        <div style={{
          background: 'linear-gradient(135deg, #FFE5D9 0%, #FFF1C5 40%, #D8F3DC 100%)',
          borderRadius: '32px',
          padding: '40px 36px',
          boxShadow: '0 12px 36px rgba(255, 202, 212, 0.25)',
          border: '2px solid rgba(255, 255, 255, 0.8)',
          position: 'relative',
          overflow: 'hidden'
        }}>

          {/* Soft background decorative circles */}
          <div style={{
            position: 'absolute',
            top: '-20px',
            right: '-20px',
            width: '220px',
            height: '220px',
            background: 'rgba(255, 255, 255, 0.35)',
            borderRadius: '50%',
            pointerEvents: 'none'
          }} />

          <div style={{ maxWidth: '820px', position: 'relative', zIndex: 2 }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#FFFFFF',
              padding: '6px 16px',
              borderRadius: '50px',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: '#E07A5F',
              marginBottom: '16px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
            }}>
              <Sparkles size={16} /> Every Paw Deserves Love & Healing
            </div>

            <h1 style={{ fontSize: '2.8rem', lineHeight: '1.25', color: '#2B2D42', marginBottom: '14px', fontWeight: 700 }}>
              Rescue Injured Strays, Adopt Pets & Heal Companions 🌸
            </h1>

            <p style={{ fontSize: '1.15rem', color: '#5C677D', marginBottom: '28px', lineHeight: '1.5', fontWeight: 500 }}>
              Fast emergency rescue dispatch, loving pet adoptions, and 24/7 care guides at your fingertips.
            </p>

            {/* Primary Action Buttons */}
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <Link to="/adopt" className="btn-pastel-mint" style={{ textDecoration: 'none' }}>
                <Heart size={20} />
                <span>Meet Our Pets</span>
              </Link>

              <Link to="/cure-animals" className="btn-pastel-lilac" style={{ textDecoration: 'none' }}>
                <Stethoscope size={20} />
                <span>Cure Animals</span>
              </Link>

              <button className="btn-pastel-primary" onClick={onOpenRescueModal}>
                <ShieldAlert size={20} />
                <span>Report Injured Animal</span>
              </button>
            </div>
          </div>

        </div>

        {/* Impact Statistics Section inspired by reference design */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginTop: '24px'
        }}>
          <div className="card-pastel" style={{ background: '#FFFFFF', textAlign: 'center', padding: '20px' }}>
            <h3 style={{ fontSize: '2.2rem', color: '#E07A5F', margin: 0, fontWeight: 800 }}>1,200+</h3>
            <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#2B2D42', margin: '4px 0' }}>Injured Animals Rescued</p>
            <p style={{ fontSize: '0.78rem', color: '#8D99AE', margin: 0 }}>Provided emergency vet care & ambulance transport</p>
          </div>

          <div className="card-pastel" style={{ background: '#FFFFFF', textAlign: 'center', padding: '20px' }}>
            <h3 style={{ fontSize: '2.2rem', color: '#52B788', margin: 0, fontWeight: 800 }}>980+</h3>
            <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#2B2D42', margin: '4px 0' }}>Adoptions Completed</p>
            <p style={{ fontSize: '0.78rem', color: '#8D99AE', margin: 0 }}>Found loving forever families & warm homes</p>
          </div>

          <div className="card-pastel" style={{ background: '#FFFFFF', textAlign: 'center', padding: '20px' }}>
            <h3 style={{ fontSize: '2.2rem', color: '#9D4EDD', margin: 0, fontWeight: 800 }}>20+</h3>
            <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#2B2D42', margin: '4px 0' }}>Pets Ready for Adoption</p>
            <p style={{ fontSize: '0.78rem', color: '#8D99AE', margin: 0 }}>Vaccinated, health-checked & waiting for you</p>
          </div>

          <div className="card-pastel" style={{ background: '#FFFFFF', textAlign: 'center', padding: '20px' }}>
            <h3 style={{ fontSize: '2.2rem', color: '#3A86FF', margin: 0, fontWeight: 800 }}>24/7</h3>
            <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#2B2D42', margin: '4px 0' }}>Helper Location API</p>
            <p style={{ fontSize: '0.78rem', color: '#8D99AE', margin: 0 }}>Instant nearby vet & rescue volunteer locator</p>
          </div>
        </div>

      </div>
    </section>
  );
}
