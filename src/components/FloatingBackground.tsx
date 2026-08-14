import React, { useMemo } from 'react';
import { motion } from 'motion/react';

interface FloatingBackgroundProps {
  intensity?: 'normal' | 'celebration' | 'cake';
}

export const FloatingBackground: React.FC<FloatingBackgroundProps> = ({ intensity = 'normal' }) => {
  // Pre-generate static properties for particles
  const balloons = useMemo(() => {
    const colors = [
      { bg: 'from-pink-400 to-rose-500', shadow: 'rgba(244,63,94,0.4)', string: '#f43f5e' },
      { bg: 'from-purple-400 to-indigo-500', shadow: 'rgba(168,85,247,0.4)', string: '#a855f7' },
      { bg: 'from-amber-300 to-yellow-500', shadow: 'rgba(234,179,8,0.4)', string: '#eab308' },
      { bg: 'from-sky-300 to-cyan-500', shadow: 'rgba(56,189,248,0.4)', string: '#38bdf8' },
      { bg: 'from-emerald-300 to-teal-500', shadow: 'rgba(52,211,153,0.4)', string: '#10b981' },
      { bg: 'from-fuchsia-400 to-pink-600', shadow: 'rgba(217,70,239,0.4)', string: '#d946ef' },
    ];

    const count = intensity === 'celebration' ? 14 : 8;
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: `${(i * (100 / count) + Math.random() * 8) % 94 + 3}%`,
      size: 40 + (i % 3) * 15,
      color: colors[i % colors.length],
      duration: 14 + (i % 5) * 3,
      delay: (i * 1.8) % 10,
      sway: 15 + (i % 4) * 8,
    }));
  }, [intensity]);

  const sparkles = useMemo(() => {
    return Array.from({ length: intensity === 'celebration' ? 30 : 16 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 96 + 2}%`,
      top: `${Math.random() * 96 + 2}%`,
      size: 3 + Math.random() * 6,
      duration: 2 + Math.random() * 3,
      delay: Math.random() * 4,
      color: i % 3 === 0 ? '#fde047' : i % 3 === 1 ? '#f472b6' : '#a78bfa',
    }));
  }, [intensity]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Subtle radial ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-br from-pink-500/10 via-purple-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-gradient-to-tr from-amber-500/10 via-rose-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Floating balloons */}
      {balloons.map((b) => (
        <motion.div
          key={b.id}
          className="absolute -bottom-24 will-change-transform"
          style={{ left: b.left }}
          animate={{
            y: ['0vh', '-125vh'],
            x: [0, b.sway, -b.sway, 0],
            rotate: [-4, 6, -5, 4],
          }}
          transition={{
            y: { duration: b.duration, repeat: Infinity, ease: 'linear', delay: b.delay },
            x: { duration: b.duration / 2.5, repeat: Infinity, ease: 'easeInOut', delay: b.delay },
            rotate: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
          }}
        >
          <div className="relative flex flex-col items-center">
            {/* Balloon Body */}
            <div
              className={`rounded-[50%_50%_50%_50%/40%_40%_60%_60%] bg-gradient-to-b ${b.color.bg} relative shadow-lg`}
              style={{
                width: `${b.size}px`,
                height: `${b.size * 1.25}px`,
                boxShadow: `0 10px 25px ${b.color.shadow}`,
              }}
            >
              {/* Balloon Glare */}
              <div className="absolute top-2 left-2.5 w-2.5 h-4 bg-white/40 rounded-full rotate-[-25deg] blur-[0.5px]" />
              {/* Balloon Knot */}
              <div
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-1.5 rounded-sm"
                style={{ backgroundColor: b.color.string }}
              />
            </div>
            {/* Balloon String */}
            <svg width="12" height="40" className="overflow-visible stroke-current text-white/30" strokeWidth="1.2" fill="none">
              <path d="M6 0 Q10 12 4 24 T6 40" />
            </svg>
          </div>
        </motion.div>
      ))}

      {/* Twinkling Sparkles */}
      {sparkles.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full"
          style={{
            left: s.left,
            top: s.top,
            width: `${s.size}px`,
            height: `${s.size}px`,
            backgroundColor: s.color,
            boxShadow: `0 0 ${s.size * 3}px ${s.color}`,
          }}
          animate={{
            scale: [0, 1.2, 0],
            opacity: [0, 0.9, 0],
            rotate: [0, 90, 180],
          }}
          transition={{
            duration: s.duration,
            repeat: Infinity,
            delay: s.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};
