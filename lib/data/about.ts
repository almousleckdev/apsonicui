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

export const getLocalizedStories = (locale: string): Story[] => {
  const isZh = locale === "zh";
  const isFr = locale === "fr";
  return [
    {
      name: "Kwame Mensah",
      role: isZh ? "物流企业家，加纳" : isFr ? "Entrepreneur en Logistique, Ghana" : "Logistics Entrepreneur, Ghana",
      quote: isZh 
        ? "标准摩托车无法应对通往北部农场的碎石路。Apsonic的悬挂系统改变了我的业务。我从一辆摩托车发展到了十辆的车队。"
        : isFr 
        ? "Les motos standard ne pouvaient pas faire face aux routes gravillonnées menant aux fermes du nord. La suspension d'Apsonic a changé mon entreprise. Je suis passé d'une moto à une flotte de dix."
        : "Standard motorcycles couldn't cope with the gravel roads leading to the northern farms. Apsonic's suspension changed my business. I grew from one motorcycle to a fleet of ten.",
      image: "/images/about/envato-labs-image-edit (1)E.png",
    },
    {
      name: "Amara Diop",
      role: isZh ? "医护人员，塞内加尔" : isFr ? "Agent de Santé, Sénégal" : "Healthcare Worker, Senegal",
      quote: isZh
        ? "可靠性对我来说不是奢侈品；它关乎生死。当我需要到达偏远村庄时，我只信任一台引擎启动。"
        : isFr
        ? "La fiabilité n'est pas un luxe pour moi; c'est une question de vie ou de mort. Quand je dois me rendre dans des villages reculés, je ne fais confiance qu'à un moteur qui démarre à chaque fois."
        : "Reliability is not a luxury for me; it's a matter of life and death. When I need to reach remote villages, I only trust an engine that starts every time.",
      image: "/images/about/WechatIMG5212.jpg",
    },
    {
      name: "Chidi Okafor",
      role: isZh ? "市场商人，尼日利亚" : isFr ? "Marchand de Marché, Nigeria" : "Market Merchant, Nigeria",
      quote: isZh
        ? "燃料价格波动，但我的Apsonic效率保持稳定。它是保持我利润空间健康的合作伙伴。"
        : isFr
        ? "Les prix du carburant fluctuent, mais l'efficacité de mon Apsonic reste stable. C'est un partenaire qui maintient mes marges bénéficiaires en bonne santé."
        : "Fuel prices fluctuate, but my Apsonic's efficiency remains stable. It's a partner that keeps my profit margins healthy.",
      image: "/images/about/WechatIMG5213 (1).jpg",
    },
  ];
};

// Deprecated static stories for backwards compatibility
export const stories = getLocalizedStories("zh");


export const coreValues = [
  {
    id: "quality",
    title: "精益求精的品质",
    description:
      "我们不偷工减料。每个螺栓、齿轮和底盘都经过测试，能够承受最恶劣的非洲路况。",
    iconName: "MdVerified",
  },
  {
    id: "community",
    title: "社区优先",
    description:
      "当我们的骑手成长时，我们也在成长。我们的成功通过我们赋能的企业和家庭来衡量。",
    iconName: "MdGroups",
  },
  {
    id: "sustainability",
    title: "可持续未来",
    description: "致力于通过更清洁的发动机技术和负责任的制造来减少排放。",
    iconName: "MdEco",
  },
  {
    id: "partnership",
    title: "值得信赖的伙伴关系",
    description: "通过透明度和支持，与我们的经销商网络和客户建立持久的关系。",
    iconName: "MdHandshake",
  },
];

export const videos = [
  {
    id: "1",
    title: "闪耀非洲杯 · 品牌荣耀时刻",
    description:
      "作为非洲杯官方全球合作伙伴，APSONIC用一支震撼人心的广告片，向世界展示了品牌的力量与承诺。从赛场到街头，从梦想到现实，我们与非洲大陆共同书写着激情与荣耀的篇章。",
    videoUrl: "/videos/APSONIC_TVC_30s_compressed.mp4",
    thumbnail: "/images/news/非洲杯大屏幕3.png",
  },
  {
    id: "2",
    title: "飞书时代 · 数字化转型之路",
    description:
      "在数字化浪潮中，APSONIC携手飞书，开启企业管理的新纪元。通过创新的协作方式和高效的沟通平台，我们不仅提升了内部运营效率，更将这份数字化的力量传递给每一位合作伙伴。",
    videoUrl: "/videos/APSONIC_TVC_30s_compressed.mp4",
    thumbnail: "/images/about/envato-labs-image-edit (38).png",
  },
  {
    id: "3",
    title: "品牌故事 · 好质量 好生活",
    description:
      "二十年深耕非洲，APSONIC始终坚守'好质量 好生活'的品牌理念。这支广告片记录了我们与非洲人民并肩前行的点点滴滴，见证了无数梦想因可靠的品质而照进现实。",
    videoUrl: "/videos/APSONIC_TVC_30s_compressed.mp4",
    thumbnail: "/images/about/VII_3219__10970165.jpg",
  },
];

