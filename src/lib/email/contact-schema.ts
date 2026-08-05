import { z } from "zod";

export const contactFormSchema = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().max(80).optional().default(""),
  email: z.string().trim().email().max(120),
  message: z.string().trim().min(1).max(5000),
  locale: z.enum(["en", "bg"]),
  website: z.string().optional().default(""),
  startedAt: z.number().int().positive(),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;
