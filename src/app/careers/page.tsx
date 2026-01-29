'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Position {
  id: string;
  title: string;
  department: string;
  departmentIcon: React.ReactNode;
  location: string;
  type: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  perks: string[];
}

const positions: Position[] = [
  {
    id: 'bde',
    title: 'Business Development Executive',
    department: 'Sales',
    departmentIcon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <line x1="12" y1="1" x2="12" y2="23"></line>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
      </svg>
    ),
    location: 'Remote',
    type: 'Full-time',
    description: 'Join our sales team and help small businesses discover the power of AI voice agents. You\'ll be the first point of contact for potential customers, building relationships and closing deals.',
    responsibilities: [
      'Identify and reach out to potential customers',
      'Conduct product demos and presentations',
      'Build and maintain a healthy sales pipeline',
      'Close deals and hit monthly targets',
      'Gather customer feedback for product improvement'
    ],
    requirements: [
      '1-3 years in B2B sales or business development',
      'Excellent communication and presentation skills',
      'Self-motivated with a hunter mentality',
      'Experience with CRM tools (HubSpot, Salesforce)',
      'Bonus: SaaS or AI/tech sales experience'
    ],
    perks: [
      'Uncapped commission structure',
      'Direct impact on company growth',
      'Work with cutting-edge AI technology'
    ]
  },
  {
    id: 'fullstack',
    title: 'Full Stack Engineer',
    department: 'Engineering',
    departmentIcon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <polyline points="16 18 22 12 16 6"></polyline>
        <polyline points="8 6 2 12 8 18"></polyline>
      </svg>
    ),
    location: 'Remote',
    type: 'Full-time',
    description: 'Build the future of voice AI. You\'ll work on our core platform, creating seamless experiences for businesses to deploy and manage their AI voice agents.',
    responsibilities: [
      'Design and build scalable web applications',
      'Work on both frontend (React/Next.js) and backend (Node.js)',
      'Integrate with AI/ML services and telephony APIs',
      'Write clean, maintainable, and tested code',
      'Collaborate with product and design teams'
    ],
    requirements: [
      '2-4 years of full stack development experience',
      'Proficiency in React, Next.js, TypeScript',
      'Experience with Node.js and REST/GraphQL APIs',
      'Familiarity with cloud services (AWS/GCP)',
      'Bonus: Experience with real-time systems or WebRTC'
    ],
    perks: [
      'Ship features that impact thousands of businesses',
      'Work with the latest AI and voice technologies',
      'Flexible hours and async-first culture'
    ]
  },
  {
    id: 'growth',
    title: 'Growth & Social Media Executive',
    department: 'Marketing',
    departmentIcon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
      </svg>
    ),
    location: 'Remote',
    type: 'Full-time',
    description: 'Own our social presence and growth experiments. You\'ll create viral content, build our community, and run campaigns that put Voigen on the map.',
    responsibilities: [
      'Create engaging content for LinkedIn, Twitter, Instagram',
      'Plan and execute growth experiments',
      'Build and nurture our online community',
      'Analyze metrics and optimize campaigns',
      'Collaborate with founders on brand strategy'
    ],
    requirements: [
      '1-2 years in social media or growth marketing',
      'Strong copywriting and content creation skills',
      'Data-driven mindset with analytics experience',
      'Understanding of B2B SaaS marketing',
      'Bonus: Experience with video content or podcasts'
    ],
    perks: [
      'Creative freedom to experiment',
      'Build a brand from the ground up',
      'Direct collaboration with founders'
    ]
  }
];

