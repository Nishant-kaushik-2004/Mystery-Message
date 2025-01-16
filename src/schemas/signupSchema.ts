import { z } from "zod";

export const userNameSchema = z
  .string()
  .min(3, "username should be atleast three characters")
  .max(20, "username should be no longer than 20 characters")
  .regex(
    /^[a-zA-Z0-9_]+$/, //This regex also checks the length min&max limit, but here not needed as we are using min and max .
    "username should not contain any special characters"
  );

export const signUpSchema = z.object({
  username: userNameSchema,
  email: z.string().email({ message: "Invalid email adress type" }),
  password: z
    .string()
    .min(6, { message: "password should be atleast 6 characters long" }),
});
