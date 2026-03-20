// src/app/admin/page.jsx
// Pure server component — fetches data from API routes via serverFetch helper
// No connectDB, no mongoose, no onMouseEnter/Leave

import Link from "next/link";
import { formatDate, formatPrice } from "@/lib/utils";
import { serverFetch } from "@/lib/serverFetch";
import UpdateOrderStatus from "@/components/UpdateOrderStatus";
import { verifyAdmin } from "@/lib/verifyAdmin";
import { redirect } from "next/navigation";

async function fetchStats() {
  const data = await serverFetch("/api/admin/stats").catch(() => null);
  return data?.stats || { products: 0, customers: 0, revenue: 0 };
}

async function fetchOrders() {
  const data = await serverFetch("/api/admin/orders").catch(() => null);
  return data?.orders || [];
}

const STATUS_STYLE = {
  PENDING: { bg: "#fffbeb", color: "#92400e", dot: "#f59e0b" },
  DELIVERED: { bg: "#ecfdf5", color: "#065f46", dot: "#10b981" },
  CANCELLED: { bg: "#fef2f2", color: "#991b1b", dot: "#ef4444" },
};

export default async function AdminDashboard() {
  // Verify admin authentication
  const isAdmin = await verifyAdmin();
  if (!isAdmin) {
    redirect("/admin/login");
  }

  const [stats, orders] = await Promise.all([fetchStats(), fetchOrders()]);

  const pending = orders.filter((o) => o.status === "PENDING").length;
  const delivered = orders.filter((o) => o.status === "DELIVERED").length;

  const STAT_CARDS = [
    {
      label: "Total Products",
      value: stats.products ?? 0,
      color: "#3b82f6",
      bg: "#eff6ff",
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M2 5a1 1 0 011-1h14a1 1 0 011 1v2H2V5z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M3 7h14l-1.5 9H4.5L3 7z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      label: "Total Customers",
      value: stats.customers ?? 0,
      color: "#10b981",
      bg: "#ecfdf5",
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="8" cy="6" r="3" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M2 17c0-3 2.5-5 6-5s6 2 6 5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M14 8a2 2 0 010 0M14 13c2.5 0 4 1.5 4 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
    {
      label: "Total Revenue",
      value: formatPrice(stats.revenue ?? 0),
      color: "#8b5cf6",
      bg: "#f5f3ff",
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M10 2v16M6 6h6a2 2 0 010 4H8a2 2 0 000 4h7"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
    {
      label: "Pending Orders",
      value: pending,
      color: "#f59e0b",
      bg: "#fffbeb",
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle
            cx="10"
            cy="10"
            r="8"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M10 6v4l3 3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
  ];

  return (
    <>
      <style>{`
        .dash-row:hover { background: #fafbfd !important; }
        .dash-stat-card { transition: box-shadow 0.15s, transform 0.15s; }
        .dash-stat-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.08) !important; transform: translateY(-1px); }
      `}</style>

      <div style={{ maxWidth: 1200 }}>
        {/* Welcome banner */}
        <div
          style={{
            background: "linear-gradient(135deg, #0b3d91 0%, #1a5dbf 100%)",
            borderRadius: 14,
            padding: "20px 24px",
            marginBottom: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: "'DM Sans',sans-serif",
                fontSize: 20,
                fontWeight: 700,
                color: "#fff",
                margin: "0 0 4px",
              }}
            >
              Welcome back, Admin 👋
            </h2>
            <p
              style={{
                fontFamily: "'DM Sans',sans-serif",
                fontSize: 13,
                color: "rgba(255,255,255,0.7)",
                margin: 0,
              }}
            >
              Here's what's happening with your store today
            </p>
          </div>
          <Link
            href="/admin/products/create"
            style={{
              background: "rgba(255,255,255,0.15)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.25)",
              padding: "8px 16px",
              borderRadius: 8,
              textDecoration: "none",
              fontFamily: "'DM Sans',sans-serif",
              fontSize: 13,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 6,
              whiteSpace: "nowrap",
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

        {/* Stat cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: 16,
            marginBottom: 28,
          }}
        >
          {STAT_CARDS.map((card) => (
            <div
              key={card.label}
              className="dash-stat-card"
              style={{
                background: "#fff",
                borderRadius: 12,
                padding: "18px 20px",
                border: "1px solid #f1f5f9",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: card.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: card.color,
                  marginBottom: 12,
                }}
              >
                {card.icon}
              </div>
              <p
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 13,
                  color: "#64748b",
                  margin: "0 0 4px",
                }}
              >
                {card.label}
              </p>
              <p
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 24,
                  fontWeight: 700,
                  color: "#0f172a",
                  margin: 0,
                }}
              >
                {card.value}
              </p>
            </div>
          ))}
        </div>

        {/* Orders table */}
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            border: "1px solid #f1f5f9",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "16px 20px",
              borderBottom: "1px solid #f8fafc",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            <h3
              style={{
                fontFamily: "'DM Sans',sans-serif",
                fontSize: 15,
                fontWeight: 700,
                color: "#0f172a",
                margin: 0,
              }}
            >
              Recent Orders
            </h3>
            <div style={{ display: "flex", gap: 8 }}>
              <span
                style={{
                  background: "#fffbeb",
                  color: "#92400e",
                  border: "1px solid #fde68a",
                  padding: "3px 10px",
                  borderRadius: 999,
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                {pending} pending
              </span>
              <span
                style={{
                  background: "#ecfdf5",
                  color: "#065f46",
                  border: "1px solid #a7f3d0",
                  padding: "3px 10px",
                  borderRadius: 999,
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                {delivered} delivered
              </span>
            </div>
          </div>

          {orders.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 24px" }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: "#f8fafc",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 12px",
                  color: "#cbd5e1",
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <rect
                    x="9"
                    y="3"
                    width="6"
                    height="4"
                    rx="1"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
              <p
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 14,
                  color: "#94a3b8",
                }}
              >
                No orders yet
              </p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: 700,
                }}
              >
                <thead>
                  <tr style={{ background: "#f8fafc" }}>
                    {[
                      "Order #",
                      "Customer",
                      "Product",
                      "Size",
                      "Price",
                      "Status",
                      "Date",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "10px 16px",
                          textAlign: "left",
                          fontFamily: "'DM Sans',sans-serif",
                          fontSize: 11,
                          fontWeight: 600,
                          color: "#64748b",
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => {
                    const st =
                      STATUS_STYLE[order.status] || STATUS_STYLE.PENDING;
                    return (
                      <tr
                        key={order._id}
                        className="dash-row"
                        style={{ borderTop: "1px solid #f8fafc" }}
                      >
                        <td
                          style={{
                            padding: "12px 16px",
                            fontFamily: "'DM Sans',sans-serif",
                            fontSize: 13,
                            fontWeight: 600,
                            color: "#0b3d91",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {order.orderNumber}
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <p
                            style={{
                              fontFamily: "'DM Sans',sans-serif",
                              fontSize: 13,
                              fontWeight: 500,
                              color: "#0f172a",
                              margin: "0 0 2px",
                            }}
                          >
                            {order.customerName}
                          </p>
                          <p
                            style={{
                              fontFamily: "'DM Sans',sans-serif",
                              fontSize: 11,
                              color: "#94a3b8",
                              margin: 0,
                            }}
                          >
                            {order.customerPhone}
                          </p>
                        </td>
                        <td style={{ padding: "12px 16px", maxWidth: 160 }}>
                          <p
                            style={{
                              fontFamily: "'DM Sans',sans-serif",
                              fontSize: 13,
                              color: "#374151",
                              margin: 0,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {order.productName}
                          </p>
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          {order.selectedSize ? (
                            <span
                              style={{
                                background: "#eff6ff",
                                color: "#1d4ed8",
                                padding: "2px 8px",
                                borderRadius: 4,
                                fontSize: 12,
                                fontWeight: 600,
                                fontFamily: "'DM Sans',sans-serif",
                              }}
                            >
                              {order.selectedSize}
                            </span>
                          ) : (
                            <span
                              style={{
                                color: "#cbd5e1",
                                fontFamily: "'DM Sans',sans-serif",
                                fontSize: 13,
                              }}
                            >
                              —
                            </span>
                          )}
                        </td>
                        <td
                          style={{
                            padding: "12px 16px",
                            fontFamily: "'DM Sans',sans-serif",
                            fontSize: 13,
                            fontWeight: 600,
                            color: "#0f172a",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {formatPrice(order.productPrice)}
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 5,
                              background: st.bg,
                              color: st.color,
                              padding: "3px 10px",
                              borderRadius: 999,
                              fontSize: 12,
                              fontWeight: 600,
                              fontFamily: "'DM Sans',sans-serif",
                              whiteSpace: "nowrap",
                            }}
                          >
                            <span
                              style={{
                                width: 6,
                                height: 6,
                                borderRadius: "50%",
                                background: st.dot,
                                flexShrink: 0,
                              }}
                            />
                            {order.status}
                          </span>
                        </td>
                        <td
                          style={{
                            padding: "12px 16px",
                            fontFamily: "'DM Sans',sans-serif",
                            fontSize: 12,
                            color: "#94a3b8",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {formatDate(order.createdAt)}
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <UpdateOrderStatus
                            orderId={order._id}
                            currentStatus={order.status}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
