import { z } from "zod";

// Plain-language messages, surfaced directly in the UI (§10: errors explain
// what happened and how to fix it).
export const emailSchema = z
  .string()
  .trim()
  .min(1, "Enter your email address.")
  .email("That doesn't look like a valid email address.");

export const passwordSchema = z
  .string()
  .min(10, "Use at least 10 characters.")
  .max(200, "That password is too long.");

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Enter your password."),
});

export const createAdminSchema = z.object({
  name: z.string().trim().min(1, "Enter your name."),
  email: emailSchema,
  password: passwordSchema,
});

export const createUserSchema = z.object({
  name: z.string().trim().min(1, "Enter a name."),
  email: emailSchema,
  password: passwordSchema,
  role: z.enum(["user", "admin", "super_admin"]),
});

export const resetPasswordSchema = z.object({
  userId: z.string().uuid(),
  password: passwordSchema,
});

export type SignInInput = z.infer<typeof signInSchema>;
export type CreateAdminInput = z.infer<typeof createAdminSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
