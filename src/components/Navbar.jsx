import React from 'react';
import { playHoverBlip } from '../utils/audioEngine';

export default function Navbar({ theme, toggleTheme, user, handleLogout, setShowLoginModal, menuOpen, setMenuOpen }) {
  return (
    <>
      <nav className="fixed w-full top-0 z-50 vision-glass rounded-none border-t-0 border-x-0 shadow-sm soft-glow relative">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white relative z-10">DEV FUSION</div>
          
          <div className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-800 dark:text-slate-300 relative z-10">
            <a href="#work" onMouseEnter={playHoverBlip} className="hover:text-black dark:hover:text-white transition">Our Work</a>
            <a href="#founders" onMouseEnter={playHoverBlip} className="hover:text-black dark:hover:text-white transition">Founders</a>
            <a href="#process" onMouseEnter={playHoverBlip} className="hover:text-black dark:hover:text-white transition">Process</a>
            <a href="#pricing" onMouseEnter={playHoverBlip} className="hover:text-black dark:hover:text-white transition">Pricing</a>
            
            <a href="#contact" onMouseEnter={playHoverBlip} className="vision-pill px-6 py-2.5 flex items-center gap-2 soft-glow text-slate-900 dark:text-white">
              Get a Quote <i className="fas fa-arrow-right text-xs"></i>
            </a>

            {user ? (
              <div className="flex items-center gap-2">
                <div className="vision-pill px-5 py-2.5 flex items-center gap-2 soft-glow bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30">
                  <img src={user.photoURL || 'https://ui-avatars.com/api/?name=' + user.displayName} className="w-5 h-5 rounded-full" alt="avatar"/> 
                  {user.displayName?.split(' ')[0] || 'Account'}
                </div>
                <button onClick={handleLogout} onMouseEnter={playHoverBlip} className="vision-pill w-10 h-10 flex items-center justify-center soft-glow bg-red-500/10 text-red-500 border-red-500/30 hover:bg-red-500 hover:text-white transition-colors" title="Log Out">
                  <i className="fas fa-sign-out-alt"></i>
                </button>
              </div>
            ) : (
              <button onClick={() => setShowLoginModal(true)} onMouseEnter={playHoverBlip} className="vision-pill px-6 py-2.5 flex items-center gap-2 soft-glow bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30 hover:bg-blue-500 hover:text-white transition-colors">
                Login <i className="fas fa-user-circle"></i>
              </button>
            )}

            <button onClick={toggleTheme} onMouseEnter={playHoverBlip} className="vision-pill w-10 h-10 flex items-center justify-center soft-glow text-slate-900 dark:text-white">
              <i className={theme === 'dark' ? "fas fa-moon text-indigo-400" : theme === 'light' ? "fas fa-sun text-orange-400" : "fas fa-desktop text-blue-500"}></i>
            </button>
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} onMouseEnter={playHoverBlip} className="md:hidden text-slate-900 dark:text-white text-2xl focus:outline-none relative z-50 transition-transform hover:scale-110">
            <i className={`fas ${menuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div className={`fixed inset-0 z-40 bg-white/90 dark:bg-[#020617]/95 backdrop-blur-2xl transform transition-transform duration-500 ease-in-out flex flex-col items-center justify-center space-y-6 ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {['#work', '#founders', '#process', '#pricing'].map((link) => (
          <a key={link} href={link} onClick={() => setMenuOpen(false)} className="text-3xl font-bold text-slate-900 dark:text-white hover:text-blue-500 transition-colors">{link.replace('#', '').charAt(0).toUpperCase() + link.slice(2)}</a>
        ))}
        
        {user ? (
          <div className="flex flex-col gap-3 mt-4 items-center">
            <div className="vision-pill px-10 py-4 font-bold text-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center gap-3">
              <img src={user.photoURL || 'https://ui-avatars.com/api/?name=' + user.displayName} className="w-6 h-6 rounded-full" alt="avatar"/>
              {user.displayName}
            </div>
            <button onClick={() => { setMenuOpen(false); handleLogout(); }} className="vision-pill px-10 py-3 font-bold text-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors">
              Log Out <i className="fas fa-sign-out-alt ml-2"></i>
            </button>
          </div>
        ) : (
          <button onClick={() => { setMenuOpen(false); setShowLoginModal(true); }} className="vision-pill px-10 py-4 font-bold text-xl mt-4 bg-blue-500/20 text-blue-600 dark:text-blue-400">
            Client Login
          </button>
        )}

        <button onClick={toggleTheme} className="vision-pill px-6 py-3 mt-2 flex items-center justify-center gap-3 font-bold text-slate-900 dark:text-white">
          <i className={theme === 'dark' ? "fas fa-moon text-indigo-400" : theme === 'light' ? "fas fa-sun text-orange-400" : "fas fa-desktop text-blue-500"}></i> 
          <span>{theme === 'dark' ? 'Dark Theme' : theme === 'light' ? 'Light Theme' : 'System Theme'}</span>
        </button>
      </div>
    </>
  );
}