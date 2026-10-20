'use client';

import React from 'react';
import { NextIntlClientProvider } from 'next-intl';
import zhMessages from '@/messages/zh.json';
import { AdminTextProvider } from '@/context/AdminTextContext';
import type { AdminTextMode } from '@/lib/i18n/admin/text';

/**
 * Everything the admin portal needs from its layout. The shared site components that appear in the admin read the
 * Chinese site messages; the admin's own text comes from the bilingual catalog (see AdminTextContext).
 */
export function AdminProviders({ initialMode, children }: { initialMode: AdminTextMode; children: React.ReactNode }) {
  return (
    <NextIntlClientProvider locale="zh" messages={zhMessages}>
      <AdminTextProvider initialMode={initialMode}>
        <div data-admin-text={initialMode} className="contents">{children}</div>
      </AdminTextProvider>
    </NextIntlClientProvider>
  );
}
