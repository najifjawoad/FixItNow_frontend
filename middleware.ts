import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("accessToken")?.value;

  // Protect /dashboard routes
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      // Decode JWT payload (base64 decode standard token)
      const payloadBase64 = token.split(".")[1];
      if (payloadBase64) {
        const decodedJson = Buffer.from(payloadBase64, "base64").toString("utf-8");
        const payload = JSON.parse(decodedJson);
        const userRole = payload.role;

        // Role-specific route enforcement
        if (pathname.startsWith("/dashboard/admin") && userRole !== "ADMIN") {
          return NextResponse.redirect(new URL(getRoleDashboard(userRole), request.url));
        }

        if (pathname.startsWith("/dashboard/technician") && userRole !== "TECHNICIAN") {
          return NextResponse.redirect(new URL(getRoleDashboard(userRole), request.url));
        }

        if (pathname.startsWith("/dashboard/customer") && userRole !== "CUSTOMER") {
          return NextResponse.redirect(new URL(getRoleDashboard(userRole), request.url));
        }
      }
    } catch (e) {
      // If token parsing fails, clear and redirect to login
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect authenticated users away from auth pages (/auth/login, /auth/register)
  if ((pathname === "/auth/login" || pathname === "/auth/register") && token) {
    try {
      const payloadBase64 = token.split(".")[1];
      if (payloadBase64) {
        const decodedJson = Buffer.from(payloadBase64, "base64").toString("utf-8");
        const payload = JSON.parse(decodedJson);
        return NextResponse.redirect(new URL(getRoleDashboard(payload.role), request.url));
      }
    } catch (e) {
      // Continue to auth page if token is invalid
    }
  }

  return NextResponse.next();
}

function getRoleDashboard(role: string): string {
  switch (role) {
    case "ADMIN":
      return "/dashboard/admin";
    case "TECHNICIAN":
      return "/dashboard/technician";
    case "CUSTOMER":
    default:
      return "/dashboard/customer";
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/login", "/auth/register"],
};
