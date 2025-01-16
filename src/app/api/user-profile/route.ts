import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import { User } from "next-auth";

export async function GET() {
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

    const userProfile = await UserModel.findById(loggedInUserId);

    return Response.json(
      {
        success: true,
        message: "Your profile details has been fetched successfully",
        userProfile: userProfile,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Failed to fetch user profile", error);
    return Response.json(
      {
        success: false,
        message: "Failed to fetch user profile",
      },
      {
        status: 500,
      }
    );
  }
}
