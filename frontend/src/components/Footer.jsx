import React from 'react';
import { Heart, PhoneCall, ShieldAlert, MapPin, Mail, Sparkles } from 'lucide-react';

export default function Footer({ onOpenRescueModal }) {
  return (
    <footer style={{
      background: 'linear-gradient(135deg, #FFE5D9 0%, #FAF6F0 50%, #D8F3DC 100%)',
      borderTop: '2px solid rgba(255, 202, 212, 0.4)',
      padding: '48px 0 24px 0',
      marginTop: '60px'
    }}>
      <div className="container">
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '32px', marginBottom: '36px' }}>
          
          {/* Brand Col */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{ background: '#FFCAD4', padding: '10px', borderRadius: '14px', fontSize: '1.4rem' }}>
                🐾
              </div>
              <h3 style={{ fontSize: '1.6rem', margin: 0, color: '#2B2D42' }}>PawsCare</h3>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#5C677D', lineHeight: '1.6' }}>
              Compassionate animal rescue, adoption, and pet healthcare ecosystem powered by interactive location helper APIs.
            </p>
          </div>

          {/* Quick Features */}
          <div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '14px', color: '#2B2D42' }}>Core System Features</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.9rem', color: '#5C677D', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>🩹 Cure Injured Animal Rescue Tracker</li>
              <li>🐾 Pet Adoption & Foster Portal</li>
              <li>🩺 Home Pet Care & Symptom Remedies</li>
              <li>📍 Browser Location API & Helper Map</li>
            </ul>
          </div>

          {/* Emergency Hotline */}
          <div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '14px', color: '#2B2D42' }}>Emergency Lifeline</h4>
            <div style={{ background: '#FFFFFF', padding: '16px', borderRadius: '18px', boxShadow: '0 4px 14px rgba(0,0,0,0.05)', border: '1px solid #FFCAD4' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#E07A5F', fontWeight: 800, fontSize: '1rem', marginBottom: '6px' }}>
                <PhoneCall size={18} /> 24/7 Rescue Dispatch Hotline
              </div>
              <p style={{ fontSize: '1.2rem', fontWeight: 800, color: '#2B2D42', margin: '4px 0' }}>
                +1 (800) 999-PAWS
              </p>
              <p style={{ fontSize: '0.8rem', color: '#8D99AE', margin: 0 }}>
                Available 24 hours a day for critical animal rescue.
              </p>
            </div>
          </div>

        </div>

        <div style={{ borderTop: '1px solid rgba(200,200,200,0.3)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', fontSize: '0.85rem', color: '#5C677D' }}>
          <div>
            © 2026 PawsCare Animal Rescue System. Built with Node.js, React & Location API.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>Made with</span> <Heart size={14} color="#E07A5F" fill="#E07A5F" /> <span>for animal welfare</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
