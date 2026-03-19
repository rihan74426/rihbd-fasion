// components/UpdateOrderStatus.js
// Client component to update order status

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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order");
      }

      router.refresh();
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      {currentStatus === "PENDING" && (
        <button
          onClick={() => handleStatusChange("DELIVERED")}
          disabled={loading}
          className="text-xs bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition-colors disabled:opacity-50"
        >
          Mark Delivered
        </button>
      )}

      {currentStatus !== "CANCELLED" && (
        <button
          onClick={() => handleStatusChange("CANCELLED")}
          disabled={loading}
          className="text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
      )}
    </div>
  );
}
