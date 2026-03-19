// app/api/orders/route.js
// API for creating and fetching orders

import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { generateOrderNumber } from "@/lib/utils";

// GET - Fetch all orders (admin only)
export async function GET(request) {
  try {
    await connectDB();

    const orders = await Order.find()
      .populate("product")
      .sort({ createdAt: -1 });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// POST - Create new order
export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { productId, customerName, customerPhone, customerAddress } = body;

    // Validate required fields
    if (!productId || !customerName || !customerPhone || !customerAddress) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get product details
    const product = await Product.findById(productId);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (!product.isActive || product.stock === 0) {
      return NextResponse.json(
        { error: "Product not available" },
        { status: 400 }
      );
    }

    // Create order
    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      product: productId,
      productName: product.name,
      productPrice: product.price,
      productImage: product.image,
      customerName,
      customerPhone,
      customerAddress,
      status: "PENDING",
      paymentMethod: "CASH_ON_DELIVERY",
    });

    // Decrease product stock
    product.stock -= 1;
    await product.save();

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
