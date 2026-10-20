'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { createTranslator } from 'next-intl';
import { adminCatalog, type AdminKey } from '@/lib/i18n/admin/catalog';
import { BUILDER_GLOSSARY } from '@/lib/i18n/admin/glossary/builder';
import { ADMIN_TEXT_COOKIE, splitCatalog, type AdminTextMode } from '@/lib/i18n/admin/text';

type Values = Record<string, string | number>;

/** One admin string in both languages. */
export interface BilingualText {
  en: string;
  zh: string;
}

interface AdminTextValue {
  mode: AdminTextMode;
  setMode: (mode: AdminTextMode) => void;
  /** Both versions of a string, for components that lay them out themselves. */
  parts: (key: AdminKey, values?: Values) => BilingualText;
  /** Chinese for a text that comes from the server in English (page-builder field labels...); English when unknown. */
  server: (english: string) => BilingualText;
  /** The same as {@link server}, as one plain string. */
  tServer: (english: string) => string;
  /** One plain string for places that cannot show markup (placeholders, tooltips, toasts): "中文 / English" per the display mode. */
  t: (key: AdminKey, values?: Values) => string;
}

const AdminTextContext = createContext<AdminTextValue | null>(null);

const messages = splitCatalog(adminCatalog);
const translators = {
  en: createTranslator({ locale: 'en', messages: messages.en }),
  zh: createTranslator({ locale: 'zh', messages: messages.zh }),
};

/** Joins the two versions according to the display mode. Exported for tests and for code outside React. */
export function joinText(text: BilingualText, mode: AdminTextMode): string {
  if (mode === 'en') return text.en;
  if (mode === 'zh') return text.zh;
  return text.zh === text.en ? text.en : `${text.zh} / ${text.en}`;
}

export function AdminTextProvider({ initialMode, children }: { initialMode: AdminTextMode; children: React.ReactNode }) {
  const [mode, setModeState] = useState<AdminTextMode>(initialMode);

  // Modals and menus are drawn outside the admin frame, so the mode also lives on <html> where the CSS reads it.
  useEffect(() => {
    document.documentElement.dataset.adminText = mode;
    return () => { delete document.documentElement.dataset.adminText; };
  }, [mode]);

  const setMode = useCallback((next: AdminTextMode) => {
    setModeState(next);
    document.cookie = `${ADMIN_TEXT_COOKIE}=${next}; path=/; max-age=31536000; SameSite=Lax`;
  }, []);

  const value = useMemo<AdminTextValue>(() => {
    const parts = (key: AdminKey, values?: Values): BilingualText => ({
      en: translators.en(key as never, values as never) as string,
      zh: translators.zh(key as never, values as never) as string,
    });
    const server = (english: string): BilingualText => ({ en: english, zh: BUILDER_GLOSSARY[english] || english });
    return { mode, setMode, parts, server, tServer: (english) => joinText(server(english), mode), t: (key, values) => joinText(parts(key, values), mode) };
  }, [mode, setMode]);

  return <AdminTextContext.Provider value={value}>{children}</AdminTextContext.Provider>;
}

export function useAdminText(): AdminTextValue {
  const value = useContext(AdminTextContext);
  if (!value) throw new Error('useAdminText must be used inside the admin layout');
  return value;
}
