import { PRODUCT_MODELS } from "./product-models";

export interface ProductHeroContent {
  headlineLines: Array<{ text: string; color: "white" | "brand" }>;
  left: string;
  middle: string;
  right: string;
  rider: string;
  topLeftBadge?: string;
}

export interface KeyFeatureMetric {
  value: number;
  unit: string;
  suffix?: string; // e.g. "*4"
}

export interface KeyFeatureItem {
  title: string;
  image: string;
  /** Spans both grid rows and renders at a larger type scale. */
  tall?: boolean;
  /** Where the value block sits relative to the title. */
  layout: "below" | "inline-top" | "bottom-left" | "bottom-right";
  label?: string;
  metric?: KeyFeatureMetric;
  text?: string;
  highlight?: { lines: string[]; trail: string };
}

export interface StorySplitVariant {
  id: string;
  colorLabel: string;
  dotColor: string; // hex color swatch
  image: string;
}

export interface ProductStorySplitContent {
  title: string;
  description: string;
  background: string;
  variants: StorySplitVariant[];
}

export interface SpecBannerFeatureCard {
  image: string;
  label?: string;
  multiplier?: string; // e.g. "x2"
}

export interface SpecBannerContent {
  id: string;
  background: string;
  align: "left" | "right";
  titleLines: string[];
  description: string;
  metric?: { label: string; value: number; unit: string };
  featureCards?: SpecBannerFeatureCard[];
  badge?: string;
}

export interface ProductAestheticContent {
  title: string;
  subtitle: string;
  subtitleHighlight: string;
  backgroundImage: string;
  firstImage: string;
  secondImage: string;
  badgeImage?: string;
}

export interface ProductReviewItem {
  author: string;
  rating: number;
  content: string;
}

export interface ProductKeySpec {
  label: string;
  value: number;
  unit: string;
  prefix?: string;
}

export interface ProductDetailSpecRow {
  label: string;
  value: string;
}

export interface ProductTechSpecsContent {
  keySpecs: ProductKeySpec[];
  fullSpecs: ProductDetailSpecRow[];
}

export interface ProductDetailContent {
  id: string;
  hero: ProductHeroContent;
  keyFeatures: {
    title: string;
    subtitleHighlight: string;
    subtitleRest: string;
    background: string;
    items: KeyFeatureItem[];
  };
  storySplit: ProductStorySplitContent;
  specBanners: SpecBannerContent[];
  aestheticDesign?: ProductAestheticContent;
  reviews?: ProductReviewItem[];
  techSpecs?: ProductTechSpecsContent;
}

const defaultHeroLeft = "/images/products/detail/hero/leftimage.png";
const defaultHeroMiddle = "/images/products/detail/hero/middleimage.png";
const defaultHeroRight = "/images/products/detail/hero/rightimage.png";
const defaultHeroRider = "/images/products/detail/hero/persononbike.png";
const defaultHeroTopLeftBadge = "/images/products/detail/hero/topleft.png";

const defaultKeyFeaturesBackground = "/images/products/detail/keyperformance/bg.png";
const defaultEngineImg = "/images/products/detail/keyperformance/矩形 11.png";
const defaultFrameImg = "/images/products/detail/keyperformance/图层 390 拷贝.png";
const defaultHeadlightImg = "/images/products/detail/keyperformance/huaban-3181726860 拷贝.png";
const defaultRearAbsorberImg = "/images/products/detail/keyperformance/左45度.png";
const defaultPedalImg = "/images/products/detail/keyperformance/DSC_7956.png";

const defaultStorySplitBackground = "/images/products/detail/storysplit/background.png";
const defaultStorySplitBlack = "/images/products/detail/storysplit/left_black.png";
const defaultStorySplitRed = "/images/products/detail/storysplit/left_red.png";

const defaultFrameBanner = "/images/products/detail/specbanner/firstsection.png";
const defaultEngineBanner = "/images/products/detail/specbanner/secondsection.png";
const defaultRearCarrierBanner = "/images/products/detail/specbanner/thirdsection.png";

