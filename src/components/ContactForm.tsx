'use client';

import { useEffect } from 'react';

interface ContactFormProps {
  /** Title displayed above the form. Default: "Request a Demo" */
  title?: string;
  /** Subtitle displayed below the title. Default: "Let us show you how Voigen.ai can transform your business" */
  subtitle?: string;
  /** Height of the iframe. Default: 600 */
  height?: number;
  /** Additional CSS class for the container */
  className?: string;
}

export default function ContactForm({
  title = "Request a Demo",
  subtitle = "Let us show you how Voigen.ai can transform your business",
  height = 600,
  className = ""
}: ContactFormProps) {
  
  // Load Tally script on mount
  useEffect(() => {
    const loadTallyScript = () => {
      // Check if Tally script is already loaded
      if (typeof (window as any).Tally !== 'undefined') {
        (window as any).Tally.loadEmbeds();
        return;
      }

      // Load Tally script
      const script = document.createElement('script');
      script.src = 'https://tally.so/widgets/embed.js';
      script.async = true;
      script.onload = () => {
        if (typeof (window as any).Tally !== 'undefined') {
          (window as any).Tally.loadEmbeds();
        }
      };
      document.head.appendChild(script);
    };

    loadTallyScript();
  }, []);

  return (
    <div className={`tally-form-container ${className}`}>
      {title && <h3>{title}</h3>}
      {subtitle && <p className="form-subtitle">{subtitle}</p>}
      
      {/* Tally Embedded Form */}
      <iframe 
        data-tally-src="https://tally.so/embed/J91vGz?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1" 
        loading="lazy" 
        width="100%" 
        height={height}
        frameBorder="0" 
        marginHeight={0}
        marginWidth={0}
        title="Contact Us - Voigen.ai"
      />
    </div>
  );
}
