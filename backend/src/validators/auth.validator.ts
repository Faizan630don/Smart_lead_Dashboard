import { z } from 'zod';
import { USER_ROLES } from '../constants';

export const registerSchema = z.object({
  body: z
    .object({
      email: z
        .string({ required_error: 'Email is required' })
        .email('Invalid email')
        .trim()
        .toLowerCase(),
      password: z
        .string({ required_error: 'Password is required' })
        .min(6, 'Password must be at least 6 characters'),
      confirmPassword: z.string({ required_error: 'Confirm password is required' }),
      name: z
        .string({ required_error: 'Name is required' })
        .min(2, 'Name too short')
        .trim(),
      role: z
        .enum(Object.values(USER_ROLES) as [string, ...string[]], {
          invalid_type_error: 'Role must be either admin or sales_user',
        })
        .default(USER_ROLES.SALES_USER),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ['confirmPassword'],
    }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'Email is required' })
      .email('Invalid email')
      .trim()
      .toLowerCase(),
    password: z
      .string({ required_error: 'Password is required' }),
  }),
});
