import React, { useState } from 'react';
import { Heart, Sparkles, ShieldCheck, MapPin, Filter } from 'lucide-react';

export default function AdoptionModule({ pets, onOpenAdoptionModal }) {
  const [selectedSpecies, setSelectedSpecies] = useState('All');
  const [selectedBirdCategory, setSelectedBirdCategory] = useState('All');
  const [filterUrgent, setFilterUrgent] = useState(false);

  const speciesList = ['All', 'Dog', 'Cat', 'Bird', 'Bunny'];

  const birdCategories = [
    { label: 'All Birds 🦜', value: 'All' },
    { label: 'Cockatiel 🐥', value: 'Cockatiel' },
    { label: 'Parrot & Macaw 🦜', value: 'Parrot & Macaw' },
    { label: 'Budgie & Parakeet 🐦', value: 'Budgie & Parakeet' },
    { label: 'Lovebird 💕', value: 'Lovebird' },
    { label: 'Cockatoo 🪶', value: 'Cockatoo' },
    { label: 'Canary & Finch 🎶', value: 'Canary & Finch' },
    { label: 'Conure & Lorikeet 🌈', value: 'Conure & Lorikeet' }
  ];

  const filteredPets = pets.filter(pet => {
    const matchSpecies = selectedSpecies === 'All' || pet.species.toLowerCase() === selectedSpecies.toLowerCase();
    const matchUrgent = !filterUrgent || pet.urgency === 'Urgent Foster';
    const matchBirdCategory =
      selectedSpecies !== 'Bird' ||
      selectedBirdCategory === 'All' ||
      (pet.category || '').toLowerCase() === selectedBirdCategory.toLowerCase();
    return matchSpecies && matchUrgent && matchBirdCategory;
  });

  return (
    <section style={{ padding: '20px 0 40px 0' }}>
      <div className="container">
        
        {/* Module Header */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge-pastel-mint">🐾 Animal Adoption Hub</span>
            <span style={{ fontSize: '0.85rem', color: '#5C677D' }}>{pets.length} Rescued Animals Waiting</span>
          </div>
          <h2 style={{ fontSize: '2rem', marginTop: '6px', margin: 0 }}>Find Your New Best Friend</h2>
          <p style={{ color: '#5C677D', fontSize: '0.95rem' }}>
            Adopt a rescued animal and give them the loving home they deserve. All pets are veterinary-checked & vaccinated.
          </p>
        </div>

        {/* Primary Species Filters */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', marginBottom: selectedSpecies === 'Bird' ? '14px' : '24px' }}>
          <div style={{ display: 'flex', gap: '8px', background: '#FFFFFF', padding: '6px', borderRadius: '30px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            {speciesList.map(sp => (
              <button
                key={sp}
                onClick={() => {
                  setSelectedSpecies(sp);
                  if (sp !== 'Bird') setSelectedBirdCategory('All');
                }}
                style={{
                  border: 'none',
                  background: selectedSpecies === sp ? '#D8F3DC' : 'transparent',
                  color: selectedSpecies === sp ? '#1B4332' : '#5C677D',
                  padding: '6px 16px',
                  borderRadius: '20px',
                  fontWeight: selectedSpecies === sp ? 700 : 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {sp === 'All' ? 'All Species 🐾' : sp}
              </button>
            ))}
          </div>

          <button
            onClick={() => setFilterUrgent(!filterUrgent)}
            style={{
              border: filterUrgent ? '2px solid #FFCAD4' : '1px solid #E0E0E0',
              background: filterUrgent ? '#FFE5D9' : '#FFFFFF',
              color: filterUrgent ? '#9C4100' : '#5C677D',
              padding: '8px 16px',
              borderRadius: '20px',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            🔥 Urgent Foster Only
          </button>
        </div>

        {/* Secondary Classification Filter for Birds */}
        {selectedSpecies === 'Bird' && (
          <div style={{
            background: 'linear-gradient(135deg, #FFF0F3 0%, #FFE5D9 50%, #D8F3DC 100%)',
            padding: '16px 20px',
            borderRadius: '24px',
            marginBottom: '24px',
            border: '1.5px solid #FFCAD4',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.3rem' }}>🦜</span>
                <span style={{ fontWeight: 800, color: '#7A3B2E', fontSize: '0.96rem' }}>
                  Bird Species & Categories:
                </span>
              </div>
              <span style={{ fontSize: '0.84rem', color: '#5C677D', fontWeight: 700 }}>
                {filteredPets.length} {filteredPets.length === 1 ? 'Bird Available' : 'Birds Available'}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {birdCategories.map(cat => {
                const isSelected = selectedBirdCategory === cat.value;
                return (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedBirdCategory(cat.value)}
                    style={{
                      border: isSelected ? '2px solid #E07A5F' : '1px solid rgba(0,0,0,0.08)',
                      background: isSelected ? '#FFFFFF' : 'rgba(255, 255, 255, 0.75)',
                      color: isSelected ? '#C92A2A' : '#495057',
                      padding: '7px 15px',
                      borderRadius: '16px',
                      fontWeight: isSelected ? 800 : 600,
                      fontSize: '0.86rem',
                      cursor: 'pointer',
                      boxShadow: isSelected ? '0 4px 12px rgba(224, 122, 95, 0.22)' : 'none',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Pets Cards Grid */}
        <div className="grid-cards">
          {filteredPets.map(pet => (
            <div key={pet.id} className="card-pastel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              
              <div>
                {/* Photo & Badges */}
                <div style={{ position: 'relative', height: '220px', borderRadius: '18px', overflow: 'hidden', marginBottom: '16px' }}>
                  <img
                    src={pet.imageUrl}
                    alt={pet.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  
                  {pet.urgency === 'Urgent Foster' && (
                    <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                      <span className="badge-pastel-urgent">🚨 Urgent Foster</span>
                    </div>
                  )}

                  {pet.category && (
                    <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                      <span style={{
                        background: 'rgba(27, 67, 50, 0.85)',
                        backdropFilter: 'blur(6px)',
                        color: '#FFFFFF',
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: 800
                      }}>
                        {pet.category}
                      </span>
                    </div>
                  )}

                  <div style={{ position: 'absolute', bottom: '12px', left: '12px', background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(8px)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, color: '#2B2D42' }}>
                    {pet.gender} • {pet.age}
                  </div>
                </div>

                {/* Name & Breed */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px', gap: '8px', flexWrap: 'wrap' }}>
                  <h3 style={{ fontSize: '1.4rem', margin: 0 }}>{pet.name}</h3>
                  <span style={{ fontSize: '0.82rem', background: '#E8DEF8', color: '#4A148C', padding: '3px 10px', borderRadius: '12px', fontWeight: 700 }}>
                    {pet.breed}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: '#5C677D', marginBottom: '12px' }}>
                  <MapPin size={14} color="#E07A5F" />
                  <span>{pet.location}</span>
                </div>

                <p style={{ fontSize: '0.9rem', color: '#5C677D', marginBottom: '14px', lineHeight: '1.5' }}>
                  {pet.description}
                </p>

                {/* Personality Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                  {pet.tags.map((tag, idx) => (
                    <span key={idx} style={{ background: '#FAF6F0', border: '1px solid #FFE5D9', color: '#5C677D', fontSize: '0.78rem', padding: '3px 10px', borderRadius: '12px', fontWeight: 600 }}>
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Medical Badges */}
                <div style={{ display: 'flex', gap: '12px', fontSize: '0.8rem', color: '#1B4332', marginBottom: '16px', background: '#D8F3DC', padding: '8px 12px', borderRadius: '12px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ShieldCheck size={14} color="#52B788" /> Vaccinated
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ShieldCheck size={14} color="#52B788" /> Neutered
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                className="btn-pastel-primary"
                onClick={() => onOpenAdoptionModal(pet)}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <Heart size={18} />
                <span>Apply to Adopt {pet.name}</span>
              </button>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
