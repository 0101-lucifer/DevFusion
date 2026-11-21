import React from 'react';
import { playHoverBlip } from '../utils/audioEngine';

export default function ProcessSection({ timelineProgress }) {
  const processSteps = [
    { step: '1. Discovery Call', desc: 'We dive deep into your brand, target audience, and specific technical requirements.', icon: 'fa-phone-alt', color: 'blue' },
    { step: '2. Design & Develop', desc: 'We craft wireframes into Ultra-Glass UI, building robust, scalable code under the hood.', icon: 'fa-pen-nib', color: 'purple' },
    { step: '3. Launch & Scale', desc: 'Your site goes live on high-speed servers with built-in analytics and SEO optimization.', icon: 'fa-rocket', color: 'emerald' }
  ];

  return (
    <section id="process" className="py-24 relative z-10 mt-10">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 md:gap-16 items-center">
        <div className="reveal-text text-center md:text-left relative z-10">
          <span className="text-xs font-bold tracking-widest uppercase text-slate-600 dark:text-slate-500 mb-2 block">Process</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6">Your vision, our expertise.</h2>
          <p className="text-slate-600 dark:text-slate-400 font-medium max-w-lg mx-auto md:mx-0 mb-8">Scroll through our clear, collaborative process designed to ensure your website project is a success from concept to launch.</p>
        </div>
        <div className="reveal-text relative pl-4 md:pl-0 z-10" id="timeline-container">
          <div className="timeline-line"><div className="timeline-progress" style={{height: `${timelineProgress}%`}}></div></div>
          <div className="flex flex-col gap-8 md:gap-10">
            {processSteps.map((p, i) => (
            <div key={i} className="vision-glass p-6 md:p-8 w-full max-w-md ml-auto soft-glow flex items-start gap-4 card-hover backdrop-blur-xl bg-white/20 dark:bg-[#020617]/40 border border-white/30 dark:border-white/10 shadow-xl" onMouseEnter={playHoverBlip}>
              <div className={`w-10 h-10 rounded-full bg-${p.color}-500/20 border border-${p.color}-400 flex items-center justify-center shrink-0 z-10`}><i className={`fas ${p.icon} text-${p.color}-500`}></i></div>
              <div className='relative z-10'>
                <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{p.step}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">{p.desc}</p>
              </div>
            </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}