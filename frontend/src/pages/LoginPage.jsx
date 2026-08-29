import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '30px 16px',
      background: '#FAF6F0'
    }}>
      <div style={{
        maxWidth: '460px',
        width: '100%',
        background: '#FFFFFF',
        borderRadius: '28px',
        padding: '36px 32px',
        boxShadow: '0 12px 30px rgba(0,0,0,0.06)',
        border: '2px solid #FFCAD4',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🐾</div>
        <h2 style={{ fontSize: '1.5rem', margin: '0 0 8px 0', color: '#2B2D42' }}>Authentication</h2>
        <p style={{ fontSize: '0.9rem', color: '#5C677D', marginBottom: '24px' }}>
          Authentication system will be configured separately. All animal rescue features are currently directly accessible.
        </p>
        <Link to="/" className="btn-pastel-primary" style={{ textDecoration: 'none', justifyContent: 'center' }}>
          <ArrowLeft size={16} /> Back to Website
        </Link>
      </div>
    </div>
  );
}
