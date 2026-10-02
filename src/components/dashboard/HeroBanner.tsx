import React from 'react';
import { Sun } from 'lucide-react';
import { useTaskContext } from '../../context/TaskContext';
import { ASSETS } from '../../assets';

export const HeroBanner: React.FC = () => {
  const { user } = useTaskContext();

  return (
    <div className="relative w-full h-[135px] sm:h-[140px] rounded-2xl overflow-hidden border border-[#285A48]/50 shadow-xl shadow-black/30 group">
      {/* Nature / Mountain background image */}
      <img
        src={ASSETS.heroMountainNature}
        alt="Mountain landscape background"
        className="absolute inset-0 w-full h-full object-cover object-center scale-105 group-hover:scale-100 transition-transform duration-700 ease-out"
        referrerPolicy="no-referrer"
      />

      {/* Dark green gradient scrim for high-contrast readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#091413]/95 via-[#122822]/85 to-[#091413]/80 backdrop-blur-[1px]" />
      
      {/* Subtle border highlight */}
      <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-[#408A71]/20 pointer-events-none" />

      {/* Content overlay */}
      <div className="relative z-10 h-full flex flex-col justify-center px-6 sm:px-8">
        <div className="flex items-center gap-2 mb-1 text-[#B0E4CC]">
          <Sun className="w-4 h-4 text-[#B0E4CC] animate-pulse" />
          <span className="text-xs font-semibold tracking-wider uppercase">
            Good Morning,
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-baseline gap-2">
          <span>{user.name || 'Iqra'}</span>
        </h1>

        <p className="text-xs sm:text-sm text-neutral-300/90 mt-1 max-w-xl font-normal leading-relaxed text-balance">
          You&apos;re doing great! Keep going and make today count.
        </p>
      </div>
    </div>
  );
};
