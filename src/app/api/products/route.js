// app/api/products/route.js
// API for products - GET all, POST create

import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

// GET - Fetch all active products
export async function GET(request) {
  try {
    await connectDB();

    const products = await Product.find({ isActive: true }).sort({
      createdAt: -1,
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST - Create new product (admin only)
export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { name, price, description, image, stock } = body;

    // Validate required fields
    if (!name || !price || !description || !image) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create product
    const product = await Product.create({
      name,
      price,
      description,
      image,
      stock: stock || 0,
      isActive: true,
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
