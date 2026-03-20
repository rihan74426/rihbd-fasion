// src/app/api/admin/customers/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { verifyAdmin } from "@/lib/verifyAdmin";

export async function GET() {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();

    const orders = await Order.find().sort({ createdAt: -1 }).lean();

    // Group by phone number
    const map = {};
    for (const order of orders) {
      const phone = order.customerPhone;
      if (!map[phone]) {
        map[phone] = {
          name: order.customerName,
          phone,
          orders: [],
          totalSpent: 0,
          firstSeen: order.createdAt,
          lastSeen: order.createdAt,
        };
      }
      const c = map[phone];
      c.orders.push({
        _id: order._id,
        orderNumber: order.orderNumber,
        productName: order.productName,
        productPrice: order.productPrice,
        status: order.status,
        createdAt: order.createdAt,
      });
      if (order.status !== "CANCELLED") c.totalSpent += order.productPrice || 0;
      if (new Date(order.createdAt) > new Date(c.lastSeen))
        c.lastSeen = order.createdAt;
    }

    const customers = Object.values(map).sort(
      (a, b) => new Date(b.lastSeen) - new Date(a.lastSeen)
    );

    return NextResponse.json({ success: true, customers });
  } catch (error) {
    console.error("Error fetching customers:", error);
    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 }
    );
  }
}
