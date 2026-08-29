import React from 'react';
import SavedDataViewer from '../components/SavedDataViewer';
import { Database, ShieldCheck, RefreshCw } from 'lucide-react';

export default function DatabasePage({ rescues, applications, consultations, onRefresh }) {
  return (
    <div className="container" style={{ padding: '30px 20px' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge-pastel-peach">💾 Node.js REST Database</span>
            <span style={{ fontSize: '0.85rem', color: '#5C677D' }}>Persistent Storage: backend/database/data.json</span>
          </div>
          <h2 style={{ fontSize: '2.2rem', marginTop: '6px', margin: 0 }}>System Saved Database Overview</h2>
          <p style={{ color: '#5C677D', fontSize: '1rem' }}>
            Visual live inspection of all rescue reports, pet adoption applications, and vet consultations saved in the database.
          </p>
        </div>

        <button className="btn-pastel-primary" onClick={onRefresh}>
          <RefreshCw size={18} />
          <span>Refresh Database Data</span>
        </button>
      </div>

      <SavedDataViewer
        rescues={rescues}
        applications={applications}
        consultations={consultations}
      />

    </div>
  );
}
