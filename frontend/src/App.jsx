import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import RescueModal from './components/RescueModal';
import AdoptionModal from './components/AdoptionModal';

import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import CureAnimalsPage from './pages/CureAnimalsPage';
import RescuePage from './pages/RescuePage';
import AdoptionPage from './pages/AdoptionPage';
import PetCarePage from './pages/PetCarePage';
import HelperMapPage from './pages/HelperMapPage';

import {
  fetchRescues,
  fetchAdoptionPets,
  fetchPetCareGuides
} from './api/client';

function MainAppLayout({ children, onOpenRescueModal }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar onOpenRescueModal={onOpenRescueModal} />
      <main style={{ flex: 1 }}>
        {children}
      </main>
      <Footer onOpenRescueModal={onOpenRescueModal} />
    </div>
  );
}

export default function App() {
  const [rescues, setRescues] = useState([]);
  const [pets, setPets] = useState([]);
  const [guides, setGuides] = useState([]);

  // Modals
  const [isRescueModalOpen, setIsRescueModalOpen] = useState(false);
  const [selectedAdoptionPet, setSelectedAdoptionPet] = useState(null);

  const loadData = async () => {
    try {
      const [resData, petData, guideData] = await Promise.all([
        fetchRescues(),
        fetchAdoptionPets(),
        fetchPetCareGuides()
      ]);
      setRescues(resData);
      setPets(petData);
      setGuides(guideData);
    } catch (err) {
      console.error('Error loading data:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleNewRescueAdded = (newRescue) => {
    setRescues(prev => [newRescue, ...prev]);
  };

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          
          {/* Public Auth Gateway */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Main Website Home */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainAppLayout onOpenRescueModal={() => setIsRescueModalOpen(true)}>
                  <HomePage
                    pets={pets}
                    onOpenRescueModal={() => setIsRescueModalOpen(true)}
                    onOpenAdoptionModal={(pet) => setSelectedAdoptionPet(pet)}
                  />
                </MainAppLayout>
              </ProtectedRoute>
            }
          />

          {/* Protected Meet Our Pets -> Adopt a Pet */}
          <Route
            path="/adopt"
            element={
              <ProtectedRoute>
                <MainAppLayout onOpenRescueModal={() => setIsRescueModalOpen(true)}>
                  <AdoptionPage
                    pets={pets}
                    onOpenAdoptionModal={(pet) => setSelectedAdoptionPet(pet)}
                  />
                </MainAppLayout>
              </ProtectedRoute>
            }
          />

          {/* Protected Cure Animals Central Hub & Gemini Assistant */}
          <Route
            path="/cure-animals"
            element={
              <ProtectedRoute>
                <MainAppLayout onOpenRescueModal={() => setIsRescueModalOpen(true)}>
                  <CureAnimalsPage
                    onOpenRescueModal={() => setIsRescueModalOpen(true)}
                  />
                </MainAppLayout>
              </ProtectedRoute>
            }
          />

          {/* Protected Cure Animals -> Option 1: Cure Injured Animal */}
          <Route
            path="/rescue"
            element={
              <ProtectedRoute>
                <MainAppLayout onOpenRescueModal={() => setIsRescueModalOpen(true)}>
                  <RescuePage
                    rescues={rescues}
                    onOpenRescueModal={() => setIsRescueModalOpen(true)}
                  />
                </MainAppLayout>
              </ProtectedRoute>
            }
          />

          {/* Protected Cure Animals -> Option 2: Help My Pet */}
          <Route
            path="/petcare"
            element={
              <ProtectedRoute>
                <MainAppLayout onOpenRescueModal={() => setIsRescueModalOpen(true)}>
                  <PetCarePage
                    guides={guides}
                  />
                </MainAppLayout>
              </ProtectedRoute>
            }
          />

          {/* Protected Nearby Helpers Location API */}
          <Route
            path="/helpers"
            element={
              <ProtectedRoute>
                <MainAppLayout onOpenRescueModal={() => setIsRescueModalOpen(true)}>
                  <HelperMapPage />
                </MainAppLayout>
              </ProtectedRoute>
            }
          />

          {/* Fallback to Home (which triggers ProtectedRoute to /login if unauthenticated) */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>

        {/* Rescue & Adoption Modals */}
        <RescueModal
          isOpen={isRescueModalOpen}
          onClose={() => setIsRescueModalOpen(false)}
          onReportSuccess={handleNewRescueAdded}
        />

        <AdoptionModal
          isOpen={!!selectedAdoptionPet}
          pet={selectedAdoptionPet}
          onClose={() => setSelectedAdoptionPet(null)}
        />

      </BrowserRouter>
    </AuthProvider>
  );
}
