import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  Pause,
  Sparkles,
  Volume2,
  VolumeX,
  Maximize2,
  Upload,
  Video,
  Check,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { triggerMassiveConfetti, triggerStarBurst } from '../utils/confetti';
import { sound } from '../utils/audio';

interface SurpriseVideoRevealProps {
  friendName: string;
  senderName: string;
  videoUrl: string;
  videoTitle: string;
  videoCaption: string;
  onUpdateVideoUrl?: (newUrl: string) => void;
}

const defaultVideos = [
  {
    url: '/surprise-video-1.mp4',
    title: 'A Special Surprise For You 🎬',
    caption: 'This one is just for you, Khushi ❤️',
  },
  {
    url: '/surprise-video-2.mp4',
    title: 'And One More Surprise ✨',
    caption: 'Because one surprise was clearly not enough! 😂❤️',
  },
];

export const SurpriseVideoReveal: React.FC<SurpriseVideoRevealProps> = ({
  friendName,
  senderName,
  videoUrl,
  videoTitle,
  videoCaption,
  onUpdateVideoUrl,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [showUrlEditor, setShowUrlEditor] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const videos = defaultVideos;

  const activeVideo =
    currentVideo === 0
      ? {
          url: videoUrl || videos[0].url,
          title: videoTitle || videos[0].title,
          caption: videoCaption || videos[0].caption,
        }
      : videos[1];

  const handleOpenBox = () => {
    sound.playSfx('fanfare');
    triggerMassiveConfetti();
    triggerStarBurst(0.5, 0.5);

    setIsOpen(true);
    sound.pauseBgm();

    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }, 800);
  };

  const togglePlay = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
      sound.resumeBgm();
    } else {
      sound.pauseBgm();

      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;

    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const changeVideo = (index: number) => {
    if (index === currentVideo) return;

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }

    setIsPlaying(false);
    setCurrentVideo(index);

    sound.playSfx('sparkle');

    setTimeout(() => {
      if (videoRef.current) {
        sound.pauseBgm();

        videoRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => {});
      }
    }, 450);
  };

  const handlePrevious = () => {
    changeVideo(currentVideo === 0 ? videos.length - 1 : currentVideo - 1);
  };

  const handleNext = () => {
    changeVideo(currentVideo === videos.length - 1 ? 0 : currentVideo + 1);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file && onUpdateVideoUrl) {
      const url = URL.createObjectURL(file);

      onUpdateVideoUrl(url);

      sound.playSfx('sparkle');
    }
  };

  const handleSaveCustomUrl = () => {
    if (customUrlInput.trim() && onUpdateVideoUrl) {
      onUpdateVideoUrl(customUrlInput.trim());

      setShowUrlEditor(false);

      sound.playSfx('sparkle');
    }
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto my-12 z-20 flex flex-col items-center">
      {/* Container Card */}
      <div className="w-full bg-slate-900/80 backdrop-blur-xl border border-pink-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden text-center">

        {/* Glowing Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/15 rounded-full blur-3xl pointer-events-none" />

        {!isOpen ? (
          /* ================= GIFT BOX ================= */
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center py-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-300 text-xs sm:text-sm font-bold uppercase tracking-wider border border-amber-500/30 mb-6">
              <Sparkles
                className="w-4 h-4 text-amber-300 animate-spin"
                style={{ animationDuration: '5s' }}
              />

              <span>The Grand Birthday Reveal 🎁</span>
            </div>

            <h3 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-rose-200 to-amber-200 mb-2">
              One Final Surprise For You!
            </h3>

            <p className="text-slate-300 text-base sm:text-lg mb-8 max-w-md">
              Tap the golden gift box to open your personalized video surprise! ✨
            </p>

            {/* Gift Box */}
            <motion.div
              id="gift-box-interactive"
              whileHover={{ scale: 1.08, rotate: [0, -4, 4, -2, 2, 0] }}
              whileTap={{ scale: 0.95 }}
              onClick={handleOpenBox}
              className="relative w-44 h-44 sm:w-52 sm:h-52 cursor-pointer group my-2 select-none"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-amber-500 rounded-3xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity animate-pulse" />

              <div className="relative w-full h-full bg-gradient-to-br from-pink-600 via-rose-600 to-purple-700 rounded-3xl shadow-2xl border-2 border-pink-300/60 flex items-center justify-center overflow-hidden">

                {/* Vertical Ribbon */}
                <div className="absolute inset-y-0 w-8 bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 shadow-md" />

                {/* Horizontal Ribbon */}
                <div className="absolute inset-x-0 h-8 bg-gradient-to-b from-amber-300 via-yellow-200 to-amber-400 shadow-md" />

                {/* Bow */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="flex -space-x-3 mb-[-10px]">
                    <div className="w-10 h-10 rounded-full border-4 border-amber-300 bg-amber-400/80 shadow-md -rotate-25" />
                    <div className="w-10 h-10 rounded-full border-4 border-amber-300 bg-amber-400/80 shadow-md rotate-25" />
                  </div>

                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-300 to-yellow-100 shadow-lg border-2 border-white flex items-center justify-center text-rose-700 font-black text-xs">
                    ★
                  </div>

                  <span className="mt-3 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-white text-xs font-bold border border-white/20">
                    CLICK TO UNBOX 🎁
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.p
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-pink-300 text-sm font-semibold mt-6"
            >
              ✨ Tap to unlock your video surprise! ✨
            </motion.p>
          </motion.div>
        ) : (
          /* ================= VIDEO REVEAL ================= */
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, type: 'spring' }}
            className="flex flex-col items-center"
          >

            {/* Header */}
            <div className="flex items-center justify-between w-full mb-4 gap-3">
              <div className="flex items-center gap-2 text-pink-300 font-bold text-lg sm:text-xl text-left">
                <Video className="w-5 h-5 text-pink-400 shrink-0" />

                <span>{activeVideo.title}</span>
              </div>

              <button
                onClick={() => setShowUrlEditor(!showUrlEditor)}
                className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                title="Change or upload custom video"
              >
                <Upload className="w-3.5 h-3.5" />

                <span className="hidden sm:inline">
                  Custom Video
                </span>
              </button>
            </div>

            {/* Custom Video Editor */}
            <AnimatePresence>
              {showUrlEditor && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-2xl p-4 mb-4 text-left space-y-3"
                >
                  <p className="text-xs text-slate-300 font-medium">
                    Add Khushi&apos;s real video clip! Paste a direct MP4/video link or select a file from your device:
                  </p>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      placeholder="https://example.com/khushi-video.mp4"
                      value={customUrlInput}
                      onChange={(e) => setCustomUrlInput(e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
                    />

                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveCustomUrl}
                        className="px-3 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Save Link
                      </button>

                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        Choose File
                      </button>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="video/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* VIDEO */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentVideo}
                initial={{ opacity: 0, x: currentVideo === 0 ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: currentVideo === 0 ? 30 : -30 }}
                transition={{ duration: 0.35 }}
                className="w-full"
              >
                <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-pink-500/40 group">

                  <video
                    ref={videoRef}
                    key={activeVideo.url}
                    src={activeVideo.url}
                    playsInline
                    className="w-full h-full object-cover"
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onEnded={() => setIsPlaying(false)}
                  />

                  {/* Video Controls */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4">

                    <div className="flex justify-between items-center text-white text-xs font-medium">
                      <span className="bg-pink-600/80 px-2 py-0.5 rounded backdrop-blur-xs">
                        Happy Birthday {friendName} 🎬
                      </span>

                      <span className="bg-black/50 px-2 py-0.5 rounded-full">
                        {currentVideo + 1} / {videos.length}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">

                      <div className="flex items-center gap-3">

                        {/* Play / Pause */}
                        <button
                          onClick={togglePlay}
                          className="w-10 h-10 rounded-full bg-pink-600/90 text-white flex items-center justify-center shadow-lg hover:bg-pink-500 transition-colors cursor-pointer"
                        >
                          {isPlaying ? (
                            <Pause className="w-5 h-5" />
                          ) : (
                            <Play className="w-5 h-5 ml-0.5" />
                          )}
                        </button>

                        {/* Mute */}
                        <button
                          onClick={toggleMute}
                          className="p-2 rounded-lg bg-black/50 text-white hover:bg-black/80 transition-colors cursor-pointer"
                        >
                          {isMuted ? (
                            <VolumeX className="w-5 h-5" />
                          ) : (
                            <Volume2 className="w-5 h-5" />
                          )}
                        </button>
                      </div>

                      {/* Fullscreen */}
                      <button
                        onClick={() => {
                          if (videoRef.current?.requestFullscreen) {
                            videoRef.current.requestFullscreen();
                          }
                        }}
                        className="p-2 rounded-lg bg-black/50 text-white hover:bg-black/80 transition-colors cursor-pointer"
                      >
                        <Maximize2 className="w-5 h-5" />
                      </button>

                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Dots */}
            <div className="flex items-center gap-2 mt-5">
              {videos.map((_, index) => (
                <button
                  key={index}
                  onClick={() => changeVideo(index)}
                  aria-label={`Open video ${index + 1}`}
                  className={`rounded-full transition-all duration-300 ${
                    currentVideo === index
                      ? 'w-8 h-2 bg-pink-400'
                      : 'w-2 h-2 bg-slate-600 hover:bg-pink-300'
                  }`}
                />
              ))}
            </div>

            {/* Previous / Next */}
            <div className="flex items-center justify-center gap-3 mt-5">

              <button
                onClick={handlePrevious}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-2 transition-all hover:scale-105 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              <button
                onClick={handleNext}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-semibold flex items-center gap-2 shadow-lg shadow-pink-500/20 transition-all hover:scale-105 cursor-pointer"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>

            </div>

            {/* Caption */}
            <div className="mt-4 space-y-2 text-center">
              <p className="text-pink-300 font-medium text-base">
                {activeVideo.caption}
              </p>

              <p className="text-xs text-slate-400">
                A forever keepsake celebrating the greatest best friend in the universe ❤️
              </p>
            </div>

          </motion.div>
        )}
      </div>
    </div>
  );
};