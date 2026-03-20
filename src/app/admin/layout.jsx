"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";

const NAV = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <rect
          x="2"
          y="2"
          width="7"
          height="7"
          rx="1.5"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <rect
          x="2"
          y="11"
          width="7"
          height="7"
          rx="1.5"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <rect
          x="11"
          y="2"
          width="7"
          height="7"
          rx="1.5"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <rect
          x="11"
          y="11"
          width="7"
          height="7"
          rx="1.5"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    ),
  },
  {
    href: "/admin/products",
    label: "Products",
    icon: (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <path
          d="M2 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H3a1 1 0 01-1-1V5z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M3 8h14l-1.5 8H4.5L3 8z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    href: "/admin/customers",
    label: "Customers",
    icon: (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <circle cx="8" cy="6" r="3" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M2 17c0-3.314 2.686-5 6-5s6 1.686 6 5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M14 8a3 3 0 010 0M14 13c2 0 4 1 4 4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    href: "/admin/settings",
    label: "Settings",
    icon: (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <circle
          cx="10"
          cy="10"
          r="2.5"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M10 2v1.5M10 16.5V18M18 10h-1.5M3.5 10H2M15.657 4.343l-1.06 1.06M5.403 14.597l-1.06 1.06M15.657 15.657l-1.06-1.06M5.403 5.403l-1.06-1.06"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

function LoginOnlyLayout({ children }) {
  const appName = process.env.NEXT_PUBLIC_APP_NAME || "Rihbd Fashion";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        body { margin: 0; background: #f7f8fc; font-family: 'DM Sans', sans-serif; }
      `}</style>
      {children}
    </>
  );
}

function AdminShell({
  children,
  pathname,
  router,
  sidebarOpen,
  setSidebarOpen,
  mobileOpen,
  setMobileOpen,
  loggingOut,
  setLoggingOut,
}) {
  const appName = process.env.NEXT_PUBLIC_APP_NAME || "Rihbd Fashion";

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);

    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch {
      // If logout fails, still redirect. Middleware should block stale sessions.
    }

    router.push("/admin/login");
    router.refresh();
  };

  const currentLabel =
    NAV.find((n) => n.href === pathname)?.label ||
    (pathname.includes("/products/") ? "Products" : "Admin");

  const SidebarContent = () => (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div
        style={{ padding: "20px 20px 16px", borderBottom: "1px solid #f1f5f9" }}
      >
        <Link
          href="/admin"
          style={{
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              overflow: "hidden",
              position: "relative",
              flexShrink: 0,
              background: "#0b3d91",
            }}
          >
            <Image
              src="/logo-bgremoved.png"
              alt={appName}
              fill
              sizes="(max-width: 768px) 100vw, 380px"
              style={{ objectFit: "contain", padding: 2 }}
              onError={(e) => {
                e.currentTarget.src = "/logo.png";
              }}
            />
          </div>

          {(sidebarOpen || mobileOpen) && (
            <div>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: 14,
                  color: "#0f172a",
                  lineHeight: 1.2,
                  margin: 0,
                }}
              >
                {appName}
              </p>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 11,
                  color: "#94a3b8",
                  lineHeight: 1,
                  margin: 0,
                }}
              >
                Admin Panel
              </p>
            </div>
          )}
        </Link>
      </div>

      <nav style={{ flex: 1, padding: "12px", overflowY: "auto" }}>
        {(sidebarOpen || mobileOpen) && (
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 10,
              fontWeight: 600,
              color: "#94a3b8",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              padding: "4px 8px 8px",
              margin: 0,
            }}
          >
            Menu
          </p>
        )}

        {NAV.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "9px 10px",
                borderRadius: 9,
                marginBottom: 2,
                textDecoration: "none",
                background: active ? "rgba(11,61,145,0.08)" : "transparent",
                color: active ? "#0b3d91" : "#64748b",
                borderLeft: active
                  ? "3px solid #0b3d91"
                  : "3px solid transparent",
                transition: "all 0.15s",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                fontWeight: active ? 600 : 500,
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.background = "#f8fafc";
                  e.currentTarget.style.color = "#0f172a";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#64748b";
                }
              }}
            >
              <span style={{ flexShrink: 0 }}>{item.icon}</span>
              {(sidebarOpen || mobileOpen) && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div
        style={{
          padding: "12px",
          borderTop: "1px solid #f1f5f9",
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <Link
          href="/"
          target="_blank"
          rel="noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "9px 10px",
            borderRadius: 9,
            textDecoration: "none",
            color: "#64748b",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13,
            fontWeight: 500,
            transition: "all 0.15s",
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#f8fafc";
            e.currentTarget.style.color = "#0f172a";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#64748b";
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 20 20"
            fill="none"
            style={{ flexShrink: 0 }}
          >
            <path
              d="M10 3H5a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M15 3h2v2M11 9l6-6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {(sidebarOpen || mobileOpen) && <span>View Shop</span>}
        </Link>

        <button
          onClick={handleLogout}
          disabled={loggingOut}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "9px 10px",
            borderRadius: 9,
            background: "none",
            border: "none",
            cursor: loggingOut ? "not-allowed" : "pointer",
            color: loggingOut ? "#94a3b8" : "#ef4444",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13,
            fontWeight: 500,
            textAlign: "left",
            transition: "all 0.15s",
            whiteSpace: "nowrap",
            overflow: "hidden",
            width: "100%",
            opacity: loggingOut ? 0.6 : 1,
          }}
          onMouseEnter={(e) => {
            if (!loggingOut) e.currentTarget.style.background = "#fef2f2";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "none";
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 20 20"
            fill="none"
            style={{ flexShrink: 0 }}
          >
            <path
              d="M7 17H4a1 1 0 01-1-1V4a1 1 0 011-1h3M13 14l3-3m0 0l-3-3m3 3H7"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {(sidebarOpen || mobileOpen) && (
            <span>{loggingOut ? "Logging out…" : "Logout"}</span>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        body { margin: 0; background: #f7f8fc; font-family: 'DM Sans', sans-serif; }

        .admin-input {
          width: 100%;
          padding: 9px 12px;
          background: #fff;
          border: 1.5px solid #e2e8f0;
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: #0f172a;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .admin-input:focus {
          border-color: #0b3d91;
          box-shadow: 0 0 0 3px rgba(11,61,145,0.1);
        }
        .admin-input::placeholder { color: #94a3b8; }
        select.admin-input {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M2 4l4 4 4-4' stroke='%2394a3b8' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' fill='none'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          padding-right: 32px;
        }
        textarea.admin-input { resize: vertical; min-height: 96px; }

        @media (max-width: 768px) {
          .sidebar-desktop { display: none !important; }
          .mobile-hamburger { display: flex !important; }
          .topbar-name-desktop { display: none !important; }
        }
        @media (min-width: 769px) {
          .mobile-overlay-sidebar { display: none !important; }
          .mobile-hamburger { display: none !important; }
          .sidebar-collapse-btn { display: flex !important; }
        }
      `}</style>

      <div style={{ display: "flex", minHeight: "100vh" }}>
        <aside
          className="sidebar-desktop"
          style={{
            width: sidebarOpen ? 240 : 64,
            flexShrink: 0,
            background: "#fff",
            borderRight: "1px solid #f1f5f9",
            position: "fixed",
            top: 0,
            left: 0,
            bottom: 0,
            transition: "width 0.25s ease",
            zIndex: 40,
            overflow: "hidden",
          }}
        >
          <SidebarContent />
        </aside>

        {mobileOpen && (
          <div
            className="mobile-overlay-sidebar"
            style={{ position: "fixed", inset: 0, zIndex: 50 }}
          >
            <div
              onClick={() => setMobileOpen(false)}
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(0,0,0,0.4)",
              }}
            />
            <aside
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                bottom: 0,
                width: 260,
                background: "#fff",
                zIndex: 51,
                boxShadow: "4px 0 24px rgba(0,0,0,0.12)",
              }}
            >
              <SidebarContent />
            </aside>
          </div>
        )}

        <div
          className="admin-main-area"
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
          }}
        >
          <style>{`
            @media (min-width: 769px) {
              .admin-main-area {
                margin-left: ${sidebarOpen ? 240 : 64}px !important;
                transition: margin-left 0.25s ease;
              }
            }
          `}</style>

          <header
            style={{
              position: "sticky",
              top: 0,
              zIndex: 30,
              height: 64,
              background: "#fff",
              borderBottom: "1px solid #f1f5f9",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 24px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button
                onClick={() => setSidebarOpen((o) => !o)}
                className="sidebar-collapse-btn sidebar-desktop"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 6,
                  borderRadius: 8,
                  color: "#64748b",
                  display: "none",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#f8fafc")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "none")
                }
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M3 5h14M3 10h14M3 15h14"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>

              <button
                onClick={() => setMobileOpen((o) => !o)}
                className="mobile-hamburger"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 6,
                  borderRadius: 8,
                  color: "#64748b",
                  display: "none",
                }}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M3 5h14M3 10h14M3 15h14"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>

              <h1
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 17,
                  fontWeight: 700,
                  color: "#0f172a",
                  margin: 0,
                }}
              >
                {currentLabel}
              </h1>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{ textAlign: "right" }}
                className="topbar-name-desktop"
              >
                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#0f172a",
                    margin: 0,
                  }}
                >
                  Admin
                </p>
                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 11,
                    color: "#94a3b8",
                    margin: 0,
                  }}
                >
                  Administrator
                </p>
              </div>

              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #0b3d91, #1a5dbf)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 15,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  A
                </span>
              </div>
            </div>
          </header>

          <main style={{ flex: 1, padding: "28px 24px", overflowX: "hidden" }}>
            {children}
          </main>
        </div>
      </div>
    </>
  );
}

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const check = () => {
      if (window.innerWidth < 1024) setSidebarOpen(false);
    };

    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return isLoginPage ? (
    <LoginOnlyLayout>{children}</LoginOnlyLayout>
  ) : (
    <AdminShell
      children={children}
      pathname={pathname}
      router={router}
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
      mobileOpen={mobileOpen}
      setMobileOpen={setMobileOpen}
      loggingOut={loggingOut}
      setLoggingOut={setLoggingOut}
    />
  );
}
