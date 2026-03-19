// src/app/api/orders/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { generateOrderNumber } from "@/lib/utils";
import { sendOrderNotification } from "@/lib/email";

export async function GET() {
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

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const {
      productId,
      customerName,
      customerPhone,
      customerAddress,
      selectedSize,
    } = body;

    if (!productId || !customerName || !customerPhone || !customerAddress) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const product = await Product.findById(productId);
    if (!product)
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    if (!product.isActive || product.stock === 0) {
      return NextResponse.json(
        { error: "Product not available" },
        { status: 400 }
      );
    }

    // Validate size
    if (product.sizes?.length > 0 && !selectedSize) {
      return NextResponse.json(
        { error: "Please select a size" },
        { status: 400 }
      );
    }
    if (
      selectedSize &&
      product.sizes?.length > 0 &&
      !product.sizes.includes(selectedSize)
    ) {
      return NextResponse.json(
        { error: "Invalid size selected" },
        { status: 400 }
      );
    }

    // Determine charge price — use discountPrice if valid
    const chargePrice =
      product.discountPrice && product.discountPrice < product.price
        ? product.discountPrice
        : product.price;

    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      product: productId,
      productName: product.name,
      productPrice: chargePrice,
      productImage: product.images?.[0] || "/placeholder.jpg",
      selectedSize: selectedSize || null,
      customerName,
      customerPhone,
      customerAddress,
      status: "PENDING",
      paymentMethod: "CASH_ON_DELIVERY",
    });

    // Decrement stock
    product.stock -= 1;
    await product.save();

    // Send email notification to admin (non-blocking — don't fail order if email fails)
    sendOrderNotification({
      orderNumber: order.orderNumber,
      customerName,
      customerPhone,
      customerAddress,
      productName: product.name,
      productPrice: chargePrice,
      selectedSize: selectedSize || null,
    }).catch((err) =>
      console.error("Email notification failed (non-critical):", err)
    );

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
