import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  Stethoscope,
  ArrowRight,
  Sparkles,
  CheckCircle,
  Bot,
  MessageSquareHeart,
  ChevronRight
} from 'lucide-react';
import VeterinaryChatbot from '../components/VeterinaryChatbot';

export default function CureAnimalsPage({ onOpenRescueModal }) {
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'ai-assistant'

  return (
    <div className="container" style={{ padding: '30px 20px 60px 20px' }}>
      
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #FFE5D9 0%, #FFF1C5 50%, #D8F3DC 100%)',
        borderRadius: '28px',
        padding: '36px 32px',
        marginBottom: '32px',
        border: '2px solid rgba(255,255,255,0.8)',
        boxShadow: '0 8px 30px rgba(255, 202, 212, 0.2)'
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#FFFFFF', padding: '6px 14px', borderRadius: '50px', fontSize: '0.85rem', fontWeight: 700, color: '#E07A5F', marginBottom: '12px' }}>
          <Sparkles size={16} /> Animal Healthcare & Healing Center
        </div>
        <h1 style={{ fontSize: '2.5rem', margin: '0 0 10px 0', color: '#2B2D42', fontWeight: 700 }}>
          Cure Animals 🌸
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#5C677D', maxWidth: '820px', margin: 0, lineHeight: '1.6' }}>
          Choose how you would like to help: chat with our <strong>Veterinary AI Assistant</strong> for instant pet health guidance, report an injured stray animal on the street, or explore step-by-step home remedies and vet consultations.
        </p>

        {/* Quick Section Switcher Buttons */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '22px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('all')}
            style={{
              padding: '10px 20px',
              borderRadius: '50px',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              background: activeTab === 'all' ? '#2B2D42' : 'rgba(255, 255, 255, 0.9)',
              color: activeTab === 'all' ? '#FFFFFF' : '#2B2D42',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
              boxShadow: activeTab === 'all' ? '0 4px 14px rgba(0,0,0,0.15)' : 'none'
            }}
          >
            <span>All Healing Services</span>
          </button>

          <button
            onClick={() => setActiveTab('ai-assistant')}
            style={{
              padding: '10px 20px',
              borderRadius: '50px',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              background: activeTab === 'ai-assistant' ? '#9D4EDD' : '#F3E8FF',
              color: activeTab === 'ai-assistant' ? '#FFFFFF' : '#4A148C',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
              boxShadow: activeTab === 'ai-assistant' ? '0 4px 14px rgba(157, 78, 221, 0.3)' : 'none'
            }}
          >
            <Bot size={16} />
            <span>🩺 Veterinary AI Assistant</span>
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      {activeTab === 'ai-assistant' ? (
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.6rem', color: '#2B2D42', margin: 0, fontWeight: 800 }}>
              🩺 Veterinary AI Assistant
            </h2>
            <button
              onClick={() => setActiveTab('all')}
              className="btn-pastel-outline"
              style={{ fontSize: '0.85rem' }}
            >
              ← Back to All Services
            </button>
          </div>
          <VeterinaryChatbot onOpenRescueModal={onOpenRescueModal} />
        </div>
      ) : (
        <>
          {/* Top Featured Service: Veterinary AI Assistant */}
          <div className="card-pastel" style={{
            background: 'linear-gradient(135deg, #F3E8FF 0%, #FFFFFF 60%, #E8DEF8 100%)',
            borderColor: '#D8B4F8',
            marginBottom: '32px',
            padding: '32px',
            boxShadow: '0 8px 30px rgba(157, 78, 221, 0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
              <div style={{ flex: '1 1 500px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#D8F3DC', color: '#1B4332', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, marginBottom: '10px' }}>
                  <Sparkles size={14} color="#52B788" /> Powered by Google Gemini 2.5 AI
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
                  <div style={{ background: '#E8DEF8', width: '52px', height: '52px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Bot size={28} color="#7B2CBF" />
                  </div>
                  <div>
                    <h2 style={{ fontSize: '1.7rem', margin: 0, color: '#2B2D42', fontWeight: 800 }}>
                      Veterinary AI Assistant 🩺
                    </h2>
                    <p style={{ fontSize: '0.9rem', color: '#7B2CBF', margin: 0, fontWeight: 600 }}>
                      Instant AI pet triage, symptom insights, safe first aid, and toxic food alerts
                    </p>
                  </div>
                </div>
                <p style={{ fontSize: '0.98rem', color: '#5C677D', lineHeight: '1.6', margin: '0 0 16px 0' }}>
                  Have an urgent animal question or need first-aid advice? Chat directly with our Gemini-powered veterinary assistant for guidance on dogs, cats, birds, and domestic pets.
                </p>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setActiveTab('ai-assistant')}
                    className="btn-pastel-lilac"
                    style={{ padding: '12px 24px', fontSize: '0.95rem' }}
                  >
                    <MessageSquareHeart size={18} />
                    <span>Open AI Assistant Chat</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>

              <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '20px', border: '1px solid #E8DEF8', flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
                <div style={{ fontWeight: 700, color: '#3B1C54', marginBottom: '4px' }}>💡 Quick Questions You Can Ask:</div>
                <div style={{ color: '#5C677D', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#9D4EDD' }}>•</span> "My dog ate chocolate, is it an emergency?"
                </div>
                <div style={{ color: '#5C677D', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#9D4EDD' }}>•</span> "Why is my cat scratching constantly?"
                </div>
                <div style={{ color: '#5C677D', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#9D4EDD' }}>•</span> "Vaccination schedule for 8-week puppy"
                </div>
                <div style={{ color: '#5C677D', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#9D4EDD' }}>•</span> "Safe first aid for injured bird"
                </div>
              </div>
            </div>
          </div>

          {/* The Two Main Dedicated Pathways (100% Preserved) */}
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

          {/* Embedded Veterinary Chatbot directly in Cure Animals */}
          <div style={{ marginTop: '40px' }}>
            <div style={{ marginBottom: '16px' }}>
              <span className="badge-pastel-mint">Live AI Veterinary Chat</span>
              <h2 style={{ fontSize: '1.7rem', color: '#2B2D42', margin: '6px 0 0 0', fontWeight: 800 }}>
                Talk to PawsCare Veterinary Assistant 🩺
              </h2>
            </div>
            <VeterinaryChatbot onOpenRescueModal={onOpenRescueModal} />
          </div>
        </>
      )}

    </div>
  );
}
