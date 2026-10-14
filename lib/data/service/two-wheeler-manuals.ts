import type { CategoryData } from '../service-detail-data';

export const getLocalizedTwoWheelerData = (locale: string): Record<string, CategoryData> => {
  const isZh = locale === 'zh';
  const isFr = locale === 'fr';

  return {
    underbone: {
      title: isZh ? '弯梁车' : isFr ? 'Underbone' : 'Underbone',
      manuals: [
        {
          id: 'ub-1',
          title: isZh ? 'AP110-A PLUS 用户手册' : 'AP110-A PLUS User Manual',
          description: isZh
            ? 'AP110-A PLUS型号完整用户手册，包含操作指南 and 维护说明。'
            : 'Complete user manual for AP110-A PLUS, including operation and maintenance guidelines.',
          pdfUrl: '/pdf/simpple.pdf',
          imageUrl: '/categories/弯梁车/AP110-A PLUS(白).png',
          size: '2.4 MB',
          updated: isZh ? '2025年1月' : 'Jan 2025',
        },
        {
          id: 'ub-2',
          title: isZh ? 'AP110-3 用户手册' : 'AP110-3 User Manual',
          description: isZh
            ? 'AP110-3型号详细手册，包含操作说明与日常维护。'
            : 'Detailed manual for AP110-3, outlining operation and regular maintenance.',
          pdfUrl: '/pdf/simpple.pdf',
          imageUrl: '/categories/弯梁车/AP110-3 (1).png',
          size: '2.1 MB',
          updated: isZh ? '2024年12月' : 'Dec 2024',
        },
      ],
      videos: [
        {
          id: 'v-ub-1',
          title: isZh ? '弯梁车日常维护教程' : 'Underbone Daily Maintenance Guide',
          description: isZh
            ? '学习如何检查机油、链条张紧度及轮胎气压。'
            : 'Learn how to inspect engine oil, chain tension, and tire pressure.',
          thumbnail: '/categories/弯梁车/AP110-A PLUS(红).png',
          youtubeId: 'dQw4w9WgXcQ',
        },
      ],
      images: [
        '/categories/弯梁车/AP110-A PLUS(白).png',
        '/categories/弯梁车/AP110-A PLUS(红).png',
        '/categories/弯梁车/AP110-A PLUS(蓝).png',
      ],
    },
    standard: {
      title: isZh ? '骑士车' : isFr ? 'Motocyclette' : 'Standard Motorcycle',
      manuals: [
        {
          id: 'st-1',
          title: isZh ? 'AP125-30 用户手册' : 'AP125-30 User Manual',
          description: isZh
            ? 'AP125-30骑士车完整技术与操作指南。'
            : 'Complete technical and operational guide for AP125-30 standard motorcycle.',
          pdfUrl: '/pdf/simpple.pdf',
          imageUrl: '/categories/骑士车/AP125-30 (1.2).png',
          size: '3.1 MB',
          updated: isZh ? '2025年2月' : 'Feb 2025',
        },
      ],
      videos: [],
      images: [
        '/categories/骑士车/AP125-30 (1.2).png',
        '/categories/骑士车/AP150-30(1.2).png',
      ],
    },
  };
};
