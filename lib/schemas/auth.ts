import { z } from 'zod';

export function createLoginSchema(t: (key: string) => string) {
  return z.object({
    usernameOrEmail: z.string().min(1, t('validation.usernameRequired')),
    password: z.string().min(6, t('validation.passwordMinLength')),
    rememberMe: z.boolean().optional(),
  });
}

export type LoginFormData = z.infer<ReturnType<typeof createLoginSchema>>;
