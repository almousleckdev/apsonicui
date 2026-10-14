import { z } from 'zod';

export const contactSchema = z.object({
  firstName: z.string().min(1, 'First name is required').trim(),
  lastName: z.string().min(1, 'Last name is required').trim(),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^\+?[\d\s-]{10,}$/.test(val), 'Invalid phone number'),
  country: z.string().min(1, 'Country is required'),
  department: z.string().min(1, 'Department is required'),
  subject: z.string().min(1, 'Subject is required').trim(),
  message: z.string().min(20, 'Message must be at least 20 characters').trim(),
});

export function createContactSchema(t?: (key: string, options?: { defaultMessage: string }) => string) {
  if (!t) return contactSchema;

  const safeT = (key: string, defaultMsg: string) => {
    try {
      const res = t(key, { defaultMessage: defaultMsg });
      return res || defaultMsg;
    } catch {
      return defaultMsg;
    }
  };

  return z.object({
    firstName: z.string().min(1, safeT('validation.firstNameRequired', 'First name is required')).trim(),
    lastName: z.string().min(1, safeT('validation.lastNameRequired', 'Last name is required')).trim(),
    email: z
      .string()
      .min(1, safeT('validation.emailRequired', 'Email is required'))
      .email(safeT('validation.emailInvalid', 'Invalid email address')),
    phone: z
      .string()
      .optional()
      .refine((val) => !val || /^\+?[\d\s-]{10,}$/.test(val), safeT('validation.phoneInvalid', 'Invalid phone number')),
    country: z.string().min(1, safeT('validation.countryRequired', 'Country is required')),
    department: z.string().min(1, safeT('validation.departmentRequired', 'Department is required')),
    subject: z.string().min(1, safeT('validation.subjectRequired', 'Subject is required')).trim(),
    message: z.string().min(20, safeT('validation.messageMinLength', 'Message must be at least 20 characters')).trim(),
  });
}

export type ContactFormData = z.infer<typeof contactSchema>;
