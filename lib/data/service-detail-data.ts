export interface ManualItem {
  id: string;
  title: string;
  description: string;
  pdfUrl: string;
  imageUrl: string;
  size: string;
  updated: string;
}

export interface VideoItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  youtubeId: string;
}

export interface CategoryData {
  title: string;
  manuals: ManualItem[];
  videos: VideoItem[];
  images: string[];
}

export { getLocalizedTwoWheelerData } from './service/two-wheeler-manuals';
export { getLocalizedTricycleData } from './service/tricycle-manuals';
