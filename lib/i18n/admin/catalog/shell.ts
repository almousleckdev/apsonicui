import type { CatalogNode } from '../text';

/** The admin frame: sidebar, header, sign-out, display mode. */
export const shell = {
  nav: {
    dashboard: ['Dashboard', '仪表板'],
    pages: ['Pages', '页面管理'],
    navigation: ['Navigation', '导航管理'],
    homePage: ['Home Page', '主页内容管理'],
    products: ['Products', '产品管理'],
    categories: ['Categories', '产品分类'],
    news: ['News & Media', '新闻管理'],
    trash: ['Trash', '回收站'],
    users: ['Users', '用户管理'],
    notifications: ['Notifications', '通知中心'],
    profile: ['Profile', '个人资料'],
    logout: ['Logout', '登出系统'],
    portal: ['Enterprise Portal', '企业管理门户'],
    openMenu: ['Open menu', '打开菜单'],
    closeMenu: ['Close menu', '关闭菜单'],
  },
  titles: {
    new: ['New item', '新建'],
    edit: ['Edit item', '编辑'],
  },
  header: {
    searchPlaceholder: ['Search dashboard…', '搜索仪表板…'],
    notifications: ['Notifications', '通知'],
  },
  session: {
    verifying: ['Verifying permissions…', '正在验证权限…'],
    signOutTitle: ['Confirm sign out', '确认登出系统'],
    signOutText: ['Are you sure you want to end your current admin session? You will need to sign in again to access the portal.', '确定要结束当前的管理会话吗？您需要重新登录才能访问管理门户。'],
    signOut: ['Sign out', '登出'],
  },
  confirm: {
    typeToConfirm: ['Please type the name below to confirm:', '请输入下方名称以确认：'],
    typePlaceholder: ['Type "{name}" to confirm', '输入“{name}”以确认'],
  },
  display: {
    label: ['Language shown', '显示语言'],
    both: ['Both', '双语'],
    en: ['EN', 'EN'],
    zh: ['中文', '中文'],
    bothHint: ['Show Chinese and English together', '同时显示中文和英文'],
    enHint: ['Show English only', '仅显示英文'],
    zhHint: ['Show Chinese only', '仅显示中文'],
  },
} as const satisfies CatalogNode;
