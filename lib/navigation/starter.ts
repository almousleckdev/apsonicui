import type { MenuItem } from './types';
import { newMenuItem } from './tree';

type Names = { en: string; fr: string; zh: string };

const link = (route: string, labels: Names): MenuItem => newMenuItem('ROUTE', { route, labels });
const section = (labels: Names, children: MenuItem[]): MenuItem => newMenuItem('GROUP', { labels, children });

/**
 * What the footer editor starts with before anything was published, so administrators change a footer they can see
 * instead of building one from nothing.
 */
export function starterFooter(): MenuItem[] {
  return [
    section({ en: 'Products', fr: 'Produits', zh: '产品' }, [link('/products', { en: 'All products', fr: 'Tous les produits', zh: '全部产品' })]),
    section({ en: 'Services', fr: 'Services', zh: '服务' }, [link('/services', { en: 'Services', fr: 'Services', zh: '服务' })]),
    section({ en: 'Company', fr: 'Société', zh: '公司' }, [link('/news', { en: 'News', fr: 'Actualités', zh: '新闻' })]),
    section({ en: 'Contact', fr: 'Contact', zh: '联系' }, [link('/contact', { en: 'Contact Us', fr: 'Contact', zh: '联系' })]),
  ];
}
