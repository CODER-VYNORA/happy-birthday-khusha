import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart, ArrowRight, RotateCw, ImagePlus, Eye, MessageCircle, X } from 'lucide-react';
import { MemoryPhoto } from '../types';
import { triggerConfettiPop } from '../utils/confetti';
import { sound } from '../utils/audio';

interface MemoryGalleryProps {
  friendName: string;
  photos: MemoryPhoto[];
  onProceed: () => void;
  onAddPhoto?: (newPhoto: MemoryPhoto) => void;
}

export const MemoryGallery: React.FC<MemoryGalleryProps> = ({
  friendName,
  photos,
  onProceed,
  onAddPhoto,
}) => {
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [likedPhotos, setLikedPhotos] = useState<Record<string, number>>({});
  const [activePhoto, setActivePhoto] = useState<MemoryPhoto | null>(null);

  const dynamicTags = Array.from(
    new Set(photos.map((p) => p.tag).filter((t): t is string => Boolean(t && t.length < 25)))
  );
  const tags = ['All', ...dynamicTags];

  const filteredPhotos = selectedTag === 'All'
    ? photos
    : photos.filter((p) => p.tag === selectedTag);

  const handleCardFlip = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playSfx('click');
    setFlippedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playSfx('pop');
    triggerConfettiPop({ x: 0.5, y: 0.7 });
    setLikedPhotos((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  return (
    <div className="relative min-h-[90vh] flex flex-col items-center justify-start px-4 py-10 max-w-5xl mx-auto z-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-2xl mx-auto mb-8"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-pink-500/20 text-pink-300 text-xs sm:text-sm font-semibold border border-pink-500/30 mb-3">
          <Sparkles className="w-3.5 h-3.5 text-pink-300" />
          <span>The Memory Vault</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-rose-200 to-amber-200 tracking-tight leading-snug">
          A Few Picss of my Crazy Best Friend khushaaaaa 😂
        </h2>
        <p className="text-sm sm:text-base text-slate-300 mt-2">
          Tap any Polaroid to flip it and read our secret inside joke! ✨
        </p>

        {/* Tag Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => {
                sound.playSfx('click');
                setSelectedTag(tag);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                selectedTag === tag
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md shadow-pink-500/20'
                  : 'bg-slate-800/70 hover:bg-slate-700 text-slate-300 border border-slate-700'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Polaroid Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 w-full mb-12">
        {filteredPhotos.map((photo, index) => {
          const isFlipped = !!flippedCards[photo.id];
          const likes = likedPhotos[photo.id] || 0;

          return (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="relative perspective-1000 group cursor-pointer"
              style={{
                transform: `rotate(${photo.rotation || (index % 2 === 0 ? -2 : 2)}deg)`,
              }}
              onClick={() => setActivePhoto(photo)}
            >
              {/* Polaroid Frame */}
              <div
                className="relative bg-stone-100 text-slate-900 rounded-lg p-3.5 pb-6 shadow-2xl transition-all duration-300 hover:scale-105 hover:rotate-0 hover:z-20 hover:shadow-[0_20px_50px_rgba(244,63,94,0.3)] border border-stone-200/80"
              >
                {/* Washi Tape Accent on Top */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-pink-400/40 backdrop-blur-sm -rotate-2 rounded-xs pointer-events-none shadow-xs border-dashed border-x border-pink-400/60" />

                {/* Sticker Emoji in corner */}
                {photo.sticker && (
                  <div className="absolute top-2 right-2 text-2xl z-10 pointer-events-none drop-shadow-md select-none">
                    {photo.sticker}
                  </div>
                )}

                {/* Card Flip Content */}
                {!isFlipped ? (
                  <div>
                    {/* Photo Image */}
                    <div className="relative aspect-[4/3.8] bg-slate-200 rounded-sm overflow-hidden mb-3">
                      <img
                        src={photo.url}
                        alt={photo.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-white text-[11px] font-medium tracking-wide">
                        {photo.date || 'Memory'}
                      </div>
                    </div>

                    {/* Polaroid Bottom Caption */}
                    <div className="space-y-1">
                      <h4 className="font-bold text-base text-slate-900 tracking-tight flex items-center justify-between">
                        <span>{photo.title}</span>
                      </h4>
                      <p className="font-handwriting text-xl text-pink-600 font-bold leading-tight">
                        &ldquo;{photo.caption}&rdquo;
                      </p>
                    </div>
                  </div>
                ) : (
                  /* Flipped Back Note */
                  <div className="aspect-[4/4.5] flex flex-col justify-between p-3 bg-amber-50 rounded-sm border border-amber-200/60">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between border-b border-amber-200/80 pb-1.5">
                        <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Secret Note 🤫</span>
                        <span className="text-xs text-slate-500 font-mono">CONFIDENTIAL</span>
                      </div>
                      <p className="font-handwriting text-2xl text-slate-800 leading-snug pt-2">
                        {photo.secretNote || "Best friend memories that cannot be explained without laughing hysterically 😂"}
                      </p>
                    </div>

                    <div className="text-xs text-amber-700 font-medium italic text-right">
                      - Click to flip back 🔄
                    </div>
                  </div>
                )}

                {/* Interactive Action Bar at bottom */}
                <div className="flex items-center justify-between pt-3 mt-2 border-t border-stone-200/80 text-xs">
                  <button
                    onClick={(e) => handleLike(photo.id, e)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-pink-100 hover:bg-pink-200 text-pink-600 font-semibold transition-colors cursor-pointer"
                  >
                    <Heart className={`w-3.5 h-3.5 ${likes > 0 ? 'fill-pink-600 text-pink-600' : ''}`} />
                    <span>{likes > 0 ? `${likes} Bestie Vibes` : 'Vibe ❤️'}</span>
                  </button>

                  <button
                    onClick={(e) => handleCardFlip(photo.id, e)}
                    className="flex items-center gap-1 text-slate-600 hover:text-slate-900 font-medium py-1 px-2 rounded hover:bg-stone-200/60 transition-colors cursor-pointer"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>{isFlipped ? 'Photo' : 'Secret'}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Lightbox / Big Photo Modal */}
      <AnimatePresence>
        {activePhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActivePhoto(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.85, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-stone-100 text-slate-900 rounded-2xl p-5 max-w-lg w-full shadow-2xl relative"
            >
              <button
                onClick={() => setActivePhoto(null)}
                className="absolute -top-3 -right-3 w-8 h-8 bg-pink-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-pink-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="rounded-xl overflow-hidden mb-4 aspect-4/3 bg-slate-200">
                <img
                  src={activePhoto.url}
                  alt={activePhoto.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-900">{activePhoto.title}</h3>
                <p className="font-handwriting text-3xl text-pink-600 font-bold">
                  &ldquo;{activePhoto.caption}&rdquo;
                </p>
                {activePhoto.secretNote && (
                  <div className="bg-amber-100/80 p-3 rounded-lg border border-amber-300/60 mt-3 text-sm text-slate-800">
                    <span className="font-bold text-amber-900 block mb-1">Behind The Scenes 😂:</span>
                    {activePhoto.secretNote}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom CTA to proceed */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-3"
      >
        <button
          id="btn-memory-proceed"
          onClick={() => {
            sound.playSfx('sparkle');
            onProceed();
          }}
          className="px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white font-bold text-lg sm:text-xl shadow-xl shadow-pink-500/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 cursor-pointer"
        >
          <span>Read My Serious Letter 💌</span>
          <ArrowRight className="w-5 h-5" />
        </button>
        <span className="text-xs text-slate-400">
          Prepare yourself for 30 seconds of pure emotional best-friend vulnerability! 🥺
        </span>
      </motion.div>
    </div>
  );
};
