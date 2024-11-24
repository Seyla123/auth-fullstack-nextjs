import { z } from 'zod'

// Sign up schema and type
export const SignupFormSchema = z.object({
  username: z
    .string({ required_error: "Username is required." })
    .min(2, { message: 'Username must be at least 2 characters long.' })
    .trim(),
  email: z
    .string({ required_error: "Email is required." })
    .email({ message: 'Please enter a valid email.' })
    .trim(),
  password: z
    .string({ required_error: "Password is required." })
    .min(8, { message: 'Be at least 8 characters long' })
    .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
    .regex(/[0-9]/, { message: 'Contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'Contain at least one special character.',
    })
    .trim().refine(value => !!value, { message: 'Password is required.' }),
})
export type SignupFormValues = z.infer<typeof SignupFormSchema>;

// sign in schema and type
export const SigninFormSchema = z.object({
  email: z
    .string({ required_error: "Email is required." })
    .email({ message: 'Please enter a valid email.' })
    .trim(),
  password: z
    .string({ required_error: "Password is required." })
    .min(8, { message: 'Be at least 8 characters long' })
    .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
    .regex(/[0-9]/, { message: 'Contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'Contain at least one special character.',
    })
    .trim(),
})
export type SigninFormValues = z.infer<typeof SigninFormSchema>;

export type FormState =
  | {
    errors?: {
      name?: string[]
      email?: string[]
      password?: string[]
    }
    message?: string
  }
  | undefined
