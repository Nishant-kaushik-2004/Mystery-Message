import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import { User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json(
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

    const loggedInUserId = loggedInUser?._id;

    const { imageUrl } = await req.json();

    const user = await UserModel.findByIdAndUpdate(
      loggedInUserId,
      {
        imageUrl: imageUrl as string,
      },
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Your avatar updated successfully",
      },
      {
        status: 200,
      }
    );

  } catch (error) {
    console.log("Failed to update your avatar", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update your avatar",
      },
      {
        status: 500,
      }
    );
  }
}
