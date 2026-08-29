import React from 'react';
import { Database, ShieldAlert, Heart, Stethoscope, CheckCircle, Clock, User, Phone, MapPin, Mail, Home } from 'lucide-react';

export default function SavedDataViewer({ rescues = [], applications = [], consultations = [] }) {
  return (
    <div style={{ marginTop: '40px', background: '#FFFFFF', padding: '28px', borderRadius: '24px', border: '2px dashed #FFCAD4', boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ background: '#FFF1C5', padding: '10px', borderRadius: '14px' }}>
            <Database size={22} color="#5C4000" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.4rem', margin: 0, color: '#2B2D42' }}>💾 Live Saved Data in Database</h3>
            <p style={{ fontSize: '0.85rem', color: '#5C677D', margin: 0 }}>
              All records submitted through the forms are saved persistently to the Node.js backend database.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <span className="badge-pastel-peach">🚨 {rescues.length} Rescues</span>
          <span className="badge-pastel-mint">🐾 {applications.length} Applications</span>
          <span className="badge-pastel-lilac">🩺 {consultations.length} Consultations</span>
        </div>
      </div>

      {/* Grid of 3 Saved Data Columns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        
        {/* Saved Rescue Reports */}
        <div style={{ background: '#FAF6F0', padding: '18px', borderRadius: '18px', border: '1px solid #FFE5D9' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <ShieldAlert size={18} color="#E07A5F" />
            <h4 style={{ fontSize: '1.1rem', margin: 0 }}>Injured Rescue Reports</h4>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '340px', overflowY: 'auto' }}>
            {rescues.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: '#8D99AE' }}>No rescue reports saved yet.</p>
            ) : (
              rescues.map(item => (
                <div key={item.id} style={{ background: '#FFFFFF', padding: '12px 14px', borderRadius: '14px', border: '1px solid #E0E0E0', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#2B2D42', marginBottom: '4px' }}>
                    <span>{item.title}</span>
                    <span style={{ color: '#E07A5F' }}>{item.severity}</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#5C677D', marginBottom: '6px' }}>
                    <MapPin size={12} style={{ display: 'inline', marginRight: '4px' }} /> {item.locationName}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', background: '#D8F3DC', color: '#1B4332', padding: '3px 8px', borderRadius: '8px', fontWeight: 700 }}>
                    <span>Status: {item.status}</span>
                    <span>Reporter: {item.reporterName}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Saved Adoption Applications */}
        <div style={{ background: '#FAF6F0', padding: '18px', borderRadius: '18px', border: '1px solid #B7E4C7' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Heart size={18} color="#52B788" />
            <h4 style={{ fontSize: '1.1rem', margin: 0 }}>Adoption Applications</h4>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '340px', overflowY: 'auto' }}>
            {applications.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: '#8D99AE' }}>No adoption applications saved yet.</p>
            ) : (
              applications.map(app => (
                <div key={app.id} style={{ background: '#FFFFFF', padding: '12px 14px', borderRadius: '14px', border: '1px solid #E0E0E0', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#2B2D42', marginBottom: '4px' }}>
                    <span>Pet: {app.petName}</span>
                    <span style={{ color: '#52B788' }}>{app.status}</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#5C677D', marginBottom: '4px' }}>
                    <User size={12} style={{ display: 'inline', marginRight: '4px' }} /> Applicant: <strong>{app.applicantName}</strong>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#5C677D', marginBottom: '6px' }}>
                    <Mail size={12} style={{ display: 'inline', marginRight: '4px' }} /> {app.email} • {app.phone}
                  </div>
                  <div style={{ fontSize: '0.75rem', background: '#FFE5D9', color: '#7A3B2E', padding: '3px 8px', borderRadius: '8px' }}>
                    Home: {app.housingType}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Saved Vet Consultations */}
        <div style={{ background: '#FAF6F0', padding: '18px', borderRadius: '18px', border: '1px solid #E8DEF8' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Stethoscope size={18} color="#9D4EDD" />
            <h4 style={{ fontSize: '1.1rem', margin: 0 }}>Vet Consultations</h4>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '340px', overflowY: 'auto' }}>
            {consultations.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: '#8D99AE' }}>No vet consultations saved yet.</p>
            ) : (
              consultations.map(c => (
                <div key={c.id} style={{ background: '#FFFFFF', padding: '12px 14px', borderRadius: '14px', border: '1px solid #E0E0E0', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#2B2D42', marginBottom: '4px' }}>
                    <span>Pet: {c.petName}</span>
                    <span style={{ color: '#9D4EDD' }}>{c.status}</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#5C677D', marginBottom: '4px' }}>
                    <User size={12} style={{ display: 'inline', marginRight: '4px' }} /> Owner: {c.petOwnerName} ({c.phone})
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#5C677D', fontStyle: 'italic', marginBottom: '6px' }}>
                    "{c.symptomDescription}"
                  </div>
                  <div style={{ fontSize: '0.75rem', background: '#E8DEF8', color: '#4A148C', padding: '3px 8px', borderRadius: '8px' }}>
                    Time: {c.preferredTime}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
