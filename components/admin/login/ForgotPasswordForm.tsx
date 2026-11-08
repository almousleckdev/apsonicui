'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, AlertCircle, MailCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AdminAuthCard } from './AdminAuthShell';
import { useAdminText } from '@/context/AdminTextContext';
import { createForgotPasswordSchema, type ForgotPasswordFormData } from '@/lib/schemas/auth';
import { authService } from '@/services/auth-service';
import { ApiError } from '@/services/api-client';
import type { AdminKey } from '@/lib/i18n/admin/catalog';

const TOO_MANY_REQUESTS = 429;

export const ForgotPasswordForm: React.FC = () => {
  const { parts } = useAdminText();
  const zh = (key: string) => parts(key as AdminKey).zh;
  const [sent, setSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(createForgotPasswordSchema((key) => zh(`login.${key}`))),
    defaultValues: { email: '' },
  });

  const onSubmit = async ({ email }: ForgotPasswordFormData) => {
    setErrorMessage('');
    try {
      await authService.forgotPassword(email.trim());
      setSent(true);
    } catch (error) {
      const tooMany = error instanceof ApiError && error.status === TOO_MANY_REQUESTS;
      setErrorMessage(zh(tooMany ? 'login.forgot.tooMany' : 'login.forgot.failed'));
    }
  };

  return (
    <AdminAuthCard>
      {sent ? (
        <div className="relative text-left space-y-4">
          <MailCheck className="w-10 h-10 text-brand-green" />
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">{zh('login.forgot.sentTitle')}</h2>
          <p className="text-sm text-gray-300/90 leading-relaxed">{zh('login.forgot.sentText')}</p>
          <Link href="/admin/login" className="inline-block text-sm font-semibold text-brand-green hover:underline pt-2">
            {zh('login.forgot.back')}
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-8 text-left space-y-2">
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">{zh('login.forgot.title')}</h2>
            <p className="text-sm text-gray-300/90 leading-relaxed">{zh('login.forgot.text')}</p>
          </div>

          {errorMessage && (
            <div role="alert" className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500/40 text-red-200 text-xs flex items-center gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            <Input
              type="email"
              label={zh('login.emailLabel')}
              placeholder={zh('login.emailPlaceholder')}
              error={errors.email?.message}
              icon={<Mail className="w-5 h-5" />}
              variant="dark"
              autoComplete="email"
              disabled={isSubmitting}
              {...register('email')}
            />
            <Button type="submit" variant="brand" size="md" loading={isSubmitting} className="w-full">
              {zh(isSubmitting ? 'login.forgot.sending' : 'login.forgot.send')}
            </Button>
            <div className="text-center">
              <Link href="/admin/login" className="text-sm text-white/70 hover:text-white transition-colors">
                {zh('login.forgot.back')}
              </Link>
            </div>
          </form>
        </>
      )}
    </AdminAuthCard>
  );
};
