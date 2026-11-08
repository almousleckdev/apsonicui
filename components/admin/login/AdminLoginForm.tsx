'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAdminText } from '@/context/AdminTextContext';
import { Mail, AlertCircle } from 'lucide-react';
import { useLoginForm } from '@/hooks/useLoginForm';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PasswordInput } from './PasswordInput';

export const AdminLoginForm: React.FC = () => {
  const { register, errors, errorMessage, isSubmitting, onSubmit } = useLoginForm();
  const { parts } = useAdminText();
  const zh = (key: Parameters<typeof parts>[0]) => parts(key).zh;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
      className="lg:col-span-5 w-full max-w-md mx-auto lg:ml-auto"
    >
      <div className="backdrop-blur-2xl bg-neutral-950/65 border border-white/15 shadow-2xl rounded-3xl p-8 sm:p-10 relative overflow-hidden">
        {/* Ambient Glow Accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-green/15 rounded-full blur-3xl pointer-events-none" />

        {/* Form Title Header */}
        <div className="mb-8 text-left">
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">{zh('login.title')}</h2>
        </div>

        {/* Global Error Banner */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500/40 text-red-200 text-xs flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={onSubmit} className="space-y-6" noValidate>
          {/* Email / Username Field */}
          <Input
            label={zh('login.emailLabel')}
            placeholder={zh('login.emailPlaceholder')}
            error={errors.usernameOrEmail?.message}
            icon={<Mail className="w-5 h-5" />}
            variant="dark"
            disabled={isSubmitting}
            {...register('usernameOrEmail')}
          />

          {/* Password Field */}
          <div className="space-y-2">
            <PasswordInput
              label={zh('login.passwordLabel')}
              placeholder={zh('login.passwordPlaceholder')}
              error={errors.password?.message}
              autoComplete="current-password"
              disabled={isSubmitting}
              {...register('password')}
            />
            <div className="text-right">
              <Link href="/admin/forgot-password" className="text-xs font-semibold text-white/70 hover:text-brand-green transition-colors">
                {zh('login.forgotLink')}
              </Link>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="brand"
            size="md"
            loading={isSubmitting}
            className="w-full"
          >
            {zh(isSubmitting ? 'login.loading' : 'login.submit')}
          </Button>
        </form>
      </div>
    </motion.div>
  );
};
