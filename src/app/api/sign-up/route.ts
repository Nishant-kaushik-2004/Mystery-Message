import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
// import SendVerificationEmail from "@/helpers/sendVerificationEmail";

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const { username, email, password } = await request.json();

    const existingUserByUsername = await UserModel.findOne({
      username,
    });

    if (existingUserByUsername) {
      return NextResponse.json(
        {
          success: false,
          message: "This Username is already taken",
        },
        { status: 409 } //409 -> HTTP status code for the case where a user already exists
      );
    }
    const existingUserByEmail = await UserModel.findOne({
      email,
    });

    if (existingUserByEmail) {
      return NextResponse.json(
        {
          success: false,
          message: "A user already exist with this email",
        },
        {
          status: 409,
        }
      );
    }

    // if (existingUserByEmail) {
    //   if (existingUserByEmail.isVerified) {
    //     return NextResponse.json(
    //       {
    //         success: false,
    //         message: "User already exist with this email",
    //       },
    //       { status: 400 }
    //     );
    //   } else {
    //     const hashedPassword = await bcrypt.hash(password, 10);
    //     existingUserByEmail.password = hashedPassword;
    //     existingUserByEmail.verifyCode = verifyCode;
    //     existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
    //     await existingUserByEmail.save();
    //   }
    // } else {
    // }

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    const hashedPassword = await bcrypt.hash(password, 10);
    const codeExpiryDate = new Date();
    codeExpiryDate.setHours(codeExpiryDate.getHours() + 1);
    const newUser = new UserModel({
      username,
      email,
      password: hashedPassword,
      verifyCode: verifyCode,
      verifyCodeExpiry: codeExpiryDate,
      isVerified: false,
      isAcceptingMessage: true,
      messages: [],
    });

    await newUser.save();

    // send verification email
    // const emailResponse = await SendVerificationEmail(
    //   email,
    //   username,
    //   verifyCode
    // );
    // if (!emailResponse.success) {
    //   return Response.json(
    //     { success: false, message: emailResponse.message },
    //     { status: 500 }
    //   );
    // }
    return Response.json(
      {
        success: true,
        message: "User registered successfully!!",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("error while registering user", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error occured while Registering user",
      },
      { status: 500 }
    );
  }
}