export const timelineEvents: TimelineEvent[] = [
  {
    year: "2005",
    title: "品牌应运而生",
    description: 'APSONIC诞生于多哥洛美，赋予"好质量，好生活"品牌理念。',
    iconName: "MdTimeline",
    image: "/timeline/2005.jpg",
  },
  {
    year: "2006",
    title: "筑梦君子之国",
    description: "APSONIC进军布吉纳法索，并开始辐射周边国家。",
    iconName: "MdPublic",
    image: "/timeline/2006.jpg",
  },
  {
    year: "2009",
    title: "涉足黄金海岸",
    description: "APSONIC开拓加纳市场，由北向南布局加纳全国市场。",
    iconName: "MdTrendingUp",
    image: "/timeline/2009.jpg",
  },
  {
    year: "2009",
    title: "席卷西非市场",
    description:
      "APSONIC骑士车AP125-30(ALOBA)及APSONIC三轮车正式量产投放，迅速席卷西非市场，成为非洲最受欢迎的交通工具。同年进驻布基纳法索南部波波迪乌拉索区域。",
    iconName: "MdRocketLaunch",
    image: "/timeline/2009.jpg",
  },
  {
    year: "2011",
    title: "畅游鳄鱼之河",
    description: "APSONIC进驻马里，继续开拓西非内陆国家市场。",
    iconName: "MdPublic",
    image: "/timeline/2011.jpg",
  },
  {
    year: "2012",
    title: "破浪象牙海岸",
    description: "APSONIC开拓科特迪瓦市场，由中部向四周辐射。",
    iconName: "MdPublic",
    image: "/timeline/2012.jpg",
  },
  {
    year: "2012",
    title: "涉猎户外越野",
    description: "APSONIC越野车200GY-3亮相户外。",
    iconName: "MdFlashOn",
    image: "/timeline/2012.jpg",
  },
  {
    year: "2013",
    title: "首家工厂投产",
    description:
      "APSONIC 首座组装工厂在布吉纳法索首都瓦加杜古顺利投产，产能效率大幅提升。",
    iconName: "MdLocalGasStation",
    image: "/timeline/2013.jpg",
  },
  {
    year: "2014",
    title: "远赴西非绿肺",
    description: "APSONIC进驻经济重镇锡卡索地区。",
    iconName: "MdPublic",
    image: "/timeline/2014.jpg",
  },
  {
    year: "2015",
    title: "梦绕油棕之国",
    description: "APSONIC进军贝宁市场。",
    iconName: "MdPublic",
    image: "/timeline/2015.jpg",
  },
  {
    year: "2017",
    title: "售后战役打响",
    description: 'APSONIC正式启动"售后服务万里行活动"。',
    iconName: "MdHandshake",
    image: "/timeline/2017.jpg",
  },
  {
    year: "2018",
    title: "服务全域覆盖",
    description: "APSONIC专业售后服务网点达800余个。",
    iconName: "MdGroups",
    image: "/timeline/2016.jpg",
  },
  {
    year: "2019",
    title: "矢志科技研发",
    description: "APSONIC模拟非洲工况和用户使用习惯的新技术中心投入使用。",
    iconName: "MdSpeed",
    image: "/timeline/2019.jpg",
  },
  {
    year: "2020",
    title: "开启东非序幕",
    description: "APSONIC正式肯尼亚市场，开启东非市场序幕。",
    iconName: "MdPublic",
    image: "/timeline/2020.jpg",
  },
  {
    year: "2021",
    title: "首创销量纪录",
    description: "APSONIC 在非洲销售超两百万台。",
    iconName: "MdTrendingUp",
    image: "/timeline/2021.jpg",
  },
  {
    year: "2023",
    title: "闪耀非洲杯",
    description:
      "与非洲足球联合会达成战略合作，成为全球摩托车行业首家非洲杯官方合作伙伴。",
    iconName: "MdVerified",
    image: "/timeline/2024.jpg",
  },
  {
    year: "2024",
    title: "东西并进",
    description:
      "在西非，正式进驻塞内加尔，毛里塔尼亚。在东非，完成了坦桑尼亚、乌干达的市场调研。",
    iconName: "MdPublic",
    image: "/timeline/2024.jpg",
  },
  {
    year: "2025",
    title: "再耀非洲杯",
    description:
      "成为第35届和第36届非洲杯官方全球合作伙伴，成为全球唯一连续三届赞助该项级洲际足球赛事的摩托车品牌。",
    iconName: "MdVerified",
    image: "/timeline/2025.jpg",
  },
];

export const engineeringFeatures = [
  {
    id: "fuel",
    title: "燃油效率",
    value: "65 公里/升",
    description: "优化的燃烧室，实现每升最大里程。",
    iconName: "MdLocalGasStation",
  },
  {
    id: "suspension",
    title: "悬挂系统",
    value: "双弹簧",
    description: "加强的后减震器，针对崎岖地形校准。",
    iconName: "MdFlashOn",
  },
  {
    id: "load",
    title: "载重能力",
    value: "250 公斤+",
    description: "专为商业物流打造的重型底盘框架。",
    iconName: "MdSpeed",
  },
];
