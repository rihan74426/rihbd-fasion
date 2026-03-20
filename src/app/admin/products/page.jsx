// src/app/admin/products/page.jsx
// Server component — fetches from /api/admin/products via serverFetch, no connectDB

import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { serverFetch } from "@/lib/serverFetch";
import DeleteProduct from "@/components/Deleteproduct";
import { verifyAdmin } from "@/lib/verifyAdmin";
import { redirect } from "next/navigation";

async function fetchProducts() {
  const data = await serverFetch("/api/admin/products").catch(() => null);
  return data?.products || [];
}

export default async function AdminProductsPage() {
  // Verify admin authentication
  const isAdmin = await verifyAdmin();
  if (!isAdmin) {
    redirect("/admin/login");
  }

  const products = await fetchProducts();
  const active = products.filter((p) => p.isActive).length;
  const outOfStock = products.filter((p) => p.stock === 0).length;

  return (
    <>
      <style>{`
        .prod-card { transition: box-shadow 0.15s, transform 0.15s; }
        .prod-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.1) !important; transform: translateY(-2px); }
        .edit-btn:hover { background: #dbeafe !important; }
      `}</style>

      <div style={{ maxWidth: 1200 }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
            marginBottom: 24,
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: "'DM Sans',sans-serif",
                fontSize: 20,
                fontWeight: 700,
                color: "#0f172a",
                margin: "0 0 4px",
              }}
            >
              Products
            </h2>
            <p
              style={{
                fontFamily: "'DM Sans',sans-serif",
                fontSize: 13,
                color: "#64748b",
                margin: 0,
              }}
            >
              {products.length} total · {active} active · {outOfStock} out of
              stock
            </p>
          </div>
          <Link
            href="/admin/products/create"
            style={{
              background: "#0b3d91",
              color: "#fff",
              textDecoration: "none",
              padding: "9px 18px",
              borderRadius: 8,
              fontFamily: "'DM Sans',sans-serif",
              fontSize: 14,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 3v10M3 8h10"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
            Add Product
          </Link>
        </div>

        {products.length === 0 ? (
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              border: "1px solid #f1f5f9",
              padding: "64px 24px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 14,
                background: "#f8fafc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
                color: "#cbd5e1",
              }}
            >
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path
                  d="M4 7a2 2 0 012-2h16a2 2 0 012 2v3H4V7z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M5 10h18l-2 14H7L5 10z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p
              style={{
                fontFamily: "'DM Sans',sans-serif",
                fontSize: 15,
                color: "#374151",
                fontWeight: 600,
                margin: "0 0 6px",
              }}
            >
              No products yet
            </p>
            <p
              style={{
                fontFamily: "'DM Sans',sans-serif",
                fontSize: 13,
                color: "#94a3b8",
                margin: 0,
              }}
            >
              Add your first product to get started
            </p>
            <Link
              href="/admin/products/create"
              style={{
                background: "#0b3d91",
                color: "#fff",
                textDecoration: "none",
                padding: "9px 20px",
                borderRadius: 8,
                fontFamily: "'DM Sans',sans-serif",
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              Add First Product
            </Link>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 16,
            }}
          >
            {products.map((product) => {
              const hasDiscount =
                product.discountPrice && product.discountPrice < product.price;
              const displayPrice = hasDiscount
                ? product.discountPrice
                : product.price;

              return (
                <div
                  key={product._id}
                  className="prod-card"
                  style={{
                    background: "#fff",
                    borderRadius: 12,
                    border: "1px solid #f1f5f9",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                    overflow: "hidden",
                  }}
                >
                  {/* Image */}
                  <div
                    style={{
                      position: "relative",
                      aspectRatio: "4/3",
                      background: "#f8fafc",
                    }}
                  >
                    <Image
                      src={product.images?.[0] || "/placeholder.jpg"}
                      alt={product.name}
                      fill
                      sizes="(max-width:768px) 100vw, 300px"
                      style={{ objectFit: "cover" }}
                    />
                    {/* Active badge */}
                    <div style={{ position: "absolute", top: 10, left: 10 }}>
                      <span
                        style={{
                          background: product.isActive ? "#ecfdf5" : "#f8fafc",
                          color: product.isActive ? "#065f46" : "#64748b",
                          border: `1px solid ${
                            product.isActive ? "#a7f3d0" : "#e2e8f0"
                          }`,
                          padding: "2px 8px",
                          borderRadius: 999,
                          fontFamily: "'DM Sans',sans-serif",
                          fontSize: 11,
                          fontWeight: 600,
                        }}
                      >
                        {product.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    {/* Stock badge */}
                    <div style={{ position: "absolute", top: 10, right: 10 }}>
                      <span
                        style={{
                          background:
                            product.stock === 0
                              ? "#fef2f2"
                              : product.stock <= 5
                              ? "#fffbeb"
                              : "#f0fdf4",
                          color:
                            product.stock === 0
                              ? "#991b1b"
                              : product.stock <= 5
                              ? "#92400e"
                              : "#166534",
                          padding: "2px 8px",
                          borderRadius: 999,
                          fontFamily: "'DM Sans',sans-serif",
                          fontSize: 11,
                          fontWeight: 600,
                        }}
                      >
                        {product.stock === 0
                          ? "Out of stock"
                          : `Stock: ${product.stock}`}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div style={{ padding: "14px 16px" }}>
                    <h3
                      style={{
                        fontFamily: "'DM Sans',sans-serif",
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#0f172a",
                        margin: "0 0 4px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {product.name}
                    </h3>
                    <p
                      style={{
                        fontFamily: "'DM Sans',sans-serif",
                        fontSize: 12,
                        color: "#64748b",
                        margin: "0 0 10px",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {product.description}
                    </p>

                    {/* Price */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 10,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'DM Sans',sans-serif",
                          fontSize: 16,
                          fontWeight: 700,
                          color: "#0b3d91",
                        }}
                      >
                        {formatPrice(displayPrice)}
                      </span>
                      {hasDiscount && (
                        <span
                          style={{
                            fontFamily: "'DM Sans',sans-serif",
                            fontSize: 12,
                            color: "#94a3b8",
                            textDecoration: "line-through",
                          }}
                        >
                          {formatPrice(product.price)}
                        </span>
                      )}
                      {product.featured && (
                        <span
                          style={{
                            marginLeft: "auto",
                            background: "#fffbeb",
                            color: "#92400e",
                            border: "1px solid #fde68a",
                            padding: "1px 6px",
                            borderRadius: 4,
                            fontSize: 10,
                            fontWeight: 600,
                            fontFamily: "'DM Sans',sans-serif",
                          }}
                        >
                          Featured
                        </span>
                      )}
                    </div>

                    {/* Sizes */}
                    {product.sizes?.length > 0 && (
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 4,
                          marginBottom: 12,
                        }}
                      >
                        {product.sizes.map((s) => (
                          <span
                            key={s}
                            style={{
                              background: "#eff6ff",
                              color: "#1d4ed8",
                              padding: "1px 6px",
                              borderRadius: 4,
                              fontFamily: "'DM Sans',sans-serif",
                              fontSize: 10,
                              fontWeight: 600,
                            }}
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    <div style={{ display: "flex", gap: 8 }}>
                      <Link
                        href={`/admin/products/${product._id}/edit`}
                        className="edit-btn"
                        style={{
                          flex: 1,
                          textAlign: "center",
                          background: "#eff6ff",
                          color: "#1d4ed8",
                          padding: "7px 12px",
                          borderRadius: 7,
                          textDecoration: "none",
                          fontFamily: "'DM Sans',sans-serif",
                          fontSize: 13,
                          fontWeight: 600,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 5,
                          transition: "background 0.15s",
                        }}
                      >
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 13 13"
                          fill="none"
                        >
                          <path
                            d="M2 10.5L10 2.5l2 2-8 8H2v-2z"
                            stroke="currentColor"
                            strokeWidth="1.3"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Edit
                      </Link>
                      <DeleteProduct productId={product._id} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
