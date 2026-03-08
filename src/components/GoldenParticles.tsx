import { useEffect, useState } from "react";

interface Particle {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
  opacity: number;
  type: 'violet' | 'crimson' | 'dust';
}

const GoldenParticles = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const p: Particle[] = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 10,
      duration: 8 + Math.random() * 8,
      size: 1.5 + Math.random() * 4,
      opacity: 0.15 + Math.random() * 0.4,
      type: i % 3 === 0 ? 'crimson' : i % 3 === 1 ? 'violet' : 'dust',
    }));
    setParticles(p);
  }, []);

  const getColor = (type: Particle['type'], opacity: number) => {
    switch (type) {
      case 'violet': return `radial-gradient(circle, hsl(280 80% 65% / ${opacity}), transparent)`;
      case 'crimson': return `radial-gradient(circle, hsl(350 70% 50% / ${opacity * 0.7}), transparent)`;
      case 'dust': return `radial-gradient(circle, hsl(270 20% 60% / ${opacity * 0.5}), transparent)`;
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            background: getColor(p.type, p.opacity),
            animation: `particle-float ${p.duration}s linear ${p.delay}s infinite`,
            filter: p.type === 'violet' ? `blur(${p.size > 3 ? 1 : 0}px)` : 'none',
          }}
        />
      ))}
    </div>
  );
};

export default GoldenParticles;
