// src/app/api/admin/stats/route.js
import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/verifyAdmin";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Order from "@/models/Order";

export async function GET(request) {
  try {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const products = await Product.countDocuments();
    const orders = await Order.find();
    const customers = new Set(orders.map((o) => o.customerPhone)).size;
    const revenue = orders.reduce((sum, o) => sum + o.productPrice, 0);

    return NextResponse.json({
      success: true,
      stats: { products, customers, revenue },
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
