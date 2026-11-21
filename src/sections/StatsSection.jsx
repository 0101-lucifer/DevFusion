import React from 'react';
import { playHoverBlip } from '../utils/audioEngine';
import AnimatedCounter from '../components/AnimatedCounter';

export default function StatsSection() {
  return (
    <div className="max-w-7xl mx-auto px-6 w-full reveal-text" style={{transitionDelay: '0.3s'}}>
      <div className="vision-glass p-6 md:p-8 rounded-3xl flex flex-wrap justify-around items-center gap-6 soft-glow card-hover backdrop-blur-xl bg-white/20 dark:bg-[#020617]/40 border border-white/30 dark:border-white/10" onMouseEnter={playHoverBlip}>
        <div className="text-center relative z-10">
          <h3 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-1"><AnimatedCounter target={150} />+</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Projects Delivered</p>
        </div>
        <div className="text-center relative z-10">
          <h3 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-1"><AnimatedCounter target={99} />%</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Client Retention</p>
        </div>
        <div className="text-center relative z-10">
          <h3 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-1"><AnimatedCounter target={24} />/7</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Server Monitoring</p>
        </div>
        <div className="text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full mb-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold relative z-10">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div> Live System
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">100% Uptime</p>
        </div>
      </div>
    </div>
  );
}