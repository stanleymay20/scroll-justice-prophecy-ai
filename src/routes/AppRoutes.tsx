
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Index from '@/pages/Index';
import ScrollCourt from '@/pages/ScrollCourt';
import JudgmentRoom from '@/pages/JudgmentRoom';
import WealthDashboard from '@/pages/Wealth/WealthDashboard';
import ExodusDashboard from '@/pages/Exodus/ExodusDashboard';
import NotFound from '@/pages/NotFound';
import ScrollCry from '@/pages/ScrollCry';
import PrecedentExplorer from '@/pages/PrecedentExplorer';
import { CommunityForum } from '@/components/community/CommunityForum';
import SimulationTrial from '@/pages/SimulationTrial';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/scroll-court" element={<ScrollCourt />} />
      <Route path="/judgment-room" element={<JudgmentRoom />} />
      <Route path="/wealth" element={<WealthDashboard />} />
      <Route path="/exodus" element={<ExodusDashboard />} />
      <Route path="/scroll-cry" element={<ScrollCry />} />
      <Route path="/precedent" element={<PrecedentExplorer />} />
      <Route path="/community" element={<CommunityForum />} />
      <Route path="/simulation-trial" element={<SimulationTrial />} />
      
      {/* Show the NotFound component for undefined routes */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
