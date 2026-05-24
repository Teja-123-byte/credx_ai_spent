import {useMemo} from "react";

const StarParticles = () => {
  const particles = useMemo(() => Array.from({ length: 40 }, (_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    dur: `${2 + Math.random() * 4}s`,
    delay: `${Math.random() * 3}s`,
    size: Math.random() > 0.7 ? 4 : 2,
  })), []);
  return (
    <>
      {particles.map((p) => (
        <div
          key={p.id}
          className="star-particle"
          style={{
            top: p.top,
            left: p.left,
            "--dur": p.dur,
            "--delay": p.delay,
            width: p.size,
            height: p.size,
          } as React.CSSProperties}
        />
      ))}
    </>
  );
};
export default StarParticles;