import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { FloatingBackground } from './components/FloatingBackground';
import { AudioPlayerToggle } from './components/AudioPlayerToggle';
import { WelcomeScreen } from './components/WelcomeScreen';
import { BirthdayIntro } from './components/BirthdayIntro';
import { MemoryGallery } from './components/MemoryGallery';
import { FriendshipMessage } from './components/FriendshipMessage';
import { BirthdayCake } from './components/BirthdayCake';
import { FinalCelebration } from './components/FinalCelebration';
import { CustomizerModal } from './components/CustomizerModal';
import { defaultBirthdayConfig } from './data/defaultContent';
import { BirthdayConfig, MemoryPhoto } from './types';
import { sound } from './utils/audio';

export default function App() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [config, setConfig] = useState<BirthdayConfig>(defaultBirthdayConfig);
  const [isMusicPlaying, setIsMusicPlaying] = useState<boolean>(false);

  const startMusic = () => {
    if (!isMusicPlaying) {
      sound.startBgm(config.customMusicUrl || '/bgm.mp3');
      setIsMusicPlaying(true);
    }
  };

  const toggleMusic = () => {
    const isMuted = sound.toggleMute();
    setIsMusicPlaying(!isMuted);
  };

  const handleUpdateConfig = (newConfig: BirthdayConfig) => {
    setConfig(newConfig);
    if (newConfig.customMusicUrl) {
      sound.setBgmUrl(newConfig.customMusicUrl);
    }
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(6, prev + 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRestart = () => {
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateVideoUrl = (newUrl: string) => {
    setConfig((prev) => ({ ...prev, videoUrl: newUrl }));
  };

  const handleAddPhoto = (newPhoto: MemoryPhoto) => {
    setConfig((prev) => ({ ...prev, photos: [...prev.photos, newPhoto] }));
  };

  // Page step icons for breadcrumbs
  const steps = [
    { num: 1, label: 'Intro', emoji: '👀' },
    { num: 2, label: 'Reveal', emoji: '🎉' },
    { num: 3, label: 'Memories', emoji: '📸' },
    { num: 4, label: 'Letter', emoji: '💌' },
    { num: 5, label: 'Make a Wish', emoji: '🎂' },
    { num: 6, label: 'Gift & Finale', emoji: '🎁' },
  ];

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 relative overflow-x-hidden flex flex-col justify-between selection:bg-pink-500 selection:text-white">
      {/* Dynamic Animated Background with Floating Balloons & Sparkles */}
      <FloatingBackground intensity={currentPage === 6 ? 'celebration' : currentPage === 5 ? 'cake' : 'normal'} />

      {/* Floating Audio BGM Widget */}
      <AudioPlayerToggle isPlaying={isMusicPlaying} onToggle={toggleMusic} />

      {/* Subtle Step Progress Header (Visible on Page 2+) */}
      {currentPage > 1 && (
        <header className="relative z-30 pt-4 pb-2 px-4 flex items-center justify-center">
          <div className="flex items-center gap-1.5 sm:gap-2.5 bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-full px-4 py-1.5 shadow-lg">
            {steps.map((step) => {
              const isActive = currentPage === step.num;
              const isPast = currentPage > step.num;

              return (
                <button
                  key={step.num}
                  onClick={() => {
                    sound.playSfx('click');
                    setCurrentPage(step.num);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md shadow-pink-500/30 scale-105'
                      : isPast
                      ? 'text-pink-300 hover:text-white hover:bg-slate-800/80'
                      : 'text-slate-500 hover:text-slate-400'
                  }`}
                  title={step.label}
                >
                  <span>{step.emoji}</span>
                  <span className="hidden md:inline">{step.label}</span>
                </button>
              );
            })}
          </div>
        </header>
      )}

      {/* Main Interactive Stage Container */}
      <main className="relative z-10 flex-1 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {currentPage === 1 && (
            <motion.div
              key="page-1"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
              <WelcomeScreen
                friendName={config.friendName}
                onProceed={handleNextPage}
                onStartMusic={startMusic}
              />
            </motion.div>
          )}

          {currentPage === 2 && (
            <motion.div
              key="page-2"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
              <BirthdayIntro
                friendName={config.friendName}
                senderName={config.senderName}
                onProceed={handleNextPage}
              />
            </motion.div>
          )}

          {currentPage === 3 && (
            <motion.div
              key="page-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
              <MemoryGallery
                friendName={config.friendName}
                photos={config.photos}
                onProceed={handleNextPage}
                onAddPhoto={handleAddPhoto}
              />
            </motion.div>
          )}

          {currentPage === 4 && (
            <motion.div
              key="page-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
              <FriendshipMessage
                friendName={config.friendName}
                senderName={config.senderName}
                letterTitle={config.letterTitle}
                letterBody={config.letterBody}
                letterClosing={config.letterClosing}
                onProceed={handleNextPage}
              />
            </motion.div>
          )}

          {currentPage === 5 && (
            <motion.div
              key="page-5"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
              <BirthdayCake
                friendName={config.friendName}
                onProceed={handleNextPage}
              />
            </motion.div>
          )}

          {currentPage === 6 && (
            <motion.div
              key="page-6"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <FinalCelebration
                config={config}
                onRestart={handleRestart}
                onUpdateVideoUrl={handleUpdateVideoUrl}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Customizer Modal for easy editing of photos, videos, & letters */}
      <CustomizerModal config={config} onSave={handleUpdateConfig} />
    </div>
  );
}
