"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const appName = process.env.NEXT_PUBLIC_APP_NAME || "Rihbd Fashion";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Login failed");
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f7f8fc; font-family: 'DM Sans', sans-serif; }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: "#f7f8fc",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem 1rem",
          backgroundImage:
            "radial-gradient(circle at 20% 80%, rgba(11,61,145,0.06) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(212,175,55,0.06) 0%, transparent 50%)",
        }}
      >
        <div style={{ width: "100%", maxWidth: 420 }}>
          {/* Brand */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                overflow: "hidden",
                position: "relative",
                margin: "0 auto 14px",
                background: "#0b3d91",
              }}
            >
              <Image
                src="/logo-bgremoved.png"
                alt={appName}
                fill
                sizes="(max-width: 768px) 100vw, 380px"
                style={{ objectFit: "contain", padding: 6 }}
                onError={(e) => {
                  e.currentTarget.src = "/logo.png";
                }}
              />
            </div>
            <h1
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 22,
                fontWeight: 700,
                color: "#0f172a",
                marginBottom: 4,
              }}
            >
              {appName}
            </h1>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                color: "#64748b",
              }}
            >
              Sign in to your admin panel
            </p>
          </div>

          {/* Card */}
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: "32px",
              boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
              border: "1px solid #f1f5f9",
            }}
          >
            {/* Error */}
            {error && (
              <div
                style={{
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  borderRadius: 8,
                  padding: "10px 14px",
                  marginBottom: 20,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  style={{ flexShrink: 0 }}
                >
                  <circle
                    cx="8"
                    cy="8"
                    r="7"
                    stroke="#ef4444"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M8 5v3M8 10.5v.5"
                    stroke="#ef4444"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
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
              {/* Username */}
              <div style={{ marginBottom: 18 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 500,
                    color: "#374151",
                    marginBottom: 6,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  Username
                </label>
                <div style={{ position: "relative" }}>
                  <span
                    style={{
                      position: "absolute",
                      left: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#94a3b8",
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle
                        cx="8"
                        cy="5"
                        r="3"
                        stroke="currentColor"
                        strokeWidth="1.4"
                      />
                      <path
                        d="M2 14c0-2.761 2.686-5 6-5s6 2.239 6 5"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    placeholder="Enter username"
                    required
                    disabled={loading}
                    style={{
                      width: "100%",
                      padding: "10px 12px 10px 38px",
                      background: "#fff",
                      border: "1.5px solid #e2e8f0",
                      borderRadius: 8,
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 14,
                      color: "#0f172a",
                      outline: "none",
                      transition: "border-color 0.15s, box-shadow 0.15s",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#0b3d91";
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(11,61,145,0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e2e8f0";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>
              </div>

              {/* Password */}
              <div style={{ marginBottom: 24 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 500,
                    color: "#374151",
                    marginBottom: 6,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  Password
                </label>
                <div style={{ position: "relative" }}>
                  <span
                    style={{
                      position: "absolute",
                      left: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#94a3b8",
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <rect
                        x="2"
                        y="7"
                        width="12"
                        height="8"
                        rx="2"
                        stroke="currentColor"
                        strokeWidth="1.4"
                      />
                      <path
                        d="M5 7V5a3 3 0 016 0v2"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="Enter password"
                    required
                    disabled={loading}
                    style={{
                      width: "100%",
                      padding: "10px 40px 10px 38px",
                      background: "#fff",
                      border: "1.5px solid #e2e8f0",
                      borderRadius: 8,
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 14,
                      color: "#0f172a",
                      outline: "none",
                      transition: "border-color 0.15s, box-shadow 0.15s",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#0b3d91";
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(11,61,145,0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e2e8f0";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    style={{
                      position: "absolute",
                      right: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#94a3b8",
                      padding: 0,
                    }}
                  >
                    {showPassword ? (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M2 8s2.5-5 6-5 6 5 6 5-2.5 5-6 5-6-5-6-5z"
                          stroke="currentColor"
                          strokeWidth="1.4"
                        />
                        <circle
                          cx="8"
                          cy="8"
                          r="1.5"
                          stroke="currentColor"
                          strokeWidth="1.4"
                        />
                        <line
                          x1="3"
                          y1="3"
                          x2="13"
                          y2="13"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                        />
                      </svg>
                    ) : (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M2 8s2.5-5 6-5 6 5 6 5-2.5 5-6 5-6-5-6-5z"
                          stroke="currentColor"
                          strokeWidth="1.4"
                        />
                        <circle
                          cx="8"
                          cy="8"
                          r="1.5"
                          stroke="currentColor"
                          strokeWidth="1.4"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "11px",
                  background: loading ? "#94a3b8" : "#0b3d91",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "background 0.15s, box-shadow 0.15s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                {loading && (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    style={{ animation: "spin 0.8s linear infinite" }}
                  >
                    <circle
                      cx="8"
                      cy="8"
                      r="6"
                      stroke="rgba(255,255,255,0.3)"
                      strokeWidth="2"
                    />
                    <path
                      d="M8 2a6 6 0 016 6"
                      stroke="#fff"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
                {loading ? "Signing in…" : "Sign In"}
              </button>
            </form>
          </div>

          <div style={{ textAlign: "center", marginTop: 20 }}>
            <Link
              href="/"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                color: "#64748b",
                textDecoration: "none",
              }}
            >
              ← Back to Shop
            </Link>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
