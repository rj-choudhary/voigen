import { getPostBySlug, getPostMetadata, getPosts } from '@/lib/notion';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import NotionRenderer from '@/components/NotionRenderer';
import TableOfContents from '@/components/TableOfContents';

// Notion color mapping for text colors
const notionTextColors: { [key: string]: string } = {
  'default': '#37352f',
  'gray': '#787774',
  'brown': '#9f6b53',
  'orange': '#d9730d',
  'yellow': '#cb912f',
  'green': '#448361',
  'blue': '#337ea9',
  'purple': '#9065b0',
  'pink': '#c14c8a',
  'red': '#d44c47',
};

// Notion color mapping for background colors (for inline text)
const notionBgColors: { [key: string]: string } = {
  'gray_background': '#f7f6f3',
  'brown_background': '#f4eeee',
  'orange_background': '#faebdd',
  'yellow_background': '#fbf3db',
  'green_background': '#ddedea',
  'blue_background': '#ddebf1',
  'purple_background': '#eae4f2',
  'pink_background': '#f4dfeb',
  'red_background': '#fbe4e4',
};

// Enhanced function to render Notion blocks with rich text formatting including colors
function renderRichText(richText: any[], defaultTextColor?: string) {
  if (!richText || richText.length === 0) return '';
  
  return richText.map((text: any, index: number) => {
    const annotations = text.annotations || {};
    const color = annotations.color || 'default';
    
    // Build inline styles for text color and background
    const style: React.CSSProperties = {};
    
    // Handle text color
    if (color && color !== 'default') {
      if (color.endsWith('_background')) {
        // It's a background color
        style.backgroundColor = notionBgColors[color] || 'transparent';
        style.padding = '2px 4px';
        style.borderRadius = '3px';
      } else {
        // It's a text color
        style.color = notionTextColors[color] || defaultTextColor || '#37352f';
      }
    } else if (defaultTextColor) {
      style.color = defaultTextColor;
    }
    
    // Build className for other annotations
    let className = '';
    if (annotations.bold) className += ' font-bold';
    if (annotations.italic) className += ' italic';
    if (annotations.strikethrough) className += ' line-through';
    if (annotations.underline) className += ' underline';
    if (annotations.code) {
      className += ' bg-gray-200 px-1 py-0.5 rounded text-sm font-mono';
      style.color = '#eb5757'; // Notion's code text color
    }
    
    if (text.href) {
      return (
        <a 
          key={index} 
          href={text.href} 
          className={`hover:opacity-80 underline${className}`}
          style={{ ...style, color: style.color || '#337ea9' }}
        >
          {text.plain_text}
        </a>
      );
    }
    
    return (
      <span key={index} className={className.trim()} style={style}>
        {text.plain_text}
      </span>
    );
  });
}

