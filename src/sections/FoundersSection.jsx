import React from 'react';
import { playHoverBlip } from '../utils/audioEngine';

export default function FoundersSection() {
  return (
    <section id="founders" className="py-24 relative z-10 mt-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center md:text-left mb-16 reveal-text relative z-10">
          <span className="text-xs font-bold tracking-widest uppercase text-slate-600 dark:text-slate-500 mb-2 block">The Team</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6">Meet the Founders.</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          <div className="vision-glass p-8 rounded-3xl reveal-text soft-glow group card-hover backdrop-blur-xl bg-white/20 dark:bg-[#020617]/40 border border-white/30 dark:border-white/10" onMouseEnter={playHoverBlip}>
            <div className="w-16 h-16 rounded-full bg-blue-500/20 border border-blue-400 flex items-center justify-center mb-6 text-2xl text-blue-500 group-hover:scale-110 transition-transform z-10 relative"><i className="fas fa-code"></i></div>
            <div className='relative z-10'>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Sadiq Pathan</h3>
            <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-4">HTML, CSS, JS, C, C++, Python, MongoDB, SQL</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Sadiq holds a Bachelor of Engineering in Computer Engineering and brings robust full-stack development experience to the table. He has successfully engineered complex projects, including a dynamic Railway Reservation System UI, a scalable e-commerce platform, and an automated email generator.</p>
            <a href="https://sadiq-s-portfolio.web.app/" target="_blank" rel="noreferrer" onMouseEnter={playHoverBlip} className="vision-pill inline-flex mt-6 px-5 py-3 text-sm font-bold text-slate-900 dark:text-white bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/30 hover:bg-blue-500 hover:text-white transition-colors">
              View Portfolio
            </a>
            </div>
          </div>
          <div className="vision-glass p-8 rounded-3xl reveal-text soft-glow group card-hover backdrop-blur-xl bg-white/20 dark:bg-[#020617]/40 border border-white/30 dark:border-white/10" style={{transitionDelay: '0.1s'}} onMouseEnter={playHoverBlip}>
            <div className="w-16 h-16 rounded-full bg-purple-500/20 border border-purple-400 flex items-center justify-center mb-6 text-2xl text-purple-500 group-hover:scale-110 transition-transform z-10 relative"><i className="fas fa-layer-group"></i></div>
            <div className='relative z-10'>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Shahvez Sayyed</h3>
            <p className="text-xs font-bold text-purple-500 uppercase tracking-widest mb-4">HTML, CSS, Node.js, React.js</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Shahvez is an innovative web developer with a strong focus on building interactive, user-centric booking and reservation systems. His portfolio highlights include a comprehensive makeup artist platform equipped with appointment scheduling and course management capabilities, alongside a centralized restaurant reservation website.</p>
            <a href="https://shahvez-portfolio.web.app/" target="_blank" rel="noreferrer" onMouseEnter={playHoverBlip} className="vision-pill inline-flex mt-6 px-5 py-3 text-sm font-bold text-slate-900 dark:text-white bg-purple-500/10 dark:bg-purple-500/20 border border-purple-500/30 hover:bg-purple-500 hover:text-white transition-colors">
              View Portfolio
            </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}