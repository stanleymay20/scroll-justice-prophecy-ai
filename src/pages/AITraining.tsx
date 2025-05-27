
import React, { useState } from 'react';
import { NavBar } from '@/components/layout/NavBar';
import { EnhancedTrainingForm } from '@/components/legal-systems/EnhancedTrainingForm';
import { ModelCard } from '@/components/legal-systems/ModelCard';
import { GlassCard } from '@/components/advanced-ui/GlassCard';
import { TrainingParameters, ModelTrainingStatus, LegalFrameworkFocus } from '@/types';
import { MetaTags } from '@/components/MetaTags';
import { useLanguage } from '@/contexts/language';

const AITraining = () => {
  const { t } = useLanguage();
  const [isTraining, setIsTraining] = useState(false);

  // Mock training models with correct properties
  const mockModels: ModelTrainingStatus[] = [
    {
      id: '1',
      status: 'completed',
      progress: 100,
      started_at: '2024-01-15T10:00:00Z',
      completed_at: '2024-01-15T14:30:00Z',
      accuracy: 94.2,
      model_version: 'v2.1.0'
    },
    {
      id: '2', 
      status: 'training',
      progress: 67,
      started_at: '2024-01-16T09:00:00Z',
      accuracy: 87.5,
      model_version: 'v2.2.0'
    },
    {
      id: '3',
      status: 'pending',
      progress: 0,
      started_at: '2024-01-17T08:00:00Z',
      accuracy: 0,
      model_version: 'v2.3.0'
    }
  ];

  const handleTrainingSubmit = async (params: TrainingParameters) => {
    console.log('Training parameters:', params);
    setIsTraining(true);
    
    // Simulate training process
    setTimeout(() => {
      setIsTraining(false);
      alert('Training completed successfully!');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-justice-dark to-black">
      <MetaTags 
        title="AI Training - ScrollJustice"
        description="Train and manage AI models for legal judgment"
      />
      <NavBar />
      
      <div className="container mx-auto px-4 pt-20 pb-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{t("training.title")}</h1>
          <p className="text-justice-light/80">
            {t("training.description")}
          </p>
          
          <div className="mt-4 p-4 bg-amber-900/20 border border-amber-500/50 rounded-lg">
            <p className="text-amber-200 text-sm">
              <strong>AI Training Disclaimer:</strong> All AI models are trained for advisory purposes only. 
              Human oversight and review are required for all legal decisions. Models must comply with 
              applicable legal and ethical standards in each jurisdiction.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <GlassCard className="p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Configure New Model</h2>
              <EnhancedTrainingForm 
                onSubmit={handleTrainingSubmit}
                loading={isTraining}
              />
            </GlassCard>
          </div>
          
          <div className="space-y-6">
            <GlassCard className="p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Active Models</h2>
              <div className="space-y-4">
                {mockModels.map((model) => (
                  <ModelCard key={model.id} model={model} />
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AITraining;