// Enhanced function to render Notion blocks with TOC anchor support
function renderNotionBlock(block: any) {
  const { type } = block;
  
  // Generate heading ID for TOC anchors
  const getHeadingId = (blockType: string) => {
    if (blockType.startsWith('heading_')) {
      return `heading-${block.id}`;
    }
    return undefined;
  };

  // Get callout theme based on icon
  const getCalloutTheme = (icon?: string) => {
    switch (icon) {
      case '💡':
      case '🔍':
        return 'bg-blue-900/30 border-blue-500/50 text-blue-100';
      case '⚠️':
      case '🚨':
        return 'bg-yellow-900/30 border-yellow-500/50 text-yellow-100';
      case '✅':
      case '✔️':
        return 'bg-green-900/30 border-green-500/50 text-green-100';
      case '❌':
      case '🚫':
        return 'bg-red-900/30 border-red-500/50 text-red-100';
      case '📝':
      case '📋':
        return 'bg-purple-900/30 border-purple-500/50 text-purple-100';
      default:
        return 'bg-gray-900/30 border-gray-500/50 text-gray-100';
    }
  };
  
  switch (type) {
    case 'paragraph':
      const paragraphText = renderRichText(block.paragraph?.rich_text || []);
      return paragraphText ? (
        <p className="text-gray-700 leading-relaxed mb-6 text-lg">
          {paragraphText}
        </p>
      ) : null;
    
    case 'heading_1':
      const headingId1 = getHeadingId(type);
      return (
        <h1 id={headingId1} className="text-4xl font-bold text-gray-900 mb-8 mt-16 pt-4 border-t border-gray-200 scroll-mt-40">
          {renderRichText(block.heading_1?.rich_text || [])}
        </h1>
      );
    
    case 'heading_2':
      const headingId2 = getHeadingId(type);
      return (
        <h2 id={headingId2} className="text-3xl font-bold text-gray-900 mb-6 mt-12 pt-3 border-t border-gray-100 scroll-mt-40">
          {renderRichText(block.heading_2?.rich_text || [])}
        </h2>
      );
    
    case 'heading_3':
      const headingId3 = getHeadingId(type);
      return (
        <h3 id={headingId3} className="text-2xl font-bold text-gray-900 mb-4 mt-10 pt-2 scroll-mt-40">
          {renderRichText(block.heading_3?.rich_text || [])}
        </h3>
      );
    
    case 'bulleted_list_item':
      return (
        <li className="text-gray-700 ml-6 mb-3 list-disc text-lg leading-relaxed">
          {renderRichText(block.bulleted_list_item?.rich_text || [])}
        </li>
      );
    
    case 'numbered_list_item':
      return (
        <li className="text-gray-700 ml-6 mb-3 list-decimal text-lg leading-relaxed">
          {renderRichText(block.numbered_list_item?.rich_text || [])}
        </li>
      );
    
    case 'quote':
      return (
        <blockquote className="border-l-4 border-indigo-500 pl-6 italic text-gray-600 my-8 bg-indigo-50 py-4 rounded-r-lg text-xl leading-relaxed">
          {renderRichText(block.quote?.rich_text || [])}
        </blockquote>
      );
    
    case 'code':
      return (
        <pre className="bg-gray-900 p-6 rounded-xl overflow-x-auto my-6 border border-gray-200 shadow-lg">
          <code className="text-green-400 text-sm font-mono leading-relaxed">
            {block.code?.rich_text?.map((text: any) => text.plain_text).join('') || ''}
          </code>
        </pre>
      );
    
    case 'callout':
      const calloutIcon = block.callout?.icon?.emoji || '💡';
      const notionColor = block.callout?.color || 'gray_background';
      
      const getNotionColorStyles = (color: string) => {
        const colorMap: { [key: string]: { bg: string; text: string } } = {
          'gray_background': { bg: '#f7f6f3', text: '#37352f' },
          'brown_background': { bg: '#f4eeee', text: '#37352f' },
          'orange_background': { bg: '#faebdd', text: '#37352f' },
          'yellow_background': { bg: '#fbf3db', text: '#37352f' },
          'green_background': { bg: '#ddedea', text: '#37352f' },
          'blue_background': { bg: '#ddebf1', text: '#37352f' },
          'purple_background': { bg: '#eae4f2', text: '#37352f' },
          'pink_background': { bg: '#f4dfeb', text: '#37352f' },
          'red_background': { bg: '#fbe4e4', text: '#37352f' },
          'default': { bg: '#f7f6f3', text: '#37352f' },
        };
        return colorMap[color] || colorMap['default'];
      };
      
      const calloutColorStyles = getNotionColorStyles(notionColor);
      
      return (
        <div 
          style={{
            backgroundColor: calloutColorStyles.bg,
            borderRadius: '6px',
            padding: '16px 16px 16px 14px',
            margin: '12px 0',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px'
          }}
        >
          <div style={{
            fontSize: '20px',
            lineHeight: '1.3',
            flexShrink: 0,
            width: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {calloutIcon}
          </div>
          <div style={{
            flex: 1,
            fontSize: '16px',
            lineHeight: '1.5',
            color: calloutColorStyles.text,
            minWidth: 0
          }}>
            {renderRichText(block.callout?.rich_text || [])}
          </div>
        </div>
      );
    
    case 'divider':
      return <hr className="border-gray-200 my-12 border-t-2" />;
    
    case 'image':
      const imageUrl = block.image?.file?.url || block.image?.external?.url;
      const captionText = block.image?.caption ? 
        block.image.caption.map((text: any) => text.plain_text).join('') : '';
      const captionElements = block.image?.caption ? renderRichText(block.image.caption) : null;
      
      return imageUrl ? (
        <figure className="my-8">
          <img 
            src={imageUrl} 
            alt={captionText || 'Blog image'} 
            className="w-full rounded-xl shadow-2xl"
          />
          {captionElements && (
            <figcaption className="text-gray-400 text-center mt-4 italic text-lg">
              {captionElements}
            </figcaption>
          )}
        </figure>
      ) : null;
    
    case 'video':
      const videoUrl = block.video?.file?.url || block.video?.external?.url;
      return videoUrl ? (
        <div className="my-8">
          <video controls className="w-full rounded-xl shadow-2xl">
            <source src={videoUrl} />
            Your browser does not support the video tag.
          </video>
        </div>
      ) : null;
    
    case 'embed':
      const embedUrl = block.embed?.url;
      return embedUrl ? (
        <div className="my-8">
          <iframe 
            src={embedUrl} 
            className="w-full h-96 rounded-xl border border-gray-700 shadow-lg"
            allowFullScreen
          />
        </div>
      ) : null;
    
    case 'to_do':
      return (
        <div className="flex items-start gap-3 mb-4 text-lg">
          <input 
            type="checkbox" 
            checked={block.to_do?.checked || false} 
            readOnly 
            className="mt-2 w-4 h-4 accent-indigo-600"
          />
          <span className={`text-gray-700 leading-relaxed ${block.to_do?.checked ? 'line-through opacity-60' : ''}`}>
            {renderRichText(block.to_do?.rich_text || [])}
          </span>
        </div>
      );
    
    case 'column_list':
    case 'column':
    case 'breadcrumb':
    case 'table_of_contents':
    case 'unsupported':
      return null;
    
    default:
      return null;
  }
}

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post: any) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const postMetadata = await getPostMetadata(slug);
  
  if (!postMetadata) {
    return {
      title: 'Post Not Found - Voigen.ai',
    };
  }

  return {
    title: `${postMetadata.title} - Voigen.ai Blog`,
    description: `Read about ${postMetadata.title}`,
    openGraph: {
      title: postMetadata.title,
      description: `Read about ${postMetadata.title}`,
      type: 'article',
      publishedTime: postMetadata.date,
      tags: postMetadata.tags,
    },
  };
}

