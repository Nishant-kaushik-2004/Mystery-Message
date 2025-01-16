import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();

    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json(
        {
          success: false,
          message: "You are not authorized to delete this message",
        },
        {
          status: 401,
        }
      );
    }

    const { user } = session;

    const { username } = user;

    const { searchParams } = new URL(req.url);

    const msgId = searchParams.get("msgId");

    const foundUser = await UserModel.findOne({ username });

    if (!foundUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    const objectMsgId = new mongoose.Types.ObjectId(msgId as string);

    foundUser.messages = foundUser.messages.filter(
      (msg) => !objectMsgId.equals(msg._id as string)
    );

    await foundUser.save();

    return NextResponse.json(
      {
        success: true,
        message: "Message deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in message deletion route", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error in message deletion",
      },
      { status: 500 }
    );
  }
}
