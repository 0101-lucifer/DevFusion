import React from 'react';
import { playHoverBlip } from '../utils/audioEngine';

const FaqItem = ({ question, answer, isOpen, onClick }) => (
  <div 
    className="faq-item vision-glass rounded-2xl p-6 cursor-pointer card-hover soft-glow backdrop-blur-xl bg-white/20 dark:bg-[#020617]/40 border border-white/30 dark:border-white/10" 
    onClick={onClick}
    onMouseEnter={playHoverBlip}
  >
    <div className="flex justify-between items-center text-slate-900 dark:text-white font-bold relative z-10">
      <h4>{question}</h4>
      <i className={`fas fa-chevron-down transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}></i>
    </div>
    <div 
      className="faq-content overflow-hidden transition-all duration-500 ease-in-out text-slate-600 dark:text-slate-400 text-sm"
      style={{ maxHeight: isOpen ? '200px' : '0px' }}
    >
      <p className="pt-4">{answer}</p>
    </div>
  </div>
);

export default FaqItem;