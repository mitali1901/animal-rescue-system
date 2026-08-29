import React from 'react';
import RescueModule from '../components/RescueModule';

export default function RescuePage({ rescues, onOpenRescueModal }) {
  return (
    <div>
      <RescueModule
        rescues={rescues}
        onOpenRescueModal={onOpenRescueModal}
      />
    </div>
  );
}
