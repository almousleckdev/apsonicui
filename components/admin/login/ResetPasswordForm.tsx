'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdminAuthCard } from './AdminAuthShell';
import { PasswordInput } from './PasswordInput';
import { useAdminText } from '@/context/AdminTextContext';
import { createResetPasswordSchema, type ResetPasswordFormData } from '@/lib/schemas/auth';
import { authService } from '@/services/auth-service';
import { ApiError } from '@/services/api-client';
import type { AdminKey } from '@/lib/i18n/admin/catalog';

const BAD_REQUEST = 400;

type Stage = 'form' | 'done' | 'invalid';

export const ResetPasswordForm: React.FC<{ token: string }> = ({ token }) => {
  const { parts } = useAdminText();
  const zh = (key: string) => parts(key as AdminKey).zh;
  const [stage, setStage] = useState<Stage>(token ? 'form' : 'invalid');
  const [errorMessage, setErrorMessage] = useState('');

  // The token is a secret: once it is in memory, take it out of the address bar and browser history.
  useEffect(() => {
    if (token) window.history.replaceState(null, '', window.location.pathname);
  }, [token]);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(createResetPasswordSchema((key) => zh(`login.${key}`))),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onSubmit = async ({ password }: ResetPasswordFormData) => {
    setErrorMessage('');
    try {
      await authService.resetPassword(token, password);
      setStage('done');
    } catch (error) {
      // A 400 for a well-formed password means the link itself is spent or expired.
      if (error instanceof ApiError && error.status === BAD_REQUEST) setStage('invalid');
      else setErrorMessage(zh('login.reset.failed'));
    }
  };

  if (stage === 'done') {
    return (
      <AdminAuthCard>
        <div className="relative text-left space-y-4">
          <CheckCircle2 className="w-10 h-10 text-brand-green" />
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">{zh('login.reset.doneTitle')}</h2>
          <p className="text-sm text-gray-300/90">{zh('login.reset.doneText')}</p>
          <Link href="/admin/login" className="block pt-2">
            <Button variant="brand" size="md" className="w-full">{zh('login.reset.goSignIn')}</Button>
          </Link>
        </div>
      </AdminAuthCard>
    );
  }

  if (stage === 'invalid') {
    return (
      <AdminAuthCard>
        <div className="relative text-left space-y-4">
          <AlertCircle className="w-10 h-10 text-red-400" />
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">{zh('login.reset.invalidTitle')}</h2>
          <p className="text-sm text-gray-300/90 leading-relaxed">{zh('login.reset.invalidText')}</p>
          <Link href="/admin/forgot-password" className="block pt-2">
            <Button variant="brand" size="md" className="w-full">{zh('login.reset.requestAgain')}</Button>
          </Link>
        </div>
      </AdminAuthCard>
    );
  }

  return (
    <AdminAuthCard>
      <div className="mb-8 text-left space-y-2">
        <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">{zh('login.reset.title')}</h2>
        <p className="text-sm text-gray-300/90">{zh('login.reset.text')}</p>
      </div>

      {errorMessage && (
        <div role="alert" className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500/40 text-red-200 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <PasswordInput
          label={zh('login.reset.newPassword')}
          placeholder={zh('login.reset.newPasswordPlaceholder')}
          error={errors.password?.message}
          helperText={zh('login.reset.rules')}
          autoComplete="new-password"
          disabled={isSubmitting}
          {...register('password')}
        />
        <PasswordInput
          label={zh('login.reset.confirmPassword')}
          placeholder={zh('login.reset.confirmPasswordPlaceholder')}
          error={errors.confirmPassword?.message}
          autoComplete="new-password"
          disabled={isSubmitting}
          {...register('confirmPassword')}
        />
        <Button type="submit" variant="brand" size="md" loading={isSubmitting} className="w-full">
          {zh(isSubmitting ? 'login.reset.saving' : 'login.reset.save')}
        </Button>
      </form>
    </AdminAuthCard>
  );
};
