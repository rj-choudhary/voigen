'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function ConfirmationPage() {
  const { user } = useAuth();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Try to get user name from Firebase user or localStorage
    if (user?.displayName) {
      setUserName(user.displayName.split(' ')[0]);
    } else {
      const signupData = localStorage.getItem('signupData');
      if (signupData) {
        try {
          const data = JSON.parse(signupData);
          if (data.name) {
            setUserName(data.name.split(' ')[0]);
          }
        } catch (e) {
          console.error('Error parsing signup data:', e);
        }
      }
    }
  }, [user]);

  return (
    <div className="auth-page confirmation-page">
      <div className="auth-container">
        <div className="confirmation-card">
          {/* Success Animation */}
          <div className="success-icon">
            <div className="success-circle">
              <svg 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="3" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <div className="success-rings">
              <div className="ring ring-1"></div>
              <div className="ring ring-2"></div>
              <div className="ring ring-3"></div>
            </div>
          </div>

          {/* Content */}
          <h1 className="confirmation-title">
            You're all set{userName ? `, ${userName}` : ''} 🎉
          </h1>
          
          <p className="confirmation-subtitle">
            Your free trial has started.<br />
            Our team will set up your AI voice agent and contact you shortly.
          </p>

          {/* Features List */}
          <div className="confirmation-features">
            <div className="feature-item">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <span>14-day free trial activated</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <span>Custom AI voice agent setup</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <span>Dedicated onboarding support</span>
            </div>
          </div>

          {/* CTA Button */}
          <button 
            className="btn btn-primary btn-large"
            data-cal-namespace="democall"
            data-cal-link="voigen-mvcmgc/democall"
            data-cal-config='{"layout":"month_view"}'
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '20px', height: '20px', marginRight: '8px' }}>
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            Book your setup call
          </button>

          <p className="confirmation-note">
            Or we'll reach out to you within 24 hours
          </p>

          {/* Back to Home */}
          <Link href="/" className="back-home-link">
            ← Back to Home
          </Link>
        </div>

        {/* Decorative Elements */}
        <div className="auth-decoration">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
          <div className="confetti-container">
            {[...Array(20)].map((_, i) => (
              <div key={i} className={`confetti confetti-${i % 5}`} style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
