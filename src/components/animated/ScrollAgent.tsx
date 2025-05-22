
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

type AgentState = 'idle' | 'loading' | 'processing' | 'judging' | 'complete';

interface ScrollAgentProps {
  state?: AgentState;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  withParticles?: boolean;
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  autoAnimate?: boolean;
}

export const ScrollAgent: React.FC<ScrollAgentProps> = ({ 
  state = 'idle',
  position = 'bottom-right',
  withParticles = false,
  size = 'md',
  message,
  autoAnimate = false
}) => {
  const [currentState, setCurrentState] = useState<AgentState>(state);
  const [showMessage, setShowMessage] = useState(false);
  
  // Auto-animate through states if enabled
  useEffect(() => {
    if (!autoAnimate) {
      setCurrentState(state);
      return;
    }
    
    const states: AgentState[] = ['idle', 'loading', 'processing', 'judging', 'complete'];
    let currentIndex = states.indexOf(state);
    
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % states.length;
      setCurrentState(states[currentIndex]);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [state, autoAnimate]);
  
  // Show message when state changes
  useEffect(() => {
    if (message) {
      setShowMessage(true);
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [message, currentState]);
  
  // Determine position classes
  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
  };
  
  // Determine size
  const sizeClasses = {
    'sm': 'w-16 h-16',
    'md': 'w-24 h-24',
    'lg': 'w-32 h-32'
  };
  
  // Determine icon based on state
  const renderAgentIcon = () => {
    switch (currentState) {
      case 'idle':
        return (
          <div className={`relative ${sizeClasses[size]}`}>
            <motion.div 
              className="absolute inset-0 bg-justice-primary rounded-full opacity-20"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 3 }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3/4 h-3/4 rounded-full bg-gradient-to-br from-justice-primary to-justice-tertiary flex items-center justify-center">
                <span className="text-white font-cinzel font-bold text-xl">SJ</span>
              </div>
            </div>
          </div>
        );
      
      case 'loading':
        return (
          <div className={`relative ${sizeClasses[size]}`}>
            <motion.div 
              className="absolute inset-0 border-4 border-justice-primary/30 rounded-full"
              style={{ borderTopColor: 'rgb(155, 135, 245)' }}
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3/5 h-3/5 rounded-full bg-gradient-to-br from-justice-primary to-justice-tertiary flex items-center justify-center">
                <span className="text-white font-cinzel font-bold text-lg">SJ</span>
              </div>
            </div>
          </div>
        );
      
      case 'processing':
        return (
          <div className={`relative ${sizeClasses[size]}`}>
            <motion.div 
              className="absolute inset-0 bg-justice-primary/20 rounded-full"
              animate={{ 
                boxShadow: [
                  '0 0 0 0 rgba(155, 135, 245, 0.4)', 
                  '0 0 0 20px rgba(155, 135, 245, 0)',
                  '0 0 0 0 rgba(155, 135, 245, 0)'
                ]
              }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
            <motion.div 
              className="absolute inset-0 flex items-center justify-center"
              animate={{ rotate: [0, 15, 0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            >
              <div className="w-4/5 h-4/5 rounded-full bg-gradient-to-br from-justice-primary to-justice-tertiary flex items-center justify-center">
                <span className="text-white font-cinzel font-bold text-xl">SJ</span>
              </div>
            </motion.div>
          </div>
        );
        
      case 'judging':
        return (
          <div className={`relative ${sizeClasses[size]}`}>
            <motion.div 
              className="absolute inset-0 rounded-full"
              initial={{ background: 'rgba(155, 135, 245, 0.2)' }}
              animate={{ 
                background: [
                  'rgba(155, 135, 245, 0.2)',
                  'rgba(255, 165, 0, 0.3)',
                  'rgba(155, 135, 245, 0.2)'
                ],
                scale: [1, 1.05, 1]
              }}
              transition={{ repeat: Infinity, duration: 3 }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div 
                className="w-4/5 h-4/5 rounded-full bg-gradient-to-br from-justice-primary to-justice-tertiary flex items-center justify-center"
                animate={{ 
                  boxShadow: [
                    '0 0 15px rgba(255, 165, 0, 0.5)',
                    '0 0 25px rgba(255, 165, 0, 0.7)',
                    '0 0 15px rgba(255, 165, 0, 0.5)'
                  ]
                }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <span className="text-white font-cinzel font-bold text-xl">SJ</span>
              </motion.div>
            </div>
          </div>
        );
        
      case 'complete':
        return (
          <div className={`relative ${sizeClasses[size]}`}>
            <motion.div 
              className="absolute inset-0 bg-green-500/20 rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            />
            <motion.div 
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="w-4/5 h-4/5 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                <motion.span 
                  className="text-white font-cinzel font-bold text-xl"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: 'spring' }}
                >
                  SJ
                </motion.span>
              </div>
            </motion.div>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  // Particles for aura effect
  const renderParticles = () => {
    if (!withParticles) return null;
    
    return (
      <div className="absolute inset-0 -z-10">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-justice-primary/80"
            initial={{ 
              x: 0, 
              y: 0,
              opacity: 0
            }}
            animate={{ 
              x: Math.random() * 100 - 50, 
              y: Math.random() * 100 - 50,
              opacity: [0, 0.8, 0]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 3 + Math.random() * 2,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>
    );
  };
  
  // Messages that correspond to states
  const stateMessages = {
    idle: "Awaiting sacred petition",
    loading: "Consulting the scrolls",
    processing: "Analyzing evidence",
    judging: "Seeking divine wisdom",
    complete: "Justice determined"
  };
  
  const displayMessage = message || stateMessages[currentState];
  
  return (
    <div className={`fixed ${positionClasses[position]} z-30`}>
      <div className="relative">
        {renderAgentIcon()}
        {renderParticles()}
        
        {/* Message tooltip */}
        {(showMessage || autoAnimate) && (
          <motion.div 
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 bg-black/80 px-4 py-2 rounded-lg border border-justice-primary/30 whitespace-nowrap"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <p className="text-justice-light text-sm">{displayMessage}</p>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-3 h-3 bg-black/80 border-r border-b border-justice-primary/30"></div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ScrollAgent;
