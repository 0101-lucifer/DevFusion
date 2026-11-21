import React, { useState } from 'react';
import { playHoverBlip } from '../utils/audioEngine';

export default function AiEstimatorModal({ isOpen, onClose }) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [estimate, setEstimate] = useState(null);
  const [error, setError] = useState('');

  const handleGetEstimate = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    setError('');
    setEstimate(null);
    playHoverBlip();

    try {
      const response = await fetch("https://devfusion-backend.vercel.app/api/estimate-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      setEstimate(data);
    } catch (err) {
      console.error(err);
      setError("The AI is currently analyzing other projects. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose}></div>
      
      <div className="relative w-full max-w-2xl vision-glass p-8 rounded-[2rem] shadow-2xl soft-glow backdrop-blur-xl bg-white/30 dark:bg-[#020617]/80 border border-white/40 dark:border-white/10 transform transition-all">
        
        <button onClick={() => { playHoverBlip(); onClose(); }} className="absolute top-6 right-6 w-8 h-8 flex justify-center items-center rounded-full bg-slate-200/50 dark:bg-slate-800/50 text-slate-800 dark:text-white hover:bg-red-500 hover:text-white transition-colors">
          <i className="fas fa-times"></i>
        </button>

        <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">AI Project Estimator</h3>
        <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm">Describe your dream website in plain English, and our AI architect will scope it out for you instantly.</p>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-500 text-sm font-bold">
             <i className="fas fa-exclamation-triangle mr-2"></i> {error}
          </div>
        )}

        {!estimate ? (
          <div className="space-y-4">
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., I need a 5-page e-commerce site for my bakery that lets users customize their cake orders and pay online..." 
              className="w-full bg-white/40 dark:bg-black/40 backdrop-blur-md border border-white/50 dark:border-white/10 text-slate-900 dark:text-white rounded-xl p-4 h-32 outline-none transition-all placeholder-slate-500 dark:placeholder-slate-500 resize-none shadow-inner cursor-none"
            ></textarea>
            
            {/* REFINED BUTTON: Matches site aesthetic */}
            <button 
              onClick={handleGetEstimate}
              disabled={loading || !prompt.trim()}
              onMouseEnter={playHoverBlip}
              className="vision-pill w-full py-4 font-bold flex justify-center items-center gap-3 soft-glow bg-blue-500/20 dark:bg-blue-500/30 text-slate-900 dark:text-white disabled:opacity-50 cursor-none"
            >
              {loading ? (
                <><i className="fas fa-spinner fa-spin"></i> Analyzing Requirements...</>
              ) : (
                <><i className="fas fa-magic"></i> Generate Estimate</>
              )}
            </button>
          </div>
        ) : (
          <div className="animate-fade-in-up">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* REFINED RESULT CARDS: Clean vision-glass look */}
              <div className="vision-glass p-6 rounded-xl border border-white/20 dark:border-white/10 bg-white/20 dark:bg-black/20">
                <p className="text-xs font-bold tracking-widest uppercase text-blue-500 mb-1">Estimated Cost</p>
                <h4 className="text-4xl font-extrabold text-slate-900 dark:text-white">${estimate.suggestedPrice}</h4>
              </div>
              <div className="vision-glass p-6 rounded-xl border border-white/20 dark:border-white/10 bg-white/20 dark:bg-black/20">
                <p className="text-xs font-bold tracking-widest uppercase text-purple-500 mb-1">Timeline</p>
                <h4 className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{estimate.timeframe}</h4>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-xs font-bold tracking-widest uppercase text-slate-500 mb-3">Required Architecture</p>
              <div className="flex flex-wrap gap-2">
                {estimate.features.map((feat, idx) => (
                  <span key={idx} className="px-3 py-1 bg-white/50 dark:bg-white/10 border border-slate-300 dark:border-white/20 rounded-full text-xs font-bold text-slate-800 dark:text-slate-200">
                    <i className="fas fa-check text-emerald-500 mr-1"></i> {feat}
                  </span>
                ))}
              </div>
            </div>

            <p className="text-sm text-slate-700 dark:text-slate-300 italic bg-white/30 dark:bg-black/30 p-4 rounded-lg border border-white/40 dark:border-white/10">
              " {estimate.rationale} "
            </p>

            <button onClick={() => setEstimate(null)} onMouseEnter={playHoverBlip} className="mt-6 w-full py-3 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-none">
              <i className="fas fa-redo mr-2"></i> Try another prompt
            </button>
          </div>
        )}
      </div>
    </div>
  );
}