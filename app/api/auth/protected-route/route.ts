import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verify } from "jsonwebtoken";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  try {
    verify(token, process.env.JWT_SECRET!);
    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL("/", req.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
