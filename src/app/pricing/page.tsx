import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Pricing - AI Voice Agent Plans | Voigen',
  description: 'Simple, transparent pricing for Voigen AI voice agents. Start free with pay-as-you-go at $0.06/min or scale with enterprise plans. No platform fees.',
  keywords: ['Voigen pricing', 'AI voice agent cost', 'AI receptionist pricing', 'call automation pricing'],
  openGraph: {
    title: 'Voigen Pricing - AI Voice Agent Plans',
    description: 'Start free with pay-as-you-go pricing. Only $0.06/minute for AI call handling. No platform fees.',
    url: 'https://voigen.ai/pricing',
    type: 'website',
  },
  alternates: {
    canonical: 'https://voigen.ai/pricing',
  },
};

export default function PricingPage() {
  return (
    <main className="pricing-page-new">
      {/* Background Elements */}
      <div className="pricing-background">
        <div className="geometric-lines">
          <div className="geo-line line-1"></div>
          <div className="geo-line line-2"></div>
          <div className="geo-line line-3"></div>
          <div className="geo-line line-4"></div>
          <div className="geo-line line-5"></div>
        </div>
        <div className="pricing-gradient-orb orb-1"></div>
        <div className="pricing-gradient-orb orb-2"></div>
      </div>

      <div className="pricing-container">
        {/* Header */}
        <div className="pricing-header-new">
          <div className="pricing-badge">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 3l1.912 5.813a2 2 0 001.272 1.272L21 12l-5.813 1.912a2 2 0 00-1.272 1.272L12 21l-1.912-5.813a2 2 0 00-1.272-1.272L3 12l5.813-1.912a2 2 0 001.272-1.272L12 3z"></path>
            </svg>
            No Platform Fees. No Strings Attached.
          </div>
          <h1 className="pricing-title">
            Flexible Pricing <br />That <span className="gradient-text">Grows</span> With You.
          </h1>
          <p className="pricing-subtitle">
            Skip the trial-and-error with fully tested, high-performance agents. Simple, scalable pricing designed to save you time, effort, and money.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="pricing-cards-grid">
          {/* Pay As You Go Card */}
          <div className="pricing-card payg-card">
            <div className="pricing-card-header">
              <div className="pricing-card-info">
                <h3>Pay As You Go</h3>
                <p>Perfect for small businesses just getting started with AI call management.</p>
              </div>
              <div className="pricing-card-icon payg-icon">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
            </div>

            <div className="pricing-amount">
              <div className="price-main">
                <span className="price-value">$0</span>
                <span className="price-label">to start</span>
              </div>
              <div className="price-per-min">
                <span className="price-then">Then</span>
                <span className="price-rate">$0.06 / min</span>
              </div>
              <p className="price-note">No monthly platform fees. Only pay for active talk time.</p>
            </div>

            <div className="pricing-features">
              <div className="pricing-feature">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                </svg>
                <span>Start Instantly (Self-Serve)</span>
              </div>
              <div className="pricing-feature">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                  <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
                  <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
                </svg>
                <span>10 Free Knowledge Bases</span>
              </div>
              <div className="pricing-feature">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <span>20 Free Concurrent Calls</span>
              </div>
              <div className="pricing-feature">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="18" y1="20" x2="18" y2="10"></line>
                  <line x1="12" y1="20" x2="12" y2="4"></line>
                  <line x1="6" y1="20" x2="6" y2="14"></line>
                </svg>
                <span>Real-time Analytics & Sim Testing</span>
              </div>
              <div className="pricing-feature">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
                  <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
                </svg>
                <span>Priority Discord & Email Support</span>
              </div>
            </div>

            <div className="pricing-dfy-box">
              <p className="dfy-label">
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 3l1.912 5.813a2 2 0 001.272 1.272L21 12l-5.813 1.912a2 2 0 00-1.272 1.272L12 21l-1.912-5.813a2 2 0 00-1.272-1.272L3 12l5.813-1.912a2 2 0 001.272-1.272L12 3z"></path>
                </svg>
                Done-For-You Option
              </p>
              <p className="dfy-text">Prefer not to DIY? We&apos;ll custom-build and scale your AI agent for you.</p>
            </div>

            <Link href="/auth/signup" className="pricing-cta-btn payg-cta">
              Sign Up Free <span className="trial-note">(7-Day Trial)</span>
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
          </div>

          {/* Enterprise Card */}
          <div className="pricing-card enterprise-card">
            <div className="enterprise-badge">Enterprise Grade</div>
            <div className="pricing-card-header">
              <div className="pricing-card-info">
                <h3>Scale Plan</h3>
                <p>For teams handling 10,000+ mins/mo with custom reliability needs.</p>
              </div>
              <div className="pricing-card-icon enterprise-icon">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  <path d="M9 12l2 2 4-4"></path>
                </svg>
              </div>
            </div>

            <div className="pricing-amount enterprise-amount">
              <div className="price-custom">Custom Pricing</div>
              <p className="price-volume">High Volume Optimization</p>
            </div>

            <div className="pricing-features enterprise-features">
              <div className="pricing-feature">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <span>Guaranteed 99.99% Uptime SLA</span>
              </div>
              <div className="pricing-feature">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="2" y1="12" x2="22" y2="12"></line>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
                <span>SIP Trunking & Native Integration</span>
              </div>
              <div className="pricing-feature">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                </svg>
                <span>Unlimited Concurrent Calls</span>
              </div>
              <div className="pricing-feature">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <span>White Label & Reseller Toolkit</span>
              </div>
              <div className="pricing-feature">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                <span>Advanced Compliance & MSA Support</span>
              </div>
              <div className="pricing-feature">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <polyline points="16 11 18 13 22 9"></polyline>
                </svg>
                <span>Enterprise Onboarding & Training</span>
              </div>
            </div>

            <div className="pricing-deploy-box">
              <p className="deploy-label">Advanced Deployment</p>
              <p className="deploy-text">On-premise multi-region deployment and flexible hosting options available.</p>
            </div>

            <Link href="/contact-us" className="pricing-cta-btn enterprise-cta">
              Contact Sales
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
          </div>
        </div>

        {/* Trust Bar */}
        <div className="pricing-trust-bar">
          <div className="trust-item-new">
            <div className="trust-icon green">
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h4>Money Back Guarantee</h4>
            <p>Not satisfied? We&apos;ll refund your setup fee, no questions asked.</p>
          </div>
          <div className="trust-item-new">
            <div className="trust-icon indigo">
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 3l1.912 5.813a2 2 0 001.272 1.272L21 12l-5.813 1.912a2 2 0 00-1.272 1.272L12 21l-1.912-5.813a2 2 0 00-1.272-1.272L3 12l5.813-1.912a2 2 0 001.272-1.272L12 3z"></path>
              </svg>
            </div>
            <h4>7-Day Free Trial</h4>
            <p>Full access to the platform to test your first AI agent.</p>
          </div>
          <div className="trust-item-new">
            <div className="trust-icon amber">
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
                <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
              </svg>
            </div>
            <h4>VIP Onboarding</h4>
            <p>Get constant 1-on-1 support for your initial agent setup.</p>
          </div>
        </div>

        {/* Testimonial */}
        <div className="pricing-testimonial">
          <p className="testimonial-quote">&ldquo;We found that Voigen pays for itself within the first 48 hours of call automation.&rdquo;</p>
          <div className="testimonial-stars">
            {[...Array(5)].map((_, i) => (
              <svg key={i} width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <p className="testimonial-source">Trusted by 500+ Local Businesses</p>
        </div>
      </div>
    </main>
  );
}
