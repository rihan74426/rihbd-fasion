import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-change-this"
);

export async function verifyAdminToken(request) {
  try {
    const adminToken = request.cookies.get("admin-token");

    if (!adminToken) {
      return {
        isValid: false,
        error: "No authentication token found",
        statusCode: 401,
      };
    }

    const verified = await jwtVerify(adminToken.value, JWT_SECRET);

    return {
      isValid: true,
      adminId: verified.payload.adminId,
      username: verified.payload.username,
    };
  } catch (error) {
    console.error("Token verification failed:", error);
    return {
      isValid: false,
      error: "Invalid or expired token",
      statusCode: 401,
    };
  }
}

export function sendUnauthorized(message = "Unauthorized") {
  return NextResponse.json({ error: message }, { status: 401 });
}

export function sendForbidden(message = "Forbidden") {
  return NextResponse.json({ error: message }, { status: 403 });
}
