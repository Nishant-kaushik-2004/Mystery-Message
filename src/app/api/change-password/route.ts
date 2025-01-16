import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import { User } from "next-auth";
import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const session = await auth();

    if (!session || !session.user) {
      return Response.json(
        {
          success: false,
          message: "Not Authenticated",
        },
        {
          status: 401,
        }
      );
    }

    const loggedInUser: User = session?.user as User;

    const loggedInUserId = loggedInUser._id;

    const { currentPassword, newPassword } = await req.json();

    const user = await UserModel.findById(loggedInUserId);

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    const isOldPasswordCorrect = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isOldPasswordCorrect) {
      return Response.json(
        {
          success: false,
          message:
            "Current password is incorrrect. Please enter the correct password.",
        },
        {
          status: 400,
        }
      );
    }

    const newHashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = newHashedPassword;

    await user.save();

    return Response.json(
      {
        success: true,
        message: "Your profile password updated successfully",
      },
      {
        status: 200,
      }
    );

  } catch (error) {
    console.log("Failed to update your security", error);
    return Response.json(
      {
        success: false,
        message: "Failed to update your security",
      },
      {
        status: 500,
      }
    );
  }
}
