
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/advanced-ui/GlassCard';
import { Scroll, Home, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-justice-dark to-black flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-4">
            <Scroll className="h-16 w-16 text-justice-primary" />
          </div>
          <h1 className="text-4xl font-cinzel text-white mb-2">404</h1>
          <h2 className="text-2xl font-cinzel text-justice-light">Sacred Page Not Found</h2>
        </div>

        <GlassCard className="p-8">
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-justice-light text-lg mb-4">
                The sacred scroll you seek has been lost to the void.
              </p>
              <p className="text-justice-light/70 text-sm">
                This page does not exist in the ScrollJustice realm.
              </p>
            </div>

            <div className="space-y-3">
              <Button
                asChild
                className="w-full bg-justice-primary hover:bg-justice-tertiary"
              >
                <Link to="/dashboard">
                  <Home className="h-4 w-4 mr-2" />
                  Return to Sacred Dashboard
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="w-full border-justice-primary/30 text-justice-light hover:text-white"
              >
                <Link to="javascript:history.back()">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Go Back
                </Link>
              </Button>
            </div>

            <div className="text-center pt-4 border-t border-justice-primary/20">
              <p className="text-justice-light/70 text-xs">
                If you believe this is an error, please contact the sacred administrators.
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default NotFoundPage;
