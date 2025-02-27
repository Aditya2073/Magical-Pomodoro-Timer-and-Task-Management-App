import React, { useEffect, useRef } from 'react';

interface MagicalParticlesProps {
  count?: number;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  element: HTMLDivElement;
  opacity: number;
  fadeSpeed: number;
}

const MagicalParticles: React.FC<MagicalParticlesProps> = ({ count = 15 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number | null>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const particles: Particle[] = [];
    
    // Colors for magical particles
    const colors = [
      'rgba(138, 43, 226, 0.6)', // purple
      'rgba(58, 134, 255, 0.6)', // blue
      'rgba(255, 215, 0, 0.6)',  // gold
      'rgba(255, 105, 180, 0.6)', // pink
      'rgba(72, 209, 204, 0.6)',  // turquoise
    ];
    
    // Create particles
    for (let i = 0; i < count; i++) {
      const size = Math.random() * 6 + 2;
      const element = document.createElement('div');
      element.className = 'particle';
      element.style.width = `${size}px`;
      element.style.height = `${size}px`;
      element.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      element.style.boxShadow = `0 0 ${size * 2}px ${element.style.backgroundColor}`;
      
      const particle: Particle = {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size,
        speedX: Math.random() * 0.5 - 0.25,
        speedY: Math.random() * 0.5 - 0.25,
        color: colors[Math.floor(Math.random() * colors.length)],
        element,
        opacity: Math.random() * 0.5 + 0.3,
        fadeSpeed: Math.random() * 0.01 + 0.005
      };
      
      // Set initial opacity
      element.style.opacity = particle.opacity.toString();
      
      container.appendChild(element);
      particles.push(particle);
    }
    
    particlesRef.current = particles;
    
    // Animation function
    const animate = () => {
      particles.forEach(particle => {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Bounce off edges
        if (particle.x <= 0 || particle.x >= window.innerWidth) {
          particle.speedX *= -1;
        }
        
        if (particle.y <= 0 || particle.y >= window.innerHeight) {
          particle.speedY *= -1;
        }
        
        // Fade in and out
        particle.opacity += particle.fadeSpeed;
        if (particle.opacity >= 0.8 || particle.opacity <= 0.2) {
          particle.fadeSpeed *= -1;
        }
        
        // Update element position and opacity
        particle.element.style.left = `${particle.x}px`;
        particle.element.style.top = `${particle.y}px`;
        particle.element.style.opacity = particle.opacity.toString();
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    // Start animation
    animate();
    
    // Handle window resize
    const handleResize = () => {
      particles.forEach(particle => {
        // Keep particles within the window
        if (particle.x > window.innerWidth) {
          particle.x = window.innerWidth - particle.size;
        }
        if (particle.y > window.innerHeight) {
          particle.y = window.innerHeight - particle.size;
        }
      });
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      particles.forEach(particle => {
        if (particle.element.parentNode) {
          particle.element.parentNode.removeChild(particle.element);
        }
      });
      
      window.removeEventListener('resize', handleResize);
    };
  }, [count]);
  
  return <div ref={containerRef} className="particles-container" />;
};

export default MagicalParticles;