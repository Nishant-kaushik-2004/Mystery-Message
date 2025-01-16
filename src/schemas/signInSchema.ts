import { z } from "zod";

const userNameLoginSchema = z
  .string()
  .min(3, "username will never be less than three characters")
  .max(15, "username will never be more than 15 characters")
  .regex(
    /^[a-zA-Z0-9_]+$/,
    "username will never contain any special characters"
  );

const emailLoginSchema = z
  .string()
  .email("Please enter a valid email address");

export const signInSchema = z.object({
  identifier: z.union([userNameLoginSchema, emailLoginSchema]),
  password: z
    .string()
    .min(6, { message: "password will never be less than six characters" }),
});
