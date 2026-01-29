import { Client } from "@notionhq/client";

const notion = new Client({ 
  auth: process.env.NOTION_API_KEY,
});

export async function getPosts() {
  try {
    // Use the working search method but filter properly
    const response = await notion.search({
      filter: {
        value: "page",
        property: "object"
      },
      sort: {
        direction: "descending",
        timestamp: "last_edited_time"
      }
    });

    // Filter results to only include pages from our database
    // Normalize IDs by removing dashes for comparison
    const normalizedDbId = process.env.NOTION_DATABASE_ID?.replace(/-/g, '');
    const databasePages = response.results.filter((page: any) => {
      const pageDbId = page.parent?.database_id?.replace(/-/g, '');
      return pageDbId === normalizedDbId;
    });

    // Map and filter by status
    const posts = databasePages
      .map((page: any) => {
        const properties = page.properties || {};
        
        const post = {
          id: page.id,
          title: properties.Title?.title?.[0]?.plain_text || "Untitled",
          slug: properties.Slug?.rich_text?.[0]?.plain_text || page.id,
          date: properties.Date?.date?.start || page.created_time,
          tags: properties.Tags?.multi_select?.map((tag: any) => tag.name) || [],
          status: properties.Status?.status?.name || "Draft",
          // "Is Featured Post" logic for your 'Yes' dropdown
          isFeatured: properties['Is Featured Post']?.status?.name === "Yes",
          // Handling both internal and external Notion images
          featuredImage: properties['Featured Image']?.files?.[0]?.file?.url || 
                         properties['Featured Image']?.files?.[0]?.external?.url || null,
          excerpt: properties.Summary?.rich_text?.[0]?.plain_text || 
                  `Read about ${properties.Title?.title?.[0]?.plain_text || "this topic"}...`,
          // Author name from select property
          authorName: properties.Author_Name?.select?.name || "Voigen Team"
        };
        
        return post;
      })
      .filter((post: any) => post.status === "Published");

    return posts;
  } catch (error) {
    console.error('Notion Fetch Error:', error);
    return [];
  }
}

// Helper to get page content using official Notion API only
export async function getPostBySlug(slug: string) {
  try {
    // Decode URL-encoded slug
    const decodedSlug = decodeURIComponent(slug);
    
    // Get all posts and find the matching one
    const allPosts = await getPosts();
    const matchingPost = allPosts.find((post: any) => {
      return post.slug === decodedSlug || post.slug === slug || post.id === decodedSlug || post.id === slug;
    });

    if (!matchingPost) {
      return null;
    }
    
    // Get page content using official Notion API only
    try {
      const pageResponse = await notion.pages.retrieve({ page_id: matchingPost.id });
      
      // Get page blocks (content) with recursive fetching for nested blocks
      const allBlocks = await getAllBlocks(matchingPost.id);
      
      return {
        page: pageResponse,
        blocks: allBlocks,
      };
    } catch (error) {
      return null;
    }
  } catch (error) {
    console.error('Error fetching post by slug:', error);
    return null;
  }
}

// Helper function to recursively get all blocks including nested ones
async function getAllBlocks(blockId: string): Promise<any[]> {
  const allBlocks: any[] = [];
  let cursor: string | undefined = undefined;
  
  do {
    try {
      const response = await notion.blocks.children.list({
        block_id: blockId,
        page_size: 100,
        start_cursor: cursor,
      });
      
      for (const block of response.results) {
        allBlocks.push(block);
        
        // If block has children, fetch them recursively
        if ('has_children' in block && block.has_children) {
          const childBlocks = await getAllBlocks(block.id);
          allBlocks.push(...childBlocks);
        }
      }
      
      cursor = response.next_cursor || undefined;
    } catch (error) {
      console.error('Error fetching blocks:', error);
      break;
    }
  } while (cursor);
  
  return allBlocks;
}

// Get post metadata by slug
export async function getPostMetadata(slug: string) {
  try {
    // Decode URL-encoded slug
    const decodedSlug = decodeURIComponent(slug);
    
    // Get all posts and find the matching one
    const allPosts = await getPosts();
    const matchingPost = allPosts.find((post: any) => {
      return post.slug === decodedSlug || post.slug === slug || post.id === decodedSlug || post.id === slug;
    });

    if (!matchingPost) {
      return null;
    }
    
    return {
      id: matchingPost.id,
      title: matchingPost.title,
      slug: matchingPost.slug,
      date: matchingPost.date,
      tags: matchingPost.tags,
      excerpt: matchingPost.excerpt,
      authorName: matchingPost.authorName,
    };
  } catch (error) {
    console.error('Error fetching post metadata:', error);
    return null;
  }
}

// Legacy functions for backward compatibility
export const getBlogPosts = getPosts;
export const getBlogPost = getPostBySlug;
