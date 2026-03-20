"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Upload, X, Plus, AlertCircle, Loader2 } from "lucide-react";

const ALL_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "2XL", "3XL"];
const CATEGORIES = [
  { value: "mens", label: "Men" },
  { value: "womens", label: "Women" },
  { value: "kids", label: "Kids" },
  { value: "accessories", label: "Accessories" },
];

export default function CreateProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [error, setError] = useState("");
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
  });

  const inp = (name, value) =>
    setFormData((prev) => ({ ...prev, [name]: value }));

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    inp(name, type === "checkbox" ? checked : value);
  };

  const toggleSize = (size) =>
    inp(
      "sizes",
      formData.sizes.includes(size)
        ? formData.sizes.filter((s) => s !== size)
        : [...formData.sizes, size]
    );

  const handleAddColor = () => {
    if (colorInput.trim() && !formData.colors.includes(colorInput.trim())) {
      inp("colors", [...formData.colors, colorInput.trim()]);
      setColorInput("");
    }
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
      e.target.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!formData.name.trim()) return setError("Product name is required");
    if (!formData.description.trim())
      return setError("Description is required");
    if (!formData.category) return setError("Please select a category");
    if (!formData.price || parseFloat(formData.price) <= 0)
      return setError("Valid price is required");
    if (formData.stock === "" || parseInt(formData.stock) < 0)
      return setError("Valid stock quantity is required");
    if (images.length === 0)
      return setError("Please upload at least one image");
    if (
      formData.discountPrice &&
      parseFloat(formData.discountPrice) >= parseFloat(formData.price)
    )
      return setError("Discount price must be less than regular price");

    setLoading(true);
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
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
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create product");
      router.push("/admin/products");
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const S = {
    // shared styles
    section: {
      background: "#fff",
      borderRadius: 12,
      border: "1px solid #f1f5f9",
      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      padding: "20px 22px",
      marginBottom: 16,
    },
    sectionTitle: {
      fontFamily: "'DM Sans', sans-serif",
      fontSize: 14,
      fontWeight: 700,
      color: "#0f172a",
      margin: "0 0 16px",
      paddingBottom: 12,
      borderBottom: "1px solid #f8fafc",
    },
    label: {
      display: "block",
      fontSize: 13,
      fontWeight: 500,
      color: "#374151",
      marginBottom: 6,
      fontFamily: "'DM Sans', sans-serif",
    },
    input: {
      width: "100%",
      padding: "9px 12px",
      background: "#fff",
      border: "1.5px solid #e2e8f0",
      borderRadius: 8,
      fontFamily: "'DM Sans', sans-serif",
      fontSize: 14,
      color: "#0f172a",
      outline: "none",
      boxSizing: "border-box",
      transition: "border-color 0.15s, box-shadow 0.15s",
    },
  };

  const focusStyle = (e) => {
    e.target.style.borderColor = "#0b3d91";
    e.target.style.boxShadow = "0 0 0 3px rgba(11,61,145,0.1)";
  };
  const blurStyle = (e) => {
    e.target.style.borderColor = "#e2e8f0";
    e.target.style.boxShadow = "none";
  };

  return (
    <div style={{ maxWidth: 900 }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 20,
              fontWeight: 700,
              color: "#0f172a",
              margin: "0 0 4px",
            }}
          >
            Create Product
          </h2>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13,
              color: "#64748b",
              margin: 0,
            }}
          >
            Add a new product to your store
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.back()}
          style={{
            background: "none",
            border: "1.5px solid #e2e8f0",
            padding: "7px 14px",
            borderRadius: 8,
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13,
            color: "#64748b",
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          ← Back
        </button>
      </div>

      {error && (
        <div
          style={{
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: 10,
            padding: "12px 16px",
            marginBottom: 16,
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
          }}
        >
          <AlertCircle
            size={16}
            color="#ef4444"
            style={{ flexShrink: 0, marginTop: 1 }}
          />
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13,
              color: "#dc2626",
              margin: 0,
            }}
          >
            {error}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Two-column layout on desktop */}
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
          className="create-grid"
        >
          {/* Left column */}
          <div>
            {/* Images */}
            <div style={S.section}>
              <p style={S.sectionTitle}>Product Images</p>
              <label
                htmlFor="img-upload"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "24px 16px",
                  border: "2px dashed #e2e8f0",
                  borderRadius: 10,
                  cursor: uploadLoading ? "not-allowed" : "pointer",
                  transition: "border-color 0.15s, background 0.15s",
                  background: uploadLoading ? "#f8fafc" : "#fff",
                }}
                onMouseEnter={(e) => {
                  if (!uploadLoading) {
                    e.currentTarget.style.borderColor = "#0b3d91";
                    e.currentTarget.style.background = "#f8fbff";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#e2e8f0";
                  e.currentTarget.style.background = uploadLoading
                    ? "#f8fafc"
                    : "#fff";
                }}
              >
                <input
                  type="file"
                  id="img-upload"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadLoading}
                  style={{ display: "none" }}
                />
                {uploadLoading ? (
                  <>
                    <Loader2
                      size={24}
                      color="#94a3b8"
                      style={{ animation: "spin 0.8s linear infinite" }}
                    />
                    <p
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 13,
                        color: "#94a3b8",
                        marginTop: 8,
                        marginBottom: 0,
                      }}
                    >
                      Uploading…
                    </p>
                  </>
                ) : (
                  <>
                    <Upload size={24} color="#94a3b8" />
                    <p
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 13,
                        fontWeight: 500,
                        color: "#374151",
                        marginTop: 8,
                        marginBottom: 2,
                      }}
                    >
                      Click to upload images
                    </p>
                    <p
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 12,
                        color: "#94a3b8",
                        margin: 0,
                      }}
                    >
                      PNG, JPG, WEBP up to 5MB
                    </p>
                  </>
                )}
              </label>

              {images.length > 0 && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 8,
                    marginTop: 12,
                  }}
                >
                  {images.map((img, i) => (
                    <div
                      key={i}
                      style={{
                        position: "relative",
                        borderRadius: 8,
                        overflow: "hidden",
                        aspectRatio: "1",
                      }}
                    >
                      <Image
                        src={img}
                        alt=""
                        fill
                        style={{ objectFit: "cover" }}
                        sizes="80px"
                      />
                      {i === 0 && (
                        <div
                          style={{
                            position: "absolute",
                            bottom: 0,
                            inset: "auto 0 0",
                            background: "rgba(11,61,145,0.8)",
                            padding: "2px",
                            textAlign: "center",
                          }}
                        >
                          <span
                            style={{
                              color: "#fff",
                              fontSize: 9,
                              fontWeight: 600,
                              fontFamily: "'DM Sans', sans-serif",
                            }}
                          >
                            Cover
                          </span>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() =>
                          setImages((prev) => prev.filter((_, j) => j !== i))
                        }
                        style={{
                          position: "absolute",
                          top: 4,
                          right: 4,
                          background: "rgba(0,0,0,0.6)",
                          border: "none",
                          borderRadius: "50%",
                          width: 20,
                          height: 20,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                          padding: 0,
                        }}
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sizes */}
            <div style={S.section}>
              <p style={S.sectionTitle}>Available Sizes</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {ALL_SIZES.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: 7,
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.15s",
                      border: formData.sizes.includes(size)
                        ? "2px solid #0b3d91"
                        : "2px solid #e2e8f0",
                      background: formData.sizes.includes(size)
                        ? "#0b3d91"
                        : "#fff",
                      color: formData.sizes.includes(size) ? "#fff" : "#64748b",
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 11,
                  color: "#94a3b8",
                  marginTop: 8,
                  marginBottom: 0,
                }}
              >
                Click to toggle sizes on/off
              </p>
            </div>

            {/* Colors */}
            <div style={S.section}>
              <p style={S.sectionTitle}>Available Colors</p>
              <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                <input
                  value={colorInput}
                  onChange={(e) => setColorInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddColor();
                    }
                  }}
                  placeholder="e.g., Navy Blue"
                  style={{ ...S.input, flex: 1 }}
                  onFocus={focusStyle}
                  onBlur={blurStyle}
                />
                <button
                  type="button"
                  onClick={handleAddColor}
                  style={{
                    background: "#0b3d91",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    padding: "0 14px",
                    cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 13,
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    flexShrink: 0,
                  }}
                >
                  <Plus size={14} /> Add
                </button>
              </div>
              {formData.colors.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {formData.colors.map((c, i) => (
                    <span
                      key={i}
                      style={{
                        background: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        padding: "3px 10px",
                        borderRadius: 999,
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 13,
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        color: "#374151",
                      }}
                    >
                      {c}
                      <button
                        type="button"
                        onClick={() =>
                          inp(
                            "colors",
                            formData.colors.filter((_, j) => j !== i)
                          )
                        }
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#ef4444",
                          padding: 0,
                          display: "flex",
                        }}
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right column */}
          <div>
            <div style={S.section}>
              <p style={S.sectionTitle}>Product Details</p>

              <div style={{ marginBottom: 14 }}>
                <label style={S.label}>Product Name *</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  style={S.input}
                  placeholder="Enter product name"
                  required
                  onFocus={focusStyle}
                  onBlur={blurStyle}
                />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={S.label}>Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  style={{ ...S.input, minHeight: 90, resize: "vertical" }}
                  placeholder="Describe the product…"
                  required
                  onFocus={focusStyle}
                  onBlur={blurStyle}
                />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={S.label}>Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  style={{
                    ...S.input,
                    appearance: "none",
                    backgroundImage:
                      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M2 4l4 4 4-4' stroke='%2394a3b8' stroke-width='1.5' fill='none'/%3E%3C/svg%3E\")",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 12px center",
                    paddingRight: 32,
                  }}
                  required
                  onFocus={focusStyle}
                  onBlur={blurStyle}
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                  marginBottom: 14,
                }}
              >
                <div>
                  <label style={S.label}>Price (৳) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    style={S.input}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                    onFocus={focusStyle}
                    onBlur={blurStyle}
                  />
                </div>
                <div>
                  <label style={S.label}>Discount Price (৳)</label>
                  <input
                    type="number"
                    name="discountPrice"
                    value={formData.discountPrice}
                    onChange={handleChange}
                    style={S.input}
                    placeholder="Optional"
                    step="0.01"
                    min="0"
                    onFocus={focusStyle}
                    onBlur={blurStyle}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={S.label}>Stock Quantity *</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  style={S.input}
                  placeholder="0"
                  min="0"
                  required
                  onFocus={focusStyle}
                  onBlur={blurStyle}
                />
              </div>

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  cursor: "pointer",
                  padding: "10px 12px",
                  background: "#f8fafc",
                  borderRadius: 8,
                  border: "1px solid #f1f5f9",
                }}
              >
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  style={{ accentColor: "#0b3d91", width: 15, height: 15 }}
                />
                <div>
                  <span
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 13,
                      fontWeight: 500,
                      color: "#374151",
                      display: "block",
                    }}
                  >
                    Mark as Featured
                  </span>
                  <span
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 11,
                      color: "#94a3b8",
                    }}
                  >
                    Show in featured section on homepage
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div style={{ display: "flex", gap: 10, paddingBottom: 24 }}>
          <button
            type="submit"
            disabled={loading || uploadLoading}
            style={{
              flex: 1,
              padding: "11px",
              background: loading || uploadLoading ? "#94a3b8" : "#0b3d91",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14,
              fontWeight: 600,
              cursor: loading || uploadLoading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              transition: "background 0.15s",
            }}
          >
            {loading && (
              <Loader2
                size={16}
                style={{ animation: "spin 0.8s linear infinite" }}
              />
            )}
            {loading ? "Creating…" : "Create Product"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            disabled={loading}
            style={{
              flex: 1,
              padding: "11px",
              background: "#fff",
              color: "#374151",
              border: "1.5px solid #e2e8f0",
              borderRadius: 8,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </form>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 640px) { .create-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
