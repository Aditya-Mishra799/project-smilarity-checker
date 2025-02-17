import { z } from 'zod';


const LoginFormValidationSchema = z.object({
    email: z.string()
      .email({ message: "Please enter a valid email address" })
      .min(1, { message: "Email is required" }),
  
    password: z.string()
      .min(1, { message: "Password is required" })
  })

export { LoginFormValidationSchema };
