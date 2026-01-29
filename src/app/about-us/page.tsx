import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | Voigen - AI Voice Agent Company',
  description: 'Learn about Voigen.ai - the AI automation platform helping small businesses automate customer calls and WhatsApp messages. Our mission is to democratize AI-powered customer service.',
  keywords: ['Voigen', 'about Voigen', 'AI voice agent company', 'small business automation', 'AI customer service'],
  openGraph: {
    title: 'About Voigen.ai - AI Voice Agent for Small Business',
    description: 'Learn about Voigen.ai - the AI automation platform helping small businesses automate customer calls and WhatsApp messages.',
    url: 'https://voigen.ai/about-us',
    type: 'website',
  },
  alternates: {
    canonical: 'https://voigen.ai/about-us',
  },
};

export default function AboutUsPage() {
  return (
    <section className="section about-section about-page">
      <div className="container">
        <div className="section-header">
          <h1 className="section-title">About <span className="gradient-text">Voigen.ai</span></h1>
          <p className="section-subtitle">Empowering small businesses with intelligent automation</p>
        </div>
        <div className="about-content">
          <div className="about-text">
            <h3>Who We Are</h3>
            <p>
              Voigen.ai is a cutting-edge AI automation platform designed specifically for small business owners 
              who want to streamline their customer communications without breaking the bank.
            </p>
            <p>
              We understand the challenges of managing customer calls and WhatsApp messages while running a business. 
              That&apos;s why we&apos;ve built an intelligent system that handles conversations naturally, books appointments, 
              answers FAQs, and qualifies leads—all automatically.
            </p>
            <h3>Our Mission</h3>
            <p>
              To democratize AI-powered customer service automation, making enterprise-level technology accessible 
              and affordable for small businesses worldwide.
            </p>
            <div className="about-features">
              <div className="about-feature">
                <span className="feature-icon">🎯</span>
                <div>
                  <h4>Purpose-Built</h4>
                  <p>Designed specifically for small business needs</p>
                </div>
              </div>
              <div className="about-feature">
                <span className="feature-icon">⚡</span>
                <div>
                  <h4>Easy Setup</h4>
                  <p>Get started in minutes, no technical expertise required</p>
                </div>
              </div>
              <div className="about-feature">
                <span className="feature-icon">💰</span>
                <div>
                  <h4>Affordable</h4>
                  <p>Enterprise features at small business prices</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
