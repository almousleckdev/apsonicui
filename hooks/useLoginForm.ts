import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { createLoginSchema, type LoginFormData } from '@/lib/schemas/auth';
import { useAuth } from './useAuth';
import { ApiError } from '@/services/api-client';

export const useLoginForm = () => {
  const router = useRouter();
  const { login } = useAuth();
  const t = useTranslations('auth');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(createLoginSchema(t)),
    defaultValues: {
      usernameOrEmail: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setErrorMessage('');

    try {
      await login({
        usernameOrEmail: data.usernameOrEmail,
        password: data.password,
        rememberMe: data.rememberMe,
      });

      router.push('/admin/dashboard');
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message || t('errors.invalidCredentials'));
      } else {
        setErrorMessage(t('errors.connectionError'));
      }
    }
  };

  return {
    register,
    errors,
    errorMessage,
    isSubmitting,
    onSubmit: handleSubmit(onSubmit),
  };
};
