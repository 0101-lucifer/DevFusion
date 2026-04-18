import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "./firebase"; 
import { onAuthStateChanged, signOut } from "firebase/auth";
import emailjs from '@emailjs/browser';
import LoginUI from './Login';

// ==========================================
// DATA
// ==========================================
const DRAWER_DATA = {
  ecommerce: {
    title: "Modern E-Commerce",
    img: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=80",
    challenge: "The client was losing 40% of their mobile users during the checkout phase due to a clunky, outdated system.",
    solution: "We rebuilt the entire frontend using Next.js and implemented our Ultra-Glass UI, focusing heavily on a 2-tap mobile checkout flow.",
    results: "Mobile conversion rates increased by 65%, and page load speeds dropped below 1 second."
  },
  beauty: {
    title: "Bridal & Beauty Studio",
    img: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
    challenge: "A high-end makeup artist needed a digital portfolio that reflected her luxury brand, without sacrificing SEO.",
    solution: "A bespoke gallery experience built with seamless CSS transitions and integrated directly with a hidden booking calendar.",
    results: "Fully booked schedule 3 months in advance directly from organic search traffic."
  },
  restaurant: {
    title: "Fine Dining Experience",
    img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
    challenge: "The restaurant relied on 3rd party booking apps that took huge cuts of their profits.",
    solution: "We built an immersive menu and an entirely custom, zero-fee table reservation system powered by Node.js and MongoDB.",
    results: "Saved $12k in annual third-party fees and increased direct reservations by 30%."
  }
};

// ==========================================
// AUDIO ENGINE
// ==========================================
let audioCtx = null;
const playHoverBlip = () => {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  
  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  
  osc.type = 'sine';
  osc.frequency.setValueAtTime(800, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.05); 
  
  gainNode.gain.setValueAtTime(0.02, audioCtx.currentTime); 
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05); 
  
  osc.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  
  osc.start();
  osc.stop(audioCtx.currentTime + 0.05);
};

// ==========================================
// COMPONENTS
// ==========================================
const AnimatedCounter = ({ target }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    let hasCounted = false;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !hasCounted) {
        hasCounted = true;
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        const updateCounter = () => {
          current += step;
          if (current < target) {
            setCount(Math.ceil(current));
            requestAnimationFrame(updateCounter);
          } else {
            setCount(target);
          }
        };
        updateCounter();
      }
    }, { threshold: 0.5 });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count}</span>;
};

// FULLY BLURRED FAQ PILLS
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

