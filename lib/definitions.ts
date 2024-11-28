import { z } from 'zod';

// Reusable field schemas
const usernameSchema = z
  .string({ required_error: "Username is required." })
  .min(2, { message: 'Username must be at least 2 characters long.' })
  .trim();

const emailSchema = z
  .string({ required_error: "Email is required." })
  .email({ message: 'Please enter a valid email.' })
  .trim();

const passwordSchema = z
  .string({ required_error: "Password is required." })
  .min(8, { message: 'Be at least 8 characters long' })
  .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
  .regex(/[0-9]/, { message: 'Contain at least one number.' })
  .regex(/[^a-zA-Z0-9]/, { message: 'Contain at least one special character.' })
  .trim();

// Sign up schema and type
export const SignupFormSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
});
export type SignupFormValues = z.infer<typeof SignupFormSchema>;

// Sign in schema and type
export const SigninFormSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});
export type SigninFormValues = z.infer<typeof SigninFormSchema>;

// Change Password schema and type
export const ChangePasswordFormSchema = z.object({
  currentPassword: passwordSchema,
  newPassword: passwordSchema,
});
export type ChangePasswordFormValues = z.infer<typeof ChangePasswordFormSchema>;

// Forgot Password schema and type
export const ForgotPasswordFormSchema = z.object({
  email: emailSchema,
});
export type ForgotPasswordFormValues = z.infer<typeof ForgotPasswordFormSchema>;

// ResetConfirm Password schema and type
export const ResetConfirmPasswordFormSchema = z.object({
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Password confirmation does not match password',
  path: ['confirmPassword'], // Specify which field to attach the error to
});
export type ResetConfirmPasswordFormValues = z.infer<typeof ResetConfirmPasswordFormSchema>;

// Reset password schema and type
export const ResetPasswordFormSchema = z.object({
  newPassword: passwordSchema,
});
export type ResetPasswordFormValues = z.infer<typeof ResetPasswordFormSchema>;

// Resend Verification schema and type
export const ResendVerificationFormSchema = z.object({
  email: emailSchema,
});
export type ResendVerificationFormValues = z.infer<typeof ResendVerificationFormSchema>;
// Invite User schema  and type
export const InviteUserFormSchema = z.object({
  email: emailSchema,
  role: z.string({ required_error: "role is required." })
    .min(1, { message: 'Please enter user role.' })

});
export type InviteUserFormValues = z.infer<typeof InviteUserFormSchema>;

// Register User by invitation schema and type
export const RegisterUserByInviteFormSchema = z.object({
  username: usernameSchema,
  password: passwordSchema
});
export type RegisterUserByInviteFormValues = z.infer<typeof RegisterUserByInviteFormSchema>;
export type FormState =
  | {
    errors?: {
      name?: string[]
      email?: string[]
      password?: string[]
    }
    message?: string
  }
  | undefined;

