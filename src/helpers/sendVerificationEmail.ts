import { resend } from "@/lib/resend";
import ApiResponseType from "@/types/ApiResponseType";
import VerificationEmailTemplate from "../../emails/VerificationEmailTemplate";

export default async function SendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponseType> {
  try {
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Mystery message Application| Verification code",
      react: VerificationEmailTemplate({ username, otp: verifyCode }),
    });
    console.log(data || error);
    return {
      success: true,
      message: "Verification email sent successfully",
    };
  } catch (emailError) {
    console.error("Error sending verification email", emailError);
    return { success: false, message: "Failed to send verification email" };
  }
}
