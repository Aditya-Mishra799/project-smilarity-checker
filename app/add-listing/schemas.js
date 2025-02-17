import { z } from "zod";

export const stepSchemas = {
  personalInfo: z.object({
    fullName: z.string().min(1, "Full Name is required"),
    email: z.string().email("Invalid email address"),
  }),
  address: z.object({
    addressLine1: z.string().min(1, "Address Line 1 is required"),
    city: z.string().min(1, "City is required"),
  }),
  review: z.object({
    comments: z.string().optional(),
  }),
};
