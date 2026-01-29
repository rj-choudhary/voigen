import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Careers at Voigen | Join Our AI Voice Agent Team',
  description: 'Join Voigen and help build the future of AI voice agents for small businesses. We\'re hiring engineers, sales, and marketing roles. Remote-first, async-friendly.',
  keywords: ['Voigen careers', 'Voigen jobs', 'AI startup jobs', 'remote AI jobs', 'voice AI careers'],
  openGraph: {
    title: 'Careers at Voigen - Build the Future of Voice AI',
    description: 'Join our remote-first team and help small businesses automate their customer communications with AI.',
    url: 'https://voigen.ai/careers',
    type: 'website',
  },
  alternates: {
    canonical: 'https://voigen.ai/careers',
  },
};

export default function CareersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
