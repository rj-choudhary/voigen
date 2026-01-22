import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy — Voigen.ai',
  description: 'Privacy Policy for Voigen.ai - Learn how we collect, use, and protect your personal information.',
};

export default function PrivacyPolicy() {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <Link href="/" className="back-link">← Back to Home</Link>
        
        <div className="legal-header">
          <h1>Privacy Policy</h1>
          <p className="last-updated">Last Updated: March 12, 2025</p>
        </div>

        <div className="legal-content">
          <p>
            At Voigen.ai (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered voice and WhatsApp automation services.
          </p>

          <h2>1. Information We Collect</h2>
          
          <h3>1.1 Information You Provide</h3>
          <p>We collect information that you voluntarily provide to us, including:</p>
          <ul>
            <li>Account information (name, email address, phone number, company name)</li>
            <li>Payment and billing information</li>
            <li>Communication preferences</li>
            <li>Customer support inquiries and correspondence</li>
            <li>Any other information you choose to provide</li>
          </ul>

          <h3>1.2 Automatically Collected Information</h3>
          <p>When you use our services, we automatically collect certain information, including:</p>
          <ul>
            <li>Usage data (features used, time spent, interaction patterns)</li>
            <li>Device information (IP address, browser type, operating system)</li>
            <li>Call and message logs (for service functionality and quality improvement)</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>

          <h3>1.3 Third-Party Information</h3>
          <p>We may receive information about you from third-party services you connect to our platform, such as CRM systems, calendar applications, and communication platforms.</p>

          <h2>2. How We Use Your Information</h2>
          <p>We use the collected information for the following purposes:</p>
          <ul>
            <li>Providing, maintaining, and improving our services</li>
            <li>Processing transactions and sending related information</li>
            <li>Sending administrative information, updates, and security alerts</li>
            <li>Responding to your inquiries and providing customer support</li>
            <li>Analyzing usage patterns to enhance user experience</li>
            <li>Detecting, preventing, and addressing technical issues and fraud</li>
            <li>Complying with legal obligations and enforcing our terms</li>
            <li>Marketing and promotional communications (with your consent)</li>
          </ul>

          <h2>3. Information Sharing and Disclosure</h2>
          <p>We do not sell your personal information. We may share your information in the following circumstances:</p>
          
          <h3>3.1 Service Providers</h3>
          <p>We may share information with third-party service providers who perform services on our behalf, such as payment processing, data analysis, email delivery, hosting services, and customer service.</p>

          <h3>3.2 Business Transfers</h3>
          <p>If we are involved in a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.</p>

          <h3>3.3 Legal Requirements</h3>
          <p>We may disclose your information if required by law or in response to valid requests by public authorities.</p>

          <h3>3.4 With Your Consent</h3>
          <p>We may share your information with third parties when you give us explicit consent to do so.</p>

          <h2>4. Data Security</h2>
          <p>
            We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
          </p>
          <ul>
            <li>Encryption of data in transit and at rest</li>
            <li>Regular security assessments and audits</li>
            <li>Access controls and authentication mechanisms</li>
            <li>Employee training on data protection practices</li>
          </ul>
          <p>
            However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
          </p>

          <h2>5. Data Retention</h2>
          <p>
            We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. When we no longer need your information, we will securely delete or anonymize it.
          </p>

          <h2>6. Your Rights and Choices</h2>
          <p>Depending on your location, you may have the following rights regarding your personal information:</p>
          <ul>
            <li><strong>Access:</strong> Request access to your personal information</li>
            <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
            <li><strong>Deletion:</strong> Request deletion of your personal information</li>
            <li><strong>Portability:</strong> Request a copy of your information in a portable format</li>
            <li><strong>Objection:</strong> Object to processing of your information</li>
            <li><strong>Restriction:</strong> Request restriction of processing</li>
            <li><strong>Withdraw Consent:</strong> Withdraw consent where processing is based on consent</li>
          </ul>
          <p>To exercise these rights, please contact us at <a href="mailto:privacy@voigen.ai">privacy@voigen.ai</a>.</p>

          <h2>7. Cookies and Tracking Technologies</h2>
          <p>
            We use cookies and similar tracking technologies to collect and track information about your use of our services. You can control cookies through your browser settings and other tools. However, disabling cookies may limit your ability to use certain features of our services.
          </p>

          <h2>8. Third-Party Links</h2>
          <p>
            Our services may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties. We encourage you to review their privacy policies before providing any personal information.
          </p>

          <h2>9. Children&apos;s Privacy</h2>
          <p>
            Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
          </p>

          <h2>10. International Data Transfers</h2>
          <p>
            Your information may be transferred to and processed in countries other than your country of residence. These countries may have different data protection laws. We ensure appropriate safeguards are in place to protect your information in accordance with this Privacy Policy.
          </p>

          <h2>11. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the &quot;Last Updated&quot; date. Your continued use of our services after such changes constitutes acceptance of the updated policy.
          </p>

          <h2>12. Contact Us</h2>
          <p>If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:</p>
          <ul>
            <li><strong>Email:</strong> <a href="mailto:privacy@voigen.ai">privacy@voigen.ai</a></li>
            <li><strong>Phone:</strong> +91 97822 60112</li>
            <li><strong>Address:</strong> Voigen.ai, [Your Business Address]</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
