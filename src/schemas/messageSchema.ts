import { z } from "zod";

export const messageSchema = z.object({
  content: z.string()
  .min(10, {message:"content must be atleast of 10 characters"})
  .max(300, {message:"content should not exceed maximum of 300 characters"}),
});
