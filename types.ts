export interface Artwork {
  id: string;
  title: string;
  slug: string;
  year: string;
  medium: string;
  dimensions: string;
  description: string;
  collectionId: string;
  tags: string[];
  availability: 'for_sale' | 'sold' | 'nfs';
  featured: boolean;
  heroMedia: string; // URL
  galleryMedia: string[]; // URLs
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export type ViewMode = 'view' | 'drag' | 'play' | 'default';
