import React from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import { Heart, ShieldAlert, Stethoscope, ArrowRight, Sparkles, MapPin } from 'lucide-react';

export default function HomePage({ pets = [], onOpenRescueModal, onOpenAdoptionModal }) {
  const featuredPets = pets.slice(0, 3);

  return (
    <div className="container" style={{ paddingBottom: '60px' }}>
      
      {/* 1. Hero Section */}
      <HeroSection onOpenRescueModal={onOpenRescueModal} />

      {/* 2. Meet Our Pets Showcase Section (inspired by reference image) */}
      <section style={{ margin: '48px 0 36px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge-pastel-mint">🐾 Forever Homes</span>
              <span style={{ fontSize: '0.85rem', color: '#5C677D' }}>{pets.length} Rescued Pets Available</span>
            </div>
            <h2 style={{ fontSize: '2.2rem', marginTop: '6px', margin: 0, fontWeight: 700 }}>Meet Our Pets 🐶🐱</h2>
            <p style={{ color: '#5C677D', fontSize: '0.95rem' }}>
              Explore rescued animals looking for a warm, loving household. Each pet is fully vaccinated and vet-checked.
            </p>
          </div>

          <Link to="/adopt" className="btn-pastel-mint" style={{ textDecoration: 'none' }}>
            <span>View All Adoptable Pets</span>
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* 3 Featured Pet Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {featuredPets.map(pet => (
            <div key={pet.id} className="card-pastel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#FFFFFF' }}>
              <div>
                <div style={{ position: 'relative', height: '200px', borderRadius: '18px', overflow: 'hidden', marginBottom: '14px' }}>
                  <img src={pet.imageUrl} alt={pet.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  {pet.urgency === 'Urgent Foster' && (
                    <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
                      <span className="badge-pastel-urgent">🔥 Urgent Foster</span>
                    </div>
                  )}
                  <div style={{ position: 'absolute', bottom: '10px', left: '10px', background: 'rgba(255, 255, 255, 0.92)', backdropFilter: 'blur(6px)', padding: '4px 10px', borderRadius: '14px', fontSize: '0.78rem', fontWeight: 700 }}>
                    {pet.gender} • {pet.age}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <h3 style={{ fontSize: '1.3rem', margin: 0 }}>{pet.name}</h3>
                  <span style={{ fontSize: '0.8rem', background: '#E8DEF8', color: '#4A148C', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>
                    {pet.breed}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.82rem', color: '#5C677D', marginBottom: '10px' }}>
                  <MapPin size={14} color="#E07A5F" /> {pet.location}
                </div>

                <p style={{ fontSize: '0.88rem', color: '#5C677D', marginBottom: '14px', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {pet.description}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  className="btn-pastel-primary"
                  onClick={() => onOpenAdoptionModal(pet)}
                  style={{ flex: 1, justifyContent: 'center', fontSize: '0.88rem' }}
                >
                  <Heart size={16} /> Adopt {pet.name}
                </button>
                <Link to="/adopt" className="btn-pastel-outline" style={{ textDecoration: 'none', padding: '8px 12px' }}>
                  Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Cure Animals Gateway Section */}
      <section style={{ margin: '48px 0 36px 0', background: 'linear-gradient(135deg, #FFF0F3 0%, #FAF6F0 50%, #F3E8FF 100%)', padding: '36px 28px', borderRadius: '28px', border: '2px solid rgba(255,202,212,0.4)' }}>
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge-pastel-peach">🩺 Healthcare Hub</span>
            <span style={{ fontSize: '0.85rem', color: '#5C677D' }}>2 Dedicated Healthcare Services</span>
          </div>
          <h2 style={{ fontSize: '2.2rem', marginTop: '6px', margin: 0, fontWeight: 700 }}>Cure Animals 🌸</h2>
          <p style={{ color: '#5C677D', fontSize: '0.95rem' }}>
            Whether you need emergency help for an injured stray animal or healthcare guidance for your beloved pet.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          
          {/* Card 1: Cure Injured Animal */}
          <div className="card-pastel" style={{ background: '#FFFFFF', border: '1px solid #FFCAD4', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ background: '#FFCAD4', padding: '12px', borderRadius: '16px' }}>
                  <ShieldAlert size={26} color="#7A3B2E" />
                </div>
                <div>
                  <span className="badge-pastel-peach" style={{ marginBottom: '2px' }}>Stray Emergency</span>
                  <h3 style={{ fontSize: '1.35rem', margin: 0 }}>Cure Injured Animal</h3>
                </div>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#5C677D', lineHeight: '1.6', marginBottom: '16px' }}>
                Report an injured stray animal with GPS coordinates and injury photo. Volunteers and emergency vet ambulances dispatched immediately.
              </p>
            </div>

            <Link to="/rescue" className="btn-pastel-primary" style={{ textDecoration: 'none', justifyContent: 'center' }}>
              <span>Go to Cure Injured Animal</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Card 2: Help My Pet */}
          <div className="card-pastel" style={{ background: '#FFFFFF', border: '1px solid #E8DEF8', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ background: '#E8DEF8', padding: '12px', borderRadius: '16px' }}>
                  <Stethoscope size={26} color="#4A148C" />
                </div>
                <div>
                  <span className="badge-pastel-lilac" style={{ marginBottom: '2px' }}>Pet Parent Care</span>
                  <h3 style={{ fontSize: '1.35rem', margin: 0 }}>Help My Pet</h3>
                </div>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#5C677D', lineHeight: '1.6', marginBottom: '16px' }}>
                Search first-aid guides, home remedies for pet injuries, or request an appointment with certified veterinary specialists.
              </p>
            </div>

            <Link to="/petcare" className="btn-pastel-lilac" style={{ textDecoration: 'none', justifyContent: 'center' }}>
              <span>Go to Help My Pet</span>
              <ArrowRight size={16} />
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
}
