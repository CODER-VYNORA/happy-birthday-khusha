import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, PartyPopper } from 'lucide-react';
import { triggerConfettiPop, triggerStarBurst } from '../utils/confetti';
import { sound } from '../utils/audio';

interface WelcomeScreenProps {
  friendName: string;
  onProceed: () => void;
  onStartMusic: () => void;
}

const funnyNoMessages = [
  'NO 🙈',
  'Nope 😜',
  'Try again 😂',
  "You can't escape!",
  'Are you sure? 👀',
  'Nice try!',
  'Catch me if you can! 🏃‍♀️',
  'Wrong button bestie! 🙅‍♀️',
  'Error 404: NO not found 🤖',
  'Resistance is futile! 😈',
  'There is only YES! ✨',
];

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  friendName,
  onProceed,
  onStartMusic,
}) => {
  const [noButtonPos, setNoButtonPos] = useState<{ x: number; y: number; rotate: number } | null>(null);
  const [noClickCount, setNoClickCount] = useState(0);
  const [noButtonText, setNoButtonText] = useState('NO 🙈');
  const containerRef = useRef<HTMLDivElement>(null);

  // Evasively change dimensional position whenever cursor or touch comes near
  const teleportNoButton = (e?: React.SyntheticEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    sound.playSfx('boing');
    
    setNoClickCount((prev) => {
      const nextCount = prev + 1;
      const nextTextIndex = nextCount % funnyNoMessages.length;
      setNoButtonText(funnyNoMessages[nextTextIndex]);
      return nextCount;
    });

    // Calculate dynamic boundaries
    const maxRangeX = Math.min(window.innerWidth * 0.38, 220);
    const maxRangeY = Math.min(window.innerHeight * 0.28, 150);

    // Pick a new position that jumps distinctly away
    let newX = (Math.random() - 0.5) * (maxRangeX * 2);
    let newY = (Math.random() - 0.5) * (maxRangeY * 2);

    // Ensure it doesn't land right back at current spot
    if (Math.abs(newX) < 70) newX = newX < 0 ? -130 : 130;
    if (Math.abs(newY) < 45) newY = newY < 0 ? -90 : 90;

    const randomRotate = (Math.random() - 0.5) * 36;

    setNoButtonPos({ x: newX, y: newY, rotate: randomRotate });
  };

  // One click on YES immediately triggers music, celebration & transitions to the next page
  const handleSingleClickYes = () => {
    sound.playSfx('pop');
    sound.playSfx('cheer');
    sound.playSfx('fanfare');
    triggerConfettiPop({ x: 0.5, y: 0.5 });
    triggerStarBurst(0.5, 0.5);
    onStartMusic();
    onProceed();
  };

  return (
    <div
      ref={containerRef}
      className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-4 py-8 max-w-xl mx-auto z-10 select-none"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -25 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="w-full flex flex-col items-center"
      >
        {/* Header Badge */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.15, type: 'spring' }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/20 border border-pink-400/30 text-pink-300 text-sm font-semibold mb-6 shadow-inner"
        >
          <Sparkles className="w-4 h-4 text-pink-300 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Special Mission For Bestie</span>
        </motion.div>

        {/* Greeting */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-300 to-amber-200 mb-4 tracking-tight drop-shadow-md"
        >
          Hey {friendName}! 👀
        </motion.h1>

        {/* Question Text */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="text-lg sm:text-2xl text-slate-200 font-medium max-w-md mx-auto mb-10 leading-relaxed"
        >
          Are you ready for a little birthday surprise? 🎁✨
        </motion.p>

        {/* Action Buttons Area */}
        <div className="relative w-full min-h-[180px] flex items-center justify-center gap-6">
          {/* YES Button - 1 click instantly proceeds */}
          <motion.button
            id="btn-welcome-yes"
            whileHover={{ scale: 1.1, boxShadow: '0 0 30px rgba(236,72,153,0.8)' }}
            whileTap={{ scale: 0.94 }}
            onClick={handleSingleClickYes}
            className="relative z-20 px-8 py-4 sm:px-10 sm:py-4.5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white font-bold text-xl sm:text-2xl shadow-xl shadow-pink-500/35 border border-pink-300/40 flex items-center gap-3 transition-transform cursor-pointer"
          >
            <PartyPopper className="w-6 h-6 animate-bounce" />
            <span>YES! 💖</span>
          </motion.button>

          {/* Dimensionally Evasive NO Button */}
          <motion.button
            id="btn-welcome-no"
            animate={
              noButtonPos
                ? {
                    x: noButtonPos.x,
                    y: noButtonPos.y,
                    rotate: noButtonPos.rotate,
                    scale: Math.max(0.8, 1 - noClickCount * 0.02),
                  }
                : { x: 0, y: 0, rotate: 0, scale: 1 }
            }
            transition={{ type: 'spring', stiffness: 450, damping: 20 }}
            onClick={teleportNoButton}
            onPointerOver={teleportNoButton}
            onPointerDown={teleportNoButton}
            onMouseEnter={teleportNoButton}
            onTouchStart={teleportNoButton}
            className="relative z-10 px-6 py-3.5 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 font-semibold text-base border border-slate-700 shadow-md transition-colors cursor-pointer select-none whitespace-nowrap"
          >
            {noButtonText}
          </motion.button>
        </div>

        {/* Playful hint when NO button is chased */}
        <AnimatePresence>
          {noClickCount >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="mt-6 text-sm text-pink-300/90 font-medium bg-pink-950/40 border border-pink-500/30 px-4 py-2 rounded-xl backdrop-blur-sm"
            >
              {noClickCount < 5
                ? `Haha! The "NO" button is allergic to you ${friendName}! 😂 Click the pink YES button!`
                : `You've tried to click NO ${noClickCount} times! There is literally no escape! Click YES! 🤣`}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
