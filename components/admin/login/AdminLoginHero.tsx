'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ArrowLeft } from 'lucide-react';
import { ADMIN_AUTH_CONSTANTS, BRAND_TAGLINE_ZH } from '@/lib/constants/auth';

export const AdminLoginHero: React.FC = () => {
  const t = useTranslations('auth');

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="lg:col-span-7 flex flex-col justify-center space-y-6 text-left"
    >
      {/* Brand Badge */}
      <div className="space-y-4">
        <span className="inline-block px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-brand-green bg-brand-green/10 border border-brand-green/20 rounded-full backdrop-blur-md">
          {ADMIN_AUTH_CONSTANTS.BRAND_NAME} {t('portalBadge')}
        </span>

        {/* Hero Slogan (translated) */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight drop-shadow-lg">
          {t('slogan')}
        </h1>
      </div>

      {/* Navigation Return Link */}
      <div className="pt-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-white/70 hover:text-white transition-colors bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-2.5 rounded-full border border-white/10 shadow-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('backToHome')}</span>
        </Link>
      </div>
    </motion.div>
  );
};
