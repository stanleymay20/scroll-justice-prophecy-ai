
import React from 'react';
import { NavBar } from '@/components/layout/NavBar';
import { PetitionForm } from '@/components/courtroom/PetitionForm';
import { useNavigate } from 'react-router-dom';

const PetitionNew = () => {
  const navigate = useNavigate();

  const handlePetitionCreated = (petition: any) => {
    navigate(`/petition/${petition.id}`);
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-justice-dark to-black">
      <NavBar />
      
      <div className="container mx-auto px-4 pt-20 pb-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">File New Petition</h1>
          <p className="text-justice-light/80">
            Submit your case to the Sacred Scrolls for AI-powered legal judgment
          </p>
          <div className="mt-4 p-4 bg-amber-900/20 border border-amber-500/50 rounded-lg">
            <p className="text-amber-200 text-sm">
              <strong>Legal Disclaimer:</strong> This platform provides AI-generated legal analysis for educational and advisory purposes only. 
              AI verdicts do not constitute professional legal advice and should not be relied upon for actual legal decisions. 
              Please consult with qualified legal professionals for binding legal counsel.
            </p>
          </div>
        </div>

        <PetitionForm 
          onPetitionCreated={handlePetitionCreated}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default PetitionNew;
