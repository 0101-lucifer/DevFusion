import React, { useState, useEffect, useCallback } from 'react';
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "./firebase"; 
import { onAuthStateChanged, signOut } from "firebase/auth";
import emailjs from '@emailjs/browser';

import { DRAWER_DATA } from './utils/data';
import { playHoverBlip } from './utils/audioEngine';
import { processPayment } from './utils/paymentGateway';

import LoginUI from './Login';
import RotatingSphereBackground from './components/RotatingSphereBackground';
import CursorTrail from './components/CursorTrail';
import Navbar from './components/Navbar';
import AiEstimatorModal from './components/AiEstimatorModal';

import HeroSection from './sections/HeroSection';
import StatsSection from './sections/StatsSection';
import TechStackSection from './sections/TechStackSection';
import WorkSection from './sections/WorkSection';
import TestimonialsSection from './sections/TestimonialsSection';
import ProcessSection from './sections/ProcessSection';
import FoundersSection from './sections/FoundersSection';
import PricingSection from './sections/PricingSection';
import FaqSection from './sections/FaqSection';
import ContactSection from './sections/ContactSection';

export default function App() {
  const [theme, setTheme] = useState('system');
  const [isDark, setIsDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [drawerData, setDrawerData] = useState(null);
  const [timelineProgress, setTimelineProgress] = useState(0);
  
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  
  const [user, setUser] = useState(null); 
  const [formStatus, setFormStatus] = useState('idle');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe(); 
  }, []);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.displayName || prev.name,
        email: user.email || prev.email
      }));
    }
  }, [user]);

  const handleLogout = async () => {
    playHoverBlip();
    try {
      await signOut(auth);
      setUser(null);
      setShowLoginModal(false);
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  useEffect(() => {
    let resolvedDark = false;
    if (theme === 'dark') resolvedDark = true;
    else if (theme === 'light') resolvedDark = false;
    else resolvedDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    setIsDark(resolvedDark);
    if (resolvedDark) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    playHoverBlip();
    setTheme(prev => prev === 'system' ? 'light' : prev === 'light' ? 'dark' : 'system');
  }, []);

  useEffect(() => {
    const handleGlowMove = (e) => {
      if (!e.target.closest('.soft-glow')) return;
      const el = e.target.closest('.soft-glow');
      const rect = el.getBoundingClientRect();
      el.style.setProperty('--x', `${e.clientX - rect.left}px`);
      el.style.setProperty('--y', `${e.clientY - rect.top}px`);
    };
    document.addEventListener('mousemove', handleGlowMove);
    
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('in-view'); });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });
    
    document.querySelectorAll('.reveal-text').forEach(el => revealObserver.observe(el));

    const handleScroll = () => {
      const timeline = document.getElementById('timeline-container');
      if(!timeline) return;
      const rect = timeline.getBoundingClientRect();
      const viewHeight = window.innerHeight;
      if (rect.top < viewHeight / 2 && rect.bottom > 0) {
        let progress = ((viewHeight / 2 - rect.top) / rect.height) * 100;
        setTimelineProgress(Math.max(0, Math.min(100, progress)));
      }
    };
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      document.removeEventListener('mousemove', handleGlowMove);
      revealObserver.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('sending');
    playHoverBlip();
    
    try {
      await addDoc(collection(db, "contacts"), {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        timestamp: new Date()
      });

      await emailjs.send('service_8zx06bf', 'template_h51b6fn', { name: formData.name, email: formData.email, message: formData.message }, 'cPbVW3Ogoq03163_h');

      setFormStatus('success');
      setFormData({ name: user ? user.displayName : '', email: user ? user.email : '', message: '' }); 
      setTimeout(() => setFormStatus('idle'), 4000);
    } catch (error) {
      console.error("Error submitting form: ", error);
      setFormStatus('error');
      setTimeout(() => setFormStatus('idle'), 4000);
    }
  };

  const openDrawer = (id) => {
    playHoverBlip();
    setDrawerData(DRAWER_DATA[id]);
    document.body.style.overflow = 'hidden';
  };
  
  const closeDrawer = () => {
    playHoverBlip();
    setDrawerData(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <div className="antialiased relative transition-colors duration-500 min-h-screen">
      <RotatingSphereBackground isDark={isDark} />
      <CursorTrail isDark={isDark} />

      <div className={`fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-md transition-opacity duration-300 ${showLoginModal ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className={`relative w-full max-w-md transform transition-transform duration-400 p-4 ${showLoginModal ? 'scale-100' : 'scale-95'}`}>
          <button onClick={() => setShowLoginModal(false)} className="absolute top-0 right-0 z-10 w-10 h-10 flex justify-center items-center rounded-full bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-colors">
            <i className="fas fa-times"></i>
          </button>
          <LoginUI />
        </div>
      </div>

      <AiEstimatorModal isOpen={showAiModal} onClose={() => setShowAiModal(false)} />

      <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] transition-opacity duration-300 ${drawerData ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={closeDrawer} />
      <div className={`fixed top-0 right-0 w-full max-w-[500px] h-screen z-[9999] transform transition-transform duration-400 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-transform vision-glass rounded-none border-y-0 border-r-0 !bg-white/80 dark:!bg-[#020617]/90 p-8 flex flex-col ${drawerData ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{drawerData?.title || 'Project Details'}</h3>
          <button onClick={closeDrawer} onMouseEnter={playHoverBlip} className="vision-pill w-10 h-10 flex justify-center items-center"><i className="fas fa-times"></i></button>
        </div>
        {drawerData && <img src={drawerData.img} className="w-full h-64 object-cover rounded-2xl mb-6 shadow-lg" alt="Project" />}
        <div className="space-y-6 flex-grow">
          <div>
            <h4 className="text-sm font-bold text-blue-500 uppercase tracking-widest mb-2">The Challenge</h4>
            <p className="text-slate-700 dark:text-slate-400 text-sm leading-relaxed">{drawerData?.challenge}</p>
          </div>
          <div>
            <h4 className="text-sm font-bold text-blue-500 uppercase tracking-widest mb-2">Our Solution</h4>
            <p className="text-slate-700 dark:text-slate-400 text-sm leading-relaxed">{drawerData?.solution}</p>
          </div>
          <div>
            <h4 className="text-sm font-bold text-emerald-500 uppercase tracking-widest mb-2">Results</h4>
            <p className="text-slate-700 dark:text-slate-400 text-sm font-semibold">{drawerData?.results}</p>
          </div>
        </div>
        <a href={drawerData?.url || '#'} target="_blank" rel="noreferrer" onMouseEnter={playHoverBlip} className="vision-pill w-full py-4 text-center font-bold mt-8 block">Visit Live Site <i className="fas fa-external-link-alt ml-2"></i></a>
      </div>

      <Navbar theme={theme} toggleTheme={toggleTheme} user={user} handleLogout={handleLogout} setShowLoginModal={setShowLoginModal} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <section className="min-h-screen flex flex-col justify-center pt-20 relative z-10">
        <HeroSection onOpenAi={() => setShowAiModal(true)} />
        <StatsSection />
      </section>

      <TechStackSection />
      <WorkSection openDrawer={openDrawer} />
      <TestimonialsSection />
      <ProcessSection timelineProgress={timelineProgress} />
      <FoundersSection />
      
      {/* We pass the price from PricingSection and our isDark theme state directly into processPayment */}
      <PricingSection handlePayment={(price) => processPayment(price, isDark)} />
      
      <FaqSection />
      <ContactSection user={user} setShowLoginModal={setShowLoginModal} formStatus={formStatus} formData={formData} setFormData={setFormData} handleFormSubmit={handleFormSubmit} />
    </div>
  );
}