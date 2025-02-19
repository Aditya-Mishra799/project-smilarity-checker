import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
    const token = await getToken({
      req,
      cookieName : process.env.SERVER_MODE === "development" ? "next-auth.session-token" : "__Secure-next-auth.session-token",
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      const loginUrl = new URL("/auth/signin", req.url);
      loginUrl.searchParams.set("callbackUrl", req.url);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }



export const config = {
  matcher: ["/session/:path*", "/profile/:path*", "/create-session/:path*"],
};
