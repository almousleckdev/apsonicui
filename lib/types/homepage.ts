export interface HomeHeroConfig {
  taglineZh?: string;
  taglineEn?: string;
  taglineFr?: string;
  titleZh?: string;
  titleEn?: string;
  titleFr?: string;
  subtitleZh?: string;
  subtitleEn?: string;
  subtitleFr?: string;
  videos: string[];
  interval: number;
}

export interface HomeFeaturedModelItem {
  id: string;
  name: string;
  image: string;
  watermark?: string;
  href?: string;
  colors?: {
    id: string;
    name: string;
    hex: string;
    image: string;
  }[];
}

export interface HomeCategoryItem {
  id: string;
  name: string;
  nameZh?: string;
  nameFr?: string;
  image: string;
  href: string;
}

export interface HomePageSectionVisibility {
  showHero: boolean;
  showRecommendedModels: boolean;
  showCategoryCarousel: boolean;
  showServiceSupport: boolean;
  showVoices: boolean;
  showNews: boolean;
}

export interface HomePageConfig {
  hero: HomeHeroConfig;
  recommendedModels: HomeFeaturedModelItem[];
  categories: HomeCategoryItem[];
  visibility: HomePageSectionVisibility;
}

export const DEFAULT_HOMEPAGE_CONFIG: HomePageConfig = {
  hero: {
    taglineZh: "探索品牌",
    taglineEn: "Discover Apsonic",
    taglineFr: "Découvrir Apsonic",
    titleZh: "好质量 好生活",
    titleEn: "Good Quality, Good Life",
    titleFr: "Bonne qualité pour une meilleure vie",
    subtitleZh: "APSONIC 摩托车 - 专为非洲复杂路况打造",
    subtitleEn: "APSONIC Motorcycles - Built for Africa's Rugged Roads",
    subtitleFr: "Motos APSONIC - Conçues pour les Routes d'Afrique",
    videos: ["/videos/hero2.mp4", "/videos/723_1770449481.mp4"],
    interval: 8000,
  },
  recommendedModels: [
    {
      id: "1",
      name: "AP125-30 ALOBA",
      image: "/images/banners/homepage/aloba-black.png",
      watermark: "APSONIC",
      colors: [
        { id: "black", name: "魅夜黑", hex: "#000000", image: "/images/banners/homepage/aloba-black.png" },
        { id: "red", name: "激情红", hex: "#E31D1A", image: "/images/banners/homepage/aloba-red.png" },
      ],
      href: "/products",
    },
    {
      id: "2",
      name: "AP150-40 CRUISER",
      image: "/images/banners/homepage/img2.jpg",
      watermark: "Good Life",
      colors: [
        { id: "black", name: "魅夜黑", hex: "#000000", image: "/images/banners/homepage/img2.jpg" },
        { id: "red", name: "激情红", hex: "#E31D1A", image: "/images/banners/homepage/aloba-red.png" },
      ],
      href: "/products",
    },
  ],
  categories: [
    { id: "standard", name: "Standard", nameZh: "骑士车", nameFr: "Standard", image: "/categories/骑士车/AP125-K(3.2).png", href: "/products?category=standard" },
    { id: "street", name: "Street", nameZh: "街车", nameFr: "Urbaine", image: "/images/banners/homepage/AP125-30（2）.png", href: "/products?category=street" },
    { id: "offroad", name: "Off-Road", nameZh: "越野车", nameFr: "Tout-Terrain", image: "/images/banners/homepage/AP250GY (3).png", href: "/products?category=offroad" },
    { id: "underbone", name: "Underbone", nameZh: "弯梁车", nameFr: "Underbone", image: "/images/banners/homepage/AP110-A-PLUS(白).png", href: "/products?category=underbone" },
    { id: "scooter", name: "Scooter", nameZh: "踏板车", nameFr: "Scooter", image: "/categories/踏板车/AP150T/AP150T-珍珠白（2）.png", href: "/products?category=scooter" },
    { id: "atv", name: "ATV", nameZh: "ATV", nameFr: "Quad / ATV", image: "/categories/ATV/AP150ST-250 正右侧 投影.png", href: "/products?category=atv" },
    { id: "tricycle", name: "Tricycle", nameZh: "三轮车", nameFr: "Tricycle", image: "/categories/三轮车/AP150ZH-20更新/AP150ZH-20 MAX (1).png", href: "/products?category=tricycle" },
  ],
  visibility: {
    showHero: true,
    showRecommendedModels: true,
    showCategoryCarousel: true,
    showServiceSupport: true,
    showVoices: true,
    showNews: true,
  },
};
