import React, { useEffect, useRef } from 'react';

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

export default CursorTrail;