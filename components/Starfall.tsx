
import React, { useEffect, useState } from 'react';

const Starfall: React.FC = () => {
  const [stars, setStars] = useState<{ id: number; left: string; delay: string; duration: string; size: string }[]>([]);
  const [objects, setObjects] = useState<{ id: number; top: string; left: string; color: string; size: string; delay: string }[]>([]);

  useEffect(() => {
    const starCount = 30;
    const newStars = Array.from({ length: starCount }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 10}s`,
      duration: `${3 + Math.random() * 5}s`,
      size: `${1 + Math.random() * 2}px`,
    }));
    setStars(newStars);

    const objectCount = 6;
    const colors = ['rgba(212, 175, 55, 0.1)', 'rgba(96, 165, 250, 0.1)', 'rgba(192, 132, 252, 0.1)'];
    const newObjects = Array.from({ length: objectCount }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      color: colors[i % colors.length],
      size: `${100 + Math.random() * 200}px`,
      delay: `${Math.random() * -20}s`,
    }));
    setObjects(newObjects);
  }, []);

  return (
    <div className="starfall-container">
      {objects.map(obj => (
        <div 
          key={obj.id} 
          className="celestial-object"
          style={{
            top: obj.top,
            left: obj.left,
            width: obj.size,
            height: obj.size,
            backgroundColor: obj.color,
            animationDelay: obj.delay,
          }}
        />
      ))}
      {stars.map(star => (
        <div
          key={star.id}
          className="starfall"
          style={{
            left: star.left,
            width: star.size,
            height: star.size,
            animationDelay: star.delay,
            animationDuration: star.duration,
          }}
        />
      ))}
    </div>
  );
};

export default Starfall;
