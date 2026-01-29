export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  status: string;
  date: string;
  tags: string[];
  content: string;
  excerpt?: string;
}

export interface NotionPage {
  id: string;
  properties: {
    Title: {
      title: Array<{
        plain_text: string;
      }>;
    };
    Slug: {
      rich_text: Array<{
        plain_text: string;
      }>;
    };
    Status: {
      select: {
        name: string;
      } | null;
    };
    Date: {
      date: {
        start: string;
      } | null;
    };
    Tags: {
      multi_select: Array<{
        name: string;
      }>;
    };
  };
}
