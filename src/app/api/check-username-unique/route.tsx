import { z } from "zod";
import dbConnect from "@/lib/dbConnect";
import { userNameSchema } from "@/schemas/signupSchema";
import UserModel from "@/models/user.model";

const UsernameQuerySchema = z.object({
  username: userNameSchema,
});

export async function GET(request: Request) {
  await dbConnect();

  try {

    const { searchParams } = new URL(request.url);

    const decodedUsername = decodeURIComponent(searchParams.get("username")!);

    const queryParams = {
      username: decodedUsername,
    };

    const result = UsernameQuerySchema.safeParse(queryParams);

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      console.log("zod result usernameErrors -> ", result.error.format());
      return Response.json(
        {
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(", ")
              : "Invalid query parameters",
        },
        { status: 400 }
      );
    }

    const { username } = result.data;

    const existingUser = await UserModel.findOne({
      username,
    });

    if (existingUser) {
      return Response.json(
        {
          success: false,
          message: "This username is already taken",
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Username  available",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking username", error);
    return Response.json(
      {
        success: false,
        message: "Error checking username",
      },
      { status: 500 }
    );
  }
}
