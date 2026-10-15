import type { CatalogNode } from '../text';

/** The administrator sign-in page. */
export const login = {
  login: {
    portalBadge: ['Enterprise portal', '企业门户'],
    slogan: ['Good quality, good life', '好质量 好生活'],
    title: ['Welcome back', '欢迎回来'],
    subtitle: ['Sign in to manage the website', '登录以管理网站'],
    emailLabel: ['Email', '电子邮箱'],
    emailPlaceholder: ['Enter your email', '请输入邮箱'],
    passwordLabel: ['Password', '密码'],
    passwordPlaceholder: ['Enter your password', '请输入密码'],
    submit: ['Sign in', '登录'],
    loading: ['Signing in…', '登录中…'],
    backToHome: ['← Back to the homepage', '← 返回官方主页'],
    validation: {
      usernameRequired: ['Email or username is required', '请输入邮箱或用户名'],
      passwordMinLength: ['Password must be at least 6 characters', '密码至少需要 6 个字符'],
    },
    errors: {
      invalidCredentials: ['Invalid credentials, please check and try again', '账号或密码有误，请检查后重试'],
      connectionError: ['Unable to connect to the server, please try again', '无法连接服务器，请重试'],
    },
  },
} as const satisfies CatalogNode;
