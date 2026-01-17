
import React from 'react';
import { Sparkles, CloudFog, Zap } from 'lucide-react';

export const Gurunnanse: React.FC = () => {
  return (
    <div className="relative w-80 h-80 flex items-center justify-center animate-float">
      {/* Outer Glow */}
      <div className="absolute inset-0 bg-amber-500/20 blur-[60px] rounded-full animate-pulse"></div>
      
      {/* Inner Orb */}
      <div className="relative z-10 w-48 h-48 rounded-full bg-gradient-to-br from-slate-900 to-amber-900/40 border border-amber-500/30 flex items-center justify-center shadow-[0_0_50px_rgba(212,175,55,0.4)] backdrop-blur-md overflow-hidden">
         {/* Moving Gradient inside Orb */}
         <div className="absolute inset-0 bg-gradient-radial from-amber-400/10 to-transparent animate-spin-slow"></div>
         
         {/* Core Icon */}
         <div className="relative z-20 flex flex-col items-center">
             <div className="absolute inset-0 bg-amber-400 blur-xl opacity-50 animate-pulse"></div>
             <Sparkles className="w-20 h-20 text-amber-100 relative z-20 drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
         </div>
      </div>

      {/* Orbiting Particles */}
      <div className="absolute w-full h-full animate-[spin_10s_linear_infinite]">
         <div className="absolute top-0 left-1/2 w-3 h-3 bg-amber-300 rounded-full blur-[2px] shadow-[0_0_10px_#fcd34d]"></div>
      </div>
       <div className="absolute w-[80%] h-[80%] animate-[spin_15s_linear_infinite_reverse]">
         <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-blue-300 rounded-full blur-[2px] shadow-[0_0_10px_#93c5fd]"></div>
      </div>
    </div>
  );
};

export const DummalaEffect: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden mix-blend-screen">
      {/* Fog Layers */}
      <div className="absolute inset-0 bg-gradient-radial from-slate-800/0 via-slate-800/0 to-slate-900/80"></div>
      <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-amber-900/10 to-transparent blur-3xl opacity-40 animate-pulse"></div>
      
      {/* Floating Particles/Glows */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500/5 rounded-full blur-[40px] animate-float"></div>
      <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-indigo-500/5 rounded-full blur-[50px] animate-float" style={{animationDelay: '2s'}}></div>
      
      <div className="absolute inset-0 flex items-center justify-center opacity-5">
         <CloudFog className="w-full h-full text-slate-300 scale-150 animate-pulse" />
      </div>
    </div>
  );
};
