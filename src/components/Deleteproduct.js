"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteProduct({ productId }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this product? This cannot be undone."
      )
    )
      return;
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete product");
      router.refresh();
    } catch (error) {
      alert(error.message);
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      style={{
        background: "#fef2f2",
        color: "#991b1b",
        border: "1px solid #fecaca",
        padding: "7px 12px",
        borderRadius: 7,
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 13,
        fontWeight: 600,
        cursor: loading ? "not-allowed" : "pointer",
        opacity: loading ? 0.5 : 1,
        transition: "background 0.15s",
        display: "flex",
        alignItems: "center",
        gap: 4,
      }}
      onMouseEnter={(e) => {
        if (!loading) e.currentTarget.style.background = "#fee2e2";
      }}
      onMouseLeave={(e) => (e.currentTarget.style.background = "#fef2f2")}
    >
      <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
        <path
          d="M2 3h9M4.5 3V2h4v1M5 5.5v4M8 5.5v4M3 3l.5 8h6L10 3"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {loading ? "…" : "Delete"}
    </button>
  );
}
