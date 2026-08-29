import React from 'react';
import PetCareModule from '../components/PetCareModule';

export default function PetCarePage({ guides }) {
  return (
    <div>
      <PetCareModule guides={guides} />
    </div>
  );
}
