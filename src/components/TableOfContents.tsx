'use client';

import { useState, useEffect } from 'react';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  headings: Heading[];
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  // Initialize with first heading to prevent hydration mismatch
  const [activeId, setActiveId] = useState<string>(headings.length > 0 ? headings[0].id : '');
  const [mounted, setMounted] = useState(false);

  // Set mounted state after hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Track which heading is currently in view
  useEffect(() => {
    if (!mounted) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-100px 0px -80% 0px',
        threshold: 0
      }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      headings.forEach((heading) => {
        const element = document.getElementById(heading.id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [headings, mounted]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, headingId: string) => {
    e.preventDefault();
    const element = document.getElementById(headingId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 120,
        behavior: 'smooth'
      });
      setActiveId(headingId);
    }
  };

  if (headings.length === 0) return null;

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.98) 100%)',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)',
      border: '1px solid rgba(226, 232, 240, 0.8)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative gradient accent */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: 'linear-gradient(90deg, #8b5cf6 0%, #a855f7 50%, #d946ef 100%)',
        borderRadius: '16px 16px 0 0'
      }} />

      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '20px',
        paddingBottom: '16px',
        borderBottom: '1px solid rgba(226, 232, 240, 0.6)'
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(139, 92, 246, 0.3)'
        }}>
          <svg 
            width="16" 
            height="16" 
            fill="none" 
            stroke="white" 
            viewBox="0 0 24 24"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h10" />
          </svg>
        </div>
        <span style={{
          fontSize: '13px',
          fontWeight: '700',
          color: '#1e293b',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          On This Page
        </span>
      </div>

      {/* Navigation */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {headings.map((heading, index) => {
          const isActive = activeId === heading.id;
          const isH1 = heading.level === 1;
          const isH2 = heading.level === 2;
          
          return (
            <a
              key={heading.id}
              href={`#${heading.id}`}
              onClick={(e) => handleClick(e, heading.id)}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: isH1 ? '12px 14px' : '8px 14px',
                marginLeft: isH1 ? '0' : isH2 ? '12px' : '24px',
                borderRadius: '10px',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                background: isActive 
                  ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.12) 0%, rgba(168, 85, 247, 0.08) 100%)'
                  : 'transparent',
                border: isActive 
                  ? '1px solid rgba(139, 92, 246, 0.2)' 
                  : '1px solid transparent',
                cursor: 'pointer',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(241, 245, 249, 0.8)';
                  e.currentTarget.style.transform = 'translateX(4px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.transform = 'translateX(0)';
                }
              }}
            >
              {/* Level indicator dot/line */}
              <div style={{
                width: isH1 ? '8px' : '6px',
                height: isH1 ? '8px' : '6px',
                borderRadius: '50%',
                background: isActive 
                  ? 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)'
                  : isH1 
                    ? '#94a3b8' 
                    : '#cbd5e1',
                marginTop: isH1 ? '6px' : '7px',
                flexShrink: 0,
                transition: 'all 0.2s ease',
                boxShadow: isActive ? '0 0 8px rgba(139, 92, 246, 0.4)' : 'none'
              }} />
              
              {/* Text */}
              <span style={{
                fontSize: isH1 ? '14px' : '13px',
                fontWeight: isH1 ? '600' : isActive ? '500' : '400',
                color: isActive 
                  ? '#7c3aed' 
                  : isH1 
                    ? '#1e293b' 
                    : '#64748b',
                lineHeight: '1.5',
                transition: 'all 0.2s ease'
              }}>
                {heading.text}
              </span>

              {/* Active indicator bar */}
              {isActive && (
                <div style={{
                  position: 'absolute',
                  left: '0',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '3px',
                  height: '60%',
                  background: 'linear-gradient(180deg, #8b5cf6 0%, #a855f7 100%)',
                  borderRadius: '0 4px 4px 0'
                }} />
              )}
            </a>
          );
        })}
      </nav>

      {/* Progress indicator */}
      <div style={{
        marginTop: '20px',
        paddingTop: '16px',
        borderTop: '1px solid rgba(226, 232, 240, 0.6)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <div style={{
          flex: 1,
          height: '4px',
          background: '#e2e8f0',
          borderRadius: '2px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${((headings.findIndex(h => h.id === activeId) + 1) / headings.length) * 100}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #8b5cf6 0%, #a855f7 100%)',
            borderRadius: '2px',
            transition: 'width 0.3s ease'
          }} />
        </div>
        <span style={{
          fontSize: '11px',
          color: '#94a3b8',
          fontWeight: '500',
          minWidth: '40px',
          textAlign: 'right'
        }}>
          {headings.findIndex(h => h.id === activeId) + 1}/{headings.length}
        </span>
      </div>
    </div>
  );
}
