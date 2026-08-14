import confetti from 'canvas-confetti';

export function triggerConfettiPop(origin = { x: 0.5, y: 0.7 }) {
  confetti({
    particleCount: 60,
    spread: 70,
    origin,
    colors: ['#f43f5e', '#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#fbbf24'],
    ticks: 200,
    gravity: 1.1,
    scalar: 1,
  });
}

export function triggerMassiveConfetti() {
  const duration = 3.5 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 120, zIndex: 9999 };

  const interval: ReturnType<typeof setInterval> = setInterval(() => {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) {
      return clearInterval(interval);
    }
    const particleCount = 50 * (timeLeft / duration);

    confetti({
      ...defaults,
      particleCount,
      origin: { x: Math.random() * 0.4 + 0.1, y: Math.random() - 0.2 },
      colors: ['#ff71ce', '#01cdfe', '#05ffa1', '#b967ff', '#fffb96', '#ff4071'],
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: Math.random() * 0.4 + 0.5, y: Math.random() - 0.2 },
      colors: ['#fb7185', '#f472b6', '#c084fc', '#38bdf8', '#fbbf24'],
    });
  }, 250);
}

export function triggerStarBurst(x = 0.5, y = 0.5) {
  confetti({
    particleCount: 40,
    spread: 360,
    origin: { x, y },
    shapes: ['star', 'circle'],
    colors: ['#fde047', '#f59e0b', '#fb7185', '#a855f7'],
    scalar: 1.2,
  });
}

export function triggerFireworks() {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    colors: ['#ec4899', '#f43f5e', '#fda4af'],
  });
  fire(0.2, {
    spread: 60,
    colors: ['#38bdf8', '#818cf8', '#c084fc'],
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
    colors: ['#facc15', '#fbbf24', '#f59e0b'],
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    colors: ['#4ade80', '#2dd4bf'],
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
    colors: ['#f472b6', '#fb7185', '#e879f9'],
  });
}
