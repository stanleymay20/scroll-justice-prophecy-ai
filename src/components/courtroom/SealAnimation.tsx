
import { useEffect, useState } from 'react';

export function SealAnimation() {
  const [showRing1, setShowRing1] = useState(false);
  const [showRing2, setShowRing2] = useState(false);
  const [showRing3, setShowRing3] = useState(false);
  const [showSymbol, setShowSymbol] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  
  useEffect(() => {
    // Sequentially animate the seal components
    const timer1 = setTimeout(() => setShowRing1(true), 200);
    const timer2 = setTimeout(() => setShowRing2(true), 600);
    const timer3 = setTimeout(() => setShowRing3(true), 1000);
    const timer4 = setTimeout(() => setShowSymbol(true), 1400);
    const timer5 = setTimeout(() => setShowFlash(true), 1800);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, []);
  
  return (
    <div className="relative">
      {/* Flash effect */}
      {showFlash && (
        <div className="absolute inset-0 bg-white/80 animate-pulse rounded-full" 
          style={{ 
            width: '300px', 
            height: '300px',
            transform: 'translate(-50%, -50%)',
            left: '50%',
            top: '50%',
            animation: 'pulse 1s ease-in-out',
          }} 
        />
      )}
      
      {/* Outer ring */}
      <div 
        className={`absolute rounded-full border-4 border-justice-tertiary transition-all duration-700 ease-out ${
          showRing1 ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
        }`}
        style={{ 
          width: '260px', 
          height: '260px',
          transform: 'translate(-50%, -50%)',
          left: '50%',
          top: '50%',
        }}
      />
      
      {/* Middle ring */}
      <div 
        className={`absolute rounded-full border-2 border-justice-primary transition-all duration-700 ease-out ${
          showRing2 ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
        }`}
        style={{ 
          width: '200px', 
          height: '200px',
          transform: 'translate(-50%, -50%)',
          left: '50%',
          top: '50%',
        }}
      />
      
      {/* Inner ring */}
      <div 
        className={`absolute rounded-full border-8 border-justice-primary/60 transition-all duration-700 ease-out ${
          showRing3 ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
        }`}
        style={{ 
          width: '150px', 
          height: '150px',
          transform: 'translate(-50%, -50%)',
          left: '50%',
          top: '50%',
        }}
      />
      
      {/* Sacred symbol */}
      <div 
        className={`absolute text-justice-primary transition-all duration-1000 ease-out ${
          showSymbol ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
        }`}
        style={{ 
          transform: 'translate(-50%, -50%)',
          left: '50%',
          top: '50%',
          fontSize: '48px',
        }}
      >
        <div className="flex flex-col items-center justify-center">
          <span className="text-6xl mb-2">⚖️</span>
          <span className="text-xl font-semibold text-white">SEALED</span>
        </div>
      </div>
      
      {/* Text below */}
      <div 
        className={`absolute transition-all duration-1000 delay-500 ${
          showSymbol ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ 
          transform: 'translate(-50%, 0)',
          left: '50%',
          top: '65%',
          width: '300px',
          textAlign: 'center',
        }}
      >
        <p className="text-justice-light text-lg mb-2">Scroll Sealed Successfully</p>
        <p className="text-justice-light/70 text-sm">The verdict has been permanently recorded in the sacred scrolls</p>
      </div>
    </div>
  );
}
