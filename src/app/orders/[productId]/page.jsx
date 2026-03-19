// src/app/orders/[productId]/page.jsx
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import OrderFormClient from "@/components/OrderFormClient";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

function formatPrice(price) {
  const num = typeof price === "string" ? parseFloat(price) : price;
  return `৳${num.toLocaleString("en-BD")}`;
}

async function getProduct(productId) {
  try {
    await connectDB();
    const product = await Product.findById(productId);
    if (!product) return null;
    return JSON.parse(JSON.stringify(product));
  } catch {
    return null;
  }
}

export default async function OrderPage({ params }) {
  const { productId } = await params;
  const product = await getProduct(productId);

  if (!product || !product.isActive || product.stock === 0) notFound();

  const productImage = product.images?.[0] || "/placeholder.jpg";
  const hasDiscount =
    product.discountPrice && product.discountPrice < product.price;
  const displayPrice = hasDiscount ? product.discountPrice : product.price;
  const sizes =
    Array.isArray(product.sizes) && product.sizes.length ? product.sizes : [];

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back */}
        <Link
          href="/"
          className="inline-flex items-center text-primary hover:text-primary-dark mb-6"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Products
        </Link>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-6 md:p-8">
            {/* Product info */}
            <div>
              <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 mb-4">
                <Image
                  src={productImage}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>

              {/* Price — always show discountPrice if present */}
              <div className="flex items-center gap-3 mb-4">
                <p className="text-3xl font-bold text-primary">
                  {formatPrice(displayPrice)}
                </p>
                {hasDiscount && (
                  <p className="text-lg text-gray-400 line-through">
                    {formatPrice(product.price)}
                  </p>
                )}
                {hasDiscount && (
                  <span className="text-sm font-bold text-white bg-amber-500 px-2 py-0.5 rounded-full">
                    {Math.round(
                      ((product.price - product.discountPrice) /
                        product.price) *
                        100
                    )}
                    % OFF
                  </span>
                )}
              </div>

              <p className="text-gray-600 mb-4">{product.description}</p>

              {/* Available sizes */}
              {sizes.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    Available Sizes
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((s) => (
                      <span
                        key={s}
                        className="px-3 py-1 text-sm font-semibold border-2 border-primary text-primary rounded-md bg-blue-50"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* COD badge */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center text-green-800">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-medium">
                    Cash on Delivery Available
                  </span>
                </div>
                <p className="text-sm text-green-700 mt-2">
                  Pay when you receive your product. Safe and secure.
                </p>
              </div>
            </div>

            {/* Order form */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Order Information
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Fill in your details below to place your order. We will contact
                you to confirm.
              </p>
              {/* Pass product with corrected price and sizes */}
              <OrderFormClient
                product={{
                  ...product,
                  displayPrice, // the price to charge
                  sizes,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
