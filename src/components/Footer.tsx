import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="footer-logo">
              <img 
                src="/assets/voigen ai logo.png" 
                alt="Voigen.ai Logo" 
                className="footer-logo-img"
                style={{ width: 'auto', height: '50px' }}
              />
            </div>
            <p>AI-powered automation for small businesses</p>
          </div>
          <div className="footer-column">
            <h4>Product</h4>
            <Link href="/#features">Features</Link>
            <Link href="/#about">About</Link>
            <Link href="/#contact">Contact</Link>
          </div>
          <div className="footer-column">
            <h4>Legal</h4>
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/terms-of-service">Terms of Service</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Voigen.ai is a brand under Stackbyte Labs Pvt. Ltd.</p>
        </div>
      </div>
    </footer>
  );
}
