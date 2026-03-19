// src/components/OrderFormClient.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OrderFormClient({ product }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerAddress: "",
    selectedSize: "",
  });
  const [errors, setErrors] = useState({});

  const sizes =
    Array.isArray(product.sizes) && product.sizes.length ? product.sizes : [];
  const hasSizes = sizes.length > 0;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.customerName.trim()) errs.customerName = "Name is required";
    if (!formData.customerPhone.trim()) {
      errs.customerPhone = "Phone number is required";
    } else if (
      !/^01[3-9]\d{8}$/.test(formData.customerPhone.replace(/\s/g, ""))
    ) {
      errs.customerPhone = "Invalid Bangladesh phone number (e.g. 01712345678)";
    }
    if (!formData.customerAddress.trim()) {
      errs.customerAddress = "Address is required";
    } else if (formData.customerAddress.trim().length < 10) {
      errs.customerAddress = "Please provide a complete address";
    }
    if (hasSizes && !formData.selectedSize) {
      errs.selectedSize = "Please select a size";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product._id,
          customerName: formData.customerName.trim(),
          customerPhone: formData.customerPhone.trim(),
          customerAddress: formData.customerAddress.trim(),
          selectedSize: formData.selectedSize || null,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to place order");
      router.push(`/order-success?orderNumber=${data.orderNumber}`);
    } catch (err) {
      alert(err.message || "Failed to place order. Please try again.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Size selector */}
      {hasSizes && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Size <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {sizes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setFormData((p) => ({ ...p, selectedSize: s }));
                  setErrors((p) => ({ ...p, selectedSize: "" }));
                }}
                className="transition-all duration-150"
                style={{
                  padding: "0.45rem 1rem",
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  border:
                    formData.selectedSize === s
                      ? "2px solid #0b3d91"
                      : "2px solid #d1d5db",
                  background: formData.selectedSize === s ? "#0b3d91" : "#fff",
                  color: formData.selectedSize === s ? "#fff" : "#374151",
                  transition: "all 0.15s",
                }}
              >
                {s}
              </button>
            ))}
          </div>
          {errors.selectedSize && (
            <p className="text-red-500 text-sm mt-1">{errors.selectedSize}</p>
          )}
        </div>
      )}

      {/* Name */}
      <div>
        <label
          htmlFor="customerName"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="customerName"
          name="customerName"
          value={formData.customerName}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
            errors.customerName ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Enter your full name"
          disabled={loading}
        />
        {errors.customerName && (
          <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label
          htmlFor="customerPhone"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Phone Number <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          id="customerPhone"
          name="customerPhone"
          value={formData.customerPhone}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
            errors.customerPhone ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="01712345678"
          disabled={loading}
        />
        {errors.customerPhone && (
          <p className="text-red-500 text-sm mt-1">{errors.customerPhone}</p>
        )}
      </div>

      {/* Address */}
      <div>
        <label
          htmlFor="customerAddress"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Delivery Address <span className="text-red-500">*</span>
        </label>
        <textarea
          id="customerAddress"
          name="customerAddress"
          value={formData.customerAddress}
          onChange={handleChange}
          rows={4}
          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
            errors.customerAddress ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="House/Flat no, Road, Area, District, Division"
          disabled={loading}
        />
        {errors.customerAddress && (
          <p className="text-red-500 text-sm mt-1">{errors.customerAddress}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          Please provide complete address with district and division
        </p>
      </div>

      {/* Order summary */}
      <div className="bg-gray-50 rounded-lg p-4 text-sm">
        <div className="flex justify-between items-center mb-1">
          <span className="text-gray-600">Product</span>
          <span className="font-medium text-gray-900 truncate max-w-[180px]">
            {product.name}
          </span>
        </div>
        {formData.selectedSize && (
          <div className="flex justify-between items-center mb-1">
            <span className="text-gray-600">Size</span>
            <span className="font-bold text-primary">
              {formData.selectedSize}
            </span>
          </div>
        )}
        <div className="flex justify-between items-center border-t border-gray-200 pt-2 mt-2">
          <span className="text-gray-600 font-medium">Total</span>
          <span className="text-lg font-bold text-primary">
            ৳{(product.displayPrice || product.price).toLocaleString("en-BD")}
          </span>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 px-4 rounded-md font-medium text-white transition-colors ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-primary hover:bg-primary-dark"
        }`}
      >
        {loading ? "Placing Order..." : "Place Order (Cash on Delivery)"}
      </button>

      <p className="text-xs text-gray-500 text-center">
        By placing order, you agree to our terms and conditions
      </p>
    </form>
  );
}