export default function CareersPage() {
  const [expandedPosition, setExpandedPosition] = useState<string | null>(null);

  const togglePosition = (id: string) => {
    setExpandedPosition(expandedPosition === id ? null : id);
  };

  return (
    <main className="careers-page-new">
      {/* Background */}
      <div className="careers-background">
        <div className="careers-gradient-orb orb-1"></div>
        <div className="careers-gradient-orb orb-2"></div>
      </div>

      <div className="careers-container">
        {/* Header */}
        <div className="careers-header-new">
          <div className="careers-badge">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            We're Hiring
          </div>
          <h1 className="careers-title">
            Build the Future of <span className="gradient-text">Voice AI</span>
          </h1>
          <p className="careers-subtitle">
            Join a small, scrappy team on a mission to help every small business answer every call. 
            Remote-first, async-friendly, and obsessed with shipping.
          </p>
        </div>

        {/* Why Join Us */}
        <div className="careers-why-section">
          <h2 className="careers-why-title">Why Voigen?</h2>
          <div className="careers-why-grid">
            <div className="careers-why-card">
              <div className="careers-why-icon">
                <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polygon points="10 8 16 12 10 16 10 8"></polygon>
                </svg>
              </div>
              <h3>Early Stage, Big Impact</h3>
              <p>Your work ships to production. Your ideas shape the product. No red tape.</p>
            </div>
            <div className="careers-why-card">
              <div className="careers-why-icon">
                <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              </div>
              <h3>Work From Anywhere</h3>
              <p>100% remote. Async-first. We care about output, not hours logged.</p>
            </div>
            <div className="careers-why-card">
              <div className="careers-why-icon">
                <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              </div>
              <h3>Startup Energy</h3>
              <p>Move fast, break things, learn constantly. We're building something special.</p>
            </div>
            <div className="careers-why-card">
              <div className="careers-why-icon">
                <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3>Great People</h3>
              <p>Small team of builders who genuinely enjoy working together.</p>
            </div>
          </div>
        </div>

        {/* Open Positions */}
        <div className="careers-positions-section">
          <h2 className="careers-positions-title">Open Positions</h2>
          <p className="careers-positions-subtitle">Find your next adventure. All roles are remote-friendly.</p>

          <div className="careers-positions-list">
            {positions.map((position) => (
              <div 
                key={position.id} 
                className={`careers-position-card ${expandedPosition === position.id ? 'expanded' : ''}`}
              >
                <button 
                  className="careers-position-header"
                  onClick={() => togglePosition(position.id)}
                >
                  <div className="careers-position-left">
                    <div className="careers-position-icon">
                      {position.departmentIcon}
                    </div>
                    <div className="careers-position-info">
                      <span className="careers-position-department">{position.department}</span>
                      <h3 className="careers-position-title">{position.title}</h3>
                    </div>
                  </div>
                  <div className="careers-position-right">
                    <div className="careers-position-tags">
                      <span className="careers-position-tag location">
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        {position.location}
                      </span>
                      <span className="careers-position-tag type">{position.type}</span>
                    </div>
                    <svg 
                      className={`careers-position-chevron ${expandedPosition === position.id ? 'open' : ''}`}
                      width="20" 
                      height="20" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      viewBox="0 0 24 24"
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </div>
                </button>

                {expandedPosition === position.id && (
                  <div className="careers-position-details">
                    <p className="careers-position-description">{position.description}</p>

                    <div className="careers-position-section">
                      <h4>What You'll Do</h4>
                      <ul>
                        {position.responsibilities.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="careers-position-section">
                      <h4>What We're Looking For</h4>
                      <ul>
                        {position.requirements.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="careers-position-section">
                      <h4>Perks</h4>
                      <ul className="perks-list">
                        {position.perks.map((item, index) => (
                          <li key={index}>
                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="careers-position-cta">
                      <p className="careers-cta-text">Interested? We'd love to hear from you.</p>
                      <div className="careers-cta-buttons">
                        <Link href="/contact-us" className="careers-apply-btn">
                          Apply Now
                          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                          </svg>
                        </Link>
                        <a href="mailto:hello@voigen.ai?subject=Job Application" className="careers-email-btn">
                          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                            <polyline points="22,6 12,13 2,6"></polyline>
                          </svg>
                          hello@voigen.ai
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="careers-bottom-cta">
          <h3>Don't see your role?</h3>
          <p>We're always looking for talented people. Drop us a line and tell us what you're great at.</p>
          <a href="mailto:hello@voigen.ai?subject=General Application" className="careers-general-btn">
            Say Hello
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
          </a>
        </div>
      </div>
    </main>
  );
}
