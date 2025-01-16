import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import { auth } from "../../../auth";
import { User } from "next-auth";

export async function POST(request: Request) {
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

  const loggedInUserId = loggedInUser?._id;

  const { messageAcceptance } = await request.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      loggedInUserId,
      { isAcceptingMessage: messageAcceptance },
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
        message: "Messages accepting status updated successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Failed to update message accepting status", error);
    return Response.json(
      {
        success: false,
        message: "Failed to update message accepting status",
      },
      {
        status: 500,
      }
    );
  }
}

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

  const loggedInUserId = loggedInUser?._id;

  try {
    const foundUser = await UserModel.findById(loggedInUserId);

    if (!foundUser) {
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
        message: "Message accepting status fetched successfully",
        isAcceptingMessages: foundUser.isAcceptingMessage,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Failed to fetch message accepting status", error);
    return Response.json(
      {
        success: false,
        message: "Failed to fetch message accepting status",
      },
      {
        status: 500,
      }
    );
  }
}
