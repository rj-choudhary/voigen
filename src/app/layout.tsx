import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WaveAnimation from '@/components/WaveAnimation';
import Script from 'next/script';

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Voigen.ai — AI Voice & WhatsApp Automation for Small Businesses',
  description: 'Voigen.ai: Automate calls and WhatsApp chats for your small business. AI-powered customer support, bookings, and sales automation.',
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

        <WaveAnimation />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
