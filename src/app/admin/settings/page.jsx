"use client";

import { useState } from "react";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [show, setShow] = useState({
    current: false,
    newP: false,
    confirm: false,
  });
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (
      !formData.currentPassword ||
      !formData.newPassword ||
      !formData.confirmPassword
    )
      return setError("All fields are required");
    if (formData.newPassword.length < 6)
      return setError("New password must be at least 6 characters");
    if (formData.newPassword !== formData.confirmPassword)
      return setError("New passwords do not match");

    setLoading(true);
    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to change password");
      setSuccess("Password changed successfully!");
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const focusStyle = (e) => {
    e.target.style.borderColor = "#0b3d91";
    e.target.style.boxShadow = "0 0 0 3px rgba(11,61,145,0.1)";
  };
  const blurStyle = (e) => {
    e.target.style.borderColor = "#e2e8f0";
    e.target.style.boxShadow = "none";
  };

  const PasswordField = ({ name, label, showKey }) => (
    <div style={{ marginBottom: 16 }}>
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
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <input
          type={show[showKey] ? "text" : "password"}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          placeholder={`Enter ${label.toLowerCase()}`}
          disabled={loading}
          style={{
            width: "100%",
            padding: "9px 40px 9px 12px",
            background: "#fff",
            border: "1.5px solid #e2e8f0",
            borderRadius: 8,
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 14,
            color: "#0f172a",
            outline: "none",
            boxSizing: "border-box",
            transition: "border-color 0.15s, box-shadow 0.15s",
          }}
          onFocus={focusStyle}
          onBlur={blurStyle}
        />
        <button
          type="button"
          onClick={() => setShow((s) => ({ ...s, [showKey]: !s[showKey] }))}
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
            display: "flex",
            alignItems: "center",
          }}
        >
          {show[showKey] ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
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
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
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
  );

  return (
    <div style={{ maxWidth: 560 }}>
      <div style={{ marginBottom: 24 }}>
        <h2
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 20,
            fontWeight: 700,
            color: "#0f172a",
            margin: "0 0 4px",
          }}
        >
          Settings
        </h2>
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13,
            color: "#64748b",
            margin: 0,
          }}
        >
          Manage your admin account security
        </p>
      </div>

      {/* Change Password Card */}
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          border: "1px solid #f1f5f9",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          padding: "22px 24px",
          marginBottom: 16,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 20,
            paddingBottom: 14,
            borderBottom: "1px solid #f8fafc",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 9,
              background: "#eff6ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#1d4ed8",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect
                x="2"
                y="8"
                width="14"
                height="9"
                rx="2"
                stroke="currentColor"
                strokeWidth="1.4"
              />
              <path
                d="M6 8V6a3 3 0 016 0v2"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                fontWeight: 700,
                color: "#0f172a",
                margin: 0,
              }}
            >
              Change Password
            </p>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 12,
                color: "#64748b",
                margin: 0,
              }}
            >
              Update your admin password
            </p>
          </div>
        </div>

        {success && (
          <div
            style={{
              background: "#ecfdf5",
              border: "1px solid #a7f3d0",
              borderRadius: 8,
              padding: "10px 14px",
              marginBottom: 16,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" stroke="#10b981" strokeWidth="1.5" />
              <path
                d="M5 8l2 2 4-4"
                stroke="#10b981"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                color: "#065f46",
                margin: 0,
              }}
            >
              {success}
            </p>
          </div>
        )}
        {error && (
          <div
            style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: 8,
              padding: "10px 14px",
              marginBottom: 16,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" stroke="#ef4444" strokeWidth="1.5" />
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
          <PasswordField
            name="currentPassword"
            label="Current Password"
            showKey="current"
          />
          <PasswordField
            name="newPassword"
            label="New Password"
            showKey="newP"
          />
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 11,
              color: "#94a3b8",
              marginTop: -10,
              marginBottom: 16,
            }}
          >
            Minimum 6 characters
          </p>
          <PasswordField
            name="confirmPassword"
            label="Confirm New Password"
            showKey="confirm"
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "10px",
              marginTop: 4,
              background: loading ? "#94a3b8" : "#0b3d91",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14,
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background 0.15s",
            }}
          >
            {loading ? "Updating…" : "Update Password"}
          </button>
        </form>
      </div>

      {/* Security tips */}
      <div
        style={{
          background: "#fffbeb",
          border: "1px solid #fde68a",
          borderRadius: 12,
          padding: "16px 18px",
        }}
      >
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13,
            fontWeight: 600,
            color: "#92400e",
            margin: "0 0 8px",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M7 1l1.5 4H13l-3.5 2.5L11 12 7 9.5 3 12l1.5-4.5L1 5h4.5L7 1z"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
          </svg>
          Security Tips
        </p>
        <ul
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 12,
            color: "#78350f",
            margin: 0,
            paddingLeft: 16,
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          <li>Use a strong mix of letters, numbers, and symbols</li>
          <li>Never share your password with anyone</li>
          <li>Change your password regularly</li>
          <li>Do not reuse passwords from other sites</li>
        </ul>
      </div>
    </div>
  );
}
