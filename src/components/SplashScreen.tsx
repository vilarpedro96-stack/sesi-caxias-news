import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { SesiLogo } from './SesiLogo';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      id="splash-screen"
      onClick={onComplete}
      className="fixed inset-0 flex flex-col items-center justify-center z-50 bg-[#353844] cursor-pointer select-none"
    >
      <motion.div
        initial={{ rotate: 0, scale: 0.5, opacity: 0 }}
        animate={{
          rotate: 360 * 3,
          scale: 1,
          opacity: 1
        }}
        transition={{
          duration: 2,
          ease: 'easeOut',
          times: [0, 1]
        }}
        className="mb-8 relative w-48 h-48 flex items-center justify-center filter drop-shadow-2xl"
      >
        <SesiLogo className="w-48 h-48" size={192} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.8 }}
        className="text-center text-white"
      >
        <h1 className="text-4xl font-bold tracking-wider mb-2">SESI CAXIAS NEWS</h1>
        <p className="text-xl font-light italic">
          "Escola que informa, Alunos que crescem"
        </p>
      </motion.div>
    </div>
  );
};
