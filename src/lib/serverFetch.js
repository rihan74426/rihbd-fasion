// src/lib/serverFetch.js
// Helper for server components to call internal API routes with cookies forwarded.
// This is needed because Next.js server components cannot use relative fetch URLs
// without the full base URL, and need to forward the admin-token cookie.

import { cookies } from "next/headers";

/**
 * Fetch an internal API route from a server component.
 * Automatically forwards the admin-token cookie so protected routes work.
 */
export async function serverFetch(path) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token")?.value;

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const url = `${baseUrl}${path}`;

  const res = await fetch(url, {
    cache: "no-store",
    headers: {
      Cookie: token ? `admin-token=${token}` : "",
    },
  });

  if (!res.ok) {
    console.error(`serverFetch ${path} → ${res.status}`);
    return null;
  }

  return res.json();
}
