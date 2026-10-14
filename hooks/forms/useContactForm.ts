import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { createContactSchema, ContactFormData } from '@/lib/schemas/contact';
import { submitContactForm } from '@/services/contact';
import { ApiError } from '@/services/api-client';
import { reportError } from '@/lib/error-reporting';
import { COUNTRY_LIST, CountryInfo } from '@/lib/data/countries';

const MIN_SUBMIT_FEEDBACK_MS = 1000;

/** Resolves with the task's result, but never sooner than `minMs` - so the sending animation is visible. */
async function withMinimumDuration<T>(task: Promise<T>, minMs: number): Promise<T> {
  const startedAt = Date.now();
  const result = await task;
  const remaining = minMs - (Date.now() - startedAt);
  if (remaining > 0) {
    await new Promise((resolve) => setTimeout(resolve, remaining));
  }
  return result;
}

export const useContactForm = () => {
  const t = useTranslations('contact');
  const [selectedCountry, setSelectedCountry] = useState<CountryInfo>(COUNTRY_LIST[0]); // Default to Mali 🇲🇱 ML
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoadingAnimation, setIsLoadingAnimation] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(createContactSchema(t)),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: selectedCountry.dialCode + ' ',
      country: selectedCountry.name,
      department: 'general',
      subject: '',
      message: '',
    },
  });

  const handleCountryChange = (country: CountryInfo) => {
    setSelectedCountry(country);
    setValue('country', country.name);
    setValue('phone', country.dialCode + ' ');
  };

  const onSubmit = async (data: ContactFormData) => {
    setSubmitStatus('idle');
    setErrorMessage('');
    setIsLoadingAnimation(true);

    try {
      await withMinimumDuration(
        submitContactForm({
          ...data,
          country: `${selectedCountry.flag} ${selectedCountry.code} - ${selectedCountry.name}`,
        }),
        MIN_SUBMIT_FEEDBACK_MS
      );

      setSubmitStatus('success');
      reset();
    } catch (error) {
      reportError(error, { form: 'contact' });
      setErrorMessage(error instanceof ApiError ? error.message : t('form.genericError'));
      setSubmitStatus('error');
    } finally {
      setIsLoadingAnimation(false);
    }
  };

  const resetStatus = () => setSubmitStatus('idle');

  return {
    register,
    errors,
    selectedCountry,
    handleCountryChange,
    isSubmitting: isSubmitting || isLoadingAnimation,
    submitStatus,
    errorMessage,
    onSubmit: handleSubmit(onSubmit),
    resetStatus,
  };
};
