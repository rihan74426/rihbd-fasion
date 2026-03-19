import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { verifyAdminToken, sendUnauthorized } from "@/lib/auth";

// GET - Fetch single product (admin only)
export async function GET(request, { params }) {
  try {
    // Verify admin authentication
    const auth = await verifyAdminToken(request);
    if (!auth.isValid) {
      return sendUnauthorized(auth.error);
    }

    await connectDB();

    const product = await Product.findById(params.id).lean();

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

// PUT - Update product (admin only)
export async function PUT(request, { params }) {
  try {
    // Verify admin authentication
    const auth = await verifyAdminToken(request);
    if (!auth.isValid) {
      return sendUnauthorized(auth.error);
    }

    await connectDB();

    const body = await request.json();

    const product = await Product.findByIdAndUpdate(
      params.id,
      {
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
        isActive: body.isActive,
      },
      { new: true, runValidators: true }
    );

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Product update error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE - Delete product (admin only)
export async function DELETE(request, { params }) {
  try {
    // Verify admin authentication
    const auth = await verifyAdminToken(request);
    if (!auth.isValid) {
      return sendUnauthorized(auth.error);
    }

    await connectDB();

    const product = await Product.findByIdAndDelete(params.id);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Product deletion error:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
