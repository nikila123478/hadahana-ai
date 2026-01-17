
import React from 'react';

const SolarSystem: React.FC = () => {
  return (
    <div className="solar-system-container">
      <div className="solar-system-pivot">
        {/* Sun */}
        <div className="sun"></div>

        {/* Mercury */}
        <div className="orbit orbit-mercury">
          <div className="planet-container">
            <div className="planet" style={{ '--size': '12px', '--color': '#a5a5a5' } as any}></div>
          </div>
        </div>

        {/* Venus */}
        <div className="orbit orbit-venus">
          <div className="planet-container">
            <div className="planet" style={{ '--size': '20px', '--color': '#e3bb76' } as any}></div>
          </div>
        </div>

        {/* Earth */}
        <div className="orbit orbit-earth">
          <div className="planet-container">
            <div className="planet" style={{ '--size': '22px', '--color': '#4f8fea' } as any}></div>
          </div>
        </div>

        {/* Mars */}
        <div className="orbit orbit-mars">
          <div className="planet-container">
            <div className="planet" style={{ '--size': '16px', '--color': '#d14a28' } as any}></div>
          </div>
        </div>

        {/* Jupiter */}
        <div className="orbit orbit-jupiter">
          <div className="planet-container">
            <div className="planet" style={{ '--size': '50px', '--color': '#d8ca9d' } as any}></div>
          </div>
        </div>

        {/* Saturn */}
        <div className="orbit orbit-saturn">
           <div className="planet-container">
            <div className="planet" style={{ '--size': '42px', '--color': '#eead62' } as any}>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70px] h-[70px] border-[6px] border-slate-500/30 rounded-full" style={{ transform: 'translate(-50%, -50%) rotateX(70deg)' }}></div>
            </div>
          </div>
        </div>

        {/* Distant Stars / Particles */}
        <div className="absolute w-[200vw] h-[200vh] animate-[spin_200s_linear_infinite]" style={{ transformStyle: 'preserve-3d' }}>
           {Array.from({ length: 50 }).map((_, i) => (
             <div 
               key={i}
               className="absolute bg-white rounded-full opacity-70"
               style={{
                 top: `${Math.random() * 100}%`,
                 left: `${Math.random() * 100}%`,
                 width: `${Math.random() * 3}px`,
                 height: `${Math.random() * 3}px`,
                 boxShadow: `0 0 ${Math.random() * 10 + 5}px white`,
                 transform: `translateZ(${Math.random() * -500}px)`
               }}
             />
           ))}
        </div>
      </div>
    </div>
  );
};

export default SolarSystem;
