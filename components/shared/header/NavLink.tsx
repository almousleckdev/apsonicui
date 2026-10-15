'use client';

import React from 'react';
import { Link } from '@/lib/i18n/navigation';

interface Props extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href: string;
  external?: boolean;
  newTab?: boolean;
}

/** Internal paths keep the visitor's language prefix; web, mail and phone links are plain anchors. */
export function NavLink({ href, external, newTab, children, ...rest }: Props) {
  if (!external && href.startsWith('/')) {
    return <Link href={href} {...rest}>{children}</Link>;
  }
  const web = /^https?:\/\//i.test(href);
  return (
    <a href={href} {...rest} {...(web || newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
      {children}
    </a>
  );
}
