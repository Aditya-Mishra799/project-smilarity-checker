import { z } from "zod";

export const ResetPasswordSchema = z.object({
    password: z.string()
      .min(8, { message: "Password must be at least 8 characters" })
      .max(128, { message: "Password cannot exceed 128 characters" })
      .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
      .regex(/[0-9]/, { message: "Password must contain at least one number" })
      .regex(/[!@#$%^&*(),.?":{}|<>]/, { message: "Password must contain at least one special character" }),
  
    confirmPassword: z.string(),
  }).superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        path: ['confirmPassword'],
        message: "Password and Confirm Password must be the same",
        code: z.ZodIssueCode.custom,
      });
    }
  });
  