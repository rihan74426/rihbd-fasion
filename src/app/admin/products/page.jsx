// app/admin/products/page.js
// Admin products management page

import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import DeleteProduct from "@/components/Deleteproduct";

async function getProducts() {
  try {
    await connectDB();
    const products = await Product.find().sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600">Manage your product catalog</p>
        </div>

        <Link
          href="/admin/products/create"
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md font-medium transition-colors"
        >
          Add Product
        </Link>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          {" "}
          <p className="text-gray-500 mb-4">No products yet</p>
          <Link
            href="/admin/products/create"
            className="inline-block bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-md font-medium transition-colors"
          >
            Add Your First Product
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-lg shadow overflow-hidden"
            >
              {/* Product Image */}
              <div className="relative aspect-square bg-gray-100">
                <Image
                  src={product.images?.[0] || "/placeholder.jpg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                />

                {/* Stock Badge */}
                <div className="absolute top-2 right-2">
                  <span
                    className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                      product.stock === 0
                        ? "bg-red-500 text-white"
                        : product.stock <= 5
                        ? "bg-yellow-500 text-white"
                        : "bg-green-500 text-white"
                    }`}
                  >
                    Stock: {product.stock}
                  </span>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                  {product.name}
                </h3>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {product.description}
                </p>

                <p className="text-xl font-bold text-primary mb-4">
                  {formatPrice(product.price)}
                </p>

                {/* Status Badge */}
                <div className="mb-4">
                  <span
                    className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                      product.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {product.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link
                    href={`/admin/products/${product._id}/edit`}
                    className="flex-1 text-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Edit
                  </Link>

                  <DeleteProduct productId={product._id} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
