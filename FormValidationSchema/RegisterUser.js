import { z } from 'zod';


const RegisterFormValidationSchema = z.object({
    name: z.string()
      .min(1, { message: "Full name is required" })
      .max(100, { message: "Full name cannot exceed 100 characters" }),
  
    email: z.string()
      .email({ message: "Please enter a valid email address" })
      .min(1, { message: "Email is required" }),
  
    password: z.string()
      .min(8, { message: "Password must be at least 8 characters" })
      .max(128, { message: "Password cannot exceed 128 characters" })
      .regex(
        /[A-Z]/, 
        { message: "Password must contain at least one uppercase letter" }
      )
      .regex(
        /[0-9]/, 
        { message: "Password must contain at least one number" }
      )
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/, 
        { message: "Password must contain at least one special character" }
      ),
  
    confirmPassword: z.string()
  }).refine(data => data.password === data.confirmPassword, {
    message: "Confrim Password and Password must be same",
    path: ["confirmPassword"], 
  });

export { RegisterFormValidationSchema };
