import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./page.module.css";
import { seedDefaultAdmin } from "@/lib/seedAdmin";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || "Rihbd Fashion",
  description: "Order traditional clothing with cash on delivery",
};

// Call this once when the app starts
if (typeof window === "undefined") {
  // Only on server side
  seedDefaultAdmin().catch(console.error);
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
