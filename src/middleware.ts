import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// export { auth as middleware } from "./auth";

export async function middleware(req: NextRequest) {
  const { nextUrl } = req;

  const isOnHomePage = nextUrl.pathname === "/";
  const isOnMessagingPage = nextUrl.pathname.startsWith("/u");
  const isOnMyProfilePage = nextUrl.pathname.startsWith("/my-profile");

  if (isOnHomePage || isOnMessagingPage) {
    return NextResponse.next();
  }

  const isLoggedIn = !!(await cookies()).get("authjs.session-token"); //generally authorization is performed in authorized callback in auth.ts and here only the above commented part is executed but thats not working so i have to do it here.

  const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");

  if (isLoggedIn) {
    if (isOnDashboard || isOnMyProfilePage) {
      return NextResponse.next();
    }
    return Response.redirect(new URL("/", nextUrl.origin)); // Redirect authenticated users to dashboard
  } else if (isOnDashboard || isOnMyProfilePage) {
    return NextResponse.redirect(new URL("/sign-in", nextUrl.origin)); // Redirect unauthenticated users to sign in page
  }

  return NextResponse.next();
}

// See "Matching Paths" below
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

// export async function middleware(req: NextRequest) {
//   const session = await auth();
//   console.log("session",session);
//   console.log("req.nextUrl.pathname",req.nextUrl.pathname);
//   if (!session && req.nextUrl.pathname.startsWith("/dashboard")) {
//     const newUrl = new URL("/sign-in", req.nextUrl.origin);
//     return NextResponse.redirect(newUrl);
//   }
//   return NextResponse.next();
// }
