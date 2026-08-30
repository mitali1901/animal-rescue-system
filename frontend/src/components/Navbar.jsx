import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Heart, Stethoscope, MapPin, ShieldAlert, ChevronDown, Sparkles } from 'lucide-react';

export default function Navbar({ onOpenRescueModal }) {
  const [cureDropdownOpen, setCureDropdownOpen] = useState(false);
  const location = useLocation();

  const isCureActive = location.pathname.startsWith('/cure-animals') || location.pathname === '/rescue' || location.pathname === '/petcare';

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(250, 246, 240, 0.94)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 202, 212, 0.4)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', flexWrap: 'wrap', gap: '12px' }}>
        
        {/* Brand Logo */}
        <Link 
          to="/" 
          style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}
        >
          <div style={{
            background: 'linear-gradient(135deg, #FFCAD4 0%, #D8F3DC 100%)',
            width: '46px',
            height: '46px',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.6rem',
            boxShadow: '0 4px 12px rgba(255, 202, 212, 0.5)'
          }}>
            🐾
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', margin: 0, color: '#2B2D42', fontWeight: 700 }}>
              Paws<span style={{ color: '#E07A5F' }}>Care</span>
            </h1>
            <p style={{ fontSize: '0.75rem', color: '#5C677D', margin: 0, fontWeight: 600 }}>
              Rescue • Adopt • Heal
            </p>
          </div>
        </Link>

        {/* Main Navigation Links */}
        <nav style={{ display: 'flex', gap: '6px', background: 'rgba(255, 255, 255, 0.85)', padding: '6px', borderRadius: '50px', border: '1px solid rgba(230, 230, 230, 0.6)', alignItems: 'center', flexWrap: 'wrap' }}>
          
          {/* Home */}
          <NavLink
            to="/"
            end
            style={({ isActive }) => ({
              textDecoration: 'none',
              background: isActive ? 'linear-gradient(135deg, #FFCAD4 0%, #FFE5D9 100%)' : 'transparent',
              color: isActive ? '#4A2E35' : '#5C677D',
              padding: '8px 16px',
              borderRadius: '30px',
              fontWeight: isActive ? 700 : 600,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
              boxShadow: isActive ? '0 4px 12px rgba(255, 202, 212, 0.4)' : 'none'
            })}
          >
            {({ isActive }) => (
              <>
                <Sparkles size={16} color={isActive ? '#4A2E35' : '#74C69D'} />
                <span>Home</span>
              </>
            )}
          </NavLink>

          {/* 1. Meet Our Pets -> Adopt a Pet */}
          <NavLink
            to="/adopt"
            style={({ isActive }) => ({
              textDecoration: 'none',
              background: isActive ? 'linear-gradient(135deg, #D8F3DC 0%, #B7E4C7 100%)' : 'transparent',
              color: isActive ? '#1B4332' : '#5C677D',
              padding: '8px 16px',
              borderRadius: '30px',
              fontWeight: isActive ? 700 : 600,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
              boxShadow: isActive ? '0 4px 12px rgba(116, 198, 157, 0.4)' : 'none'
            })}
          >
            {({ isActive }) => (
              <>
                <Heart size={16} color={isActive ? '#1B4332' : '#E07A5F'} />
                <span>Meet Our Pets</span>
                <span style={{ fontSize: '0.68rem', background: isActive ? '#FFFFFF' : '#D8F3DC', color: '#1B4332', padding: '2px 7px', borderRadius: '10px', fontWeight: 700 }}>
                  Adopt
                </span>
              </>
            )}
          </NavLink>

          {/* 2. Cure Animals (Dropdown with Cure Injured Animal & Help My Pet) */}
          <div 
            style={{ position: 'relative' }}
            onMouseEnter={() => setCureDropdownOpen(true)}
            onMouseLeave={() => setCureDropdownOpen(false)}
          >
            <NavLink
              to="/cure-animals"
              style={() => ({
                textDecoration: 'none',
                background: isCureActive ? 'linear-gradient(135deg, #E8DEF8 0%, #D8B4F8 100%)' : 'transparent',
                color: isCureActive ? '#3B1C54' : '#5C677D',
                padding: '8px 16px',
                borderRadius: '30px',
                fontWeight: isCureActive ? 700 : 600,
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease',
                boxShadow: isCureActive ? '0 4px 12px rgba(232, 222, 248, 0.5)' : 'none'
              })}
            >
              <Stethoscope size={16} color={isCureActive ? '#3B1C54' : '#9D4EDD'} />
              <span>Cure Animals</span>
              <ChevronDown size={14} />
            </NavLink>

            {/* Dropdown Menu */}
            {cureDropdownOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                paddingTop: '6px',
                zIndex: 110,
                minWidth: '220px'
              }}>
                <div style={{
                  background: '#FFFFFF',
                  borderRadius: '18px',
                  padding: '8px',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.12)',
                  border: '1px solid #E8DEF8',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}>
                  <Link
                    to="/rescue"
                    onClick={() => setCureDropdownOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      textDecoration: 'none',
                      color: '#2B2D42',
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      background: location.pathname === '/rescue' ? '#FFE5D9' : 'transparent',
                      transition: 'background 0.2s ease'
                    }}
                  >
                    <ShieldAlert size={16} color="#E07A5F" />
                    <div>
                      <div>Cure Injured Animal</div>
                      <div style={{ fontSize: '0.72rem', color: '#5C677D', fontWeight: 500 }}>Stray emergency rescue</div>
                    </div>
                  </Link>

                  <Link
                    to="/petcare"
                    onClick={() => setCureDropdownOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      textDecoration: 'none',
                      color: '#2B2D42',
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      background: location.pathname === '/petcare' ? '#E8DEF8' : 'transparent',
                      transition: 'background 0.2s ease'
                    }}
                  >
                    <Stethoscope size={16} color="#9D4EDD" />
                    <div>
                      <div>Help My Pet</div>
                      <div style={{ fontSize: '0.72rem', color: '#5C677D', fontWeight: 500 }}>Remedies & vet booking</div>
                    </div>
                  </Link>

                  <Link
                    to="/cure-animals"
                    onClick={() => setCureDropdownOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      textDecoration: 'none',
                      color: '#2B2D42',
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      background: '#F3E8FF',
                      border: '1px dashed #D8B4F8',
                      transition: 'background 0.2s ease'
                    }}
                  >
                    <span style={{ fontSize: '1.1rem' }}>🩺</span>
                    <div>
                      <div style={{ color: '#4A148C' }}>Veterinary AI Assistant</div>
                      <div style={{ fontSize: '0.72rem', color: '#7B2CBF', fontWeight: 500 }}>Ask pet health questions</div>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Nearby Helpers Map */}
          <NavLink
            to="/helpers"
            style={({ isActive }) => ({
              textDecoration: 'none',
              background: isActive ? 'linear-gradient(135deg, #FFF1C5 0%, #FFE599 100%)' : 'transparent',
              color: isActive ? '#5C4000' : '#5C677D',
              padding: '8px 14px',
              borderRadius: '30px',
              fontWeight: isActive ? 700 : 600,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            })}
          >
            {({ isActive }) => (
              <>
                <MapPin size={16} color={isActive ? '#5C4000' : '#E07A5F'} />
                <span>Nearby Helpers</span>
              </>
            )}
          </NavLink>

        </nav>

        {/* Report Injured Animal Action Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button className="btn-pastel-primary" onClick={onOpenRescueModal}>
            <ShieldAlert size={18} />
            <span>Report Injured Animal</span>
          </button>
        </div>

      </div>
    </header>
  );
}
