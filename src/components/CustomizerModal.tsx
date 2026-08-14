import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, X, Plus, Trash2, Check, Image, Video, FileText, Music, Sparkles } from 'lucide-react';
import { BirthdayConfig, MemoryPhoto } from '../types';
import { sound } from '../utils/audio';

interface CustomizerModalProps {
  config: BirthdayConfig;
  onSave: (newConfig: BirthdayConfig) => void;
}

export const CustomizerModal: React.FC<CustomizerModalProps> = ({ config, onSave }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<BirthdayConfig>(config);
  const [activeTab, setActiveTab] = useState<'info' | 'photos' | 'letter' | 'video'>('info');

  const handleSave = () => {
    sound.playSfx('sparkle');
    onSave(formData);
    setIsOpen(false);
  };

  const handleAddPhoto = () => {
    const newPhoto: MemoryPhoto = {
      id: `p-${Date.now()}`,
      url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
      title: 'New Memory',
      caption: 'Unforgettable bestie moment! 😂',
      date: 'Special Moment',
      rotation: (Math.random() - 0.5) * 6,
      tag: 'Iconic',
      sticker: '✨',
      secretNote: 'Inside joke goes here!',
    };
    setFormData((prev) => ({
      ...prev,
      photos: [...prev.photos, newPhoto],
    }));
  };

  const handleRemovePhoto = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((p) => p.id !== id),
    }));
  };

  return (
    <>
      {/* Floating Gear Button in Bottom Left */}
      <button
        id="btn-settings-toggle"
        onClick={() => {
          sound.playSfx('click');
          setFormData(config);
          setIsOpen(true);
        }}
        className="fixed bottom-4 left-4 z-50 flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 backdrop-blur-md text-xs font-medium shadow-lg transition-all cursor-pointer group"
        title="Customize Names, Photos & Message"
      >
        <Settings className="w-4 h-4 text-pink-400 group-hover:rotate-90 transition-transform duration-300" />
        <span className="hidden sm:inline">Customize Surprise ✏️</span>
      </button>

      {/* Modal Dialog */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-2xl max-h-[88vh] overflow-hidden flex flex-col shadow-2xl text-slate-100"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-5 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-pink-400" />
                  <h3 className="text-lg font-bold text-white">Customize Birthday Surprise</h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Tabs */}
              <div className="flex border-b border-slate-800 bg-slate-950/50 px-4 pt-2 gap-2 text-xs font-semibold overflow-x-auto">
                <button
                  onClick={() => setActiveTab('info')}
                  className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
                    activeTab === 'info' ? 'border-pink-500 text-pink-400' : 'border-transparent text-slate-400'
                  }`}
                >
                  Names &amp; Basics
                </button>
                <button
                  onClick={() => setActiveTab('photos')}
                  className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
                    activeTab === 'photos' ? 'border-pink-500 text-pink-400' : 'border-transparent text-slate-400'
                  }`}
                >
                  Memories &amp; Photos ({formData.photos.length})
                </button>
                <button
                  onClick={() => setActiveTab('letter')}
                  className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
                    activeTab === 'letter' ? 'border-pink-500 text-pink-400' : 'border-transparent text-slate-400'
                  }`}
                >
                  Friendship Letter
                </button>
                <button
                  onClick={() => setActiveTab('video')}
                  className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
                    activeTab === 'video' ? 'border-pink-500 text-pink-400' : 'border-transparent text-slate-400'
                  }`}
                >
                  Video Surprise
                </button>
              </div>

              {/* Modal Body Scroll Area */}
              <div className="p-6 overflow-y-auto space-y-5 flex-1">
                {activeTab === 'info' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                        Birthday Girl&apos;s Name
                      </label>
                      <input
                        type="text"
                        value={formData.friendName}
                        onChange={(e) => setFormData({ ...formData, friendName: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-pink-500"
                        placeholder="Khushi"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                        Your Name / Sign-off
                      </label>
                      <input
                        type="text"
                        value={formData.senderName}
                        onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-pink-500"
                        placeholder="Your Best Friend"
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'photos' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">Manage Polaroid photos and funny captions:</span>
                      <button
                        onClick={handleAddPhoto}
                        className="px-3 py-1.5 bg-pink-600 hover:bg-pink-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Photo</span>
                      </button>
                    </div>

                    <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                      {formData.photos.map((photo, index) => (
                        <div
                          key={photo.id}
                          className="bg-slate-800/80 border border-slate-700 rounded-xl p-3 flex gap-3 items-start"
                        >
                          <img
                            src={photo.url}
                            alt=""
                            className="w-16 h-16 object-cover rounded-lg bg-slate-900 shrink-0"
                          />
                          <div className="flex-1 space-y-2 text-xs">
                            <input
                              type="text"
                              value={photo.title}
                              onChange={(e) => {
                                const newPhotos = [...formData.photos];
                                newPhotos[index].title = e.target.value;
                                setFormData({ ...formData, photos: newPhotos });
                              }}
                              placeholder="Title"
                              className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                            />
                            <input
                              type="text"
                              value={photo.caption}
                              onChange={(e) => {
                                const newPhotos = [...formData.photos];
                                newPhotos[index].caption = e.target.value;
                                setFormData({ ...formData, photos: newPhotos });
                              }}
                              placeholder="Funny Caption"
                              className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-pink-300"
                            />
                            <input
                              type="text"
                              value={photo.url}
                              onChange={(e) => {
                                const newPhotos = [...formData.photos];
                                newPhotos[index].url = e.target.value;
                                setFormData({ ...formData, photos: newPhotos });
                              }}
                              placeholder="Image URL"
                              className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-400 font-mono text-[11px]"
                            />
                          </div>
                          <button
                            onClick={() => handleRemovePhoto(photo.id)}
                            className="p-1.5 text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'letter' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                        Letter Paragraphs (One per box)
                      </label>
                      <div className="space-y-2">
                        {formData.letterBody.map((para, idx) => (
                          <textarea
                            key={idx}
                            rows={3}
                            value={para}
                            onChange={(e) => {
                              const newBody = [...formData.letterBody];
                              newBody[idx] = e.target.value;
                              setFormData({ ...formData, letterBody: newBody });
                            }}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-pink-500"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'video' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                        Surprise Video URL (MP4 direct link)
                      </label>
                      <input
                        type="text"
                        value={formData.videoUrl}
                        onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-pink-500"
                        placeholder="https://.../video.mp4"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                        Video Title &amp; Note
                      </label>
                      <input
                        type="text"
                        value={formData.videoTitle}
                        onChange={(e) => setFormData({ ...formData, videoTitle: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-pink-500 mb-2"
                      />
                      <input
                        type="text"
                        value={formData.videoCaption}
                        onChange={(e) => setFormData({ ...formData, videoCaption: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-pink-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end gap-3">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-sm font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-5 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-sm font-bold flex items-center gap-1.5 shadow-md shadow-pink-600/30 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
