import { Metadata } from 'next';
import './blog.css';

export const metadata: Metadata = {
  title: 'Blog - Voigen.ai',
  description: 'Latest insights on AI voice automation, WhatsApp automation, and business growth tips.',
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
