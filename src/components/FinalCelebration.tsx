import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, PartyPopper, Trophy, Heart, RefreshCw, Share2, Award, Gift, Download, Music } from 'lucide-react';
import { sound } from '../utils/audio';
import { triggerMassiveConfetti, triggerStarBurst, triggerFireworks } from '../utils/confetti';
import { FireworksCanvas } from './FireworksCanvas';
import { SurpriseVideoReveal } from './SurpriseVideoReveal';
import { BirthdayConfig } from '../types';

interface FinalCelebrationProps {
  config: BirthdayConfig;
  onRestart: () => void;
  onUpdateVideoUrl: (newUrl: string) => void;
}

const floatingBestieMessages = [
  '👑 Queen of Chaotic Energy',
  '🍕 3 AM Food Partner',
  '😂 Unlimited Laughter Guarantee',
  '🌟 10/10 Best Friend',
  '🚀 Partner in Questionable Ideas',
  '💖 Forever Unbreakable Bond',
];

export const FinalCelebration: React.FC<FinalCelebrationProps> = ({
  config,
  onRestart,
  onUpdateVideoUrl,
}) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Grand celebration cascade
    triggerMassiveConfetti();
    triggerFireworks();
    sound.playSfx('fanfare');
  }, []);

  const handleConfettiBlast = () => {
    sound.playSfx('pop');
    triggerMassiveConfetti();
    triggerFireworks();
  };

  const handleShare = async () => {
    sound.playSfx('sparkle');
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Happy Birthday ${config.friendName}! 🎂✨`,
          text: `A special birthday celebration made for my best friend ${config.friendName}! 🎉`,
          url: window.location.href,
        });
      } catch {
        // Share cancelled
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start text-center px-4 py-12 max-w-4xl mx-auto z-10 select-none">
      {/* Live Canvas Fireworks */}
      <FireworksCanvas />

      {/* Floating Bestie Tags */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-6 max-w-2xl">
        {floatingBestieMessages.map((msg, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * i, duration: 0.3 }}
            className="px-3 py-1 rounded-full bg-slate-900/80 border border-pink-500/30 text-pink-300 text-xs font-semibold backdrop-blur-md shadow-md"
          >
            {msg}
          </motion.span>
        ))}
      </div>

      {/* Main Grand Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full bg-slate-950/85 backdrop-blur-2xl border-2 border-pink-500/40 rounded-3xl p-8 sm:p-12 shadow-[0_0_60px_rgba(236,72,153,0.3)] relative overflow-hidden my-4"
      >
        {/* Glowing Decorative Aura */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl" />

        {/* Crown & Badge */}
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <span className="text-6xl animate-bounce">👑</span>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] tracking-wider uppercase shadow-md">
              BEST FRIEND
            </div>
          </div>
        </div>

        {/* Grand Heading (Exact requested wording) */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-400 to-rose-400 tracking-tight mb-6 drop-shadow-md">
          Happy Birthday, {config.friendName}! ❤️
        </h1>

        {/* Message 1 */}
        <p className="text-xl sm:text-3xl text-slate-100 font-bold max-w-2xl mx-auto leading-relaxed mb-6">
          &ldquo;Stay crazy, stay happy, and never change the amazing person you are!&rdquo;
        </p>

        {/* Message 2 */}
        <p className="text-lg sm:text-2xl text-pink-300 font-semibold max-w-xl mx-auto leading-relaxed mb-8">
          &ldquo;Here&apos;s to another year of adventures, laughter, stupid decisions, and unforgettable memories! 😂❤️&rdquo;
        </p>

        {/* Divider */}
        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-pink-500 to-transparent mx-auto mb-6" />

        {/* Signature (Exact requested wording) */}
        <div className="space-y-1">
          <p className="font-handwriting text-4xl sm:text-5xl font-extrabold text-amber-300 drop-shadow-sm">
            {config.senderName} ❤️
          </p>
          <p className="text-xs font-mono uppercase tracking-widest text-slate-400">
            Official Lifetime Best Friend Certificate
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
          <button
            onClick={handleConfettiBlast}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-bold text-base shadow-lg shadow-pink-500/30 flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
          >
            <PartyPopper className="w-5 h-5" />
            <span>More Confetti! 🎉</span>
          </button>

          <button
            onClick={handleShare}
            className="px-6 py-3.5 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-semibold text-base border border-slate-700 flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
          >
            <Share2 className="w-5 h-5 text-pink-400" />
            <span>{copied ? 'Link Copied! ✨' : 'Share Surprise 💌'}</span>
          </button>

          <button
            onClick={() => {
              sound.playSfx('click');
              onRestart();
            }}
            className="px-6 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 font-semibold text-base border border-slate-800 flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
          >
            <RefreshCw className="w-5 h-5 text-purple-400" />
            <span>Replay Surprise 🔄</span>
          </button>
        </div>
      </motion.div>

      {/* THE GIFT BOX VIDEO REVEAL SECTION */}
      <SurpriseVideoReveal
        friendName={config.friendName}
        senderName={config.senderName}
        videoUrl={config.videoUrl}
        videoTitle={config.videoTitle}
        videoCaption={config.videoCaption}
        onUpdateVideoUrl={onUpdateVideoUrl}
      />
           {/* FINAL FRIENDSHIP MESSAGE */}
      <motion.section
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1 }}
        className="relative w-full max-w-3xl mt-16 mb-10"
      >
        {/* Soft glowing background */}
        <div className="absolute inset-0 bg-pink-500/10 blur-3xl rounded-full" />

        <div className="relative overflow-hidden rounded-[2rem] border border-pink-500/30 bg-slate-950/80 backdrop-blur-2xl px-6 py-12 sm:px-12 sm:py-16 shadow-[0_0_70px_rgba(236,72,153,0.15)]">

          {/* Decorative sparkles */}
          <motion.div
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.8, 1.1, 0.8],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute top-8 left-8 text-pink-300 text-xl"
          >
            ✨
          </motion.div>

          <motion.div
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.8, 1.1, 0.8],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.8,
            }}
            className="absolute top-12 right-10 text-purple-300 text-xl"
          >
            ✨
          </motion.div>

          {/* Infinity symbol */}
          <motion.div
            animate={{
              scale: [1, 1.08, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="text-5xl sm:text-6xl mb-6"
          >
            ♾️
          </motion.div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-rose-300 to-purple-300 tracking-tight leading-tight">
            ONE THING
            <br />
            THAT WON&apos;T
            <br />
            CHANGE
          </h2>

          {/* Divider */}
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-pink-400 to-transparent mx-auto my-8" />

          {/* Message */}
          <div className="space-y-5 text-slate-200">
            <p className="text-lg sm:text-xl leading-relaxed">
              No matter how much
              <br />
              life changes...
            </p>

            <p className="text-lg sm:text-xl leading-relaxed">
              No matter where
              <br />
              we end up...
            </p>

            <p className="text-lg sm:text-xl leading-relaxed font-medium text-pink-100">
              I&apos;ll always be glad
              <br />
              that I got to call
              <br />
              you my best friend.
            </p>
          </div>

          {/* Heart */}
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="text-3xl mt-8"
          >
            ❤️
          </motion.div>

          {/* Signature */}
          <p className="font-handwriting text-4xl sm:text-5xl font-bold text-amber-300 mt-5">
            — Dinesh
          </p>

          {/* THE END */}
          <div className="mt-12 pt-8 border-t border-slate-800/80">
            <motion.div
              animate={{
                opacity: [0.65, 1, 0.65],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <p className="text-xs uppercase tracking-[0.4em] text-slate-500 mb-3">
                And that&apos;s...
              </p>

              <h3 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-400">
                ✨ THE END ✨
              </h3>

              <p className="text-sm text-slate-500 mt-4">
                Some friendships are simply forever. ♾️
              </p>
            </motion.div>
          </div>

        </div>
      </motion.section>
      {/* Footer credits */}
      <footer className="mt-12 text-slate-500 text-xs flex flex-col items-center gap-2">
        <p>
          Crafted with 💖, endless laughter &amp; pure best-friend energy for {config.friendName}.
        </p>
      </footer>
    </div>
  );
};
