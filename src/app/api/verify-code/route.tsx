import { z } from "zod";
import dbConnect from "@/lib/dbConnect";
import { verifyCodeSchema } from "@/schemas/verifySchema";
import UserModel from "@/models/user.model";

const CodeVerificationSchema = z.object({
  otp: verifyCodeSchema,
});

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, otp } = await request.json();

    const result = CodeVerificationSchema.safeParse({ otp:{otp:otp} });

    if (!result.success) {
      const codeSchemaError = result.error.format().otp?.otp?._errors || [];

      return Response.json(
        {
          success: false,
          message:
            codeSchemaError.length > 0
              ? codeSchemaError.join(", ")
              : "OTP must be a 6 digit number",
        },
        { status: 400 }
      );
    }

    const user = await UserModel.findOne({ username });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "No user found with this username",
        },
        { status: 400 }
      );
    }

    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();
    const isCodeCorrect = user.verifyCode === otp;

    if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message:
            "Your OTP has expired, Please signup again to generate a new one. ",
        },
        { status: 400 }
      );
    }

    if (!isCodeCorrect) {
      return Response.json(
        {
          success: false,
          message: "Wrong OTP, Enter the correct one",
        },
        { status: 400 }
      );
    }

    user.isVerified = true;
    await user.save();
    return Response.json(
      {
        success: true,
        message: "Your account verified successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(
      "error occured while doing OTP verification in verify-code route",
      error
    );
    return Response.json(
      {
        success: false,
        message: "Error verifying user",
      },
      { status: 500 }
    );
  }
}
