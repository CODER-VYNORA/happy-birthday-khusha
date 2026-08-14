import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff, Wind, Sparkles, Flame, Check, ArrowRight } from 'lucide-react';
import { sound } from '../utils/audio';
import { triggerMassiveConfetti, triggerFireworks } from '../utils/confetti';

interface BirthdayCakeProps {
  friendName: string;
  onProceed: () => void;
}

export const BirthdayCake: React.FC<BirthdayCakeProps> = ({ friendName, onProceed }) => {
  const [candles, setCandles] = useState([
    { id: 1, lit: true, smoke: false },
    { id: 2, lit: true, smoke: false },
    { id: 3, lit: true, smoke: false },
    { id: 4, lit: true, smoke: false },
    { id: 5, lit: true, smoke: false },
  ]);
  const [isAllBlown, setIsAllBlown] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const [micVolume, setMicVolume] = useState(0);
  const [micSupported, setMicSupported] = useState(true);
  const [micRequested, setMicRequested] = useState(false);
  const micControllerRef = useRef<{ stop: () => void; isSupported: boolean } | null>(null);

  // Check how many candles are lit
  const litCount = candles.filter((c) => c.lit).length;

  const extinguishCandle = (id: number) => {
    sound.playSfx('blow');
    setCandles((prev) =>
      prev.map((c) => (c.id === id ? { ...c, lit: false, smoke: true } : c))
    );
  };

  const extinguishAllCandles = () => {
    if (isAllBlown) return;
    sound.playSfx('blow');
    setCandles((prev) => prev.map((c) => ({ ...c, lit: false, smoke: true })));
  };

  // Watch for when all candles are blown
  useEffect(() => {
    if (litCount === 0 && !isAllBlown) {
      setIsAllBlown(true);
      if (micControllerRef.current) {
        micControllerRef.current.stop();
        setMicActive(false);
      }
      setTimeout(() => {
        sound.playSfx('cheer');
        sound.playSfx('fanfare');
        triggerMassiveConfetti();
        triggerFireworks();
      }, 400);
    }
  }, [litCount, isAllBlown]);

  const handleStartMic = () => {
    setMicRequested(true);
    const controller = sound.setupBlowingDetector(
      (volume) => {
        setMicVolume(volume);
      },
      () => {
        // High volume noise detected -> extinguish
        extinguishAllCandles();
      }
    );
    micControllerRef.current = controller;
    setMicActive(true);
  };

  useEffect(() => {
    return () => {
      if (micControllerRef.current) {
        micControllerRef.current.stop();
      }
    };
  }, []);

  return (
    <div className="relative min-h-[92vh] flex flex-col items-center justify-center text-center px-4 py-8 max-w-3xl mx-auto z-10 select-none">
      {/* Title & Instructions */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-pink-500/20 text-pink-300 text-xs sm:text-sm font-semibold border border-pink-500/30 mb-3 shadow-sm">
          <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Interactive Wish Portal</span>
        </div>

        {!isAllBlown ? (
          <>
            <h2 className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-400 to-rose-300 tracking-tight">
              Make a Wish, {friendName}! 🎂✨
            </h2>
            <p className="text-lg sm:text-2xl text-slate-200 font-semibold mt-2">
              Okay... now blow the candles! 💨
            </p>
          </>
        ) : (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="space-y-2"
          >
            <h2 className="text-4xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 drop-shadow-[0_0_30px_rgba(251,191,36,0.6)]">
              WISH GRANTED! ✨
            </h2>
            <p className="text-2xl sm:text-4xl font-extrabold text-pink-400">
              HAPPY BIRTHDAY, {friendName.toUpperCase()}! 🎉🎂
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* 3D Animated Cake Stage */}
      <div className="relative my-4 flex flex-col items-center justify-center w-full max-w-sm">
        {/* Glow halo behind cake */}
        <div
          className={`absolute w-72 h-72 rounded-full blur-3xl transition-opacity duration-1000 pointer-events-none ${
            litCount > 0
              ? 'bg-gradient-to-tr from-amber-500/25 via-pink-500/25 to-rose-500/25 opacity-100'
              : 'bg-gradient-to-tr from-purple-500/15 via-pink-500/15 to-transparent opacity-60'
          }`}
        />

        {/* Candles Row on top tier */}
        <div className="relative z-20 flex items-end justify-center gap-4 sm:gap-6 mb-[-6px]">
          {candles.map((candle) => (
            <div
              key={candle.id}
              onClick={() => candle.lit && extinguishCandle(candle.id)}
              className="relative flex flex-col items-center cursor-pointer group"
              title={candle.lit ? 'Click or blow to extinguish!' : 'Extinguished!'}
            >
              {/* Flame or Smoke */}
              <div className="h-10 flex items-end justify-center">
                {candle.lit ? (
                  <motion.div
                    className="relative flex items-center justify-center animate-flicker"
                    animate={{
                      scaleY: micVolume > 0.3 ? [1, 0.4, 0.9, 0.2] : [1, 1.15, 0.9, 1],
                      scaleX: micVolume > 0.3 ? [1, 1.4, 0.8, 1.3] : [1, 0.9, 1.1, 1],
                    }}
                    transition={{ repeat: Infinity, duration: 0.3 }}
                  >
                    {/* Outer orange flame */}
                    <div className="w-5 h-8 bg-gradient-to-t from-amber-500 via-orange-400 to-yellow-200 rounded-[50%_50%_35%_35%/70%_70%_30%_30%] shadow-[0_0_16px_#f97316] relative">
                      {/* Inner blue/white core */}
                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-2 h-3.5 bg-gradient-to-t from-cyan-400 via-white to-yellow-100 rounded-full" />
                    </div>
                  </motion.div>
                ) : candle.smoke ? (
                  /* Smoke puff */
                  <div className="relative animate-smoke flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-slate-300/60 blur-[1px]" />
                    <div className="w-3 h-3 rounded-full bg-slate-400/40 blur-[1px] -mt-1" />
                  </div>
                ) : (
                  /* Unlit wick */
                  <div className="w-0.5 h-2 bg-slate-700" />
                )}
              </div>

              {/* Candle Wick */}
              <div className="w-0.5 h-2.5 bg-neutral-800" />

              {/* Candle Body */}
              <div
                className={`w-3.5 sm:w-4 h-12 rounded-t-sm shadow-md border-x border-white/20 relative overflow-hidden ${
                  candle.id % 2 === 0
                    ? 'bg-gradient-to-b from-pink-400 via-rose-300 to-pink-500'
                    : 'bg-gradient-to-b from-amber-300 via-yellow-200 to-amber-400'
                }`}
              >
                {/* Candle Spiral Stripes */}
                <div className="absolute inset-0 opacity-40 bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,white_4px,white_8px)]" />
              </div>
            </div>
          ))}
        </div>

        {/* 3-TIER BIRTHDAY CAKE */}
        <div className="relative z-10 flex flex-col items-center drop-shadow-2xl">
          {/* Top Tier */}
          <div className="w-40 sm:w-48 h-14 bg-gradient-to-b from-pink-300 via-pink-400 to-rose-400 rounded-t-2xl relative shadow-inner border-t-2 border-white/40 flex items-center justify-center">
            {/* Frosting Drips */}
            <div className="absolute -top-1 inset-x-0 h-4 bg-white rounded-t-2xl flex justify-around">
              <span className="w-3 h-4 bg-white rounded-b-full shadow-xs" />
              <span className="w-3.5 h-6 bg-white rounded-b-full shadow-xs" />
              <span className="w-3 h-3 bg-white rounded-b-full shadow-xs" />
              <span className="w-3.5 h-5 bg-white rounded-b-full shadow-xs" />
              <span className="w-3 h-4 bg-white rounded-b-full shadow-xs" />
            </div>
            {/* Sprinkles */}
            <div className="absolute inset-0 flex items-center justify-around px-4 opacity-80 pointer-events-none">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-300 rotate-12" />
              <span className="w-2 h-1 rounded-sm bg-purple-300 rotate-45" />
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-300" />
              <span className="w-2 h-1 rounded-sm bg-emerald-300 -rotate-12" />
            </div>
          </div>

          {/* Middle Tier */}
          <div className="w-56 sm:w-64 h-16 bg-gradient-to-b from-purple-300 via-purple-400 to-indigo-400 rounded-t-xl relative shadow-md border-t-4 border-white/60 flex items-center justify-center">
            {/* Middle Frosting Drips */}
            <div className="absolute -top-1 inset-x-0 h-4 bg-white flex justify-around">
              <span className="w-4 h-5 bg-white rounded-b-full shadow-xs" />
              <span className="w-3 h-3 bg-white rounded-b-full shadow-xs" />
              <span className="w-4 h-6 bg-white rounded-b-full shadow-xs" />
              <span className="w-3 h-4 bg-white rounded-b-full shadow-xs" />
              <span className="w-4 h-5 bg-white rounded-b-full shadow-xs" />
              <span className="w-3 h-3.5 bg-white rounded-b-full shadow-xs" />
            </div>
            <span className="font-bold text-xs uppercase tracking-widest text-purple-950/70 font-mono">
              ★ BEST FRIEND EDITION ★
            </span>
          </div>

          {/* Bottom Base Tier */}
          <div className="w-72 sm:w-80 h-20 bg-gradient-to-b from-amber-200 via-amber-300 to-yellow-400 rounded-t-xl relative shadow-2xl border-t-4 border-white/80 flex items-center justify-center">
            {/* Bottom Frosting & Pearls */}
            <div className="absolute -top-1 inset-x-0 h-4 bg-white flex justify-around">
              <span className="w-4 h-6 bg-white rounded-b-full shadow-xs" />
              <span className="w-3.5 h-4 bg-white rounded-b-full shadow-xs" />
              <span className="w-5 h-7 bg-white rounded-b-full shadow-xs" />
              <span className="w-3.5 h-3.5 bg-white rounded-b-full shadow-xs" />
              <span className="w-4 h-5 bg-white rounded-b-full shadow-xs" />
              <span className="w-4 h-6 bg-white rounded-b-full shadow-xs" />
            </div>

            {/* Custom Bestie Piping */}
            <div className="font-display font-extrabold text-lg sm:text-xl text-amber-900 drop-shadow-sm tracking-wide">
              ✨ Happy Birthday {friendName} ✨
            </div>
          </div>

          {/* Cake Stand Plate */}
          <div className="w-84 sm:w-96 h-5 bg-gradient-to-r from-slate-300 via-white to-slate-300 rounded-full shadow-2xl border border-slate-200 flex items-center justify-center">
            <div className="w-32 h-2 bg-slate-400/40 rounded-full" />
          </div>
          <div className="w-24 h-4 bg-gradient-to-b from-slate-300 to-slate-400 rounded-b-lg shadow-md" />
        </div>
      </div>

      {/* Interactive Controls & Blowing Options */}
      <div className="mt-8 flex flex-col items-center gap-4 w-full max-w-md">
        {!isAllBlown ? (
          <>
            {/* Microphone Option */}
            <div className="flex flex-wrap items-center justify-center gap-3 w-full">
              {!micActive ? (
                <button
                  id="btn-enable-mic"
                  onClick={handleStartMic}
                  className="px-5 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-pink-300 text-sm font-semibold border border-pink-500/30 flex items-center gap-2 transition-all cursor-pointer shadow-md"
                >
                  <Mic className="w-4 h-4 text-pink-400" />
                  <span>Enable Mic to Blow 🎙️</span>
                </button>
              ) : (
                <div className="flex items-center gap-3 px-4 py-2 bg-pink-950/60 border border-pink-500/40 rounded-xl text-xs text-pink-200">
                  <div className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                  <span>Listening... Blow into your microphone! 💨</span>
                  {/* Visual volume meter */}
                  <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-pink-500 to-amber-400 transition-all duration-75"
                      style={{ width: `${Math.min(100, micVolume * 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Tap to blow fallback */}
              <button
                id="btn-tap-blow"
                onClick={extinguishAllCandles}
                className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-bold text-base shadow-lg shadow-pink-500/30 flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
              >
                <Wind className="w-5 h-5 animate-pulse" />
                <span>Tap here to blow candles 💨</span>
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Tip: You can also tap individual candles to blow them out one by one!
            </p>
          </>
        ) : (
          /* Wish Granted Celebration CTA */
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="flex flex-col items-center gap-4 pt-2"
          >
            <div className="text-slate-200 text-base sm:text-lg font-medium">
              Your birthday wish has been registered with the universe! 🌟
            </div>

            <button
              id="btn-cake-proceed"
              onClick={() => {
                sound.playSfx('fanfare');
                triggerMassiveConfetti();
                onProceed();
              }}
              className="px-9 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-pink-500 to-purple-600 text-white font-extrabold text-xl shadow-2xl shadow-pink-500/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 cursor-pointer"
            >
              <span>See The Final Grand Surprise 🎁✨</span>
              <ArrowRight className="w-6 h-6" />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};
