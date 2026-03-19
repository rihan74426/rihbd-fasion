import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Admin from "@/models/Admin";

export async function POST(request) {
  try {
    await connectDB();

    // Delete existing admin
    await Admin.deleteOne({ username: "admin" });
    console.log("✓ Deleted existing admin");

    // Create new admin with hashed password
    const newAdmin = new Admin({
      username: "admin",
      password: "admin123", // Will be hashed by pre-save hook
    });

    await newAdmin.save();
    console.log("✓ New admin created successfully");

    return NextResponse.json({
      success: true,
      message: "Admin reset successfully. Username: admin, Password: admin123",
    });
  } catch (error) {
    console.error("Reset error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