export const PRODUCT_DETAIL_CONTENT: Record<string, ProductDetailContent> = {
  "ap125-19-plus-1-2": {
    id: "ap125-19-plus-1-2",
    hero: {
      headlineLines: [
        { text: "Even loaded", color: "white" },
        { text: "stays the master", color: "brand" },
        { text: "of the road", color: "brand" },
      ],
      left: defaultHeroLeft,
      middle: defaultHeroMiddle,
      right: defaultHeroRight,
      rider: defaultHeroRider,
      topLeftBadge: defaultHeroTopLeftBadge,
    },
    keyFeatures: {
      title: "Key Performance Features",
      subtitleHighlight: "Top",
      subtitleRest: " ten selling points",
      background: defaultKeyFeaturesBackground,
      items: [
        {
          title: "Engine",
          image: defaultEngineImg,
          tall: true,
          layout: "below",
          metric: { value: 180, unit: "cc" },
        },
        {
          title: "Frame",
          image: defaultFrameImg,
          layout: "inline-top",
          label: "Maximum laden mass",
          metric: { value: 250, unit: "kg" },
        },
        {
          title: "Headlights",
          image: defaultHeadlightImg,
          layout: "below",
          text: "LED",
        },
        {
          title: "Rear absorber",
          image: defaultRearAbsorberImg,
          layout: "bottom-right",
          metric: { value: 2100, unit: "N", suffix: " *4" },
        },
        {
          title: "Pedal",
          image: defaultPedalImg,
          layout: "bottom-left",
          highlight: { lines: ["Multi", "functional"], trail: "and foldable" },
        },
      ],
    },
    storySplit: {
      title: "'Strong' impressive load-bearing ability",
      description:
        "The all-new developed four-rear-suspension reinforced frame, paired with a 15.5L enlarged fuel tank, thicker cargo racks, and a longer seat, along with unique decals, highlights the model's strong carrying capacity.",
      background: defaultStorySplitBackground,
      variants: [
        {
          id: "black",
          colorLabel: "Black",
          dotColor: "#111111",
          image: defaultStorySplitBlack,
        },
        {
          id: "red",
          colorLabel: "Red",
          dotColor: "#7a2130",
          image: defaultStorySplitRed,
        },
      ],
    },
    specBanners: [
      {
        id: "frame",
        background: defaultFrameBanner,
        align: "right",
        titleLines: ["Frame"],
        description:
          "Four rear shock absorbing frame, stronger load-bearing capacity than ordinary GN frame.",
        metric: { label: "Maximum laden mass", value: 250, unit: "kg" },
      },
      {
        id: "rear-carrier",
        background: defaultRearCarrierBanner,
        align: "left",
        titleLines: ["Rear carrier", "Rear absorber"],
        description:
          "The thickened rear carrier and four rear shock absorbers design make it more suitable for heavy loads.",
      },
      {
        id: "engine",
        background: defaultEngineBanner,
        align: "right",
        titleLines: ["Engine"],
        description:
          "An engine that can easily handle complex working conditions such as heavy loads and climbing slopes.",
      },
    ],
    aestheticDesign: {
      title: "Textured aesthetic design",
      subtitle: "Let's enjoy it together",
      subtitleHighlight: "enjoy",
      backgroundImage: "/images/products/aesthetic/bg.png",
      firstImage: "/images/products/aesthetic/2.png",
      secondImage: "/images/products/aesthetic/3.png",
      badgeImage: "/images/products/aesthetic/rightdown.png",
    },
    reviews: [
      {
        author: "Muhammad",
        rating: 5,
        content: "Meets long-range needs. Reduce failure rate and maintenance costs.",
      },
      {
        author: "Rustam",
        rating: 5,
        content: "A really great motorcycle, very satisfied, super cool and very high-quality. Meets long-range needs. Reduce failure rate and maintenance costs.",
      },
      {
        author: "Ahmed",
        rating: 5,
        content: "Hope there could be more models to choose from, really like your products. Meets long-range needs. Reduce failure rate and maintenance costs.",
      },
      {
        author: "Zainab's father, usually Zain",
        rating: 5,
        content: "APSONIC is really famous and even sponsored the Africa Cup. Meets long-range needs. Reduce failure rate and maintenance costs.",
      },
    ],
    techSpecs: {
      keySpecs: [
        { label: "MAX SPEED", value: 98, unit: "km/h", prefix: "≥" },
        { label: "FUEL TANK CAPACITY", value: 13.5, unit: "L" },
        { label: "N.W", value: 115, unit: "kg" },
        { label: "GROUND CLEARANCE", value: 160, unit: "mm" },
      ],
      fullSpecs: [
        { label: "DISPLACEMENT(ML)", value: "149.3" },
        { label: "Wheelbase(MM)", value: "1300mm" },
        { label: "BORE(MM)XSTROKE(MM)", value: "57.3X57.9mm" },
        { label: "L(MM)XW(MM)XH(MM)", value: "1980x780x1260mm" },
        { label: "COMPRESSION RATIO", value: "10.6:1" },
        { label: "MIN GROUND CLEARANCE(MM)", value: "160mm" }, // Aligned and corrected layout shift
        { label: "MAX POWER(KW/RPM)", value: "10.0 / 8000 kW/ (r/min)" },
        { label: "N.W(KG)", value: "133kg" },
        { label: "MAX TORQUE(N.m/RPM)", value: "12.5 / 6000 N・m/ (r/min)" },
        { label: "BRAKE", value: "FR.DISC/RR.DRUM" },
        { label: "MAX SPEED(KM/H)", value: ">95(km/h)" },
        { label: "TYRE SIZE", value: "FR.110 / 80-14 RR.130 / 70-13" },
        { label: "IGNITION", value: "CDI" },
        { label: "FUEL TANK CAPACITY(L)", value: "13L" },
        { label: "STARTER", value: "Electric" },
        { label: "CLUTCH TYPE", value: "CVT" },
      ],
    },
  },
};

export function getProductDetailContent(id: string): ProductDetailContent | undefined {
  // Find if this product model exists in the catalog
  const product = PRODUCT_MODELS.find((p) => p.id === id);
  if (!product) {
    return undefined;
  }

  // Retrieve the master layout content
  const master = PRODUCT_DETAIL_CONTENT["ap125-19-plus-1-2"];
  if (!master) {
    return undefined;
  }

  // Return the master details but with the corresponding ID
  return {
    ...master,
    id: id,
    hero: {
      ...master.hero,
      headlineLines: [
        { text: "Even loaded", color: "white" as const },
        { text: "stays the master", color: "brand" as const },
        { text: "of the road", color: "brand" as const },
      ],
    }
  };
}

export function getKnownProductDetailIds(): string[] {
  const existingIds = Object.keys(PRODUCT_DETAIL_CONTENT);
  const modelIds = PRODUCT_MODELS.map((p) => p.id);
  return Array.from(new Set([...existingIds, ...modelIds]));
}
