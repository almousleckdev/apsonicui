export interface NewsContentBlock {
  type: 'paragraph' | 'image' | 'video';
  content: string;
  caption?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  thumbnail: string;
  content: NewsContentBlock[];
  authorName?: string;
  authorImage?: string;
}
