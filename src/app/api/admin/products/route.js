import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    const product = new Product({
      name: body.name,
      description: body.description,
      category: body.category,
      price: body.price,
      discountPrice: body.discountPrice,
      images: body.images,
      sizes: body.sizes,
      colors: body.colors,
      stock: body.stock,
      featured: body.featured,
    });

    await product.save();

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error) {
    console.error("Product creation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create product" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    await connectDB();
    const products = await Product.find().sort({ createdAt: -1 });

    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