// ==========================================
// EXACT F24.HTML 3D SPHERE ENGINE
// ==========================================
const RotatingSphereBackground = ({ isDark }) => {
  const containerRef = useRef(null);
  const engineRef = useRef({});

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = ''; 
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 10;
    
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    const isMobile = window.innerWidth <= 768;
    const particleCount = isMobile ? 6000 : 15000; 
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const basePositions = new Float32Array(particleCount * 3); 
    const colorsLight = new Float32Array(particleCount * 3);
    const colorsDark = new Float32Array(particleCount * 3);
    
    const cRed = new THREE.Color(0xff4b4b); const cDarkRed = new THREE.Color(0x2a0000); 
    const cBlue = new THREE.Color(0x60a5fa); const cCyan = new THREE.Color(0x00ffcc);

    for(let i = 0; i < particleCount; i++) {
        const theta = Math.random() * Math.PI * 2; const phi = Math.acos((Math.random() * 2) - 1);
        const r = 4 + (Math.random() * 0.4); 
        const x = r * Math.sin(phi) * Math.cos(theta), y = r * Math.sin(phi) * Math.sin(theta), z = r * Math.cos(phi);
        positions[i*3] = x; positions[i*3+1] = y; positions[i*3+2] = z;
        basePositions[i*3] = x; basePositions[i*3+1] = y; basePositions[i*3+2] = z;
        
        const mixL = cRed.clone().lerp(cDarkRed, Math.random()); 
        colorsLight[i*3] = mixL.r; colorsLight[i*3+1] = mixL.g; colorsLight[i*3+2] = mixL.b;
        
        const mixD = cBlue.clone().lerp(cCyan, Math.random()); 
        colorsDark[i*3] = mixD.r; colorsDark[i*3+1] = mixD.g; colorsDark[i*3+2] = mixD.b;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const activeColors = new Float32Array(colorsLight);
    geometry.setAttribute('color', new THREE.BufferAttribute(activeColors, 3)); 
    
    const material = new THREE.PointsMaterial({ size: 0.04, vertexColors: true, transparent: true, opacity: 0.8, depthWrite: false });
    const particleSystem = new THREE.Points(geometry, material);
    particleSystem.position.x = isMobile ? 0 : 3.5; 
    scene.add(particleSystem);
    
    engineRef.current = { scene, geometry, material, colorsLight, colorsDark };

    const initialDark = document.documentElement.classList.contains('dark');
    if (initialDark) {
        scene.fog = new THREE.FogExp2(0x020617, 0.05);
        material.blending = THREE.AdditiveBlending;
        geometry.setAttribute('color', new THREE.BufferAttribute(colorsDark, 3));
    } else {
        scene.fog = new THREE.FogExp2(0xD8D9F1, 0.04);
        material.blending = THREE.NormalBlending;
        geometry.setAttribute('color', new THREE.BufferAttribute(colorsLight, 3));
    }

    let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;
    
    const onMouseMove = (e) => { 
        mouseX = (e.clientX / window.innerWidth) * 2 - 1; 
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1; 
    };
    const onTouchMove = (e) => { 
        if(e.touches.length > 0) { 
            mouseX = (e.touches[0].clientX / window.innerWidth) * 2 - 1; 
            mouseY = -(e.touches[0].clientY / window.innerHeight) * 2 + 1; 
        } 
    };
    
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouchMove, {passive: true});

    const clock = new THREE.Clock();
    let animationId;

    const animate = () => {
        animationId = requestAnimationFrame(animate); 
        const time = clock.getElapsedTime();
        
        targetX = mouseX * 0.5; targetY = mouseY * 0.5;
        
        particleSystem.rotation.y += 0.05 * (targetX - particleSystem.rotation.y); 
        particleSystem.rotation.x += 0.05 * (-targetY - particleSystem.rotation.x); 
        particleSystem.rotation.y += 0.002;
        
        const positionsAttribute = geometry.attributes.position; 
        const array = positionsAttribute.array; 
        const morphFactor = (Math.sin(time * 0.4) + 1) * 0.5;
        
        for(let i=0; i<particleCount; i++) {
            const ix = i * 3, bx = basePositions[ix], by = basePositions[ix+1], bz = basePositions[ix+2];
            const twistAngle = by * 0.4 * Math.sin(time * 0.6), s = Math.sin(twistAngle), c = Math.cos(twistAngle);
            const twistedX = bx * c - bz * s, twistedZ = bx * s + bz * c;
            array[ix] = bx + (twistedX - bx) * morphFactor; array[ix+1] = by; array[ix+2] = bz + (twistedZ - bz) * morphFactor;
        }
        positionsAttribute.needsUpdate = true; 
        renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight; 
        camera.updateProjectionMatrix(); 
        renderer.setSize(window.innerWidth, window.innerHeight);
        particleSystem.position.x = window.innerWidth <= 768 ? 0 : 3.5;
    };
    window.addEventListener('resize', onResize);

    return () => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('touchmove', onTouchMove);
        window.removeEventListener('resize', onResize);
        cancelAnimationFrame(animationId);
        renderer.dispose();
        geometry.dispose();
        material.dispose();
    };
  }, []);

  useEffect(() => {
    if (!engineRef.current.scene) return;
    const { scene, geometry, material, colorsLight, colorsDark } = engineRef.current;
    
    if (isDark) { 
        scene.fog = new THREE.FogExp2(0x020617, 0.05); 
        material.blending = THREE.AdditiveBlending; 
        geometry.setAttribute('color', new THREE.BufferAttribute(colorsDark, 3)); 
    } else { 
        scene.fog = new THREE.FogExp2(0xD8D9F1, 0.04); 
        material.blending = THREE.NormalBlending; 
        geometry.setAttribute('color', new THREE.BufferAttribute(colorsLight, 3)); 
    }
    material.needsUpdate = true;
  }, [isDark]);

  return <div id="three-canvas-container" ref={containerRef} className="fixed top-0 left-0 w-screen h-screen z-[-2] pointer-events-none"></div>;
};

