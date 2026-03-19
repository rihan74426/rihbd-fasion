// components/OrderFormClient.js
// Client-side order form with submission

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
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = "Name is required";
    }

    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = "Phone number is required";
    } else if (
      !/^01[3-9]\d{8}$/.test(formData.customerPhone.replace(/\s/g, ""))
    ) {
      newErrors.customerPhone = "Invalid Bangladesh phone number";
    }

    if (!formData.customerAddress.trim()) {
      newErrors.customerAddress = "Address is required";
    } else if (formData.customerAddress.trim().length < 10) {
      newErrors.customerAddress = "Please provide a complete address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product._id,
          customerName: formData.customerName.trim(),
          customerPhone: formData.customerPhone.trim(),
          customerAddress: formData.customerAddress.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to place order");
      }

      // Redirect to success page
      router.push(`/order-success?orderNumber=${data.orderNumber}`);
    } catch (error) {
      console.error("Error placing order:", error);
      alert(error.message || "Failed to place order. Please try again.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name */}
      <div>
        <label
          htmlFor="customerName"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Full Name *
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
          Phone Number *
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
          Delivery Address *
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

      {/* Submit Button */}
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
