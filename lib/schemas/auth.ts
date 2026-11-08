import { z } from 'zod';

export function createLoginSchema(t: (key: string) => string) {
  return z.object({
    usernameOrEmail: z.string().min(1, t('validation.usernameRequired')),
    password: z.string().min(6, t('validation.passwordMinLength')),
    rememberMe: z.boolean().optional(),
  });
}

export type LoginFormData = z.infer<ReturnType<typeof createLoginSchema>>;

/** The same rule the server enforces: 8+ characters with an uppercase letter, a lowercase letter, a digit and a symbol, no spaces. */
export const PASSWORD_RULE = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!._-])(?=\S+$).{8,}$/;

export function createResetPasswordSchema(t: (key: string) => string) {
  return z
    .object({
      password: z.string().regex(PASSWORD_RULE, t('reset.rules')),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('reset.mismatch'),
      path: ['confirmPassword'],
    });
}

export type ResetPasswordFormData = z.infer<ReturnType<typeof createResetPasswordSchema>>;

export function createForgotPasswordSchema(t: (key: string) => string) {
  return z.object({
    email: z.string().min(1, t('forgot.emailRequired')).email(t('forgot.emailInvalid')),
  });
}

export type ForgotPasswordFormData = z.infer<ReturnType<typeof createForgotPasswordSchema>>;
