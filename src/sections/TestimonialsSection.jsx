import React from 'react';
import { playHoverBlip } from '../utils/audioEngine';

export default function TestimonialsSection() {
  const testimonials = [
    { img: '4', name: 'Sarah Jenkins', role: 'CEO, RetailCo', text: '"Their use of 3D rendering completely transformed how we sell our products online. Conversions are up 40%."', delay: '0s' },
    { img: '5', name: 'Marcus Vance', role: 'Founder, Elite Beauty', text: '"Lightning fast delivery and the ultra-glass aesthetic is exactly what our luxury brand needed to stand out."', delay: '0.1s' },
    { img: '6', name: 'David Chen', role: 'Director, The Grand', text: '"The communication was stellar throughout the process. The site is flawless and our booking rate doubled."', delay: '0.2s' }
  ];

  return (
    <section className="py-24 relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <span className="text-xs font-bold tracking-widest uppercase text-slate-600 dark:text-slate-500 mb-2 block reveal-text relative z-10">Testimonials</span>
        <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white reveal-text relative z-10">What our clients say.</h2>
      </div>
      <div className="snap-x-container flex gap-6 px-6 md:px-12 pb-10">
        <div className="shrink-0 w-4 md:w-16"></div>
        {testimonials.map((t, i) => (
        <div key={i} className="snap-card vision-glass p-8 w-80 md:w-96 shrink-0 soft-glow reveal-text card-hover backdrop-blur-xl bg-white/20 dark:bg-[#020617]/40 border border-white/30 dark:border-white/10" style={{transitionDelay: t.delay}} onMouseEnter={playHoverBlip}>
          <div className="flex text-yellow-400 mb-4 text-sm relative z-10"><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i></div>
          <p className="text-slate-700 dark:text-slate-300 font-medium mb-6 italic relative z-10">{t.text}</p>
          <div className="flex items-center gap-3 relative z-10">
            <img src={`https://i.pravatar.cc/100?img=${t.img}`} className="w-10 h-10 rounded-full border border-white/20" alt={t.name} />
            <div><h4 className="text-sm font-bold text-slate-900 dark:text-white">{t.name}</h4><p className="text-xs text-slate-500">{t.role}</p></div>
          </div>
        </div>
        ))}
        <div className="shrink-0 w-4 md:w-16"></div>
      </div>
    </section>
  );
}