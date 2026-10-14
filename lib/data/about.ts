import { getLocalizedStories } from './about/stories';

export interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  iconName: string;
  image?: string;
}

export interface Story {
  name: string;
  role: string;
  quote: string;
  image: string;
}

export { getLocalizedStories };

export const getLocalizedTimeline = (locale: string): TimelineEvent[] => {
  const isZh = locale === 'zh';
  const isFr = locale === 'fr';

  return [
    {
      year: '2005',
      title: isZh ? '品牌创立' : isFr ? 'Fondation de la marque' : 'Brand Inception',
      description: isZh
        ? 'APSONIC 品牌正式成立，专注于为非洲复杂路况设计高耐久度摩托车。'
        : isFr
        ? 'La marque APSONIC est créée pour fournir des motos haute durabilité.'
        : 'APSONIC brand established to engineer durable motorcycles for African terrains.',
      iconName: 'Sparkles',
      image: '/images/about/envato-labs-image-edit (1)E.png',
    },
    {
      year: '2012',
      title: isZh ? '西非服务网络扩张' : isFr ? 'Expansion du réseau' : 'West Africa Expansion',
      description: isZh
        ? '服务网络拓展至加纳、多哥、贝宁及马里，建立完善的零配件保障体系。'
        : isFr
        ? 'Extension du réseau de distribution au Ghana, au Togo et au Bénin.'
        : 'Distribution network expanded across Ghana, Togo, Benin, and Mali.',
      iconName: 'Globe',
      image: '/images/about/WechatIMG5212.jpg',
    },
    {
      year: '2025',
      title: isZh ? '智能与新能源转型' : isFr ? 'Innovation Électrique' : 'Innovation & EV Transition',
      description: isZh
        ? '推出新一代高效发动机与新能源三轮车产品线，全面升级售后体验。'
        : isFr
        ? 'Lancement de nouvelles gammes de tricyle et d\'innovations technologiques.'
        : 'Launching next-generation high-efficiency engines and EV cargo solutions.',
      iconName: 'Award',
      image: '/images/about/WechatIMG5213 (1).jpg',
    },
  ];
};
