'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useAdminText } from '@/context/AdminTextContext';
import { ADMIN_AUTH_CONSTANTS } from '@/lib/constants/auth';

export const AdminLoginHero: React.FC = () => {
  const { parts } = useAdminText();

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="lg:col-span-7 flex flex-col justify-center space-y-6 text-left"
    >
      <div className="space-y-4">
        <span className="inline-block px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-brand-green bg-brand-green/10 border border-brand-green/20 rounded-full backdrop-blur-md">
          {ADMIN_AUTH_CONSTANTS.BRAND_NAME} {parts('login.portalBadge').zh}
        </span>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight drop-shadow-lg">
          {parts('login.slogan').zh}
        </h1>
      </div>
    </motion.div>
  );
};
