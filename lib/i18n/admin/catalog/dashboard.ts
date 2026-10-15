import type { CatalogNode } from '../text';

export const dashboard = {
  dashboard: {
    title: ['Dashboard overview', '仪表板概览'],
    refresh: ['Refresh stats', '刷新数据'],
    quickActions: ['Quick actions', '快捷操作'],
    cards: {
      products: ['Product models', '产品型号'],
      categories: ['Product series', '产品系列'],
      news: ['News & articles', '新闻与文章'],
      users: ['User accounts', '用户账号'],
    },
    homeTitle: ['Edit the main page', '编辑主页'],
    homeText: ['Set the hero banner, featured models and testimonials.', '设置首页横幅、精选车型和客户评价。'],
    productsTitle: ['Manage products', '管理产品'],
    productsText: ['Add or edit motorcycle models and specifications.', '添加或编辑摩托车型号及技术参数。'],
    categoriesTitle: ['Manage categories', '管理分类'],
    categoriesText: ['Organise motorcycle lines and category photos.', '整理摩托车系列和分类图片。'],
  },
} as const satisfies CatalogNode;
