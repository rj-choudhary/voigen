import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog — Voigen.ai',
  description: 'Latest insights, tips, and updates about AI automation for small businesses.',
};

// This is a placeholder for the blog listing page
// You'll integrate with Notion API here
export default function BlogPage() {
  // Placeholder blog posts - replace with Notion API integration
  const blogPosts = [
    {
      id: '1',
      title: 'Getting Started with AI Voice Automation',
      excerpt: 'Learn how to set up your first AI voice automation system for your small business.',
      date: '2024-01-15',
      slug: 'getting-started-ai-voice-automation',
      author: 'Voigen Team',
      readTime: '5 min read'
    },
    {
      id: '2',
      title: 'WhatsApp Business Automation Best Practices',
      excerpt: 'Discover the best practices for automating your WhatsApp business communications.',
      date: '2024-01-10',
      slug: 'whatsapp-business-automation-best-practices',
      author: 'Voigen Team',
      readTime: '7 min read'
    },
    {
      id: '3',
      title: '5 Ways AI Can Transform Your Customer Service',
      excerpt: 'Explore how artificial intelligence can revolutionize your customer service operations.',
      date: '2024-01-05',
      slug: '5-ways-ai-transform-customer-service',
      author: 'Voigen Team',
      readTime: '6 min read'
    }
  ];

  return (
    <div className="section" style={{ paddingTop: '8rem' }}>
      <div className="container">
        <div className="section-header">
          <h1 className="section-title">
            Our <span className="gradient-text">Blog</span>
          </h1>
          <p className="section-subtitle">
            Latest insights, tips, and updates about AI automation for small businesses
          </p>
        </div>

        <div className="blog-grid">
          {blogPosts.map((post) => (
            <article key={post.id} className="blog-card">
              <div className="blog-card-content">
                <div className="blog-meta">
                  <span className="blog-date">{new Date(post.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                  <span className="blog-read-time">{post.readTime}</span>
                </div>
                <h2 className="blog-title">
                  <Link href={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h2>
                <p className="blog-excerpt">{post.excerpt}</p>
                <div className="blog-footer">
                  <span className="blog-author">By {post.author}</span>
                  <Link href={`/blog/${post.slug}`} className="blog-read-more">
                    Read More →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="blog-cta">
          <h3>Want to stay updated?</h3>
          <p>Subscribe to our newsletter for the latest AI automation tips and insights.</p>
          <Link href="/#contact" className="btn btn-primary">
            Subscribe Now
          </Link>
        </div>
      </div>
    </div>
  );
}
