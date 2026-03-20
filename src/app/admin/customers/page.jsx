// src/app/admin/customers/page.jsx
// Server component — fetches from /api/admin/customers via serverFetch, no connectDB

import { formatDate, formatPrice } from "@/lib/utils";
import { serverFetch } from "@/lib/serverFetch";

async function fetchCustomers() {
  const data = await serverFetch("/api/admin/customers").catch(() => null);
  return data?.customers || [];
}

export default async function CustomersPage() {
  const customers = await fetchCustomers();

  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const totalOrders = customers.reduce((sum, c) => sum + c.orders.length, 0);

  return (
    <>
      <style>{`
        .cust-row:hover { background: #fafbfd !important; }
      `}</style>

      <div style={{ maxWidth: 1200 }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h2
            style={{
              fontFamily: "'DM Sans',sans-serif",
              fontSize: 20,
              fontWeight: 700,
              color: "#0f172a",
              margin: "0 0 4px",
            }}
          >
            Customers
          </h2>
          <p
            style={{
              fontFamily: "'DM Sans',sans-serif",
              fontSize: 13,
              color: "#64748b",
              margin: 0,
            }}
          >
            All customers who have placed orders
          </p>
        </div>

        {/* Summary stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: 16,
            marginBottom: 24,
          }}
        >
          {[
            {
              label: "Total Customers",
              value: customers.length,
              color: "#3b82f6",
              bg: "#eff6ff",
            },
            {
              label: "Total Orders",
              value: totalOrders,
              color: "#10b981",
              bg: "#ecfdf5",
            },
            {
              label: "Total Revenue",
              value: formatPrice(totalRevenue),
              color: "#8b5cf6",
              bg: "#f5f3ff",
            },
          ].map((card) => (
            <div
              key={card.label}
              style={{
                background: "#fff",
                borderRadius: 12,
                padding: "16px 18px",
                border: "1px solid #f1f5f9",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                borderLeft: `4px solid ${card.color}`,
              }}
            >
              <p
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 12,
                  color: "#64748b",
                  margin: "0 0 6px",
                }}
              >
                {card.label}
              </p>
              <p
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 22,
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

        {/* Table */}
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
              Customer List
            </h3>
            <span
              style={{
                fontFamily: "'DM Sans',sans-serif",
                fontSize: 12,
                color: "#94a3b8",
              }}
            >
              {customers.length} customers
            </span>
          </div>

          {customers.length === 0 ? (
            <div style={{ textAlign: "center", padding: "56px 24px" }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: "#f8fafc",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 14px",
                  color: "#cbd5e1",
                }}
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#374151",
                  margin: "0 0 4px",
                }}
              >
                No customers yet
              </p>
              <p
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 13,
                  color: "#94a3b8",
                  margin: 0,
                }}
              >
                Customers appear here once orders are placed
              </p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: 680,
                }}
              >
                <thead>
                  <tr style={{ background: "#f8fafc" }}>
                    {[
                      "Customer",
                      "Phone",
                      "Orders",
                      "Total Spent",
                      "Last Order",
                      "Contact",
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
                  {customers.map((customer) => {
                    const pendingCount = customer.orders.filter(
                      (o) => o.status === "PENDING"
                    ).length;
                    const deliveredCount = customer.orders.filter(
                      (o) => o.status === "DELIVERED"
                    ).length;

                    // Build wa.me number — strip 0 prefix, add 880
                    let waNumber = customer.phone.replace(/\s/g, "");
                    if (waNumber.startsWith("0"))
                      waNumber = "880" + waNumber.slice(1);
                    else if (!waNumber.startsWith("880"))
                      waNumber = "880" + waNumber;

                    return (
                      <tr
                        key={customer.phone}
                        className="cust-row"
                        style={{ borderTop: "1px solid #f8fafc" }}
                      >
                        {/* Name + avatar */}
                        <td
                          style={{ padding: "12px 16px", whiteSpace: "nowrap" }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                            }}
                          >
                            <div
                              style={{
                                width: 34,
                                height: 34,
                                borderRadius: "50%",
                                background:
                                  "linear-gradient(135deg, #0b3d91, #1a5dbf)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                              }}
                            >
                              <span
                                style={{
                                  color: "#fff",
                                  fontWeight: 700,
                                  fontSize: 14,
                                  fontFamily: "'DM Sans',sans-serif",
                                }}
                              >
                                {customer.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p
                                style={{
                                  fontFamily: "'DM Sans',sans-serif",
                                  fontSize: 13,
                                  fontWeight: 600,
                                  color: "#0f172a",
                                  margin: "0 0 1px",
                                }}
                              >
                                {customer.name}
                              </p>
                              <p
                                style={{
                                  fontFamily: "'DM Sans',sans-serif",
                                  fontSize: 11,
                                  color: "#94a3b8",
                                  margin: 0,
                                }}
                              >
                                Since {formatDate(customer.firstSeen)}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Phone */}
                        <td
                          style={{ padding: "12px 16px", whiteSpace: "nowrap" }}
                        >
                          <span
                            style={{
                              fontFamily: "monospace",
                              fontSize: 13,
                              color: "#374151",
                              background: "#f8fafc",
                              border: "1px solid #f1f5f9",
                              padding: "3px 8px",
                              borderRadius: 6,
                            }}
                          >
                            {customer.phone}
                          </span>
                        </td>

                        {/* Orders */}
                        <td
                          style={{ padding: "12px 16px", whiteSpace: "nowrap" }}
                        >
                          <p
                            style={{
                              fontFamily: "'DM Sans',sans-serif",
                              fontSize: 13,
                              fontWeight: 600,
                              color: "#0f172a",
                              margin: "0 0 4px",
                            }}
                          >
                            {customer.orders.length} total
                          </p>
                          <div style={{ display: "flex", gap: 4 }}>
                            {pendingCount > 0 && (
                              <span
                                style={{
                                  background: "#fffbeb",
                                  color: "#92400e",
                                  padding: "1px 6px",
                                  borderRadius: 4,
                                  fontFamily: "'DM Sans',sans-serif",
                                  fontSize: 10,
                                  fontWeight: 600,
                                }}
                              >
                                {pendingCount} pending
                              </span>
                            )}
                            {deliveredCount > 0 && (
                              <span
                                style={{
                                  background: "#ecfdf5",
                                  color: "#065f46",
                                  padding: "1px 6px",
                                  borderRadius: 4,
                                  fontFamily: "'DM Sans',sans-serif",
                                  fontSize: 10,
                                  fontWeight: 600,
                                }}
                              >
                                {deliveredCount} done
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Total spent */}
                        <td
                          style={{ padding: "12px 16px", whiteSpace: "nowrap" }}
                        >
                          <span
                            style={{
                              fontFamily: "'DM Sans',sans-serif",
                              fontSize: 13,
                              fontWeight: 700,
                              color: "#0f172a",
                            }}
                          >
                            {formatPrice(customer.totalSpent)}
                          </span>
                        </td>

                        {/* Last order */}
                        <td style={{ padding: "12px 16px" }}>
                          <p
                            style={{
                              fontFamily: "'DM Sans',sans-serif",
                              fontSize: 13,
                              color: "#374151",
                              margin: "0 0 2px",
                            }}
                          >
                            {formatDate(customer.lastSeen)}
                          </p>
                          <p
                            style={{
                              fontFamily: "'DM Sans',sans-serif",
                              fontSize: 11,
                              color: "#94a3b8",
                              margin: 0,
                              maxWidth: 140,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {customer.orders[0]?.productName}
                          </p>
                        </td>

                        {/* WhatsApp contact */}
                        <td
                          style={{ padding: "12px 16px", whiteSpace: "nowrap" }}
                        >
                          <a
                            href={`https://wa.me/${waNumber}?text=${encodeURIComponent(
                              `Hi ${customer.name}! This is Rihbd Fashion. We're reaching out regarding your order.`
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 6,
                              padding: "6px 12px",
                              background: "#25D366",
                              color: "#fff",
                              borderRadius: 7,
                              textDecoration: "none",
                              fontFamily: "'DM Sans',sans-serif",
                              fontSize: 12,
                              fontWeight: 600,
                            }}
                          >
                            <svg
                              width="13"
                              height="13"
                              viewBox="0 0 24 24"
                              fill="white"
                            >
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.6 12.6 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                            WhatsApp
                          </a>
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