// Helper function to extract headings for TOC
function extractHeadings(blocks: any[]) {
  const headings: { id: string; text: string; level: number }[] = [];
  
  blocks.forEach((block) => {
    if (block.type === 'heading_1' || block.type === 'heading_2' || block.type === 'heading_3') {
      const level = parseInt(block.type.split('_')[1]);
      const text = block[block.type]?.rich_text?.map((text: any) => text.plain_text).join('') || '';
      if (text.trim()) {
        headings.push({
          id: `heading-${block.id}`,
          text: text.trim(),
          level
        });
      }
    }
  });
  
  return headings;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const recordMap = await getPostBySlug(slug);
  const postMetadata = await getPostMetadata(slug);

  if (!postMetadata) {
    notFound();
  }

  // Extract headings for TOC
  const headings = recordMap && 'blocks' in recordMap ? extractHeadings(recordMap.blocks) : [];

  return (
    <div className="blog-detail-page">
      <div className="blog-detail-container">
        
        {/* Back Link */}
        <div className="blog-detail-back">
          <Link href="/blog" className="blog-detail-back-link">
            <svg className="blog-detail-back-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </Link>
        </div>

        <div className="blog-detail-layout">
          
          {/* SIDEBAR */}
          <aside className="blog-detail-sidebar">
            <TableOfContents headings={headings} />
          </aside>

          {/* MAIN CONTENT */}
          <main className="blog-detail-main">
            <article>
              {/* Article Content Box - Contains Header + Content */}
              <div className="blog-article-content">
                {/* Article Header - Inside the box */}
                <header className="blog-article-header">
                  <div className="blog-article-date">
                    <time dateTime={postMetadata.date}>
                      {new Date(postMetadata.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </time>
                  </div>

                  <h1 className="blog-article-title">{postMetadata.title}</h1>

                  <div className="blog-article-meta">
                    <p className="blog-article-author">
                      Published by <span className="blog-article-author-name">{postMetadata.authorName || 'Voigen Team'}</span>
                    </p>

                    {postMetadata.tags.length > 0 && (
                      <div className="blog-article-tags">
                        {postMetadata.tags.map((tag: string) => (
                          <Link
                            key={tag}
                            href={`/blog?tag=${encodeURIComponent(tag)}`}
                            className="blog-article-tag"
                          >
                            {tag}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </header>

                {/* Divider between header and content */}
                <hr className="blog-article-divider" />

                {/* Article Body */}
                <div className="blog-article-body">
                {recordMap ? (
                  <div className="notion-content">
                    {'blocks' in recordMap ? (
                      <div className="prose prose-slate max-w-none">
                        {recordMap.blocks.map((block: any) => {
                          const rendered = renderNotionBlock(block);
                          if (!rendered) return null; 
                          return (
                            <div key={block.id} className="mb-8 last:mb-0">
                              {rendered}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <NotionRenderer 
                        recordMap={recordMap} 
                        fullPage={false} 
                        darkMode={true}
                        className="notion-dark"
                      />
                    )}
                  </div>
                ) : (
                  <div className="blog-article-content-loading">
                    <svg 
                      className="blog-article-content-loading-icon" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      width="80"
                      height="80"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="blog-article-content-loading-title">Content Loading</h3>
                    <p className="blog-article-content-loading-text">
                      The full content for this article is being prepared. Please check back soon or contact us if you need immediate access.
                    </p>
                    <div className="blog-article-content-loading-excerpt">
                      {postMetadata.excerpt || `Read about ${postMetadata.title}...`}
                    </div>
                  </div>
                )}
                </div>

              </div>
            </article>
          </main>
        </div>

        {/* Related Articles Section */}
        <RelatedArticles currentSlug={slug} currentTags={postMetadata.tags} />
      </div>
    </div>
  );
}

// Related Articles Component
async function RelatedArticles({ currentSlug, currentTags }: { currentSlug: string; currentTags: string[] }) {
  const allPosts = await getPosts();
  
  // Filter related posts: same tags, exclude current post, limit to 3
  const relatedPosts = allPosts
    .filter((post: any) => {
      if (post.slug === currentSlug) return false;
      return post.tags.some((tag: string) => currentTags.includes(tag));
    })
    .slice(0, 3);

  // If not enough related posts by tag, fill with recent posts
  if (relatedPosts.length < 3) {
    const additionalPosts = allPosts
      .filter((post: any) => 
        post.slug !== currentSlug && 
        !relatedPosts.find((rp: any) => rp.slug === post.slug)
      )
      .slice(0, 3 - relatedPosts.length);
    relatedPosts.push(...additionalPosts);
  }

  if (relatedPosts.length === 0) return null;

  return (
    <section className="related-articles">
      <div className="related-articles-header">
        <h2 className="related-articles-title">Related Articles</h2>
        <p className="related-articles-subtitle">More content you might enjoy</p>
      </div>

      <div className="related-articles-grid">
        {relatedPosts.map((post: any) => (
          <Link href={`/blog/${post.slug}`} key={post.id} className="related-article-card">
            <div className="related-article-image-wrapper">
              {post.featuredImage ? (
                <img 
                  src={post.featuredImage} 
                  alt={post.title}
                  className="related-article-image"
                />
              ) : (
                <div className="related-article-placeholder">
                  <div className="related-article-placeholder-content">
                    <div className="related-article-placeholder-icon">📊</div>
                    <p className="related-article-placeholder-text">Article</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="related-article-content">
              <div className="related-article-tags">
                {post.tags.slice(0, 2).map((tag: string) => (
                  <span key={tag} className="related-article-tag">{tag}</span>
                ))}
              </div>

              <h3 className="related-article-title">{post.title}</h3>
              <p className="related-article-excerpt">{post.excerpt}</p>

              <div className="related-article-footer">
                <div className="related-article-author">
                  <div className="related-article-avatar">
                    {post.authorName?.charAt(0) || 'V'}
                  </div>
                  <div>
                    <span className="related-article-author-name">{post.authorName || 'Voigen Team'}</span>
                    <span className="related-article-author-date">
                      {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
                <span className="related-article-read-more">Read →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="related-articles-cta">
        <Link href="/blog" className="related-articles-btn">
          View All Articles
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </section>
  );
}

export const revalidate = 3600;
