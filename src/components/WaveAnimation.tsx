'use client';

import { useEffect } from 'react';

export default function WaveAnimation() {
  useEffect(() => {
    // Function to initialize wave animation
    const initWaveAnimation = () => {
      if (typeof window !== 'undefined' && !window.waveAnimation) {
        // Load the wave animation script dynamically
        const script = document.createElement('script');
        script.src = '/wave-animation.js';
        script.onload = () => {
          console.log('Wave animation script loaded');
          // Give it a moment to initialize
          setTimeout(() => {
            if (window.WaveAnimation && !window.waveAnimation) {
              window.waveAnimation = new window.WaveAnimation();
              console.log('Wave animation initialized from component');
            }
          }, 100);
        };
        document.head.appendChild(script);
      }
    };

    // Initialize with a small delay to ensure DOM is ready
    const timer = setTimeout(initWaveAnimation, 500);

    return () => {
      clearTimeout(timer);
      // Cleanup on unmount
      if (window.waveAnimation && window.waveAnimation.destroy) {
        window.waveAnimation.destroy();
        window.waveAnimation = null;
      }
    };
  }, []);

  return null; // This component doesn't render anything
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    waveAnimation: any;
    WaveAnimation: any;
  }
}
