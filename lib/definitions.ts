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

// Invite User schema  and type
export const InviteUserFormSchema = z.object({
  email: emailSchema,
  role:  z.string({ required_error: "role is required." })
  .min(1, { message: 'Please enter user role.' })

});
export type InviteUserFormValues = z.infer<typeof InviteUserFormSchema>;


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

