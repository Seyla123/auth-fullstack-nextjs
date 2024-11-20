import { FormState, SignupFormSchema } from "@/lib/definitions"

 
export async function signup(state: FormState, formData: FormData) {
  // Validate form fields
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  })
 
  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }
  const { name, email, password } = validatedFields.data
  console.log('this field : ', name, email, password);
  
  // Call the provider or db to create a user...
}