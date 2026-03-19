"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import WhatsAppButton from "@/components/WhatsAppButton";
import { formatPrice } from "@/lib/utils";
import styles from "./page.module.css";

function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative aspect-[4/5] bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse" />
        <div className="h-3 bg-gray-200 rounded w-full animate-pulse" />
        <div className="h-7 bg-gray-200 rounded w-1/2 animate-pulse" />
        <div className="h-10 bg-gray-200 rounded w-full animate-pulse mt-2" />
      </div>
    </div>
  );
}

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(8);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let mounted = true;

    // Client fetch uses relative path; server env not needed for client runtime.
    fetch("/api/products")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then((data) => {
        if (!mounted) return;
        setProducts(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Failed to load products", err);
        if (mounted) setProducts([]);
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return products;
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
        (p.name || "").toLowerCase().includes(q) ||
        (p.description || "").toLowerCase().includes(q)
    );
  }, [products, query]);

  const visibleProducts = filtered.slice(0, visibleCount);
  const canLoadMore = filtered.length > visibleCount;

  return (
    <main className={`${styles.page} min-h-screen bg-gray-50`}>
      {/* Hero */}
      <header className="bg-gradient-to-r from-[#0b3d91] to-[#062a5f] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 flex flex-col lg:flex-row gap-8 items-center">
          <div className="w-full lg:w-1/2">
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
              {process.env.NEXT_PUBLIC_APP_NAME || "RIH BD"}
            </h1>
            <p className="mt-4 text-lg text-[#f7e6b3] max-w-lg">
              Quality panjabi & apparel — crafted with care. Easy ordering, Cash
              on Delivery, fast local delivery.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="#products"
                className="inline-flex items-center gap-2 bg-[#d4af37] hover:bg-[#b8922b] text-[#062a5f] font-semibold px-5 py-3 rounded-full"
              >
                Shop Now
              </Link>

              <a
                href={
                  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
                    ? `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`
                    : "#"
                }
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 border border-white/30 hover:border-white px-4 py-3 rounded-full text-sm"
              >
                Contact on WhatsApp
              </a>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4 max-w-md">
              <div className="text-center">
                <div className="text-2xl font-bold">COD</div>
                <div className="text-xs text-white/80">Cash on Delivery</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">Quality</div>
                <div className="text-xs text-white/80">Premium fabric</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">Support</div>
                <div className="text-xs text-white/80">Always on WhatsApp</div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2">
            {/* Hero visual — show a collage of top images if available */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-3">
                <div className="bg-white rounded-lg overflow-hidden shadow-lg">
                  <Image
                    src="/hero-1.jpg"
                    alt="hero"
                    width={600}
                    height={600}
                    className="object-cover w-full h-30"
                  />
                </div>
                <div className="bg-white rounded-lg overflow-hidden shadow-lg">
                  <Image
                    src="/hero-4.jpg"
                    alt="hero"
                    width={600}
                    height={600}
                    className="object-cover w-full h-30"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <div className="bg-white rounded-lg overflow-hidden shadow-lg">
                  <Image
                    src="/hero-2.jpg"
                    alt="hero"
                    width={600}
                    height={600}
                    className="object-cover w-full h-30"
                  />
                </div>
                <div className="bg-white rounded-lg overflow-hidden shadow-lg">
                  <Image
                    src="/hero-3.jpg"
                    alt="hero"
                    width={600}
                    height={600}
                    className="object-cover w-full h-30"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Search + Featured */}
      <section
        id="products"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-[#0b3d91]">
              Featured Products
            </h2>
            <p className="text-sm text-gray-600">
              Choose your style and place order with COD
            </p>
          </div>

          <div className="w-full md:w-1/3">
            <label className="relative block">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-4 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                🔍
              </span>
            </label>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No products found</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {visibleProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {canLoadMore && (
              <div className="mt-8 text-center">
                <button
                  onClick={() => setVisibleCount((c) => c + 8)}
                  className="inline-flex items-center gap-2 bg-[#0b3d91] hover:bg-[#062a5f] text-white px-6 py-3 rounded-md"
                >
                  Load more
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Benefits / How it works */}
      <section className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h3 className="text-xl font-semibold text-[#0b3d91] mb-6">
            How it works
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 border rounded-lg text-center">
              <div className="text-3xl font-bold text-[#d4af37]">1</div>
              <h4 className="mt-4 font-semibold">Pick a product</h4>
              <p className="mt-2 text-sm text-gray-600">
                Browse and choose the product you like.
              </p>
            </div>
            <div className="p-6 border rounded-lg text-center">
              <div className="text-3xl font-bold text-[#d4af37]">2</div>
              <h4 className="mt-4 font-semibold">Place order</h4>
              <p className="mt-2 text-sm text-gray-600">
                Fill your name, phone and address — we will call to confirm.
              </p>
            </div>
            <div className="p-6 border rounded-lg text-center">
              <div className="text-3xl font-bold text-[#d4af37]">3</div>
              <h4 className="mt-4 font-semibold">Pay on delivery</h4>
              <p className="mt-2 text-sm text-gray-600">
                Receive product and pay cash to the rider.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <h4 className="font-semibold">
            {process.env.NEXT_PUBLIC_APP_NAME || "RIH BD"}
          </h4>
          <p className="text-xs text-gray-400 mt-2">
            © {new Date().getFullYear()} All rights reserved
          </p>
        </div>
      </footer>

      <WhatsAppButton />
    </main>
  );
}
