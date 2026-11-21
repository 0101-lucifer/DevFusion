import React from 'react';
import { playHoverBlip } from '../utils/audioEngine';

export default function WorkSection({ openDrawer }) {
  const projects = [
    { id: 'ecommerce', title: 'Modern E-Commerce', delay: '0s', img: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=80', desc: 'High-conversion online store architecture featuring seamless cart integrations.'},
    { id: 'beauty', title: 'Bridal & Beauty Studio', delay: '0.1s', img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80', desc: 'Elegant booking portfolio designed for an elite makeup artist.'},
    { id: 'restaurant', title: 'Fine Dining Experience', delay: '0.2s', img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80', desc: 'Immersive restaurant website with a beautifully crafted digital menu.'}
  ];

  return (
    <section id="work" className="py-24 relative z-10 vision-glass rounded-none border-x-0 mt-10 soft-glow">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center mb-16 text-center md:text-left">
          <div>
            <span className="text-xs font-bold tracking-widest uppercase text-slate-600 dark:text-slate-500 mb-2 block reveal-text relative z-10">Our Work</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight reveal-text relative z-10">Showcasing our <br className="hidden md:block"/> digital craft.</h2>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {projects.map((item) => (
          <div key={item.id} className="vision-glass p-4 rounded-3xl reveal-text group soft-glow card-hover backdrop-blur-xl bg-white/20 dark:bg-[#020617]/40 border border-white/30 dark:border-white/10" style={{transitionDelay: item.delay}} onMouseEnter={playHoverBlip}>
            <div className="overflow-hidden rounded-2xl relative mb-5">
              <img src={item.img} className="w-full h-48 md:h-64 object-cover transform group-hover:scale-110 transition-transform duration-700" alt={item.title} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-6 z-10">
                <span onClick={(e) => { e.stopPropagation(); openDrawer(item.id); }} onMouseEnter={playHoverBlip} className="vision-pill px-6 py-2 text-sm font-bold text-slate-900 dark:text-white backdrop-blur-md cursor-pointer soft-glow relative z-20 block">Read Case Study</span>
              </div>
            </div>
            <div className="px-3 pb-3 relative z-10">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          </div>
          ))}
        </div>
      </div>
    </section>
  );
}