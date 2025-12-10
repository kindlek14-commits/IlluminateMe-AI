import React from 'react';
import { Icons } from './Icon';

interface HeaderProps {
  onReset: () => void;
}

const Header: React.FC<HeaderProps> = ({ onReset }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-boss-900/80 backdrop-blur-md border-b border-white/5 h-20 flex items-center justify-between px-8 shadow-lg">
      <div className="flex items-center space-x-3 cursor-pointer group" onClick={onReset}>
        <div className="bg-vibrant-gradient p-2.5 rounded-xl shadow-lg group-hover:shadow-vibrant-pink/50 transition-all">
          <Icons.Sparkles className="w-6 h-6 text-white" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-2xl font-display font-black text-white tracking-wide leading-none">
            LUXE<span className="text-vibrant-cyan">TWIN</span>
          </h1>
          <span className="text-[10px] font-bold tracking-[0.2em] text-vibrant-pink uppercase">Boss Edition</span>
        </div>
      </div>
      
      <div className="hidden md:flex items-center space-x-4">
        <span className="text-xs font-bold px-4 py-1.5 bg-vibrant-cyan/10 rounded-full text-vibrant-cyan border border-vibrant-cyan/30 uppercase tracking-wider">
          Gemini 3 Pro + Veo
        </span>
      </div>
    </header>
  );
};

export default Header;