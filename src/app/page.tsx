'use client';

import { useEffect, useState, useRef } from 'react';
import TalkInterface from '@/components/TalkInterface';
import ContactForm from '@/components/ContactForm';

export default function Home() {
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(0);
  
  // ROI Calculator State
  const [missedCalls, setMissedCalls] = useState(15);
  const [ticketValue, setTicketValue] = useState(250);
  
  // Calculations (matching sample code logic)
  const bounceRate = 0.85;
  const weeksPerMonth = 4.3;
  const avgCallDuration = 4; // minutes per call
  const monthlyMissedCalls = missedCalls * weeksPerMonth;
  const lostRevenue = Math.round(monthlyMissedCalls * ticketValue * bounceRate);
  const totalMinutes = monthlyMissedCalls * avgCallDuration;
  const humanHourlyRate = 22; // USD per hour
  const humanMonthlyCost = Math.round(20 * weeksPerMonth * humanHourlyRate);
  const voigenCost = Math.round(totalMinutes * 0.05); // $0.05 per minute
  const savings = humanMonthlyCost - voigenCost;
  const savingsPercent = humanMonthlyCost > 0 ? Math.round((savings / humanMonthlyCost) * 100) : 0;
  
  const phrases = [
    'never misses a call',
    'captures every lead',
    'books your appointments',
    'answers customer FAQs'
  ];

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];
    let timeout: NodeJS.Timeout;

    if (!isDeleting) {
      // Typing
      if (displayText.length < currentPhrase.length) {
        timeout = setTimeout(() => {
          setDisplayText(currentPhrase.substring(0, displayText.length + 1));
        }, 100);
      } else {
        // Pause at end before deleting
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, 2000);
      }
    } else {
      // Deleting
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText(displayText.substring(0, displayText.length - 1));
        }, 50);
      } else {
        // Move to next phrase
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % phrases.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, phraseIndex, phrases]);

  useEffect(() => {
    // Google Analytics - Talk Now Button Tracking
    const handleTalkNowClick = () => {
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'talk_now_click', {
          event_category: 'engagement',
          event_label: 'Talk Now Button'
        });
      }
    };

    // Add event listener for talk now button clicks
    const talkBtn = document.getElementById('talkNowBtn');
    if (talkBtn) {
      talkBtn.addEventListener('click', handleTalkNowClick);
    }

    return () => {
      if (talkBtn) {
        talkBtn.removeEventListener('click', handleTalkNowClick);
      }
    };
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section id="home" className="section hero-section">
        <div className="hero-background">
          <div className="geometric-lines">
            <div className="geo-line line-1"></div>
            <div className="geo-line line-2"></div>
            <div className="geo-line line-3"></div>
            <div className="geo-line line-4"></div>
            <div className="geo-line line-5"></div>
          </div>
        </div>
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Your 24/7 <span className="ai-gradient">AI Voice Agent</span> that
            </h1>
            <div className="hero-rotating-text">
              <span className="rotating-text gradient-text">{displayText}</span>
              <span className="typing-cursor">|</span>
            </div>
            <p className="hero-subtitle">
              Try it live — speak now
            </p>
            <div className="hero-cta">
              <TalkInterface />
            </div>
            <p className="hero-description">
              Stop losing customers to voicemail. Voigen answers your business calls, understands caller needs, and captures leads or books appointments directly into your tools.
            </p>
            
            {/* Trust Indicators */}
            <div className="hero-trust-indicators">
              <div className="trust-item">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                  <line x1="1" y1="10" x2="23" y2="10"></line>
                </svg>
                <span>No credit card required</span>
              </div>
              <div className="trust-item">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <polyline points="20 12 20 22 4 22 4 12"></polyline>
                  <rect x="2" y="7" width="20" height="5"></rect>
                  <line x1="12" y1="22" x2="12" y2="7"></line>
                  <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
                  <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
                </svg>
                <span>7-Day Free Trial</span>
              </div>
              <div className="trust-item">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
                <span>We handle the setup</span>
              </div>
              <div className="trust-item">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                  <polyline points="2 17 12 22 22 17"></polyline>
                  <polyline points="2 12 12 17 22 12"></polyline>
                </svg>
                <span>Works with your tools</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Point Section */}
      <section className="section pain-point-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why small businesses are switching to <span className="gradient-text">AI voice</span></h2>
            <p className="section-subtitle">A missed call isn't just a notification—it's lost revenue.</p>
          </div>
          
          <div className="pain-point-grid">
            <div className="pain-point-card">
              <span className="pain-point-tag red-tag">Pain</span>
              <div className="pain-point-icon red">
                <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  <path d="M15 9l-6 6"></path>
                </svg>
              </div>
              <h3>Missed Calls = Lost Cash</h3>
              <p>Studies show 85% of people won't call back if you don't answer the first time.</p>
            </div>
            
            <div className="pain-point-card">
              <span className="pain-point-tag indigo-tag">Relief</span>
              <div className="pain-point-icon indigo">
                <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <h3>24/7 Availability</h3>
              <p>Your business stays open while you sleep, travel, or focus on current clients.</p>
            </div>
            
            <div className="pain-point-card">
              <span className="pain-point-tag amber-tag">Efficiency</span>
              <div className="pain-point-icon amber">
                <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <h3>Only serious calls reach you</h3>
              <p>Our AI Voice agent understands why people are calling, filters spam, and passes you qualified leads only.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section how-it-works-section">
        <div className="container">
          <div className="section-header">
            <p className="how-it-works-badge">How It Works</p>
            <h2 className="section-title how-it-works-title">A fully managed setup by our team</h2>
            <p className="section-subtitle how-it-works-subtitle">No technical skills required. We handle everything.</p>
          </div>
          
          <div className="how-it-works-grid">
            <div className="how-it-works-card">
              <div className="step-number">1</div>
              <div className="step-icon">
                <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="8.5" cy="7" r="4"></circle>
                  <line x1="20" y1="8" x2="20" y2="14"></line>
                  <line x1="23" y1="11" x2="17" y2="11"></line>
                </svg>
              </div>
              <h3>Sign up free</h3>
              <p>Create your account in 2 minutes. No credit card required to start.</p>
            </div>
            
            <div className="step-connector">
              <svg width="40" height="24" viewBox="0 0 40 24" fill="none">
                <path d="M0 12H36M36 12L28 4M36 12L28 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            
            <div className="how-it-works-card">
              <div className="step-number">2</div>
              <div className="step-icon">
                <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                  <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"></path>
                </svg>
              </div>
              <h3>We set it up for you</h3>
              <p>Book a free call. Our team configures your AI employees for your workflow.</p>
            </div>
            
            <div className="step-connector">
              <svg width="40" height="24" viewBox="0 0 40 24" fill="none">
                <path d="M0 12H36M36 12L28 4M36 12L28 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            
            <div className="how-it-works-card">
              <div className="step-number">3</div>
              <div className="step-icon">
                <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <h3>They work 24/7</h3>
              <p>Your AI employees start working immediately. Track progress in your dashboard.</p>
            </div>
          </div>
          
          <div className="how-it-works-cta">
            <a href="/auth/signup" className="btn btn-light">
              <span className="btn-main-text">Start Free Trial</span>
              <span className="btn-sub-text">No CC required</span>
            </a>
            <button
              className="btn btn-outline btn-on-dark"
              data-cal-namespace="democall"
              data-cal-link="voigen-mvcmgc/democall"
              data-cal-config='{"layout":"month_view"}'
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              Book a Demo
            </button>
          </div>
        </div>
      </section>

      {/* ROI Calculator Section - New Design */}
      <section className="roi-section-new">
        <div className="roi-container-new">
          <div className="roi-header-new">
            <h2 className="roi-title-new">The Reality of Missed Calls</h2>
            <p className="roi-subtitle-new">Compare your current leaks with the cost of a solution.</p>
          </div>

          <div className="roi-card-new">
            <div className="roi-grid-new">
              {/* Left Column: Inputs & Loss (Dark) */}
              <div className="roi-left-column">
                <div className="roi-left-content">
                  <div className="roi-section-title">
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="roi-icon-red">
                      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
                      <polyline points="17 18 23 18 23 12"></polyline>
                    </svg>
                    <span>Calculate Loss</span>
                  </div>
                  
                  <div className="roi-sliders">
                    {/* Weekly Missed Calls */}
                    <div className="roi-slider-item">
                      <div className="roi-slider-row">
                        <label className="roi-slider-label">Weekly Missed Calls</label>
                        <span className="roi-slider-value-new">{missedCalls} calls</span>
                      </div>
                      <input 
                        type="range" 
                        min="1" 
                        max="100" 
                        value={missedCalls}
                        onChange={(e) => setMissedCalls(parseInt(e.target.value))}
                        className="roi-range-input"
                      />
                    </div>
                    
                    {/* Avg Project Value */}
                    <div className="roi-slider-item">
                      <div className="roi-slider-row">
                        <label className="roi-slider-label">Avg. Project Value</label>
                        <span className="roi-slider-value-new">${ticketValue}</span>
                      </div>
                      <input 
                        type="range" 
                        min="50" 
                        max="5000" 
                        step="50"
                        value={ticketValue}
                        onChange={(e) => setTicketValue(parseInt(e.target.value))}
                        className="roi-range-input"
                      />
                    </div>
                  </div>

                  {/* Revenue Leak Display */}
                  <div className="roi-leak-section">
                    <p className="roi-leak-label">Estimated Monthly Revenue Leak</p>
                    <div className="roi-leak-amount">
                      <span className="roi-leak-number">${lostRevenue.toLocaleString()}</span>
                      <span className="roi-leak-period">/mo</span>
                    </div>
                    <p className="roi-leak-note">*Calculated on an 85% bounce rate: callers hire your competitor if you don&apos;t answer.</p>
                  </div>
                </div>
                
                {/* Decorative glow */}
                <div className="roi-glow"></div>
              </div>

              {/* Right Column: Cost Comparison (Light) */}
              <div className="roi-right-column">
                <div className="roi-section-title-light">
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="roi-icon-indigo">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                  </svg>
                  <span>The Math is Simple</span>
                </div>

                <div className="roi-cards-grid">
                  {/* Human Card */}
                  <div className="roi-human-card-new">
                    <div className="roi-card-icon-wrapper human-icon">
                      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                    </div>
                    <h4 className="roi-card-title">Human Receptionist</h4>
                    <p className="roi-card-desc">Based on $22/hr (salary + overhead) for 20hr/week coverage.</p>
                    <div className="roi-card-cost-section">
                      <span className="roi-card-cost-label">Monthly Cost</span>
                      <span className="roi-card-cost-value">${humanMonthlyCost.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* AI Card */}
                  <div className="roi-ai-card-new">
                    <div className="roi-ai-bg-icon">
                      <svg width="80" height="80" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                      </svg>
                    </div>
                    <div className="roi-card-icon-wrapper ai-icon">
                      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <rect x="3" y="11" width="18" height="10" rx="2"></rect>
                        <circle cx="12" cy="5" r="2"></circle>
                        <path d="M12 7v4"></path>
                        <line x1="8" y1="16" x2="8" y2="16"></line>
                        <line x1="16" y1="16" x2="16" y2="16"></line>
                      </svg>
                    </div>
                    <h4 className="roi-card-title-white">Voigen AI (Voice Agent)</h4>
                    <p className="roi-card-desc-light">Pay only for active minutes. Calculated at just $0.05/minute.</p>
                    <div className="roi-card-cost-section-ai">
                      <div className="roi-card-cost-left">
                        <span className="roi-card-cost-label-light">Monthly Cost</span>
                        <span className="roi-card-cost-value-white">${voigenCost.toLocaleString()}</span>
                      </div>
                      <div className="roi-cheaper-badge">95% Cheaper</div>
                    </div>
                  </div>
                </div>

                {/* Bottom CTA */}
                <div className="roi-bottom-cta">
                  <div className="roi-cta-text">
                    <p className="roi-cta-title">Ready to plug the leak?</p>
                    <p className="roi-cta-savings">Save <span className="roi-cta-amount">${savings.toLocaleString()}</span> every month compared to staff.</p>
                  </div>
                  <a href="/auth/signup" className="roi-cta-btn">Switch to AI Now</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Powerhouse Features Section */}
      <section id="features" className="powerhouse-section">
        <div className="powerhouse-container">
          {/* Header */}
          <div className="powerhouse-header">
            <div className="powerhouse-badge">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 3l1.912 5.813a2 2 0 001.272 1.272L21 12l-5.813 1.912a2 2 0 00-1.272 1.272L12 21l-1.912-5.813a2 2 0 00-1.272-1.272L3 12l5.813-1.912a2 2 0 001.272-1.272L12 3z"></path>
              </svg>
              Core Capabilities
            </div>
            <h2 className="powerhouse-title">The Voigen <span className="powerhouse-highlight">Powerhouse</span></h2>
            <p className="powerhouse-subtitle">Everything you need to automate your front desk with precision and personality.</p>
          </div>

          {/* Features Grid */}
          <div className="powerhouse-grid">
            {/* Feature 1: Human Voice Agents */}
            <div className="powerhouse-card">
              <div className="powerhouse-card-header">
                <div className="powerhouse-icon indigo">
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </div>
                <h3>Human-Like Voice Agents</h3>
              </div>
              <p className="powerhouse-card-desc">Neural engines that engage customers with natural pacing and professional warmth to build instant trust.</p>
              <div className="powerhouse-tags">
                <span className="powerhouse-tag">Emotional Intelligence</span>
                <span className="powerhouse-tag">HD Audio</span>
              </div>
              <div className="powerhouse-arrow">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </div>
            </div>

            {/* Feature 2: Interrupt-Friendly */}
            <div className="powerhouse-card">
              <div className="powerhouse-card-header">
                <div className="powerhouse-icon amber">
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    <line x1="9" y1="10" x2="15" y2="10"></line>
                  </svg>
                </div>
                <h3>Interrupt-Friendly</h3>
              </div>
              <p className="powerhouse-card-desc">Eva handles mid-sentence interruptions naturally, adapting her flow just like a real person would.</p>
              <div className="powerhouse-tags">
                <span className="powerhouse-tag">Active Listening</span>
                <span className="powerhouse-tag">Adaptive</span>
              </div>
              <div className="powerhouse-arrow">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </div>
            </div>

            {/* Feature 3: Appointment Booking */}
            <div className="powerhouse-card">
              <div className="powerhouse-card-header">
                <div className="powerhouse-icon green">
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                    <path d="M9 16l2 2 4-4"></path>
                  </svg>
                </div>
                <h3>Appointment Booking</h3>
              </div>
              <p className="powerhouse-card-desc">Eva checks your availability and books meetings directly into your calendar in real-time.</p>
              <div className="powerhouse-tags">
                <span className="powerhouse-tag">Syncs with Google</span>
                <span className="powerhouse-tag">Auto-Reminders</span>
              </div>
              <div className="powerhouse-arrow">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </div>
            </div>

            {/* Feature 4: Multilingual Support */}
            <div className="powerhouse-card">
              <div className="powerhouse-card-header">
                <div className="powerhouse-icon blue">
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                  </svg>
                </div>
                <h3>Multilingual Support</h3>
              </div>
              <p className="powerhouse-card-desc">Understand regional accents and speak 20+ languages natively to serve a global customer base.</p>
              <div className="powerhouse-tags">
                <span className="powerhouse-tag">20+ Languages</span>
                <span className="powerhouse-tag">Accent Aware</span>
              </div>
              <div className="powerhouse-arrow">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </div>
            </div>

            {/* Feature 5: Lead Qualification */}
            <div className="powerhouse-card">
              <div className="powerhouse-card-header">
                <div className="powerhouse-icon purple">
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="8.5" cy="7" r="4"></circle>
                    <polyline points="17 11 19 13 23 9"></polyline>
                  </svg>
                </div>
                <h3>Lead Qualification</h3>
              </div>
              <p className="powerhouse-card-desc">Automatically score leads based on intent and route high-value opportunities to your sales team.</p>
              <div className="powerhouse-tags">
                <span className="powerhouse-tag">Data Capture</span>
                <span className="powerhouse-tag">Lead Scoring</span>
              </div>
              <div className="powerhouse-arrow">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </div>
            </div>

            {/* Feature 6: Deep Integrations */}
            <div className="powerhouse-card">
              <div className="powerhouse-card-header">
                <div className="powerhouse-icon rose">
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                  </svg>
                </div>
                <h3>Deep Integrations</h3>
              </div>
              <p className="powerhouse-card-desc">Push call data and transcripts into your CRM or business tools via Webhooks or native APIs.</p>
              <div className="powerhouse-tags">
                <span className="powerhouse-tag">Zapier Ready</span>
                <span className="powerhouse-tag">Custom APIs</span>
              </div>
              <div className="powerhouse-arrow">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="powerhouse-cta">
            <div className="powerhouse-cta-glow"></div>
            <div className="powerhouse-cta-content">
              <h3>Ready to switch to AI?</h3>
              <p>Capture every lead and book every meeting starting today.</p>
            </div>
            <div className="powerhouse-cta-buttons">
              <a href="/auth/signup" className="btn btn-primary">
                Get Started
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </a>
              <button 
                className="btn btn-outline btn-on-dark"
                data-cal-namespace="democall"
                data-cal-link="voigen-mvcmgc/democall"
                data-cal-config='{"layout":"month_view"}'
              >
                Live Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section contact-section">
        <div className="container">
          <div className="contact-wrapper">
            <div className="contact-info">
              <h2 className="section-title">Get in <span className="gradient-text">Touch</span></h2>
              <p className="contact-description">
                Ready to transform your business communications? Fill out the form and we&apos;ll reach out to you within 24 hours.
              </p>
              
              <div className="contact-details">
                <div className="contact-item">
                  <span className="contact-icon">📧</span>
                  <div>
                    <h4>Email</h4>
                    <a href="mailto:hello@voigen.ai">hello@voigen.ai</a>
                  </div>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">📱</span>
                  <div>
                    <h4>Phone / WhatsApp</h4>
                    <div className="contact-number">+91 97822 60112</div>
                    <div className="contact-actions">
                      <a href="tel:+919782260112" className="contact-btn" title="Call Now">
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"></path>
                        </svg>
                        Call
                      </a>
                      <a href="https://wa.me/919782260112" target="_blank" className="contact-btn" title="WhatsApp">
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"></path>
                        </svg>
                        WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">🌐</span>
                  <div>
                    <h4>Website</h4>
                    <a href="https://voigen.ai/">www.voigen.ai</a>
                  </div>
                </div>
              </div>

            </div>

            <div className="contact-form-wrapper">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
