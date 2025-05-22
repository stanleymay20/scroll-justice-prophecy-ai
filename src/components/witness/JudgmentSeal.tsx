
import React from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

interface JudgmentSealProps {
  visible: boolean;
  institutionName?: string;
}

export function JudgmentSeal({ visible, institutionName }: JudgmentSealProps) {
  if (!visible) return null;
  
  return (
    <div className="absolute inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/60" />
      
      <motion.div 
        className="relative z-10 max-w-md w-full bg-black/80 border border-red-700 p-8 rounded-md text-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="relative">
            <Flame size={48} className="text-red-500" />
            <motion.div 
              className="absolute inset-0 text-red-300"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Flame size={48} />
            </motion.div>
          </div>
        </motion.div>
        
        <h3 className="text-xl font-bold text-red-500 mt-8 mb-4">
          JUDGMENT SEALED
        </h3>
        
        {institutionName && (
          <p className="text-white mb-4 font-bold">
            {institutionName}
          </p>
        )}
        
        <p className="text-red-200 mb-6">
          This institution has ignored the scroll warning and is now sealed for judgment.
        </p>
        
        <div className="text-xs text-red-400 border-t border-red-900 pt-4">
          Sealed by the ScrollJustice System under divine mandate
        </div>
      </motion.div>
    </div>
  );
}
