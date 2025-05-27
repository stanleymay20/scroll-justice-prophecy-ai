
import React from 'react';
import { NavBar } from '@/components/layout/NavBar';
import { PetitionDetail as PetitionDetailComponent } from '@/components/courtroom/PetitionDetail';

const PetitionDetail = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-justice-dark to-black">
      <NavBar />
      
      <div className="container mx-auto px-4 pt-20 pb-16">
        <PetitionDetailComponent />
      </div>
    </div>
  );
};

export default PetitionDetail;
