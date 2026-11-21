import React from 'react';
import { playHoverBlip } from '../utils/audioEngine';

export default function TechStackSection() {
  return (
    <section className="py-10 relative z-10 overflow-hidden">
      <div className="marquee-wrapper">
        <div className="marquee-content gap-16 md:gap-32 items-center text-4xl text-slate-500 dark:text-slate-600">
          <div className="tooltip relative transition-colors cursor-pointer hover:text-[#61DAFB]" onMouseEnter={playHoverBlip}><i className="fab fa-react"></i><span className="tooltip-text vision-glass px-3 py-1 text-xs text-white">React.js</span></div>
          <div className="tooltip relative transition-colors cursor-pointer hover:text-[#68A063]" onMouseEnter={playHoverBlip}><i className="fab fa-node-js"></i><span className="tooltip-text vision-glass px-3 py-1 text-xs text-white">Node.js</span></div>
          <div className="tooltip relative transition-colors cursor-pointer hover:text-[#F7DF1E]" onMouseEnter={playHoverBlip}><i className="fab fa-js"></i><span className="tooltip-text vision-glass px-3 py-1 text-xs text-white">JavaScript</span></div>
          <div className="tooltip relative transition-colors cursor-pointer hover:text-[#E34F26]" onMouseEnter={playHoverBlip}><i className="fab fa-html5"></i><span className="tooltip-text vision-glass px-3 py-1 text-xs text-white">HTML5</span></div>
          <div className="tooltip relative transition-colors cursor-pointer hover:text-[#1572B6]" onMouseEnter={playHoverBlip}><i className="fab fa-css3-alt"></i><span className="tooltip-text vision-glass px-3 py-1 text-xs text-white">CSS3</span></div>
          <div className="tooltip relative transition-colors cursor-pointer hover:text-[#47A248]" onMouseEnter={playHoverBlip}><i className="fas fa-database"></i><span className="tooltip-text vision-glass px-3 py-1 text-xs text-white">MongoDB</span></div>
        </div>
      </div>
    </section>
  );
}