import React from 'react';
import { playHoverBlip } from '../utils/audioEngine';

export default function PricingSection({ handlePayment }) {
  return (
    <section id="pricing" className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 reveal-text relative z-10">
          <span className="text-xs font-bold tracking-widest uppercase text-slate-600 dark:text-slate-500 mb-2 block">Investment</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6">Professional Pricing Options.</h2>
        </div>
        <div className="grid lg:grid-cols-3 gap-8 items-center">
          <div className="vision-glass p-8 rounded-3xl reveal-text soft-glow flex flex-col h-full card-hover backdrop-blur-xl bg-white/20 dark:bg-[#020617]/40 border border-white/30 dark:border-white/10" onMouseEnter={playHoverBlip}>
            <div className='relative z-10'>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Starter</h3>
              <div className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">$99<span className="text-sm text-slate-500 font-medium">/month</span></div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 flex-grow">Small businesses and solo entrepreneurs needing a digital presence.</p>
              <ul className="space-y-3 mb-8 text-sm text-slate-700 dark:text-slate-300">
                <li className="flex items-center gap-3"><i className="fas fa-check text-emerald-500"></i> Standard UI/UX Design</li>
                <li className="flex items-center gap-3"><i className="fas fa-check text-emerald-500"></i> Core booking/e-commerce</li>
                <li className="flex items-center gap-3"><i className="fas fa-check text-emerald-500"></i> Standard email support</li>
                <li className="flex items-center gap-3"><i className="fas fa-check text-emerald-500"></i> Basic analytics dashboard</li>
              </ul>
              <button onClick={() => handlePayment(99)} onMouseEnter={playHoverBlip} className="vision-pill block w-full py-3 text-center font-bold text-slate-900 dark:text-white soft-glow cursor-none">
                Buy Starter Package
              </button>
            </div>
          </div>
          
          <div className="relative h-full transform lg:-translate-y-4 reveal-text pro-card-wrapper" style={{transitionDelay: '0.1s'}} onMouseEnter={playHoverBlip}>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 bg-blue-500 text-white text-[10px] uppercase tracking-widest font-bold px-4 py-1.5 rounded-full shadow-lg">Most Popular</div>
            <div className="vision-glass p-8 rounded-3xl soft-glow flex flex-col h-full border border-blue-400/50 shadow-[0_0_30px_rgba(59,130,246,0.2)] backdrop-blur-xl bg-white/20 dark:bg-[#020617]/40 card-hover">
              <div className='relative z-10 flex flex-col h-full'>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 mt-2">Professional</h3>
                <div className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">$249<span className="text-sm text-slate-500 font-medium">/month</span></div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 flex-grow">Growing brands requiring advanced integrations and automation.</p>
                <ul className="space-y-3 mb-8 text-sm text-slate-700 dark:text-slate-300">
                  <li className="flex items-center gap-3"><i className="fas fa-check text-blue-500"></i> Everything in Starter</li>
                  <li className="flex items-center gap-3"><i className="fas fa-check text-blue-500"></i> Advanced API integrations</li>
                  <li className="flex items-center gap-3"><i className="fas fa-check text-blue-500"></i> Automated email generation</li>
                  <li className="flex items-center gap-3"><i className="fas fa-check text-blue-500"></i> Priority 24/5 support</li>
                </ul>
                <button onClick={() => handlePayment(249)} onMouseEnter={playHoverBlip} className="block w-full py-3 rounded-full text-center font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/30 transition-all mt-auto cursor-none">
                  Upgrade Now
                </button>
              </div>
            </div>
          </div>

          <div className="vision-glass p-8 rounded-3xl reveal-text soft-glow flex flex-col h-full card-hover backdrop-blur-xl bg-white/20 dark:bg-[#020617]/40 border border-white/30 dark:border-white/10" style={{transitionDelay: '0.2s'}} onMouseEnter={playHoverBlip}>
            <div className='relative z-10'>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Enterprise</h3>
              <div className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">Custom</div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 flex-grow">Large-scale operations needing complex, tailored software solutions.</p>
              <ul className="space-y-3 mb-8 text-sm text-slate-700 dark:text-slate-300">
                <li className="flex items-center gap-3"><i className="fas fa-check text-emerald-500"></i> Everything in Professional</li>
                <li className="flex items-center gap-3"><i className="fas fa-check text-emerald-500"></i> Custom DB architecture</li>
                <li className="flex items-center gap-3"><i className="fas fa-check text-emerald-500"></i> Dedicated account manager</li>
                <li className="flex items-center gap-3"><i className="fas fa-check text-emerald-500"></i> 24/7 SLA</li>
              </ul>
              <a href="#contact" className="vision-pill block w-full py-3 text-center font-bold text-slate-900 dark:text-white soft-glow">Contact Sales</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}