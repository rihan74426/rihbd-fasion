// src/app/api/admin/logout/route.js
import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });

  // Clear the httpOnly cookie — must be done server-side
  // document.cookie cannot touch httpOnly cookies
  response.cookies.set("admin-token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(0), // epoch = immediately expired
  });

  return response;
}
