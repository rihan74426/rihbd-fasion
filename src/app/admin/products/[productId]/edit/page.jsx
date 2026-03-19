// src/app/admin/products/[id]/edit/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { Upload, X, Plus, AlertCircle, Loader2 } from "lucide-react";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id;

  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [images, setImages] = useState([]);
  const [colorInput, setColorInput] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    discountPrice: "",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [],
    stock: "",
    featured: false,
    isActive: true,
  });

  // Fetch existing product on mount
  useEffect(() => {
    if (!productId) return;
    fetch(`/api/admin/products/${productId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
          setPageLoading(false);
          return;
        }
        const p = data.product;
        setFormData({
          name: p.name || "",
          description: p.description || "",
          category: p.category || "",
          price: p.price?.toString() || "",
          discountPrice: p.discountPrice?.toString() || "",
          sizes:
            Array.isArray(p.sizes) && p.sizes.length
              ? p.sizes
              : ["XS", "S", "M", "L", "XL", "XXL"],
          colors: Array.isArray(p.colors) ? p.colors : [],
          stock: p.stock?.toString() || "0",
          featured: p.featured || false,
          isActive: p.isActive !== undefined ? p.isActive : true,
        });
        setImages(
          Array.isArray(p.images) ? p.images : p.image ? [p.image] : []
        );
        setPageLoading(false);
      })
      .catch(() => {
        setError("Failed to load product");
        setPageLoading(false);
      });
  }, [productId]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError("");
    setSuccess("");
  };

  const handleAddColor = () => {
    if (colorInput.trim() && !formData.colors.includes(colorInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        colors: [...prev.colors, colorInput.trim()],
      }));
      setColorInput("");
    }
  };

  const handleRemoveColor = (idx) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== idx),
    }));
  };

  const toggleSize = (size) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploadLoading(true);
    try {
      for (const file of files) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (data.url) setImages((prev) => [...prev, data.url]);
        else throw new Error(data.error || "Upload failed");
      }
    } catch (err) {
      setError("Image upload failed: " + err.message);
    } finally {
      setUploadLoading(false);
      // Reset input so same file can be re-selected
      e.target.value = "";
    }
  };

  const handleRemoveImage = (idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate
    if (!formData.name.trim()) {
      setError("Product name is required");
      return;
    }
    if (!formData.description.trim()) {
      setError("Product description is required");
      return;
    }
    if (!formData.category) {
      setError("Please select a category");
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError("Valid price is required");
      return;
    }
    if (formData.stock === "" || parseInt(formData.stock) < 0) {
      setError("Valid stock quantity is required");
      return;
    }
    if (images.length === 0) {
      setError("At least one product image is required");
      return;
    }
    if (
      formData.discountPrice &&
      parseFloat(formData.discountPrice) >= parseFloat(formData.price)
    ) {
      setError("Discount price must be less than the regular price");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          description: formData.description.trim(),
          category: formData.category,
          price: parseFloat(formData.price),
          discountPrice: formData.discountPrice
            ? parseFloat(formData.discountPrice)
            : null,
          images,
          sizes: formData.sizes,
          colors: formData.colors,
          stock: parseInt(formData.stock),
          featured: formData.featured,
          isActive: formData.isActive,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update product");

      setSuccess("Product updated successfully!");
      setTimeout(() => router.push("/admin/products"), 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // ── Loading state ──
  if (pageLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <Loader2
            className="w-8 h-8 animate-spin text-primary"
            style={{ color: "#0b3d91" }}
          />
          <p className="text-gray-500 text-sm">Loading product...</p>
        </div>
      </div>
    );
  }

  const ALL_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "2XL", "3XL"];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
          <p className="text-gray-600 mt-1">
            Update product details and images
          </p>
        </div>
        <button
          onClick={() => router.back()}
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          ← Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Error / Success */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle
              size={20}
              className="text-red-600 flex-shrink-0 mt-0.5"
            />
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-700 text-sm font-medium">{success}</p>
          </div>
        )}

        {/* ── Images ── */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Product Images
          </h2>

          <label
            htmlFor="image-upload"
            className={`cursor-pointer flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 transition-colors ${
              uploadLoading
                ? "border-gray-200 bg-gray-50"
                : "border-gray-300 hover:border-primary"
            }`}
            style={{ "--tw-ring-color": "#0b3d91" }}
          >
            <input
              type="file"
              id="image-upload"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              disabled={uploadLoading}
            />
            {uploadLoading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 size={28} className="animate-spin text-gray-400" />
                <p className="text-sm text-gray-500">Uploading...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload size={28} className="text-gray-400" />
                <p className="text-sm font-medium text-gray-700">
                  Click to upload more images
                </p>
                <p className="text-xs text-gray-400">
                  PNG, JPG, WEBP — max 5MB each
                </p>
              </div>
            )}
          </label>

          {/* Existing + new images */}
          {images.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-medium text-gray-700 mb-3">
                Images ({images.length}) — drag first image to set as cover
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((img, idx) => (
                  <div key={`${img}-${idx}`} className="relative group">
                    <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={img}
                        alt={`Product image ${idx + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100px, 150px"
                      />
                      {idx === 0 && (
                        <div className="absolute bottom-0 inset-x-0 bg-primary/80 py-0.5 text-center">
                          <span className="text-white text-xs font-semibold">
                            Cover
                          </span>
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1.5 right-1.5 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Product details ── */}
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Product Details
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              style={{ "--tw-ring-color": "#0b3d91" }}
              placeholder="Enter product name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              placeholder="Enter product description"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                required
              >
                <option value="">Select category</option>
                <option value="mens">Men</option>
                <option value="womens">Women</option>
                <option value="kids">Kids</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (৳) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount Price (৳)
              </label>
              <input
                type="number"
                name="discountPrice"
                value={formData.discountPrice}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                placeholder="Leave blank for no discount"
                step="0.01"
                min="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Quantity *
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                placeholder="0"
                min="0"
                required
              />
            </div>
          </div>
        </div>

        {/* ── Sizes ── */}
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Variants & Options
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Available Sizes
            </label>
            <div className="flex flex-wrap gap-2">
              {ALL_SIZES.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleSize(size)}
                  className="px-4 py-2 rounded-lg text-sm font-semibold border-2 transition-all"
                  style={{
                    border: formData.sizes.includes(size)
                      ? "2px solid #0b3d91"
                      : "2px solid #d1d5db",
                    background: formData.sizes.includes(size)
                      ? "#0b3d91"
                      : "#fff",
                    color: formData.sizes.includes(size) ? "#fff" : "#374151",
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Click to toggle sizes on or off
            </p>
          </div>

          {/* Colors */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Available Colors
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={colorInput}
                onChange={(e) => setColorInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddColor();
                  }
                }}
                placeholder="e.g., Red, Navy Blue, Off-white"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              />
              <button
                type="button"
                onClick={handleAddColor}
                className="px-4 py-2 rounded-lg text-white flex items-center gap-2 text-sm font-semibold"
                style={{ background: "#0b3d91" }}
              >
                <Plus size={16} /> Add
              </button>
            </div>
            {formData.colors.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.colors.map((color, idx) => (
                  <span
                    key={idx}
                    className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {color}
                    <button
                      type="button"
                      onClick={() => handleRemoveColor(idx)}
                      className="text-red-400 hover:text-red-600 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Toggles */}
          <div className="flex flex-col gap-3 pt-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleInputChange}
                className="w-4 h-4 rounded"
                style={{ accentColor: "#0b3d91" }}
              />
              <div>
                <span className="text-sm font-medium text-gray-700">
                  Featured Product
                </span>
                <p className="text-xs text-gray-400">
                  Show this product in the featured section
                </p>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="w-4 h-4 rounded"
                style={{ accentColor: "#0b3d91" }}
              />
              <div>
                <span className="text-sm font-medium text-gray-700">
                  Active / Visible
                </span>
                <p className="text-xs text-gray-400">
                  Uncheck to hide this product from the shop
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* ── Submit ── */}
        <div className="flex gap-4 pb-8">
          <button
            type="submit"
            disabled={saving || uploadLoading}
            className="flex-1 py-3 rounded-lg font-semibold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{ background: saving ? "#9ca3af" : "#0b3d91" }}
          >
            {saving && <Loader2 size={18} className="animate-spin" />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            disabled={saving}
            className="flex-1 py-3 rounded-lg font-semibold border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
