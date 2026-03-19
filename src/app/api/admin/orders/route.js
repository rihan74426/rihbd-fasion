import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { verifyAdminToken, sendUnauthorized } from "@/lib/auth";

export async function GET(request) {
  try {
    // Verify admin authentication
    const auth = await verifyAdminToken(request);
    if (!auth.isValid) {
      return sendUnauthorized(auth.error);
    }

    await connectDB();

    const orders = await Order.find()
      .populate("product")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
