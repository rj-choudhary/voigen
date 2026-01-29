'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function BlogPage() {
  const [allPosts, setAllPosts] = useState<any[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<any[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>('All Articles');
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch('/api/blog');
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const posts = await response.json();
        setAllPosts(posts);
        
        // Check for tag in URL query parameter
        const tagFromUrl = searchParams.get('tag');
        if (tagFromUrl) {
          setSelectedTag(tagFromUrl);
          setFilteredPosts(posts.filter((post: any) => !post.isFeatured && post.tags.includes(tagFromUrl)));
        } else {
          setFilteredPosts(posts.filter((post: any) => !post.isFeatured));
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setLoading(false);
      }
    }
    fetchPosts();
  }, [searchParams]);

  // Get all unique tags from all posts
  const allTags = Array.from(new Set(allPosts.flatMap(post => post.tags)));

  // Handle tag filtering
  const handleTagFilter = (tag: string) => {
    setSelectedTag(tag);
    if (tag === 'All Articles') {
      setFilteredPosts(allPosts.filter(post => !post.isFeatured));
    } else {
      setFilteredPosts(allPosts.filter(post => !post.isFeatured && post.tags.includes(tag)));
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <main className="blog-page">
        <div className="blog-container">
          {/* Title Skeleton */}
          <div className="skeleton-pulse skeleton-title" />

          {/* Featured Post Skeleton */}
          <div className="skeleton-featured">
            <div className="skeleton-pulse skeleton-featured-image" />
            <div className="skeleton-featured-content">
              <div>
                <div className="skeleton-tags">
                  <div className="skeleton-pulse skeleton-tag skeleton-tag-1" />
                  <div className="skeleton-pulse skeleton-tag skeleton-tag-2" />
                </div>
                <div className="skeleton-pulse skeleton-line-title skeleton-line-title-90" />
                <div className="skeleton-pulse skeleton-line-title skeleton-line-title-70" />
                <div className="skeleton-pulse skeleton-line-text skeleton-line-100" />
                <div className="skeleton-pulse skeleton-line-text skeleton-line-85" />
              </div>
              <div className="skeleton-author">
                <div className="skeleton-pulse skeleton-avatar" />
                <div>
                  <div className="skeleton-pulse skeleton-author-name" />
                  <div className="skeleton-pulse skeleton-author-date" />
                </div>
              </div>
            </div>
          </div>

          {/* Tag Filter Skeleton */}
          <div className="skeleton-filters">
            {[95, 110, 125, 140, 155].map((width, i) => (
              <div 
                key={i}
                className="skeleton-pulse skeleton-filter-btn"
                style={{ width: `${width}px` }}
              />
            ))}
          </div>

          {/* Blog Cards Grid Skeleton */}
          <div className="skeleton-grid">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="skeleton-card">
                <div className="skeleton-pulse skeleton-card-image" />
                <div className="skeleton-card-content">
                  <div className="skeleton-pulse skeleton-card-tag" />
                  <div className="skeleton-pulse skeleton-card-title skeleton-card-title-100" />
                  <div className="skeleton-pulse skeleton-card-title skeleton-card-title-80" />
                  <div className="skeleton-pulse skeleton-card-text skeleton-line-100" />
                  <div className="skeleton-pulse skeleton-card-text skeleton-card-text-90" />
                  <div className="skeleton-author">
                    <div className="skeleton-pulse skeleton-avatar-sm" />
                    <div>
                      <div className="skeleton-pulse skeleton-card-author-name" />
                      <div className="skeleton-pulse skeleton-card-author-date" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }
  
  // Empty state
  if (allPosts.length === 0) {
    return (
      <main className="blog-page">
        <div className="blog-container blog-empty">
          <div className="blog-empty-icon">📝</div>
          <h2 className="blog-empty-title">No Blog Posts Yet</h2>
          <p className="blog-empty-text">We're working on some amazing content. Check back soon!</p>
        </div>
      </main>
    );
  }

  // Get featured post
  const featuredPost = allPosts.find(post => post.isFeatured);

  return (
    <main className="blog-page">
      <div className="blog-container">
        <h1 className="blog-title">Voigen Blogs</h1>

        {/* FEATURED POST */}
        {featuredPost && (
          <Link href={`/blog/${featuredPost.slug}`} className="featured-post">
            <article className="featured-post-card">
              {/* Featured Image */}
              <div className="featured-post-image-wrapper">
                {featuredPost.featuredImage ? (
                  <img 
                    src={featuredPost.featuredImage} 
                    alt={featuredPost.title}
                    className="featured-post-image"
                  />
                ) : (
                  <div className="featured-post-placeholder">
                    <div className="featured-post-placeholder-content">
                      <div className="featured-post-placeholder-icon">📊</div>
                      <p className="featured-post-placeholder-text">Featured Article</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Content */}
              <div className="featured-post-content">
                <div>
                  <div className="featured-post-tags">
                    {featuredPost.tags.length > 0 && (
                      <span className="blog-tag">{featuredPost.tags[0]}</span>
                    )}
                    <span className="blog-tag blog-tag-featured">Featured</span>
                  </div>

                  <h2 className="featured-post-title">{featuredPost.title}</h2>
                  <p className="featured-post-excerpt">{featuredPost.excerpt}</p>
                </div>

                <div className="featured-post-author">
                  <div className="author-avatar">
                    {featuredPost.authorName?.charAt(0) || 'V'}
                  </div>
                  <div>
                    <p className="author-name">{featuredPost.authorName || 'Voigen Team'}</p>
                    <p className="author-date">{new Date(featuredPost.date).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </article>
          </Link>
        )}

        {/* TAG FILTER BUTTONS */}
        <div className="tag-filters">
          <div className="tag-filters-wrapper">
            <button
              onClick={() => handleTagFilter('All Articles')}
              className={`tag-filter-btn ${selectedTag === 'All Articles' ? 'active' : ''}`}
            >
              All Articles
            </button>
            
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => handleTagFilter(tag)}
                className={`tag-filter-btn ${selectedTag === tag ? 'active' : ''}`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* BLOG POSTS GRID */}
        <div className="blog-grid">
          {filteredPosts.map((post: any) => (
            <Link href={`/blog/${post.slug}`} key={post.id} className="blog-post-link">
              <article className="blog-card">
                <div className="blog-card-image-wrapper">
                  {post.featuredImage ? (
                    <img 
                      src={post.featuredImage} 
                      alt={post.title}
                      className="blog-card-image"
                    />
                  ) : (
                    <div className="blog-card-placeholder">
                      <div className="blog-card-placeholder-content">
                        <div className="blog-card-placeholder-icon">📊</div>
                        <p className="blog-card-placeholder-text">Article</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="blog-card-content">
                  <div className="blog-card-tags">
                    {post.tags.length > 0 && (
                      <span className="blog-tag">{post.tags[0]}</span>
                    )}
                    {post.isFeatured && (
                      <span className="blog-tag blog-tag-featured">Featured</span>
                    )}
                  </div>

                  <h3 className="blog-card-title">{post.title}</h3>
                  <p className="blog-card-excerpt">{post.excerpt}</p>

                  <div className="blog-card-author">
                    <div className="author-avatar author-avatar-sm">
                      {post.authorName?.charAt(0) || 'V'}
                    </div>
                    <div>
                      <p className="author-name author-name-sm">{post.authorName || 'Voigen Team'}</p>
                      <p className="author-date author-date-sm">
                        {new Date(post.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
