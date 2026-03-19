// src/lib/verifyAdmin.js
// Server-side token verification for admin API routes
// Uses jose — same library as middleware, same secret encoding

import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-change-this-in-production"
);

/**
 * Returns true if the request carries a valid admin-token cookie.
 * Use in every /api/admin/* route handler.
 */
export async function verifyAdmin() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("admin-token");
    if (!token?.value) return false;
    await jwtVerify(token.value, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}
