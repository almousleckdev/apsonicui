// Service Support page constants - Apple-inspired design
export const SERVICE_PAGE_CONFIG = {
  // Colors
  colors: {
    primary: '#1D1D1F',
    secondary: '#86868B',
    accent: '#00A86B',
    background: '#FFFFFF',
    cardBackground: '#F5F5F5',
    border: '#E5E5E5',
    warning: '#FFF8E1',
    warningBorder: '#FFC107',
  },
  
  // Typography
  typography: {
    heroTitle: {
      fontSize: '48px',
      fontWeight: 700,
      color: '#1D1D1F',
    },
    heroSubtitle: {
      fontSize: '20px',
      fontWeight: 400,
      color: '#86868B',
    },
    sectionTitle: {
      fontSize: '36px',
      fontWeight: 700,
      color: '#1D1D1F',
    },
    cardTitle: {
      fontSize: '28px',
      fontWeight: 700,
      color: '#1D1D1F',
    },
    modelName: {
      fontSize: '16px',
      fontWeight: 500,
      color: '#1D1D1F',
    },
    categoryLabel: {
      fontSize: '14px',
      fontWeight: 400,
      color: '#86868B',
    },
    linkText: {
      fontSize: '18px',
      fontWeight: 400,
      color: '#1D1D1F',
    },
  },
  
  // Spacing
  spacing: {
    heroPadding: { top: '80px', bottom: '60px' },
    sectionPadding: { top: '80px', bottom: '80px' },
    sectionPaddingSmall: { top: '60px', bottom: '60px' },
    searchPadding: { top: '40px', bottom: '40px' },
    containerMaxWidth: '1400px',
    containerMaxWidthNarrow: '800px',
  },
  
  // Logo Badge
  logoBadge: {
    size: '120px',
    backgroundColor: '#00A86B',
    shadow: '0 4px 12px rgba(0, 168, 107, 0.2)',
  },
  
  // Cards
  card: {
    borderRadius: '16px',
    padding: '24px',
    hoverTransform: 'translateY(-8px)',
    hoverShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
    transition: 'all 0.3s ease',
  },
  
  // Feature Cards
  featureCard: {
    padding: '40px',
    imageHeight: '300px',
    hoverTransform: 'translateY(-4px)',
    hoverShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
  },
  
  // Grid
  grid: {
    gap: '24px',
    cardGap: '32px',
  },
} as const;
