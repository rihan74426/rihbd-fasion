import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { verifyAdminToken, sendUnauthorized } from "@/lib/auth";
import { verifyAdmin } from "@/lib/verifyAdmin";

// GET - Fetch all products (admin only)
export async function GET(request) {
  try {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const products = await Product.find().sort({ createdAt: -1 }).lean();

    return NextResponse.json({
      success: true,
      products,
    });
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
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();

    // Validate required fields
    if (
      !body.name ||
      !body.description ||
      !body.category ||
      !body.price ||
      body.images?.length === 0
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const product = new Product({
      name: body.name,
      description: body.description,
      category: body.category,
      price: body.price,
      discountPrice: body.discountPrice,
      images: body.images,
      sizes: body.sizes || ["XS", "S", "M", "L", "XL", "XXL"],
      colors: body.colors || [],
      stock: body.stock || 0,
      featured: body.featured || false,
    });

    await product.save();

    return NextResponse.json(
      {
        success: true,
        message: "Product created successfully",
        product,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Product creation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create product" },
      { status: 500 }
    );
  }
}
