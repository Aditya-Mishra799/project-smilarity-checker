import { z } from "zod";

const sessionFormSchema = z.object({
  name: z.string().min(1, "Session name is required").trim(),
  description: z.string().optional(),
  autoReject: z.boolean().default(true),
  threshold: z
    .number({ invalid_type_error: "Must be a proper integer." })
    .min(0, { message: "Threshold must be at least 0%" })
    .max(100, { message: "Threshold cannot exceed 100%" })
    .default(0),
});

export default sessionFormSchema;