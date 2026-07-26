export interface FeatureCard {
  id: string;
  image: string;
  imageScale?: number;
  title: string;
  subtitle?: string;
  description: string;
  ctaText: string;
  href: string;
}

export function getFeatureCards(t: (key: string) => string): FeatureCard[] {
  return [
    {
      id: "locations-manuals",
      image: "/products/AP110-A-PLUS(白).png", // exact working image path in public
      imageScale: 0.85,
      title: t("featureCards.locations.title") || "Two-Wheeler Support",
      description: t("featureCards.locations.description") || "Manuals, service videos, and support resources for APSONIC two-wheeler models.",
      ctaText: t("featureCards.locations.cta") || "View Now",
      href: "/services/locations",
    },
    {
      id: "parts-tricycles",
      image: "/dropdown/44.jpg", // exact working image path in public
      imageScale: 0.85,
      title: t("featureCards.parts.title") || "Tricycle Support",
      description: t("featureCards.parts.description") || "Manuals, service videos, and support resources for APSONIC tricycle models.",
      ctaText: t("featureCards.parts.cta") || "View Now",
      href: "/services/parts",
    },
  ];
}

export const SERVICE_COVERAGE_COUNTRIES = [
  { flag: "🇬🇭", name: "Ghana" },
  { flag: "🇹🇬", name: "Togo" },
  { flag: "🇧🇯", name: "Benin" },
  { flag: "🇨🇮", name: "Ivory Coast" },
  { flag: "🇧🇫", name: "Burkina Faso" },
  { flag: "🇲🇱", name: "Mali" },
  { flag: "🇬🇳", name: "Guinea" },
  { flag: "🇰🇪", name: "Kenya" },
  { flag: "🇺🇬", name: "Uganda" },
  { flag: "🇹🇿", name: "Tanzania" },
];
