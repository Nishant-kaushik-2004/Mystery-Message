import dbConnect from "@/lib/dbConnect";
import UserModel, { Message } from "@/models/user.model";

export async function POST(request: Request) {
  await dbConnect();

  const { username, message } = await request.json();

  try {
    const user = await UserModel.findOne({ username });

    if (!user) {
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

    if (!user.isAcceptingMessage) {
      return Response.json(
        {
          success: false,
          message: "User is not accepting messages",
        },
        {
          status: 403,
        }
      );
    }

    const newMessage = { content: message, createdAt: new Date() };

    user.messages.push(newMessage as Message);

    await user.save();

    return Response.json(
      {
        success: true,
        messages: "Message sent successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Failed to send message due to internal server error", error);
    return Response.json(
      {
        success: false,
        message: "Failed to send message due to internal server error",
      },
      {
        status: 500,
      }
    );
  }
}
