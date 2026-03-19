// middleware.js
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-change-this"
);

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  // Protect admin routes EXCEPT login and reset
  if (
    pathname.startsWith("/admin") &&
    pathname !== "/admin/login" &&
    pathname !== "/admin/reset" &&
    !pathname.startsWith("/api/admin/login") &&
    !pathname.startsWith("/api/admin/reset") &&
    !pathname.startsWith("/api/admin/seed")
  ) {
    const adminToken = request.cookies.get("admin-token");

    if (!adminToken) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    try {
      // Verify JWT token
      await jwtVerify(adminToken.value, JWT_SECRET);
    } catch (error) {
      console.error("Token verification failed:", error);
      // Clear invalid cookie and redirect to login
      const response = NextResponse.redirect(
        new URL("/admin/login", request.url)
      );
      response.cookies.delete("admin-token");
      return response;
    }
  }

  return NextResponse.next();
}

// Configure which routes to protect
export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
