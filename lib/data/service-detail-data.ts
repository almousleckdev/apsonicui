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

export const getLocalizedTwoWheelerData = (locale: string): Record<string, CategoryData> => {
  const isZh = locale === "zh";
  const isFr = locale === "fr";

  return {
    underbone: {
      title: isZh ? "弯梁车" : isFr ? "Underbone" : "Underbone",
      manuals: [
        {
          id: "ub-1",
          title: isZh ? "AP110-A PLUS 用户手册" : "AP110-A PLUS User Manual",
          description: isZh
            ? "AP110-A PLUS型号完整用户手册，包含操作指南 and 维护说明。"
            : "Complete user manual for AP110-A PLUS, including operation and maintenance guidelines.",
          pdfUrl: "/pdf/simpple.pdf",
          imageUrl: "/categories/弯梁车/AP110-A PLUS(白).png",
          size: "2.4 MB",
          updated: isZh ? "2025年1月" : "Jan 2025",
        },
        {
          id: "ub-2",
          title: isZh ? "AP110-3 用户手册" : "AP110-3 User Manual",
          description: isZh
            ? "AP110-3型号详细手册，包含操作说明与日常维护。"
            : "Detailed manual for AP110-3, outlining operation and regular maintenance.",
          pdfUrl: "/pdf/simpple.pdf",
          imageUrl: "/categories/弯梁车/AP110-3 (1.2).png",
          size: "5.8 MB",
          updated: isZh ? "2024年12月" : "Dec 2024",
        },
        {
          id: "ub-3",
          title: isZh ? "AP110-3A 用户手册" : "AP110-3A User Manual",
          description: isZh
            ? "AP110-3A型号产品手册。"
            : "Detailed manual for AP110-3A series.",
          pdfUrl: "/pdf/simpple.pdf",
          imageUrl: "/categories/弯梁车/AP110-3A (1.1).png",
          size: "2.9 MB",
          updated: isZh ? "2025年1月" : "Jan 2025",
        },
      ],
      videos: [
        {
          id: "v-ub-1",
          title: isZh ? "弯梁车基础操作指南" : "Underbone Basic Operation",
          description: isZh
            ? "学习如何正确操作和维护弯梁车"
            : "Learn how to correctly operate and maintain underbone models.",
          thumbnail: "/categories/弯梁车/AP110-A PLUS.jpg",
          youtubeId: "S-pUpk_yjZo",
        },
      ],
      images: [
        "/categories/弯梁车/AP110 (1).png",
        "/categories/弯梁车/AP110-2 (1).png",
        "/categories/弯梁车/AP110-3 (1.2).png",
        "/categories/弯梁车/AP110-3A (1.1).png",
        "/categories/弯梁车/AP110-5 (1.2).png",
        "/categories/弯梁车/AP110-A PLUS(白).png",
      ],
    },
    street: {
      title: isZh ? "街车" : isFr ? "Street" : "Street",
      manuals: [
        {
          id: "st-1",
          title: isZh ? "AP125-27 用户手册" : "AP125-27 User Manual",
          description: isZh ? "AP125-27型号完整用户手册。" : "Complete operation handbook for AP125-27.",
          pdfUrl: "/pdf/simpple.pdf",
          imageUrl: "/categories/街车/AP125-27 (1.2).png",
          size: "2.6 MB",
          updated: isZh ? "2025年1月" : "Jan 2025",
        },
        {
          id: "st-2",
          title: isZh ? "AP150X-II 用户手册" : "AP150X-II User Manual",
          description: isZh ? "AP150X-II型号产品手册。" : "Product manual for AP150X-II.",
          pdfUrl: "/pdf/simpple.pdf",
          imageUrl: "/categories/街车/AP150X-II (1.2).png",
          size: "3.0 MB",
          updated: isZh ? "2024年12月" : "Dec 2024",
        },
        {
          id: "st-3",
          title: isZh ? "Z-ONE 170 用户手册" : "Z-ONE 170 User Manual",
          description: isZh ? "Z-ONE 170型号详细维修手册。" : "Detailed service manual for Z-ONE 170.",
          pdfUrl: "/pdf/simpple.pdf",
          imageUrl: "/categories/街车/Z-ONE170（1）.png",
          size: "6.2 MB",
          updated: isZh ? "2024年11月" : "Nov 2024",
        },
      ],
      videos: [
        {
          id: "v-st-1",
          title: isZh ? "街车操作技巧" : "Street Rider Guides",
          description: isZh ? "掌握街车的正确操作技巧" : "Master the basic operations and braking tips.",
          thumbnail: "/categories/街车/Z-ONE170（5）.jpg",
          youtubeId: "JGwWNGJdvx8",
        },
      ],
      images: [
        "/categories/街车/AP125-27 (1.2).png",
        "/categories/街车/AP150X-II (1.2).png",
        "/categories/街车/AP200-27 (1.2).png",
        "/categories/街车/Z-ONE170（1）.png",
      ],
    },
    offroad: {
      title: isZh ? "越野车" : isFr ? "Tout-Terrain" : "Off-Road",
      manuals: [
        {
          id: "or-1",
          title: isZh ? "AP200GY-3 用户手册" : "AP200GY-3 User Manual",
          description: isZh ? "AP200GY-3型号完整用户手册。" : "Complete user manual for AP200GY-3 series.",
          pdfUrl: "/pdf/simpple.pdf",
          imageUrl: "/categories/越野车/AP200GY-3 (1.2).png",
          size: "3.1 MB",
          updated: isZh ? "2025年1月" : "Jan 2025",
        },
        {
          id: "or-2",
          title: isZh ? "AP200GY-7 用户手册" : "AP200GY-7 User Manual",
          description: isZh ? "AP200GY-7型号产品手册。" : "Product manual for AP200GY-7.",
          pdfUrl: "/pdf/simpple.pdf",
          imageUrl: "/categories/越野车/AP200GY-7 (1.2).png",
          size: "3.3 MB",
          updated: isZh ? "2024年12月" : "Dec 2024",
        },
        {
          id: "or-3",
          title: isZh ? "AP200GY-9 用户手册" : "AP200GY-9 User Manual",
          description: isZh ? "AP200GY-9型号详细维修手册。" : "Detailed service manual for AP200GY-9.",
          pdfUrl: "/pdf/simpple.pdf",
          imageUrl: "/categories/越野车/AP200GY-9 (1.2).png",
          size: "6.5 MB",
          updated: isZh ? "2024年10月" : "Oct 2024",
        },
      ],
      videos: [
        {
          id: "v-or-1",
          title: isZh ? "越野车驾驶基础" : "Off-road Maneuvers",
          description: isZh
            ? "越野驾驶的安全注意事项与操作技巧"
            : "Off-road safety tips and gravel control techniques.",
          thumbnail: "/categories/越野车/AP200GY-3 (5).jpg",
          youtubeId: "ScMzIvxBSi4",
        },
      ],
      images: [
        "/categories/越野车/AP200GY-3 (1.2).png",
        "/categories/越野车/AP200GY-7 (1.2).png",
        "/categories/越野车/AP200GY-9 (1.2).png",
      ],
    },
    standard: {
      title: isZh ? "骑士车" : isFr ? "Standard" : "Standard",
      manuals: [
        {
          id: "sd-1",
          title: isZh ? "AP125-12 用户手册" : "AP125-12 User Manual",
          description: isZh ? "AP125-12型号完整用户手册。" : "Standard instructions manual for AP125-12.",
          pdfUrl: "/pdf/simpple.pdf",
          imageUrl: "/categories/骑士车/AP125-12(1.2).png",
          size: "2.8 MB",
          updated: isZh ? "2025年1月" : "Jan 2025",
        },
        {
          id: "sd-2",
          title: isZh ? "AP150-30 用户手册" : "AP150-30 User Manual",
          description: isZh ? "AP150-30型号产品手册。" : "Product manual for AP150-30.",
          pdfUrl: "/pdf/simpple.pdf",
          imageUrl: "/categories/骑士车/AP150-30(1.2).png",
          size: "3.0 MB",
          updated: isZh ? "2025年1月" : "Jan 2025",
        },
        {
          id: "sd-3",
          title: isZh ? "AP125-K 用户手册" : "AP125-K User Manual",
          description: isZh ? "AP125-K型号维修手册。" : "Service manual for AP125-K.",
          pdfUrl: "/pdf/simpple.pdf",
          imageUrl: "/categories/骑士车/AP125-K(1.2).png",
          size: "5.4 MB",
          updated: isZh ? "2024年12月" : "Dec 2024",
        },
        {
          id: "sd-4",
          title: isZh ? "AP125-8 PLUS 用户手册" : "AP125-8 PLUS User Manual",
          description: isZh ? "AP125-8 PLUS型号产品手册。" : "Product manual for AP125-8 PLUS.",
          pdfUrl: "/pdf/simpple.pdf",
          imageUrl: "/categories/骑士车/AP125-8 PLUS (1.1).png",
          size: "2.7 MB",
          updated: isZh ? "2024年11月" : "Nov 2024",
        },
      ],
      videos: [
        {
          id: "v-sd-1",
          title: isZh ? "骑士车维护教程" : "Standard Bike Assembly",
          description: isZh
            ? "学习如何保养您的骑士系列摩托车"
            : "Guides on basic chain lube and air filter replacement.",
          thumbnail: "/categories/骑士车/AP125-12(4).jpg",
          youtubeId: "S-pUpk_yjZo",
        },
      ],
      images: [
        "/categories/骑士车/ALOBA底图.jpg",
        "/categories/骑士车/AP125-12(1.2).png",
        "/categories/骑士车/AP125-19 PLUS (1.2).png",
        "/categories/骑士车/AP125-30 (1.2).png",
        "/categories/骑士车/AP125-8 PLUS (1.1).png",
        "/categories/骑士车/AP125-K(1.2).png",
        "/categories/骑士车/AP150-30(1.2).png",
      ],
    },
    scooter: {
      title: isZh ? "踏板车" : isFr ? "Scooter" : "Scooter",
      manuals: [
        {
          id: "sc-1",
          title: isZh ? "AP125T 用户手册" : "AP125T User Manual",
          description: isZh
            ? "AP125T都市踏板车日常安全驾驶与保修指南。"
            : "Daily safety, assembly, and warranty manual for AP125T.",
          pdfUrl: "/pdf/simpple.pdf",
          imageUrl: "/categories/踏板车/AP125T/AP125T 右侧 精修 橙（2）.png",
          size: "2.8 MB",
          updated: isZh ? "2025年1月" : "Jan 2025",
        },
      ],
      videos: [
        {
          id: "v-sc-1",
          title: isZh ? "踏板车都市通勤保养" : "Scooter Commuter Care",
          description: isZh ? "踏板车日常润滑和电池检查流程" : "Basic battery checking and chain lubrication for scooters.",
          thumbnail: "/categories/踏板车/AP125T/AP125T 右侧 精修 白（2）.png",
          youtubeId: "S-pUpk_yjZo",
        },
      ],
      images: [
        "/categories/踏板车/AP125T/AP125T 右侧 精修 橙（2）.png",
        "/categories/踏板车/AP125T/AP125T 右侧 精修 白（2）.png",
        "/categories/踏板车/AP125T/AP125T 右侧 精修 蓝绿（2）.png",
        "/categories/踏板车/AP125T/AP125T 右侧 精修 黑（2）.png",
      ],
    },
  };
};

