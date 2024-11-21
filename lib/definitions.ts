import { z } from 'zod'

export const SignupFormSchema = z.object({
  username: z
    .string()
    .min(2, { message: 'Username must be at least 2 characters long.' })
    .trim()
    .refine(value => !!value, { message: 'Username is required.' }),
  email: z
    .string()
    .email({ message: 'Please enter a valid email.' })
    .trim()
    .refine(value => !!value, { message: 'Email is required.' }),
  password: z
    .string()
    .min(8, { message: 'Be at least 8 characters long' })
    .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
    .regex(/[0-9]/, { message: 'Contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'Contain at least one special character.',
    })
    .trim()
    .refine(value => !!value, { message: 'Password is required.' }),
})

export type SignupFormValues = z.infer<typeof SignupFormSchema>;
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
