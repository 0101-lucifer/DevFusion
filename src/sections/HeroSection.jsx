import React from 'react';
import { playHoverBlip } from '../utils/audioEngine';

export default function HeroSection({ onOpenAi }) {
  return (
    <div className="max-w-7xl mx-auto px-6 w-full grid md:grid-cols-2 gap-12 items-center mb-12">
      <div className="flex flex-col justify-center pointer-events-none mt-10 md:mt-0 text-center md:text-left">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-[1.1] text-slate-900 dark:text-white mb-6 tracking-tight reveal-text">
          Crafting <br className="hidden md:block"/> exceptional <br className="hidden md:block"/> websites with <br className="hidden md:block"/> Expert Design.
        </h1>
        <p className="text-slate-600 dark:text-slate-400 font-medium text-base md:text-lg mb-10 max-w-md mx-auto md:mx-0 pointer-events-auto reveal-text" style={{transitionDelay: '0.1s'}}>
          We specialize in creating stunning, functional websites that drive results. Explore our portfolio and see how we can elevate your online presence.
        </p>
        <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4 pointer-events-auto reveal-text" style={{transitionDelay: '0.2s'}}>
          <a href="#contact" onMouseEnter={playHoverBlip} className="vision-pill px-8 py-4 font-bold flex justify-center items-center gap-2 soft-glow text-slate-900 dark:text-white block">
            Start Your Project <i className="fas fa-arrow-right text-xs"></i>
          </a>
          
          {/* REFINED AI BUTTON: Matches the Ultra-Glass aesthetic */}
          <button 
            onClick={onOpenAi} 
            onMouseEnter={playHoverBlip} 
            className="vision-pill px-8 py-4 font-bold flex justify-center items-center gap-3 soft-glow bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30 hover:bg-blue-500 hover:text-white transition-colors"
          >
            <i className="fas fa-sparkles"></i> AI Project Estimator
          </button>
        </div>
      </div>
    </div>
  );
}