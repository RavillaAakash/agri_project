import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export const AgriCanvas3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);

  useEffect(() => {
    // Check WebGL availability
    const checkWebGL = () => {
      try {
        const canvas = document.createElement('canvas');
        return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
      } catch {
        return false;
      }
    };

    if (!checkWebGL() || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setHasWebGL(false);
      return;
    }

    const currentMount = mountRef.current;
    if (!currentMount) return;

    // Scene, Camera, Renderer
    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight;
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0e1b12, 0.035);

    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100);
    camera.position.set(0, 3, 9);
    camera.lookAt(0, 0, 0);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      currentMount.appendChild(renderer.domElement);
    } catch {
      setHasWebGL(false);
      return;
    }

    // Farmland Terrain Grid
    const planeGeo = new THREE.PlaneGeometry(28, 28, 48, 48);
    planeGeo.rotateX(-Math.PI / 2);
    const pos = planeGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      // Create agricultural furrows and gentle field roll
      const y = Math.sin(x * 0.9) * 0.35 + Math.cos(z * 0.4) * 0.45;
      pos.setY(i, y);
    }
    planeGeo.computeVertexNormals();

    const planeMat = new THREE.MeshStandardMaterial({
      color: 0x173a26,
      roughness: 0.8,
      metalness: 0.1,
      wireframe: false,
    });
    const terrain = new THREE.Mesh(planeGeo, planeMat);
    terrain.position.y = -1.8;
    scene.add(terrain);

    // AI Crop Scan Grid Lines Overlay
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x22c55e,
      wireframe: true,
      transparent: true,
      opacity: 0.14,
    });
    const terrainWire = new THREE.Mesh(planeGeo, wireMat);
    terrainWire.position.y = -1.78;
    scene.add(terrainWire);

    // Ambient Floating Agricultural Pollen & Moisture Particles
    const particleCount = 180;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 18;
      particlePos[i + 1] = Math.random() * 6 - 1;
      particlePos[i + 2] = (Math.random() - 0.5) * 16;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0xf59e0b,
      size: 0.08,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfef3c7, 1.4);
    sunLight.position.set(5, 12, 6);
    scene.add(sunLight);

    const aiScanLight = new THREE.PointLight(0x10b981, 2, 10);
    aiScanLight.position.set(0, 1, 2);
    scene.add(aiScanLight);

    // Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Slow agricultural wind effect
      terrain.position.z = (elapsed * 0.25) % 2 - 2;
      terrainWire.position.z = terrain.position.z;

      // Particle float
      particles.rotation.y = elapsed * 0.04;
      aiScanLight.position.x = Math.sin(elapsed * 0.8) * 3;
      aiScanLight.position.z = Math.cos(elapsed * 0.8) * 2;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!currentMount) return;
      const w = currentMount.clientWidth;
      const h = currentMount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      if (renderer && renderer.domElement && currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      planeGeo.dispose();
      planeMat.dispose();
      wireMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, []);

  if (!hasWebGL) {
    return (
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/40 via-emerald-900/20 to-background pointer-events-none" />
    );
  }

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-85 z-0 overflow-hidden"
      aria-hidden="true"
    />
  );
};
