import { z } from "zod";

const projectFormSchema = z.object({
  title: z.string().min(1, "Project title is required").trim(),
  abstract: z.string().min(100, "Must have al least 100 letters in abstract.").trim(),
});

export default projectFormSchema;