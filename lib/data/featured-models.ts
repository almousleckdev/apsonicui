import type { FeaturedModel, MotorcycleCategory } from "@/lib/types/products";

export const DEFAULT_FEATURED_MODELS: FeaturedModel[] = [
  {
    id: "1",
    name: "AP125-30 ALOBA",
    image: "/images/banners/homepage/aloba-black.png",
    watermark: "APSONIC",
    colors: [
      {
        id: "black",
        name: "魅夜黑",
        hex: "#000000",
        image: "/images/banners/homepage/aloba-black.png",
      },
      {
        id: "red",
        name: "激情红",
        hex: "#E31D1A",
        image: "/images/banners/homepage/aloba-red.png",
      },
    ],
    href: "/products",
  },
  {
    id: "2",
    name: "AP150-40 CRUISER",
    image: "/images/banners/homepage/img2.jpg",
    watermark: "Good Life",
    colors: [
      {
        id: "black",
        name: "魅夜黑",
        hex: "#000000",
        image: "/images/banners/homepage/img2.jpg",
      },
      {
        id: "red",
        name: "激情红",
        hex: "#E31D1A",
        image: "/images/banners/homepage/aloba-red.png",
      },
    ],
    href: "/products",
  },
];

export const DEFAULT_CATEGORIES: MotorcycleCategory[] = [
  {
    id: "standard",
    name: "Standard",
    image: "/categories/骑士车/AP125-K(3.2).png",
    href: "/products?category=standard",
  },
  {
    id: "street",
    name: "Street",
    image: "/images/banners/homepage/AP125-30（2）.png",
    href: "/products?category=street",
  },
  {
    id: "offroad",
    name: "Off-Road",
    image: "/images/banners/homepage/AP250GY (3).png",
    href: "/products?category=offroad",
  },
  {
    id: "underbone",
    name: "Underbone",
    image: "/images/banners/homepage/AP110-A-PLUS(白).png",
    href: "/products?category=underbone",
  },
  {
    id: "scooter",
    name: "Scooter",
    image: "/categories/踏板车/AP150T/AP150T-珍珠白（2）.png",
    href: "/products?category=scooter",
  },
  {
    id: "atv",
    name: "ATV",
    image: "/categories/ATV/AP150ST-250 正右侧 投影.png",
    href: "/products?category=atv",
  },
  {
    id: "tricycle",
    name: "Tricycle",
    image: "/categories/三轮车/AP150ZH-20更新/AP150ZH-20 MAX (1).png",
    href: "/products?category=tricycle",
    imageClassName: "md:p-0",
  },
];
