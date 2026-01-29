import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WaveAnimation from '@/components/WaveAnimation';
import Providers from '@/components/Providers';
import Script from 'next/script';

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://voigen.ai'),
  title: {
    default: 'Voigen - AI Voice Agent for Small Business | 24/7 Call Automation',
    template: '%s | Voigen',
  },
  description: 'Voigen is an AI voice agent that answers your business calls 24/7. Never miss a lead. Automate customer support, bookings, and sales calls for small businesses.',
  keywords: [
    'Voigen',
    'AI voice agent',
    'AI receptionist',
    'call automation',
    'small business AI',
    'voice AI',
    'WhatsApp automation',
    'AI phone answering',
    'virtual receptionist',
    'automated call handling',
    '24/7 call answering',
    'AI customer service',
    'lead capture automation',
    'appointment booking AI',
  ],
  authors: [{ name: 'Voigen.ai', url: 'https://voigen.ai' }],
  creator: 'Voigen.ai',
  publisher: 'Stackbyte Labs Pvt. Ltd.',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://voigen.ai',
    siteName: 'Voigen.ai',
    title: 'Voigen - AI Voice Agent for Small Business | 24/7 Call Automation',
    description: 'Never miss a customer call. Voigen AI answers 24/7, captures leads, and books appointments automatically for small businesses.',
    images: [
      {
        url: '/assets/voigen-logo-header.png',
        width: 1200,
        height: 630,
        alt: 'Voigen - AI Voice Agent for Small Business',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Voigen - AI Voice Agent for Small Business',
    description: 'Never miss a customer call. Voigen AI answers 24/7, captures leads, and books appointments automatically.',
    site: '@voigenai',
    creator: '@voigenai',
    images: ['/assets/voigen-logo-header.png'],
  },
  alternates: {
    canonical: 'https://voigen.ai',
  },
  category: 'technology',
};

// JSON-LD Structured Data
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Voigen.ai',
  url: 'https://voigen.ai',
  logo: 'https://voigen.ai/assets/voigen-logo-header.png',
  description: 'AI voice agent that answers business calls 24/7 for small businesses',
  foundingDate: '2024',
  sameAs: [
    'https://www.linkedin.com/company/voigen',
    'https://twitter.com/voigenai',
    'https://www.instagram.com/voigenai',
    'https://www.facebook.com/voigenai',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+91-97822-60112',
    contactType: 'customer service',
    email: 'hello@voigen.ai',
    availableLanguage: ['English', 'Hindi'],
  },
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'IN',
  },
};

const softwareApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Voigen',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description: 'AI voice agent that answers business calls 24/7, captures leads, and books appointments automatically',
  url: 'https://voigen.ai',
  author: {
    '@type': 'Organization',
    name: 'Voigen.ai',
    url: 'https://voigen.ai',
  },
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'Pay as you go - $0.06/minute, no platform fees',
    availability: 'https://schema.org/InStock',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    ratingCount: '500',
    bestRating: '5',
    worstRating: '1',
  },
  featureList: [
    '24/7 AI call answering',
    'Lead capture and qualification',
    'Appointment booking',
    'WhatsApp automation',
    'CRM integration',
    'Multilingual support',
  ],
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Voigen.ai',
  url: 'https://voigen.ai',
  description: 'AI voice agent for small business call automation',
  publisher: {
    '@type': 'Organization',
    name: 'Voigen.ai',
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://voigen.ai/blog?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <Script src="https://tally.so/widgets/embed.js" />
        
        {/* Structured Data - Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        
        {/* Structured Data - Software Application */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(softwareApplicationSchema),
          }}
        />
        
        {/* Structured Data - Website */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
      </head>
      <body className={spaceGrotesk.className}>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-KVVREXDW8Z"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-KVVREXDW8Z');
          `}
        </Script>
        <Script
          src="/wave-animation.js"
          strategy="afterInteractive"
        />
        {/* Cal.com Embed Script */}
        <Script id="cal-embed" strategy="afterInteractive">
          {`
            (function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if(typeof namespace === "string"){cal.ns[namespace] = cal.ns[namespace] || api;p(cal.ns[namespace], ar);p(cal, ["initNamespace", namespace]);} else p(cal, ar); return;} p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");
            Cal("init", "democall", {origin:"https://cal.com"});
            Cal.ns.democall("ui", {"styles":{"branding":{"brandColor":"#6366F1"}},"hideEventTypeDetails":false,"layout":"month_view"});
          `}
        </Script>

        <Providers>
          <WaveAnimation />
          <Header />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
