// components/ProductCard.js
// Product display card for shop

import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

export default function ProductCard({ product }) {
  const isOutOfStock = product.stock === 0;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      {/* Product Image */}
      <Link href={`/order/${product._id}`}>
        <div className="relative aspect-[4/5] bg-gray-100">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover"
          />

          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="bg-red-500 text-white px-4 py-2 rounded-md font-bold">
                Out of Stock
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        <Link href={`/order/${product._id}`}>
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 min-h-[56px] hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2 min-h-[40px]">
          {product.description}
        </p>

        {/* Price */}
        <p className="text-2xl font-bold text-primary mb-4">
          {formatPrice(product.price)}
        </p>

        {/* Order Button */}
        <Link
          href={`/order/${product._id}`}
          className={`block w-full text-center py-3 rounded-md font-medium transition-colors ${
            isOutOfStock
              ? "bg-gray-300 text-gray-500 cursor-not-allowed pointer-events-none"
              : "bg-primary text-white hover:bg-primary-dark"
          }`}
        >
          {isOutOfStock ? "Out of Stock" : "Order Now"}
        </Link>
      </div>
    </div>
  );
}
