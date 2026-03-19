// Create src/app/api/admin/stats/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
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

    const [products, customers, orders] = await Promise.all([
      Product.countDocuments(),
      Order.distinct("customerPhone"),
      Order.find().select("productPrice"),
    ]);

    const revenue = orders.reduce(
      (sum, order) => sum + (order.productPrice || 0),
      0
    );

    return NextResponse.json({
      success: true,
      stats: {
        products,
        customers: customers.length,
        revenue: Math.round(revenue),
      },
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
