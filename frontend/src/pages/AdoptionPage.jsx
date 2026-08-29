import React from 'react';
import AdoptionModule from '../components/AdoptionModule';

export default function AdoptionPage({ pets, onOpenAdoptionModal }) {
  return (
    <div>
      <AdoptionModule
        pets={pets}
        onOpenAdoptionModal={onOpenAdoptionModal}
      />
    </div>
  );
}
