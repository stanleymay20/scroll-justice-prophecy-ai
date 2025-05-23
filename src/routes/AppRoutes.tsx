
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Index from '@/pages/Index';
import ScrollCourt from '@/pages/ScrollCourt';
import JudgmentRoom from '@/pages/JudgmentRoom';
import WealthDashboard from '@/pages/Wealth/WealthDashboard';
import ExodusDashboard from '@/pages/Exodus/ExodusDashboard';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/scroll-court" element={<ScrollCourt />} />
      <Route path="/judgment-room" element={<JudgmentRoom />} />
      <Route path="/wealth" element={<WealthDashboard />} />
      <Route path="/exodus" element={<ExodusDashboard />} />
      
      {/* Instead of a 404 page, redirect to the home page */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
