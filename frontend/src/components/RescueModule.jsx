import React, { useState } from 'react';
import { ShieldAlert, Clock, MapPin, Phone, CheckCircle, AlertTriangle, PlusCircle } from 'lucide-react';

export default function RescueModule({ rescues, onOpenRescueModal }) {
  const [filterSeverity, setFilterSeverity] = useState('All');

  const filteredRescues = rescues.filter(r => {
    if (filterSeverity === 'All') return true;
    return r.severity.toLowerCase() === filterSeverity.toLowerCase();
  });

  const getSeverityBadge = (severity) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return <span className="badge-pastel-urgent">🚨 High Emergency</span>;
      case 'medium':
        return <span className="badge-pastel-peach">⚠️ Moderate Injury</span>;
      default:
        return <span className="badge-pastel-mint">💚 Stable</span>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Recovered':
        return <span style={{ background: '#D8F3DC', color: '#1B4332', padding: '4px 12px', borderRadius: '20px', fontWeight: 700, fontSize: '0.8rem' }}>🎉 Fully Recovered</span>;
      case 'Under Vet Care':
        return <span style={{ background: '#E8DEF8', color: '#4A148C', padding: '4px 12px', borderRadius: '20px', fontWeight: 700, fontSize: '0.8rem' }}>🩺 Under Vet Care</span>;
      case 'Helper Dispatched':
        return <span style={{ background: '#FFF1C5', color: '#5C4000', padding: '4px 12px', borderRadius: '20px', fontWeight: 700, fontSize: '0.8rem' }}>🚑 Rescue Dispatched</span>;
      default:
        return <span style={{ background: '#FFE5D9', color: '#7A3B2E', padding: '4px 12px', borderRadius: '20px', fontWeight: 700, fontSize: '0.8rem' }}>📌 Reported</span>;
    }
  };

  return (
    <section style={{ padding: '20px 0 40px 0' }}>
      <div className="container">
        
        {/* Module Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge-pastel-peach">🚨 Emergency Rescue Hub</span>
              <span style={{ fontSize: '0.85rem', color: '#5C677D' }}>{rescues.length} Active Cases</span>
            </div>
            <h2 style={{ fontSize: '2rem', marginTop: '6px', margin: 0 }}>Cure & Save Injured Animals</h2>
            <p style={{ color: '#5C677D', fontSize: '0.95rem' }}>
              Every second counts! Report an injured stray animal to dispatch nearest vet volunteers immediately.
            </p>
          </div>

          <button className="btn-pastel-primary" onClick={onOpenRescueModal}>
            <PlusCircle size={20} />
            <span>Report Injured Animal</span>
          </button>
        </div>

        {/* Severity Filter Pills */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
          {['All', 'High', 'Medium', 'Low'].map(sev => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              style={{
                border: 'none',
                background: filterSeverity === sev ? '#FFCAD4' : '#FFFFFF',
                color: filterSeverity === sev ? '#4A2E35' : '#5C677D',
                padding: '8px 18px',
                borderRadius: '30px',
                fontWeight: filterSeverity === sev ? 700 : 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                transition: 'all 0.2s ease'
              }}
            >
              {sev === 'All' ? 'All Rescue Cases' : `${sev} Severity`}
            </button>
          ))}
        </div>

        {/* Rescue Cases Cards */}
        <div className="grid-cards">
          {filteredRescues.map(item => (
            <div key={item.id} className="card-pastel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              
              <div>
                {/* Photo & Badges */}
                <div style={{ position: 'relative', height: '180px', borderRadius: '16px', overflow: 'hidden', marginBottom: '16px' }}>
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '6px' }}>
                    {getSeverityBadge(item.severity)}
                  </div>
                  <div style={{ position: 'absolute', bottom: '12px', right: '12px' }}>
                    {getStatusBadge(item.status)}
                  </div>
                </div>

                {/* Title & Info */}
                <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>{item.title}</h3>
                <p style={{ fontSize: '0.9rem', color: '#5C677D', marginBottom: '12px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {item.description}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem', color: '#5C677D', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={16} color="#E07A5F" />
                    <strong>Location:</strong> {item.locationName}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={16} color="#74C69D" />
                    <strong>Reported:</strong> {new Date(item.reportedAt).toLocaleDateString()} by {item.reporterName}
                  </div>
                </div>
              </div>

              {/* Recovery Status Progress Timeline */}
              <div style={{ background: '#FAF6F0', padding: '12px 14px', borderRadius: '14px', border: '1px solid #FFE5D9' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#5C677D', marginBottom: '8px' }}>
                  Rescue & Healing Timeline
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {item.timeline.map((step, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.82rem' }}>
                      <CheckCircle size={14} color="#52B788" style={{ marginTop: '2px', flexShrink: 0 }} />
                      <div>
                        <strong>[{step.time}] {step.status}:</strong> {step.note}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
