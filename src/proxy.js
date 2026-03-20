// middleware.js  ← MUST be at project root, next to package.json
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-change-this-in-production"
);

// Routes that are public even though they start with /admin or /api/admin
const PUBLIC_ADMIN_PATHS = ["/admin/login", "/api/admin/login"];

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  // Only run on admin page routes and admin API routes
  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");
  if (!isAdminPage && !isAdminApi) return NextResponse.next();

  // Allow public paths through without a token
  if (PUBLIC_ADMIN_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // All other /admin/* and /api/admin/* require a valid token
  const token = request.cookies.get("admin-token");

  if (!token?.value) {
    // API: return 401 JSON
    if (isAdminApi) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // Page: redirect to login
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    await jwtVerify(token.value, JWT_SECRET);
    return NextResponse.next();
  } catch {
    // Token invalid or expired — clear it
    if (isAdminApi) {
      const res = NextResponse.json(
        { error: "Session expired" },
        { status: 401 }
      );
      res.cookies.delete("admin-token");
      return res;
    }
    const loginUrl = new URL("/admin/login", request.url);
    const res = NextResponse.redirect(loginUrl);
    res.cookies.delete("admin-token");
    return res;
  }
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
