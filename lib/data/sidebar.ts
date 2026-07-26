// Sidebar icons config - static, no backend needed
export interface SidebarIconConfig {
  id: string;
  iconName: 'help' | 'chat' | 'location';
  label: string;
  onClick?: () => void;
  href?: string;
}

export const SIDEBAR_ICONS: SidebarIconConfig[] = [
  {
    id: 'help',
    iconName: 'help',
    label: 'Help',
    href: '/contact',
  },
  /* {
    id: 'chat',
    iconName: 'chat',
    label: 'AI Chat',
    onClick: () => {
      // Handled in RightSidebar component
    },
  }, */
  {
    id: 'location',
    iconName: 'location',
    label: 'Store Locator',
    href: '/services/locations',
  },
];

