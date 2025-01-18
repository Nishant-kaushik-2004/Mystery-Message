/* eslint-disable @typescript-eslint/no-explicit-any */
import UserModel from "@/models/user.model";
import dbConnect from "@/lib/dbConnect";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

// class InvalidLoginError extends CredentialsSignin {
//   code = "Invalid identifier or password";
// }

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        identifier: { label: "Email/Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        try {
          await dbConnect();

          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });

          if (!user) {
            console.log("No User found with this email or username");
            return null;
          }

          // if (!user.isVerified) {
          //   console.log("Please verify your account before login");
          //   return null;
          // }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordCorrect) {
            console.log("Incorrect Password");
            return null;
          }

          return user;
        } catch (err: any) {
          throw new Error(err);
        }
      },
    }),
  ],
  callbacks: {
    // authorized({ request }) {
    //   // Currently not in use as i am not using nextAuth middleware.
    //   return Response.redirect(new URL("/sign-in", request.nextUrl));
    //   // if (request.method === "POST") {
    //   //   const isLoggedIn = !!auth?.user;
    //   //   const isOnDashboard = request.nextUrl.pathname.startsWith("/dashboard");
    //   //   if (isLoggedIn) {
    //   //     if (isOnDashboard) {
    //   //       return true;
    //   //     }
    //   //     return Response.redirect(new URL("/dashboard",request.nextUrl)); // Redirect authenticated users to dashboard
    //   //   } else if (isOnDashboard) {
    //   //     return false; // Redirect unauthenticated users to sign in page
    //   //   }
    //   //   return true;
    //   // }
    //   // return !!auth?.user;
    // },
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.isAcceptingMessage = user.isAcceptingMessage;
        token.username = user.username;
        token.picture = user.imageUrl;
      }
      //  else {
      //   const User = await UserModel.findById(token._id);
      //   token.username = User?.username;
      //   token.email = User?.email;
      //   token.isAcceptingMessage = User?.isAcceptingMessage;
      //   token.picture = User?.imageUrl;
      //   console.log("updatedd token -> ", token);
      // }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessage = token.isAcceptingMessage;
        session.user.username = token.username;
        session.user.image = token.picture;
      }
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});
