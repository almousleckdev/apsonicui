import type { Story } from '../about';

export const getLocalizedStories = (locale: string): Story[] => {
  const isZh = locale === 'zh';
  const isFr = locale === 'fr';
  return [
    {
      name: 'Kwame Mensah',
      role: isZh ? '物流企业家，加纳' : isFr ? 'Entrepreneur en Logistique, Ghana' : 'Logistics Entrepreneur, Ghana',
      quote: isZh
        ? '标准摩托车无法应对通往北部农场的碎石路。Apsonic的悬挂系统改变了我的业务。我从一辆摩托车发展到了十辆的车队。'
        : isFr
        ? "Les motos standard ne pouvaient pas faire face aux routes gravillonnées menant aux fermes du nord. La suspension d'Apsonic a changé mon entreprise."
        : "Standard motorcycles couldn't cope with the gravel roads. Apsonic's suspension changed my business.",
      image: '/images/about/envato-labs-image-edit (1)E.png',
    },
    {
      name: 'Amara Diop',
      role: isZh ? '医护人员，塞内加尔' : isFr ? 'Agent de Santé, Sénégal' : 'Healthcare Worker, Senegal',
      quote: isZh
        ? '可靠性对我来说不是奢侈品；它关乎生死。当我需要到达偏远村庄时，我只信任一台引擎启动。'
        : isFr
        ? "La fiabilité n'est pas un luxe pour moi; c'est une question de vie ou de mort."
        : "Reliability is not a luxury for me; it's a matter of life and death.",
      image: '/images/about/WechatIMG5212.jpg',
    },
  ];
};
