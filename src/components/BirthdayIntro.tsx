import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Cake, Gift, Heart, ArrowRight, Stars } from 'lucide-react';
import { triggerMassiveConfetti, triggerStarBurst } from '../utils/confetti';
import { sound } from '../utils/audio';

interface BirthdayIntroProps {
  friendName: string;
  senderName: string;
  onProceed: () => void;
}

export const BirthdayIntro: React.FC<BirthdayIntroProps> = ({
  friendName,
  senderName,
  onProceed,
}) => {
  const [step, setStep] = useState<number>(0);

  useEffect(() => {
    // Cinematic step progression
    const timer1 = setTimeout(() => setStep(1), 800);
    const timer2 = setTimeout(() => setStep(2), 2600);
    const timer3 = setTimeout(() => {
      setStep(3);
      triggerMassiveConfetti();
      sound.playSfx('fanfare');
    }, 4500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const handleBegin = () => {
    sound.playSfx('sparkle');
    triggerStarBurst(0.5, 0.5);
    onProceed();
  };

  return (
    <div className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-4 py-8 max-w-2xl mx-auto z-10 select-none">
      <div className="w-full space-y-6">
        {/* Step 1: Teaser 1 */}
        {step >= 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-lg sm:text-2xl text-pink-200/80 font-medium italic font-serif"
          >
            &ldquo;Today isn&apos;t just another day...&rdquo;
          </motion.div>
        )}

        {/* Step 2: Teaser 2 */}
        {step >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="text-xl sm:text-3xl text-slate-200 font-semibold max-w-lg mx-auto"
          >
            Because someone really special to my life was born today. ✨
          </motion.div>
        )}

        {/* Step 3: Big Birthday Banner & Friendship Message */}
        {step >= 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
            className="pt-4 flex flex-col items-center"
          >
            {/* Top Badge */}
            <motion.div
              animate={{ rotate: [-2, 2, -2] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-pink-500/20 to-purple-500/20 border border-amber-300/40 text-amber-200 text-xs sm:text-sm font-bold uppercase tracking-wider mb-5 shadow-lg shadow-amber-500/10"
            >
              <Stars className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
              <span>Official Best-Friend Celebration Day</span>
              <Stars className="w-4 h-4 text-amber-300" />
            </motion.div>

            {/* Giant Birthday Heading */}
            <motion.h1
              className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-tight mb-4"
            >
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-400 to-rose-400 drop-shadow-[0_4px_24px_rgba(244,63,94,0.45)]">
                HAPPY BIRTHDAY
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-300 to-cyan-300 uppercase mt-1 drop-shadow-[0_4px_24px_rgba(168,85,247,0.45)]">
                {friendName}! 🎂🎉
              </span>
            </motion.h1>

            {/* Friendship Declaration */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-slate-900/70 border border-slate-700/60 backdrop-blur-md rounded-2xl p-5 sm:p-6 max-w-lg mx-auto shadow-2xl my-6"
            >
              <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-medium">
                To one of my closest best friends, <br />
                <span className="text-pink-300 font-semibold">here&apos;s a little surprise I made for you ❤️</span>
              </p>
              <div className="flex items-center justify-center gap-2 mt-3 text-xs text-slate-400">
                <span>Made with chaos, laughter &amp; friendship</span>
                <span>•</span>
                <span>From {senderName}</span>
              </div>
            </motion.div>

            {/* Begin Button */}
            <motion.button
              id="btn-intro-begin"
              whileHover={{ scale: 1.06, boxShadow: '0 0 30px rgba(236,72,153,0.7)' }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBegin}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-bold text-lg sm:text-xl shadow-xl shadow-purple-500/30 border border-white/20 flex items-center gap-3 cursor-pointer mt-2"
            >
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
              <span>Let&apos;s Begin ✨</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Skip button for quick review if user wants */}
      {step < 3 && (
        <button
          onClick={() => {
            setStep(3);
            triggerMassiveConfetti();
          }}
          className="absolute bottom-6 text-xs text-slate-500 hover:text-slate-300 underline transition-colors cursor-pointer"
        >
          Skip animation ⏩
        </button>
      )}
    </div>
  );
};