// ==========================================
// CURSOR TRAIL (2D Canvas)
// ==========================================
const CursorTrail = ({ isDark }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let cursorParticles = [];
    let animationId;
    
    const cursorColor = isDark ? '0, 255, 204' : '239, 68, 68';

    const resizeCanvas = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener('resize', resizeCanvas); 
    resizeCanvas();

    const spawnParticles = (clientX, clientY) => {
        for(let i=0; i<3; i++) {
            cursorParticles.push({ 
                x: clientX, y: clientY, 
                vx: (Math.random() - 0.5) * 3, vy: (Math.random() - 0.5) * 3, 
                life: 1, size: Math.random() * 3 + 1 
            });
        }
    };

    const handleMouseMove = (e) => spawnParticles(e.clientX, e.clientY);
    const handleTouchMove = (e) => { if(e.touches.length > 0) spawnParticles(e.touches[0].clientX, e.touches[0].clientY); };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('touchmove', handleTouchMove, {passive: true});

    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < cursorParticles.length; i++) {
            let p = cursorParticles[i];
            p.x += p.vx; p.y += p.vy; p.life -= 0.025; 
            if (p.life <= 0) { cursorParticles.splice(i, 1); i--; continue; }
            ctx.beginPath(); 
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${cursorColor}, ${p.life})`; 
            ctx.shadowBlur = 15; 
            ctx.shadowColor = `rgba(${cursorColor}, ${p.life})`; 
            ctx.fill();
        }
        animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
        window.removeEventListener('resize', resizeCanvas);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('touchmove', handleTouchMove);
        cancelAnimationFrame(animationId);
    };
  }, [isDark]);

  return <canvas id="trail-canvas" ref={canvasRef} className="fixed top-0 left-0 w-screen h-screen z-[99999] pointer-events-none transform translate-z-0"></canvas>;
};

// ==========================================
// MAIN APP COMPONENT
// ==========================================
export default function App() {
  const [theme, setTheme] = useState('system');
  const [isDark, setIsDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [drawerData, setDrawerData] = useState(null);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [timelineProgress, setTimelineProgress] = useState(0);
  
  const [showLoginModal, setShowLoginModal] = useState(false);
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
    return () => document.removeEventListener('mousemove', handleGlowMove);
  }, []);

  useEffect(() => {
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

        await emailjs.send(
            'service_8zx06bf', 
            'template_h51b6fn', 
            { name: formData.name, email: formData.email, message: formData.message },
            'cPbVW3Ogoq03163_h'
        );

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
      
      {/* BACKGROUND EFFECTS */}
      <RotatingSphereBackground isDark={isDark} />
      <CursorTrail isDark={isDark} />

      {/* LOGIN MODAL POPUP */}
      <div className={`fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-md transition-opacity duration-300 ${showLoginModal ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          <div className={`relative w-full max-w-md transform transition-transform duration-400 p-4 ${showLoginModal ? 'scale-100' : 'scale-95'}`}>
              <button 
                onClick={() => setShowLoginModal(false)} 
                className="absolute top-0 right-0 z-10 w-10 h-10 flex justify-center items-center rounded-full bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
              >
                  <i className="fas fa-times"></i>
              </button>
              
              <LoginUI />
              
          </div>
      </div>

      {/* DRAWER */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] transition-opacity duration-300 ${drawerData ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
        onClick={closeDrawer} 
      />
      <div 
        className={`fixed top-0 right-0 w-full max-w-[500px] h-screen z-[9999] transform transition-transform duration-400 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-transform vision-glass rounded-none border-y-0 border-r-0 !bg-white/80 dark:!bg-[#020617]/90 p-8 flex flex-col ${drawerData ? 'translate-x-0' : 'translate-x-full'}`}
      >
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
        <a href="#" onMouseEnter={playHoverBlip} className="vision-pill w-full py-4 text-center font-bold mt-8 block">Visit Live Site <i className="fas fa-external-link-alt ml-2"></i></a>
      </div>

      {/* NAVBAR */}
      <nav className="fixed w-full top-0 z-50 vision-glass rounded-none border-t-0 border-x-0 shadow-sm soft-glow relative">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white relative z-10">webagency</div>
            
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
                        <button 
                            onClick={handleLogout} 
                            onMouseEnter={playHoverBlip} 
                            className="vision-pill w-10 h-10 flex items-center justify-center soft-glow bg-red-500/10 text-red-500 border-red-500/30 hover:bg-red-500 hover:text-white transition-colors"
                            title="Log Out"
                        >
                            <i className="fas fa-sign-out-alt"></i>
                        </button>
                    </div>
                ) : (
                    <button 
                        onClick={() => setShowLoginModal(true)} 
                        onMouseEnter={playHoverBlip} 
                        className="vision-pill px-6 py-2.5 flex items-center gap-2 soft-glow bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30 hover:bg-blue-500 hover:text-white transition-colors"
                    >
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
                <button 
                    onClick={() => { setMenuOpen(false); handleLogout(); }} 
                    className="vision-pill px-10 py-3 font-bold text-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                >
                    Log Out <i className="fas fa-sign-out-alt ml-2"></i>
                </button>
            </div>
        ) : (
            <button 
                onClick={() => { setMenuOpen(false); setShowLoginModal(true); }} 
                className="vision-pill px-10 py-4 font-bold text-xl mt-4 bg-blue-500/20 text-blue-600 dark:text-blue-400"
            >
                Client Login
            </button>
        )}

        <button onClick={toggleTheme} className="vision-pill px-6 py-3 mt-2 flex items-center justify-center gap-3 font-bold text-slate-900 dark:text-white">
            <i className={theme === 'dark' ? "fas fa-moon text-indigo-400" : theme === 'light' ? "fas fa-sun text-orange-400" : "fas fa-desktop text-blue-500"}></i> 
            <span>{theme === 'dark' ? 'Dark Theme' : theme === 'light' ? 'Light Theme' : 'System Theme'}</span>
        </button>
      </div>

      <section className="min-h-screen flex flex-col justify-center pt-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6 w-full grid md:grid-cols-2 gap-12 items-center mb-12">
            <div className="flex flex-col justify-center pointer-events-none mt-10 md:mt-0 text-center md:text-left">
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-[1.1] text-slate-900 dark:text-white mb-6 tracking-tight reveal-text">
                    Crafting <br className="hidden md:block"/> exceptional <br className="hidden md:block"/> websites with <br className="hidden md:block"/> Expert Design.
                </h1>
                <p className="text-slate-600 dark:text-slate-400 font-medium text-base md:text-lg mb-10 max-w-md mx-auto md:mx-0 pointer-events-auto reveal-text" style={{transitionDelay: '0.1s'}}>
                    We specialize in creating stunning, functional websites that drive results. Explore our portfolio and see how we can elevate your online presence.
                </p>
                <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4 pointer-events-auto reveal-text" style={{transitionDelay: '0.2s'}}>
                    <a href="#contact" onMouseEnter={playHoverBlip} className="vision-pill px-8 py-4 font-bold flex justify-center items-center gap-2 soft-glow text-slate-900 dark:text-white block">
                        Start Your Project <i className="fas fa-arrow-right text-xs"></i>
                    </a>
                </div>
            </div>
        </div>

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
      </section>

      <section className="py-10 relative z-10 overflow-hidden">
        <div className="marquee-wrapper">
            <div className="marquee-content gap-16 md:gap-32 items-center text-4xl text-slate-500 dark:text-slate-600">
                <div className="tooltip relative transition-colors cursor-pointer hover:text-[#61DAFB]" onMouseEnter={playHoverBlip}><i className="fab fa-react"></i><span className="tooltip-text vision-glass px-3 py-1 text-xs text-white">React.js</span></div>
                <div className="tooltip relative transition-colors cursor-pointer hover:text-[#68A063]" onMouseEnter={playHoverBlip}><i className="fab fa-node-js"></i><span className="tooltip-text vision-glass px-3 py-1 text-xs text-white">Node.js</span></div>
                <div className="tooltip relative transition-colors cursor-pointer hover:text-[#F7DF1E]" onMouseEnter={playHoverBlip}><i className="fab fa-js"></i><span className="tooltip-text vision-glass px-3 py-1 text-xs text-white">JavaScript</span></div>
                <div className="tooltip relative transition-colors cursor-pointer hover:text-[#E34F26]" onMouseEnter={playHoverBlip}><i className="fab fa-html5"></i><span className="tooltip-text vision-glass px-3 py-1 text-xs text-white">HTML5</span></div>
                <div className="tooltip relative transition-colors cursor-pointer hover:text-[#1572B6]" onMouseEnter={playHoverBlip}><i className="fab fa-css3-alt"></i><span className="tooltip-text vision-glass px-3 py-1 text-xs text-white">CSS3</span></div>
                <div className="tooltip relative transition-colors cursor-pointer hover:text-[#47A248]" onMouseEnter={playHoverBlip}><i className="fas fa-database"></i><span className="tooltip-text vision-glass px-3 py-1 text-xs text-white">MongoDB</span></div>
            </div>
        </div>
      </section>

      <section id="work" className="py-24 relative z-10 vision-glass rounded-none border-x-0 mt-10 soft-glow">
        <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center mb-16 text-center md:text-left">
                <div>
                    <span className="text-xs font-bold tracking-widest uppercase text-slate-600 dark:text-slate-500 mb-2 block reveal-text relative z-10">Our Work</span>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight reveal-text relative z-10">Showcasing our <br className="hidden md:block"/> digital craft.</h2>
                </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
                {[
                  { id: 'ecommerce', title: 'Modern E-Commerce', delay: '0s', img: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=80', desc: 'High-conversion online store architecture featuring seamless cart integrations.'},
                  { id: 'beauty', title: 'Bridal & Beauty Studio', delay: '0.1s', img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80', desc: 'Elegant booking portfolio designed for an elite makeup artist.'},
                  { id: 'restaurant', title: 'Fine Dining Experience', delay: '0.2s', img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80', desc: 'Immersive restaurant website with a beautifully crafted digital menu.'}
                ].map((item) => (
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

      <section className="py-24 relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-12">
            <span className="text-xs font-bold tracking-widest uppercase text-slate-600 dark:text-slate-500 mb-2 block reveal-text relative z-10">Testimonials</span>
            <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white reveal-text relative z-10">What our clients say.</h2>
        </div>
        <div className="snap-x-container flex gap-6 px-6 md:px-12 pb-10">
            <div className="shrink-0 w-4 md:w-16"></div>
            {[
              { img: '4', name: 'Sarah Jenkins', role: 'CEO, RetailCo', text: '"Their use of 3D rendering completely transformed how we sell our products online. Conversions are up 40%."', delay: '0s' },
              { img: '5', name: 'Marcus Vance', role: 'Founder, Elite Beauty', text: '"Lightning fast delivery and the ultra-glass aesthetic is exactly what our luxury brand needed to stand out."', delay: '0.1s' },
              { img: '6', name: 'David Chen', role: 'Director, The Grand', text: '"The communication was stellar throughout the process. The site is flawless and our booking rate doubled."', delay: '0.2s' }
            ].map((t, i) => (
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
                    {[
                      { step: '1. Discovery Call', desc: 'We dive deep into your brand, target audience, and specific technical requirements.', icon: 'fa-phone-alt', color: 'blue' },
                      { step: '2. Design & Develop', desc: 'We craft wireframes into Ultra-Glass UI, building robust, scalable code under the hood.', icon: 'fa-pen-nib', color: 'purple' },
                      { step: '3. Launch & Scale', desc: 'Your site goes live on high-speed servers with built-in analytics and SEO optimization.', icon: 'fa-rocket', color: 'emerald' }
                    ].map((p, i) => (
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

      <section id="founders" className="py-24 relative z-10 mt-10">
        <div className="max-w-7xl mx-auto px-6">
            <div className="text-center md:text-left mb-16 reveal-text relative z-10">
                <span className="text-xs font-bold tracking-widest uppercase text-slate-600 dark:text-slate-500 mb-2 block">The Team</span>
                <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6">Meet the Founders.</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                <div className="vision-glass p-8 rounded-3xl reveal-text soft-glow group card-hover backdrop-blur-xl bg-white/20 dark:bg-[#020617]/40 border border-white/30 dark:border-white/10" onMouseEnter={playHoverBlip}>
                    <div className="w-16 h-16 rounded-full bg-blue-500/20 border border-blue-400 flex items-center justify-center mb-6 text-2xl text-blue-500 group-hover:scale-110 transition-transform z-10 relative"><i className="fas fa-code"></i></div>
                    <div className='relative z-10'>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Sadiq Pathan</h3>
                      <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-4">HTML, CSS, JS, C, C++, Python, MongoDB, SQL</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Sadiq holds a Bachelor of Engineering in Computer Engineering and brings robust full-stack development experience to the table. He has successfully engineered complex projects, including a dynamic Railway Reservation System UI, a scalable e-commerce platform, and an automated email generator.</p>
                    </div>
                </div>
                <div className="vision-glass p-8 rounded-3xl reveal-text soft-glow group card-hover backdrop-blur-xl bg-white/20 dark:bg-[#020617]/40 border border-white/30 dark:border-white/10" style={{transitionDelay: '0.1s'}} onMouseEnter={playHoverBlip}>
                    <div className="w-16 h-16 rounded-full bg-purple-500/20 border border-purple-400 flex items-center justify-center mb-6 text-2xl text-purple-500 group-hover:scale-110 transition-transform z-10 relative"><i className="fas fa-layer-group"></i></div>
                    <div className='relative z-10'>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Shahvez Sayyed</h3>
                      <p className="text-xs font-bold text-purple-500 uppercase tracking-widest mb-4">HTML, CSS, Node.js, React.js</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Shahvez is an innovative web developer with a strong focus on building interactive, user-centric booking and reservation systems. His portfolio highlights include a comprehensive makeup artist platform equipped with appointment scheduling and course management capabilities, alongside a centralized restaurant reservation website.</p>
                    </div>
                </div>
            </div>
        </div>
      </section>

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
                      <a href="#contact" className="vision-pill block w-full py-3 text-center font-bold text-slate-900 dark:text-white soft-glow">Get Started</a>
                    </div>
                </div>
                
                {/* FIXED PRO CARD: Replaced button class to pure Tailwind */}
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
                          {/* FIXED BUTTON: Replaced vision-pill with standard Tailwind to force styling */}
                          <a href="#contact" className="block w-full py-3 rounded-full text-center font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/30 transition-all mt-auto">Upgrade Now</a>
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

      <section className="py-24 relative z-10 max-w-4xl mx-auto px-6">
        <div className="text-center mb-12 reveal-text relative z-10">
            <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-4 reveal-text relative z-10">
            {[
              { q: 'How long does a typical project take?', a: 'Most standard projects take between 2 to 4 weeks from discovery to final launch. Enterprise solutions may take 6 to 8 weeks depending on complexity.' },
              { q: 'Do you provide hosting and maintenance?', a: 'Yes! All our packages include optional ultra-fast global hosting and 24/7 server monitoring to ensure 100% uptime.' },
              { q: 'Will my website work on mobile devices?', a: 'Absolutely. We use mobile-first architecture. Elements automatically adapt, and heavy 3D effects are optimized to save battery on phones.' }
            ].map((faq, idx) => (
              <FaqItem key={idx} question={faq.q} answer={faq.a} isOpen={openFaqIndex === idx} onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)} />
            ))}
        </div>
      </section>

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
                            {/* FIXED BUTTON: Replaced vision-pill with standard Tailwind to force styling */}
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
                            {formStatus === 'sending' ? 'Connecting to Database...' : <>Submit to Firebase <i className="fas fa-paper-plane text-xs"></i></>}
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
                          {/* FIXED BUTTON: Replaced vision-pill with standard Tailwind to force styling */}
                          <button onClick={() => setShowLoginModal(true)} onMouseEnter={playHoverBlip} className="px-8 py-3 rounded-full font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/30 transition-all cursor-none">
                              Sign In to Continue
                          </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </section>

    </div>
  );
}