export const getLocalizedTricycleData = (locale: string): Record<string, CategoryData> => {
  const isZh = locale === "zh";
  const isFr = locale === "fr";

  return {
    tricycle: {
      title: isZh ? "三轮车" : isFr ? "Tricycle" : "Tricycle",
      manuals: [
        {
          id: "tr-1",
          title: isZh ? "AP150ZH-20 MAX 操作手册" : "AP150ZH-20 MAX Manual",
          description: isZh ? "AP150ZH-20 MAX型号完整操作手册。" : "Complete operation instructions for AP150ZH-20 MAX.",
          pdfUrl: "/pdf/simpple.pdf",
          imageUrl: "/categories/三轮车/AP150ZH-20更新/AP150ZH-20 MAX (1).png",
          size: "3.5 MB",
          updated: isZh ? "2025年1月" : "Jan 2025",
        },
        {
          id: "tr-2",
          title: isZh ? "AP150ZH-175 MAX 用户手册" : "AP150ZH-175 MAX Manual",
          description: isZh ? "AP150ZH-175型号详细手册。" : "Detailed manual for AP150ZH-175.",
          pdfUrl: "/pdf/simpple.pdf",
          imageUrl: "/categories/三轮车/AP150ZH-175 更新/AP150ZH-175 MAX (1).png",
          size: "3.2 MB",
          updated: isZh ? "2024年12月" : "Dec 2024",
        },
        {
          id: "tr-3",
          title: isZh ? "AP200ZH-Q6 用户手册" : "AP200ZH-Q6 Manual",
          description: isZh ? "AP200ZH-Q6型号产品手册。" : "Product manual for AP200ZH-Q6.",
          pdfUrl: "/pdf/simpple.pdf",
          imageUrl: "/categories/三轮车/其他更新/AP200ZH-Q6 (1).png",
          size: "3.8 MB",
          updated: isZh ? "2024年11月" : "Nov 2024",
        },
      ],
      videos: [
        {
          id: "v-tr-1",
          title: isZh ? "三轮车操作与安全" : "Tricycle Safety Guides",
          description: isZh
            ? "大型三轮车的正确驾驶与货物装载安全"
            : "Large tricycle driving controls and weight distribution instructions.",
          thumbnail: "/categories/三轮车/AP150ZH-20更新/AP150ZH-20 MAX (2).jpg",
          youtubeId: "ScMzIvxBSi4",
        },
      ],
      images: [
        "/categories/三轮车/AP150ZH-20更新/AP150ZH-20 MAX (1).png",
        "/categories/三轮车/AP150ZH-175 更新/AP150ZH-175 MAX (1).png",
        "/categories/三轮车/AP150ZH-200更新/AP150ZH-200 (1).png",
        "/categories/三轮车/其他更新/AP150ZH-Q7 (1).png",
        "/categories/三轮车/特殊/AP150ZK (1).png",
      ],
    },
    atv: {
      title: isZh ? "沙滩车" : isFr ? "Quad / ATV" : "ATV",
      manuals: [
        {
          id: "atv-1",
          title: isZh ? "AP150ST-250 用户手册" : "AP150ST-250 User Manual",
          description: isZh
            ? "AP150ST-250 沙滩车使用与安全说明。"
            : "User and safety handbook for AP150ST-250 ATV.",
          pdfUrl: "/pdf/simpple.pdf",
          imageUrl: "/categories/ATV/AP150ST-250 正右侧 投影.png",
          size: "4.2 MB",
          updated: isZh ? "2025年2月" : "Feb 2025",
        },
      ],
      videos: [
        {
          id: "v-atv-1",
          title: isZh ? "沙滩车越野驾驶指导" : "ATV Safe Riding Guides",
          description: isZh
            ? "沙滩车的基本操作技巧和野外行驶安全"
            : "Learn basic operation and off-road driving safety for all-terrain vehicles.",
          thumbnail: "/categories/ATV/AP150ST-250 正右侧 投影.png",
          youtubeId: "ScMzIvxBSi4",
        },
      ],
      images: [
        "/categories/ATV/AP150ST-250 正右侧 投影.png",
        "/categories/ATV/AP150ST-250 正右侧 黑 投影.png",
      ],
    },
  };
};

// Deprecated for backwards compatibility
export const TWO_WHEELER_DATA = getLocalizedTwoWheelerData("zh");
export const TRICYCLE_CATEGORIES = getLocalizedTricycleData("zh");
