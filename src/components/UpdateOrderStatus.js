"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UpdateOrderStatus({ orderId, currentStatus }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (newStatus) => {
    if (!confirm(`Change order status to ${newStatus}?`)) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error("Failed to update order");
      router.refresh();
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", gap: 6 }}>
      {currentStatus === "PENDING" && (
        <button
          onClick={() => handleStatusChange("DELIVERED")}
          disabled={loading}
          style={{
            background: "#ecfdf5",
            color: "#065f46",
            border: "1px solid #a7f3d0",
            padding: "4px 10px",
            borderRadius: 6,
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 12,
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.5 : 1,
            transition: "background 0.15s",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => {
            if (!loading) e.currentTarget.style.background = "#d1fae5";
          }}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#ecfdf5")}
        >
          Delivered
        </button>
      )}
      {currentStatus !== "CANCELLED" && (
        <button
          onClick={() => handleStatusChange("CANCELLED")}
          disabled={loading}
          style={{
            background: "#fef2f2",
            color: "#991b1b",
            border: "1px solid #fecaca",
            padding: "4px 10px",
            borderRadius: 6,
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 12,
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.5 : 1,
            transition: "background 0.15s",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => {
            if (!loading) e.currentTarget.style.background = "#fee2e2";
          }}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#fef2f2")}
        >
          Cancel
        </button>
      )}
    </div>
  );
}
