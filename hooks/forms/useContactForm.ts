import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { createContactSchema, ContactFormData } from '@/lib/schemas/contact';
import { apiClient, ApiError } from '@/services/api-client';
import { reportError } from '@/lib/error-reporting';

export const useContactForm = () => {
  const t = useTranslations('contact');
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(createContactSchema(t)),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      department: 'general',
      subject: '',
      message: '',
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setSubmitStatus('idle');
    setErrorMessage('');
    try {
      // Send submission to Spring Boot backend contact endpoint
      await apiClient('/contact', {
        method: 'POST',
        body: JSON.stringify(data),
        requiresAuth: false, // Public endpoint
      });
      setSubmitStatus('success');
      reset();
    } catch (error) {
      reportError(error, { form: 'contact' });
      // Surface the backend's actual message when available, matching the
      // pattern already used in useLoginForm, instead of always showing the
      // same generic text regardless of cause.
      setErrorMessage(error instanceof ApiError ? error.message : t('form.genericError'));
      setSubmitStatus('error');
    }
  };

  const resetStatus = () => setSubmitStatus('idle');

  return {
    register,
    errors,
    isSubmitting,
    submitStatus,
    errorMessage,
    onSubmit: handleSubmit(onSubmit),
    resetStatus,
  };
};
