import type { CategoryData } from '../service-detail-data';

export const getLocalizedTricycleData = (locale: string): Record<string, CategoryData> => {
  const isZh = locale === 'zh';
  const isFr = locale === 'fr';

  return {
    cargo: {
      title: isZh ? '货运三轮车' : isFr ? 'Tricycle Cargo' : 'Cargo Tricycle',
      manuals: [
        {
          id: 'tc-1',
          title: isZh ? 'AP150ZH 货运三轮车手册' : 'AP150ZH Cargo Tricycle Manual',
          description: isZh
            ? '包含载重规范、后桥保养及货箱维保指南。'
            : 'Covers load capacities, rear axle servicing, and cargo box maintenance.',
          pdfUrl: '/pdf/simpple.pdf',
          imageUrl: '/categories/三轮车/AP150ZH(1.2).png',
          size: '4.2 MB',
          updated: isZh ? '2025年1月' : 'Jan 2025',
        },
      ],
      videos: [],
      images: [
        '/categories/三轮车/AP150ZH(1.2).png',
        '/categories/三轮车/AP200ZH(1.2).png',
      ],
    },
  };
};
