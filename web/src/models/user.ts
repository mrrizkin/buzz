import { z } from "zod";

export const userSchema = z.object({
  id: z.number().optional().nullable().nullish(),
  name: z.string().min(3, { message: "please enter a name with at least 3 characters" }),
  username: z.string().min(3, { message: "please enter a username with at least 3 characters" }),
  password: z.string().min(8, { message: "please enter a password with at least 8 characters" }),
  confirmed: z.boolean().optional().nullable().nullish(),
  whatsapp: z.string().optional().nullable().nullish(),
  email: z.string().email().optional().nullable().nullish(),
  role_id: z.number().optional().nullable().nullish(),
  created_at: z.date().optional().nullable().nullish(),
  updated_at: z.date().optional().nullable().nullish(),
  deleted_at: z.date().optional().nullable().nullish(),
});

export const createUserSchema = userSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  deleted_at: true,
});

export type User = z.infer<typeof userSchema>;
export type CreateUser = z.infer<typeof createUserSchema>;
