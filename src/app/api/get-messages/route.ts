import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import { auth } from "../../../auth";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET() {
  await dbConnect();

  const session = await auth();

  const loggedInUser: User = session?.user as User;

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

  const loggedInUserId = new mongoose.Types.ObjectId(loggedInUser?._id);

  try {
    const userMessages = await UserModel.aggregate([
      { $match: { _id: loggedInUserId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);

    if (!userMessages) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 401,
        }
      );
    }
    if (userMessages.length == 0) {
      return Response.json(
        {
          success: true,
          message: "You do not have any messages to display",
        },
        {
          status: 200,
        }
      );
    }
    return Response.json(
      {
        success: true,
        messages: userMessages[0].messages,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Failed to fetch user messages", error);
    return Response.json(
      {
        success: false,
        message: "Failed to fetch user latest messages",
      },
      {
        status: 500,
      }
    );
  }
}
