import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Mail, Sparkles, Gift, Heart, Laugh, CheckCircle2 } from 'lucide-react';
import { sound } from '../utils/audio';
import { triggerConfettiPop } from '../utils/confetti';

interface FriendshipMessageProps {
  friendName: string;
  senderName: string;
  letterTitle: string;
  letterBody: string[];
  letterClosing: string;
  onProceed: () => void;
}

export const FriendshipMessage: React.FC<FriendshipMessageProps> = ({
  friendName,
  senderName,
  letterTitle,
  letterBody,
  letterClosing,
  onProceed,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [typedParagraphs, setTypedParagraphs] = useState<string[]>([]);
  const [isTypingDone, setIsTypingDone] = useState(false);
  const [isFastForward, setIsFastForward] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    if (isFastForward) {
      setTypedParagraphs(letterBody);
      setIsTypingDone(true);
      return;
    }

    let currentParaIdx = 0;
    let currentCharIdx = 0;
    const workingParagraphs = new Array(letterBody.length).fill('');

    const interval = setInterval(() => {
      if (currentParaIdx >= letterBody.length) {
        setIsTypingDone(true);
        clearInterval(interval);
        return;
      }

      const targetText = letterBody[currentParaIdx];
      currentCharIdx += 3; // Type 3 chars at a time for smooth speed

      if (currentCharIdx >= targetText.length) {
        workingParagraphs[currentParaIdx] = targetText;
        currentParaIdx++;
        currentCharIdx = 0;
      } else {
        workingParagraphs[currentParaIdx] = targetText.slice(0, currentCharIdx);
      }

      setTypedParagraphs([...workingParagraphs]);
    }, 25);

    return () => clearInterval(interval);
  }, [isOpen, isFastForward, letterBody]);

  const handleOpenEnvelope = () => {
    sound.playSfx('sparkle');
    triggerConfettiPop({ x: 0.5, y: 0.6 });
    setIsOpen(true);
  };

  const handleProceed = () => {
    sound.playSfx('fanfare');
    triggerConfettiPop({ x: 0.5, y: 0.5 });
    onProceed();
  };

  return (
    <div className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 py-8 max-w-3xl mx-auto z-10">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs sm:text-sm font-semibold border border-purple-500/30 mb-2">
          <Heart className="w-3.5 h-3.5 text-pink-400" />
          <span>Vulnerability Mode Activated</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-rose-200 to-amber-200 tracking-tight">
          {letterTitle}
        </h2>
      </motion.div>

      {/* Envelope or Opened Letter */}
      {!isOpen ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-md bg-gradient-to-br from-pink-950/40 via-purple-950/40 to-slate-900/80 border border-pink-500/30 rounded-3xl p-8 text-center shadow-2xl backdrop-blur-xl flex flex-col items-center"
        >
          {/* Animated Wax Seal Envelope Graphic */}
          <div className="relative w-36 h-28 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl shadow-xl flex items-center justify-center mb-6 border border-amber-300/80 transform hover:scale-105 transition-transform">
            <div className="absolute -top-4 w-28 h-14 bg-amber-200/90 rounded-t-full border-t border-amber-300/80" />
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-rose-600 to-pink-500 flex items-center justify-center text-white shadow-lg border-2 border-rose-300 z-10 animate-pulse">
              <Mail className="w-6 h-6" />
            </div>
            <div className="absolute bottom-2 text-[10px] font-mono font-bold text-amber-800 tracking-widest uppercase">
              To: {friendName}
            </div>
          </div>

          <p className="text-slate-300 text-base mb-6 font-medium">
            You received a confidential best-friend letter with high dosage of genuine appreciation &amp; mild sarcasm.
          </p>

          <button
            id="btn-open-envelope"
            onClick={handleOpenEnvelope}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white font-bold text-lg shadow-xl shadow-pink-500/30 hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-5 h-5 text-amber-200 animate-spin" style={{ animationDuration: '4s' }} />
            <span>Unseal Letter 📜</span>
          </button>
        </motion.div>
      ) : (
        /* The Unsealed Letter Document */
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full bg-[#fdfbf7] text-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl border-4 border-[#eedbc9] relative overflow-hidden"
        >
          {/* Subtle Vintage Stamp and Watermark */}
          <div className="absolute top-4 right-4 flex items-center gap-2 border-2 border-dashed border-rose-400/60 p-2 rounded-lg rotate-3 bg-rose-50/50">
            <span className="text-2xl">🎂</span>
            <div className="text-[10px] font-bold font-mono text-rose-700 leading-tight">
              OFFICIAL BESTIE<br />CERTIFIED
            </div>
          </div>

          {/* Letter Header */}
          <div className="border-b-2 border-amber-200/80 pb-4 mb-6">
            <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-pink-700">
              For Khushi, My Irreplaceable Best Friend ✨
            </h3>
            <p className="text-xs text-slate-500 font-mono mt-1">
              Date: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} • Mood: 100% Grateful &amp; 0% Filtered
            </p>
          </div>

          {/* Letter Body (Typewritten) */}
          <div className="space-y-4 text-base sm:text-lg text-slate-700 leading-relaxed font-sans min-h-[220px]">
            {typedParagraphs.map((para, i) => (
              <p key={i} className={i === 0 ? 'font-bold text-slate-900' : ''}>
                {para}
              </p>
            ))}
            {!isTypingDone && (
              <span className="inline-block w-2.5 h-5 bg-pink-500 animate-pulse align-middle ml-1" />
            )}
          </div>

          {/* Signature */}
          {isTypingDone && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 pt-4 border-t border-amber-200 flex flex-col items-end"
            >
              <p className="font-handwriting text-3xl font-bold text-pink-600">
                {letterClosing}
              </p>
              <p className="text-xs font-semibold text-slate-500 tracking-wider uppercase mt-1">
                {senderName}
              </p>
            </motion.div>
          )}

          {/* Fast-forward button if still typing */}
          {!isTypingDone && (
            <div className="mt-4 text-center">
              <button
                onClick={() => setIsFastForward(true)}
                className="text-xs text-pink-600 hover:text-pink-800 font-semibold underline cursor-pointer"
              >
                Read all instantly ⚡
              </button>
            </div>
          )}

          {/* Bottom Transition Section */}
          {isTypingDone && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8 pt-6 border-t-2 border-dashed border-amber-300 text-center space-y-4"
            >
              <div className="text-slate-800 font-bold text-lg sm:text-xl">
                Okay enough emotional stuff. 😂
              </div>
              <div className="text-pink-600 font-extrabold text-xl sm:text-2xl">
                There&apos;s still one more surprise...
              </div>

              <button
                id="btn-letter-show-me"
                onClick={handleProceed}
                className="px-9 py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white font-extrabold text-xl shadow-xl shadow-pink-500/30 hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-3 cursor-pointer"
              >
                <Gift className="w-6 h-6 animate-bounce" />
                <span>SHOW ME 🎁</span>
              </button>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
};
