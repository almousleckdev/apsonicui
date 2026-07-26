import { z } from 'zod';

// Factory instead of a static export so validation messages come from the
// active locale - see messages/README.md for the pattern.
export function createContactSchema(t: (key: string) => string) {
  return z.object({
    firstName: z.string().min(1, t('validation.firstNameRequired')).trim(),
    lastName: z.string().min(1, t('validation.lastNameRequired')).trim(),
    email: z
      .string()
      .min(1, t('validation.emailRequired'))
      .email(t('validation.emailInvalid')),
    phone: z
      .string()
      .optional()
      .refine((val) => !val || /^\+?[\d\s-]{10,}$/.test(val), t('validation.phoneInvalid')),
    department: z.string().min(1, t('validation.departmentRequired')),
    subject: z.string().min(1, t('validation.subjectRequired')).trim(),
    message: z.string().min(20, t('validation.messageMinLength')).trim(),
  });
}

export type ContactFormData = z.infer<ReturnType<typeof createContactSchema>>;
