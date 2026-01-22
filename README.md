# Voigen.ai Next.js Website

This is the converted Next.js version of the Voigen.ai website, migrated from a static HTML site to a scalable Next.js application.

## 🚀 Features

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Responsive Design** with custom CSS
- **Blog System** ready for Notion integration
- **SEO Optimized** with proper meta tags
- **Talk Now Interface** with WebSocket integration
- **Legal Pages** (Privacy Policy, Terms of Service)

## 📁 Project Structure

```
voigen-nextjs/
├── src/
│   ├── app/
│   │   ├── blog/
│   │   │   └── page.tsx          # Blog listing page
│   │   ├── privacy-policy/
│   │   │   └── page.tsx          # Privacy Policy page
│   │   ├── terms-of-service/
│   │   │   └── page.tsx          # Terms of Service page
│   │   ├── globals.css           # Global styles
│   │   ├── layout.tsx            # Root layout
│   │   └── page.tsx              # Home page
│   └── components/
│       ├── Header.tsx            # Navigation header
│       ├── Footer.tsx            # Site footer
│       └── TalkInterface.tsx     # AI voice interface
├── public/
│   └── assets/                   # Images and static files
└── vercel.json                   # Deployment configuration
```

## 🛠 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📝 Blog Integration with Notion

To integrate the blog with Notion, follow these steps:

### 1. Set up Notion Integration

1. Go to [Notion Integrations](https://www.notion.so/my-integrations)
2. Create a new integration and get your API key
3. Create a Notion database for your blog posts with these properties:
   - **Title** (Title)
   - **Slug** (Rich Text)
   - **Excerpt** (Rich Text)
   - **Published** (Checkbox)
   - **Date** (Date)
   - **Author** (Rich Text)
   - **Read Time** (Rich Text)
   - **Content** (Rich Text - for the page content)

### 2. Install Notion SDK

```bash
npm install @notionhq/client
```

### 3. Environment Variables

Create a `.env.local` file:

```env
NOTION_API_KEY=your_notion_integration_token
NOTION_DATABASE_ID=your_database_id
```

### 4. Create Notion API Functions

Create `src/lib/notion.ts`:

```typescript
import { Client } from '@notionhq/client';

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export async function getBlogPosts() {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID!,
    filter: {
      property: 'Published',
      checkbox: {
        equals: true,
      },
    },
    sorts: [
      {
        property: 'Date',
        direction: 'descending',
      },
    ],
  });

  return response.results.map((page: any) => ({
    id: page.id,
    title: page.properties.Title.title[0]?.plain_text || '',
    slug: page.properties.Slug.rich_text[0]?.plain_text || '',
    excerpt: page.properties.Excerpt.rich_text[0]?.plain_text || '',
    date: page.properties.Date.date?.start || '',
    author: page.properties.Author.rich_text[0]?.plain_text || 'Voigen Team',
    readTime: page.properties['Read Time'].rich_text[0]?.plain_text || '5 min read',
  }));
}

export async function getBlogPost(slug: string) {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID!,
    filter: {
      property: 'Slug',
      rich_text: {
        equals: slug,
      },
    },
  });

  if (response.results.length === 0) {
    return null;
  }

  const page = response.results[0] as any;
  
  // Get page content
  const content = await notion.blocks.children.list({
    block_id: page.id,
  });

  return {
    id: page.id,
    title: page.properties.Title.title[0]?.plain_text || '',
    slug: page.properties.Slug.rich_text[0]?.plain_text || '',
    excerpt: page.properties.Excerpt.rich_text[0]?.plain_text || '',
    date: page.properties.Date.date?.start || '',
    author: page.properties.Author.rich_text[0]?.plain_text || 'Voigen Team',
    readTime: page.properties['Read Time'].rich_text[0]?.plain_text || '5 min read',
    content: content.results,
  };
}
```

### 5. Update Blog Pages

Update `src/app/blog/page.tsx` to use Notion data:

```typescript
import { getBlogPosts } from '@/lib/notion';

export default async function BlogPage() {
  const blogPosts = await getBlogPosts();
  
  // Rest of your component code...
}
```

Create `src/app/blog/[slug]/page.tsx` for individual blog posts:

```typescript
import { getBlogPost } from '@/lib/notion';
import { notFound } from 'next/navigation';

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug);
  
  if (!post) {
    notFound();
  }
  
  // Render your blog post...
}
```

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard:
   - `NOTION_API_KEY`
   - `NOTION_DATABASE_ID`
4. Deploy!

### Deploy to Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## 🔧 Configuration

### Custom Domain

Update the domain in:
- `src/app/layout.tsx` (metadata)
- `vercel.json` (if using custom redirects)

### Analytics

Google Analytics is already configured. Update the tracking ID in `src/app/layout.tsx`:

```typescript
gtag('config', 'YOUR_GA_TRACKING_ID');
```

## 📱 Features Included

### ✅ Completed
- [x] Next.js project setup with TypeScript
- [x] Responsive header and footer components
- [x] Home page with all sections (Hero, Features, About, Contact)
- [x] Privacy Policy and Terms of Service pages
- [x] Blog directory structure
- [x] Talk Now interface with WebSocket integration
- [x] CSS migration and responsive design
- [x] SEO optimization
- [x] Deployment configuration

### 🔄 Next Steps (Notion Integration)
- [ ] Set up Notion database
- [ ] Install Notion SDK
- [ ] Create API functions for blog data
- [ ] Update blog pages to use Notion data
- [ ] Create individual blog post pages
- [ ] Add rich text rendering for Notion content

## 🎨 Styling

The website uses custom CSS with:
- CSS Variables for theming
- Responsive design (mobile-first)
- Smooth animations and transitions
- Modern gradient effects
- Professional typography

## 🔗 Links

- **Live Site**: [voigen.ai](https://voigen.ai)
- **Original Static Site**: Available in parent directory
- **Notion Integration Guide**: See above instructions

## 📞 Support

For questions about the conversion or setup:
- Email: hello@voigen.ai
- Phone: +91 97822 60112

---

**Note**: This is a complete conversion from static HTML to Next.js. All original functionality has been preserved while adding scalability for future features like the Notion-powered blog system.
