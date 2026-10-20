'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useAdminText } from '@/context/AdminTextContext';

interface AdminBackNavProps {
  href?: string;
  onBack?: () => void;
  className?: string;
}

export const AdminBackNav: React.FC<AdminBackNavProps> = ({
  href,
  onBack,
  className,
}) => {
  const router = useRouter();
  const { t } = useAdminText();

  const handleClick = () => {
    if (onBack) {
      onBack();
    } else if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  if (href && !onBack) {
    return (
      <Link
        href={href}
        className={`p-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-2xl transition-colors cursor-pointer inline-flex items-center justify-center ${className || ''}`}
        aria-label={t('back')}
      >
        <ArrowLeft className="w-5 h-5" />
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`p-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-2xl transition-colors cursor-pointer inline-flex items-center justify-center ${className || ''}`}
      aria-label={t('back')}
    >
      <ArrowLeft className="w-5 h-5" />
    </button>
  );
};
