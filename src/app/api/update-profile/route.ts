import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import mongoose from "mongoose";
import { User } from "next-auth";
import { NextRequest } from "next/server";

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

    const { username, email, isAcceptingMessages } = await req.json();

    const existingUserByUsername = await UserModel.findOne({ username });

    const idOfuserByUsername = new mongoose.Types.ObjectId(
      existingUserByUsername?._id as string
    ).toString();

    if (existingUserByUsername && idOfuserByUsername !== loggedInUser._id) {
      return Response.json(
        {
          success: false,
          message:
            "This username is already taken, Please choose a different one",
        },
        {
          status: 400,
        }
      );
    }

    const existingUserByEmail = await UserModel.findOne({ email });

    const idOfuserByEmail = new mongoose.Types.ObjectId(
      existingUserByEmail?._id as string
    ).toString();

    if (existingUserByEmail && idOfuserByEmail !== loggedInUser._id) {
      return Response.json(
        {
          success: false,
          message:
            "A user already exist with this email, Please enter a different one",
        },
        {
          status: 400,
        }
      );
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      loggedInUserId,
      {
        username: username,
        email: email,
        isAcceptingMessage: isAcceptingMessages,
      },
      { new: true }
    );

    if (!updatedUser) {
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

    return Response.json(
      {
        success: true,
        message: "Your profile details updated successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Failed to update your profile", error);
    return Response.json(
      {
        success: false,
        message: "Failed to update your profile",
      },
      {
        status: 500,
      }
    );
  }
}
