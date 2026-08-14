import React, { useEffect, useRef } from 'react';

export const FireworksCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle class
    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      alpha: number;
      color: string;
      radius: number;
      decay: number;

      constructor(x: number, y: number, color: string) {
        this.x = x;
        this.y = y;
        this.color = color;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 2;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.alpha = 1;
        this.radius = Math.random() * 2.5 + 1;
        this.decay = Math.random() * 0.015 + 0.008;
      }

      update() {
        this.vx *= 0.96;
        this.vy *= 0.96;
        this.vy += 0.04; // gravity
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
      }

      draw(context: CanvasRenderingContext2D) {
        context.save();
        context.globalAlpha = Math.max(0, this.alpha);
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fillStyle = this.color;
        context.shadowBlur = 8;
        context.shadowColor = this.color;
        context.fill();
        context.restore();
      }
    }

    let particles: Particle[] = [];
    const colors = ['#f43f5e', '#ec4899', '#a855f7', '#38bdf8', '#fbbf24', '#4ade80', '#fb7185', '#ffffff'];

    const createFirework = (x: number, y: number) => {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const count = 45;
      for (let i = 0; i < count; i++) {
        particles.push(new Particle(x, y, color));
      }
    };

    let lastLaunch = 0;

    const render = (time: number) => {
      // Clear with soft trail
      ctx.fillStyle = 'rgba(9, 13, 22, 0.2)';
      ctx.fillRect(0, 0, width, height);

      // Auto launch fireworks periodically
      if (time - lastLaunch > 750) {
        lastLaunch = time;
        createFirework(
          Math.random() * (width * 0.8) + width * 0.1,
          Math.random() * (height * 0.5) + height * 0.1
        );
      }

      // Update and draw particles
      particles = particles.filter((p) => p.alpha > 0);
      particles.forEach((p) => {
        p.update();
        p.draw(ctx);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    // Canvas click to spawn fireworks
    const handleClick = (e: MouseEvent) => {
      createFirework(e.clientX, e.clientY);
    };
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 w-full h-full"
    />
  );
};
