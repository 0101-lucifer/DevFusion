import React from 'react';
import { playHoverBlip } from '../utils/audioEngine';

export default function ContactSection({ user, setShowLoginModal, formStatus, formData, setFormData, handleFormSubmit }) {
  return (
    <section id="contact" className="py-24 relative z-10 dark:bg-[#020617]/80 dark:backdrop-blur-20 border-t border-black/5 dark:border-white/5 rounded-t-[3rem]">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-5 reveal-text text-center md:text-left flex flex-col justify-between h-full relative z-10">
          <div>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 leading-tight">Let's build your digital presence.</h2>
            <p className="text-slate-600 dark:text-slate-400 font-medium mb-12">Fill out the form, or grab our free resource below to see how we analyze competitors.</p>
          </div>
          <div className="vision-glass p-6 rounded-3xl soft-glow backdrop-blur-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-white/30 dark:border-white/10 card-hover" onMouseEnter={playHoverBlip}>
            <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center mb-4 text-xl shadow-[0_0_15px_rgba(59,130,246,0.5)] z-10 relative"><i className="fas fa-chart-line"></i></div>
            <div className='relative z-10'>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Free UI/UX Audit</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Not ready for a full build? Drop your current website URL below and we'll send you a free video audit.</p>
            </div>
            
            {user ? (
              <div className="flex gap-2 relative z-10">
                <input type="text" placeholder="https://..." className="w-full bg-white/20 dark:bg-black/20 border border-white/30 dark:border-white/10 text-slate-900 dark:text-white rounded-xl p-3 outline-none text-sm cursor-none backdrop-blur-md placeholder-slate-600 dark:placeholder-slate-400" />
                <button onMouseEnter={playHoverBlip} className="px-6 py-3 rounded-full text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/30 transition-all cursor-none">Audit</button>
              </div>
            ) : (
              <button onClick={() => setShowLoginModal(true)} onMouseEnter={playHoverBlip} className="vision-pill w-full py-3 text-sm font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30 transition-colors hover:bg-blue-500/20 z-10 relative">
                Log in to Request Audit <i className="fas fa-lock ml-2"></i>
              </button>
            )}
          </div>
        </div>

        <div className="lg:col-span-7 vision-glass p-6 md:p-8 rounded-[2rem] shadow-2xl reveal-text soft-glow backdrop-blur-xl bg-white/30 dark:bg-[#020617]/40 border border-white/40 dark:border-white/10 card-hover" onMouseEnter={playHoverBlip}>
          <h3 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white text-center md:text-left relative z-10">Send a direct message</h3>
          
          {formStatus === 'success' && (
            <div className="mb-6 p-4 rounded-xl border border-emerald-500/50 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-center animate-bounce font-bold relative z-10">
              <i className="fas fa-check-circle mr-2"></i> Success! Your message is in the database.
            </div>
          )}
          {formStatus === 'error' && (
            <div className="mb-6 p-4 rounded-xl border border-red-500/50 bg-red-500/20 text-red-600 dark:text-red-400 text-center font-bold relative z-10">
              <i className="fas fa-exclamation-circle mr-2"></i> Database error. Please try again.
            </div>
          )}

          {user ? (
            <form onSubmit={handleFormSubmit} className="space-y-4 md:space-y-5 relative z-10">
              <div>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Full Name" 
                  required 
                  className="w-full bg-white/20 dark:bg-black/20 backdrop-blur-md border border-white/30 dark:border-white/10 text-slate-900 dark:text-white rounded-xl p-4 outline-none transition-all placeholder-slate-600 dark:placeholder-slate-400 cursor-none shadow-inner" 
                />
              </div>
              <div>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="Email Address" 
                  required 
                  className="w-full bg-white/20 dark:bg-black/20 backdrop-blur-md border border-white/30 dark:border-white/10 text-slate-900 dark:text-white rounded-xl p-4 outline-none transition-all placeholder-slate-600 dark:placeholder-slate-400 cursor-none shadow-inner" 
                />
              </div>
              <div>
                <textarea 
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="Project Details" 
                  required 
                  className="w-full bg-white/20 dark:bg-black/20 backdrop-blur-md border border-white/30 dark:border-white/10 text-slate-900 dark:text-white rounded-xl p-4 h-32 outline-none transition-all placeholder-slate-600 dark:placeholder-slate-400 resize-none cursor-none shadow-inner"
                ></textarea>
              </div>
              <button type="submit" disabled={formStatus === 'sending'} onMouseEnter={playHoverBlip} className="vision-pill w-full py-4 font-bold flex justify-center items-center gap-2 text-slate-900 dark:text-white soft-glow bg-blue-500/20 dark:bg-blue-500/30">
                {formStatus === 'sending' ? 'Connecting...' : <>Submit to Firebase <i className="fas fa-paper-plane text-xs"></i></>}
              </button>
            </form>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center border border-white/30 dark:border-white/10 backdrop-blur-md bg-white/10 dark:bg-black/10 rounded-2xl relative z-10 shadow-inner">
              <div className="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mb-4 text-2xl shadow-inner z-20 relative">
                <i className="fas fa-lock"></i>
              </div>
              <div className='relative z-10'>
                <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Authentication Required</h4>
                <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm max-w-xs mx-auto">Please log in to your account to send us a direct project inquiry.</p>
                <button onClick={() => setShowLoginModal(true)} onMouseEnter={playHoverBlip} className="px-8 py-3 rounded-full font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/30 transition-all cursor-none">
                  Sign In to Continue
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}