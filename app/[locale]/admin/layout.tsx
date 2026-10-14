'use client';

import React from 'react';
import { NextIntlClientProvider } from 'next-intl';
import zhMessages from '@/messages/zh.json';

// The admin portal is always Chinese regardless of the public site locale.
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <NextIntlClientProvider locale="zh" messages={zhMessages}>
      {children}
    </NextIntlClientProvider>
  );
}
