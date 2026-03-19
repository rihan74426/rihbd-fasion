import { NextResponse } from "next/server";
import { seedDefaultAdmin } from "@/lib/seedAdmin";

export async function POST(request) {
  try {
    const result = await seedDefaultAdmin();
    return NextResponse.json({
      success: true,
      message: result.created
        ? "Default admin created successfully"
        : "Admin already exists",
      created: result.created,
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Failed to seed admin" },
      { status: 500 }
    );
  }
}
