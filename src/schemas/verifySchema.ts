import { z } from "zod";

export const verifyCodeSchema = z.object({
  otp: z.string().length(6,"verification code must be 6 digits"),
});
