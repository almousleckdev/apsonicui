// Service Support section constants
export const SERVICE_CONFIG = {
  // Layout proportions
  layout: {
    leftPanelWidth: "20%",
    middlePanelWidth: "25%",
    mapStartPosition: "45%",
  },

  // Panel styling
  panel: {
    padding: "30px 40px",
    borderRadius: "20px",
    leftPanelBg: "#F8F9FA",
    middlePanelBg: "rgba(255, 255, 255, 0.95)",
  },

  // Typography
  typography: {
    sectionTitle: "2rem",
    panelTitle: "22px",
    listTitle: "30px",
    storeName: "18px",
    storeAddress: "14px",
  },

  // Spacing
  spacing: {
    titleMarginBottom: "20px",
    titleMarginTop: "30px",
    searchMarginBottom: "30px",
    radioGap: "20px",
    storeListGap: "15px",
  },

  // Map configuration
  map: {
    defaultCenter: [0.5, 6.0] as [number, number], // West Africa coast
    defaultZoom: 6.5,
    style: "mapbox://styles/mapbox/streets-v12",
    markerSize: 24,
    markerBorderWidth: 3,
    fitBoundsPadding: 50,
    fitBoundsMaxZoom: 8,
  },

  // Store display
  store: {
    initialDisplayCount: 2,
    selectedBorderWidth: 3,
    selectedPaddingLeft: "15px",
    defaultPaddingLeft: "18px",
  },

  // Query types
  queryTypes: {
    dealer: "dealer",
    service: "service",
    nearby: "nearby",
    pickup: "pickup",
  } as const,
} as const;

// Service Support text labels
export const SERVICE_LABELS = {
  sectionTitle: "服务支持",
  panelTitle: "门店查询",
  listTitle: "附近门店",
  searchPlaceholder: "请输入关键词",
  noStoresFound: "未找到商店",
  buttonText: "了解售后服务",
  queryOptions: {
    dealer: "经销商门店查询",
    service: "售后门店查询",
    nearby: "附近门店",
    pickup: "自提服务",
  },
} as const;
