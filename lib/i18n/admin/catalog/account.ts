import type { CatalogNode } from '../text';

/** The administrator's own profile. */
export const account = {
  profile: {
    title: ['Admin profile settings', '管理员个人设置'],
    subtitle: ['Manage your administrator credentials, personal details, profile picture and account security.', '管理您的管理员凭据、个人资料、头像和账号安全。'],
    loading: ['Loading profile details…', '正在加载个人资料…'],
    personal: ['Personal information', '个人信息'],
    firstName: ['First name', '名'],
    lastName: ['Last name', '姓'],
    username: ['Username', '用户名'],
    email: ['Email address', '邮箱地址'],
    security: ['Security & password', '安全与密码'],
    currentPassword: ['Current password', '当前密码'],
    newPassword: ['New password', '新密码'],
    confirmPassword: ['Confirm new password', '确认新密码'],
    change: ['Change', '更换'],
    avatarHint: ['Click the picture to upload a new one from your computer. It is saved automatically.', '点击头像可从电脑上传新图片，会自动保存。'],
    avatarAlt: ['Admin avatar', '管理员头像'],
    save: ['Save changes', '保存更改'],
    avatarSaved: ['Profile picture updated and saved.', '头像已更新并保存。'],
    avatarFailed: ['Failed to process the profile picture.', '处理头像失败。'],
    needCurrent: ['Please enter your current password to set a new password.', '设置新密码需要先输入当前密码。'],
    mismatch: ['The new password and its confirmation do not match.', '两次输入的新密码不一致。'],
    saved: ['Profile details and security settings saved.', '个人资料和安全设置已保存。'],
    saveFailed: ['Failed to update the profile.', '更新个人资料失败。'],
  },
} as const satisfies CatalogNode;
