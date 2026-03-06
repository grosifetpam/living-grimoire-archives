import { useEffect, useState } from "react";

interface StatCounterProps {
  label: string;
  end: number;
  icon: string;
}

const StatCounter = ({ label, end, icon }: StatCounterProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const step = Math.ceil(end / (duration / 30));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 30);
    return () => clearInterval(timer);
  }, [end]);

  return (
    <div className="text-center group">
      <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{icon}</div>
      <div className="font-cinzel text-3xl font-bold text-primary text-glow-gold">{count}</div>
      <div className="font-crimson text-sm text-muted-foreground mt-1">{label}</div>
    </div>
  );
};

export default StatCounter;
