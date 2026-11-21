import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

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

export default RotatingSphereBackground;