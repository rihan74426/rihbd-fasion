"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

// ─── Utility ────────────────────────────────────────────────────────────────
function formatPrice(price) {
  const num = typeof price === "string" ? parseFloat(price) : price;
  return `৳${num.toLocaleString("en-BD")}`;
}

// ─── Navbar ─────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const whatsapp = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(
    /^\+/,
    ""
  );
  const appName = process.env.NEXT_PUBLIC_APP_NAME || "Rihbd Fashion";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition:
          "background 0.4s ease, box-shadow 0.4s ease, padding 0.3s ease",
        background: scrolled ? "rgba(11,61,145,0.97)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        boxShadow: scrolled ? "0 2px 24px rgba(0,0,0,0.18)" : "none",
        padding: scrolled ? "0" : "0",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: scrolled ? 64 : 80,
          transition: "height 0.3s ease",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: "linear-gradient(135deg, #d4af37, #b8922b)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                color: "#0b3d91",
                fontWeight: 800,
                fontSize: 16,
                fontFamily: "serif",
              }}
            >
              R
            </span>
          </div>
          <span
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 20,
              fontWeight: 700,
              color: "#fff",
              letterSpacing: "-0.02em",
            }}
          >
            {appName}
          </span>
        </Link>

        {/* Desktop nav */}
        <div
          style={{ display: "flex", alignItems: "center", gap: "2rem" }}
          className="desktop-nav"
        >
          <a href="#products" style={navLinkStyle}>
            Collection
          </a>
          <a href="#how-it-works" style={navLinkStyle}>
            How it works
          </a>
          {whatsapp && (
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                background: "#25D366",
                color: "#fff",
                padding: "0.45rem 1rem",
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 600,
                textDecoration: "none",
                fontFamily: "'DM Sans', sans-serif",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(37,211,102,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = "";
              }}
            >
              <WhatsAppIcon size={14} /> WhatsApp
            </a>
          )}
          <a
            href="#products"
            style={{
              background: "linear-gradient(135deg, #d4af37, #b8922b)",
              color: "#062a5f",
              padding: "0.5rem 1.25rem",
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 700,
              textDecoration: "none",
              fontFamily: "'DM Sans', sans-serif",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow =
                "0 4px 16px rgba(212,175,55,0.45)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "";
              e.currentTarget.style.boxShadow = "";
            }}
          >
            Shop Now
          </a>
        </div>

        {/* Mobile burger */}
        <button
          onClick={() => setMenuOpen((o) => !o)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 8,
            display: "none",
          }}
          className="burger-btn"
          aria-label="Menu"
        >
          <div
            style={{
              width: 22,
              height: 2,
              background: "#fff",
              marginBottom: 5,
              borderRadius: 2,
            }}
          />
          <div
            style={{
              width: 22,
              height: 2,
              background: "#fff",
              marginBottom: 5,
              borderRadius: 2,
            }}
          />
          <div
            style={{
              width: 14,
              height: 2,
              background: "#fff",
              borderRadius: 2,
            }}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          style={{
            background: "#0b3d91",
            padding: "1rem 2rem 1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            borderTop: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          <a
            href="#products"
            onClick={() => setMenuOpen(false)}
            style={{ ...navLinkStyle, fontSize: 15 }}
          >
            Collection
          </a>
          <a
            href="#how-it-works"
            onClick={() => setMenuOpen(false)}
            style={{ ...navLinkStyle, fontSize: 15 }}
          >
            How it works
          </a>
          {whatsapp && (
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noreferrer"
              style={{
                color: "#25D366",
                textDecoration: "none",
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 600,
                fontSize: 15,
              }}
            >
              WhatsApp
            </a>
          )}
          <a
            href="#products"
            onClick={() => setMenuOpen(false)}
            style={{
              background: "linear-gradient(135deg, #d4af37, #b8922b)",
              color: "#062a5f",
              padding: "0.6rem 1.25rem",
              borderRadius: 999,
              fontSize: 14,
              fontWeight: 700,
              textDecoration: "none",
              fontFamily: "'DM Sans', sans-serif",
              display: "inline-block",
              width: "fit-content",
            }}
          >
            Shop Now
          </a>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .burger-btn { display: block !important; }
        }
      `}</style>
    </nav>
  );
}

const navLinkStyle = {
  color: "rgba(255,255,255,0.88)",
  textDecoration: "none",
  fontSize: 14,
  fontWeight: 500,
  fontFamily: "'DM Sans', sans-serif",
  letterSpacing: "0.01em",
  transition: "color 0.2s",
};

// ─── Hero ────────────────────────────────────────────────────────────────────
function Hero() {
  const [visible, setVisible] = useState(false);
  const whatsapp = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(
    /^\+/,
    ""
  );

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(145deg, #062a5f 0%, #0b3d91 45%, #1a5dbf 100%)",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Decorative background elements */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        {/* Large circle top-right */}
        <div
          style={{
            position: "absolute",
            top: "-15%",
            right: "-8%",
            width: 600,
            height: 600,
            borderRadius: "50%",
            border: "1px solid rgba(212,175,55,0.15)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "-10%",
            right: "-4%",
            width: 440,
            height: 440,
            borderRadius: "50%",
            border: "1px solid rgba(212,175,55,0.1)",
          }}
        />
        {/* Gold accent arc bottom-left */}
        <div
          style={{
            position: "absolute",
            bottom: "-20%",
            left: "-10%",
            width: 500,
            height: 500,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        />
        {/* Subtle diagonal grain overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 80px,
            rgba(255,255,255,0.012) 80px,
            rgba(255,255,255,0.012) 81px
          )`,
          }}
        />
        {/* Gold horizontal accent line */}
        <div
          style={{
            position: "absolute",
            bottom: "18%",
            left: 0,
            right: 0,
            height: 1,
            background:
              "linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.25) 30%, rgba(212,175,55,0.25) 70%, transparent 100%)",
          }}
        />
      </div>

      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "7rem 2rem 5rem",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "4rem",
          alignItems: "center",
          width: "100%",
          position: "relative",
          zIndex: 1,
        }}
        className="hero-grid"
      >
        {/* Left: Text */}
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(32px)",
            transition: "opacity 0.8s ease, transform 0.8s ease",
          }}
        >
          {/* Eyebrow tag */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "rgba(212,175,55,0.15)",
              border: "1px solid rgba(212,175,55,0.35)",
              borderRadius: 999,
              padding: "0.35rem 1rem",
              marginBottom: "1.5rem",
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#d4af37",
              }}
            />
            <span
              style={{
                color: "#d4af37",
                fontSize: 12,
                fontWeight: 600,
                fontFamily: "'DM Sans', sans-serif",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Premium Bangladeshi Fashion
            </span>
          </div>

          <h1
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(2.8rem, 5vw, 4.2rem)",
              fontWeight: 700,
              color: "#ffffff",
              lineHeight: 1.12,
              marginBottom: "1.25rem",
              letterSpacing: "-0.02em",
            }}
          >
            Wear the Art of{" "}
            <span
              style={{
                color: "#d4af37",
                display: "inline-block",
              }}
            >
              Tradition
            </span>
          </h1>

          <p
            style={{
              color: "rgba(255,255,255,0.72)",
              fontSize: "1.05rem",
              lineHeight: 1.75,
              maxWidth: 460,
              marginBottom: "2.25rem",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 400,
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 0.8s ease 0.15s, transform 0.8s ease 0.15s",
            }}
          >
            Handpicked panjabi &amp; apparel — crafted with care, delivered to
            your door. Pay cash on delivery. No fuss, just quality.
          </p>

          {/* CTAs */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.875rem",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s",
            }}
          >
            <a
              href="#products"
              style={{
                background: "linear-gradient(135deg, #d4af37 0%, #b8922b 100%)",
                color: "#062a5f",
                padding: "0.875rem 2rem",
                borderRadius: 999,
                fontWeight: 700,
                fontSize: 15,
                textDecoration: "none",
                fontFamily: "'DM Sans', sans-serif",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                boxShadow: "0 4px 24px rgba(212,175,55,0.4)",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 32px rgba(212,175,55,0.55)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow =
                  "0 4px 24px rgba(212,175,55,0.4)";
              }}
            >
              Browse Collection
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>

            {whatsapp && (
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "#fff",
                  padding: "0.875rem 1.75rem",
                  borderRadius: 999,
                  fontWeight: 500,
                  fontSize: 15,
                  textDecoration: "none",
                  fontFamily: "'DM Sans', sans-serif",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  transition: "background 0.2s, border-color 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.14)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.35)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
                }}
              >
                <WhatsAppIcon size={16} color="#25D366" /> Chat with us
              </a>
            )}
          </div>

          {/* Trust badges */}
          <div
            style={{
              display: "flex",
              gap: "1.5rem",
              marginTop: "3rem",
              flexWrap: "wrap",
              opacity: visible ? 1 : 0,
              transition: "opacity 0.8s ease 0.5s",
            }}
          >
            {[
              { icon: "💳", label: "Cash on Delivery" },
              { icon: "✨", label: "Premium Quality" },
              { icon: "⚡", label: "Fast Delivery" },
            ].map(({ icon, label }) => (
              <div
                key={label}
                style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
              >
                <span style={{ fontSize: 14 }}>{icon}</span>
                <span
                  style={{
                    color: "rgba(255,255,255,0.65)",
                    fontSize: 12,
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 500,
                    letterSpacing: "0.02em",
                  }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Visual collage */}
        <div
          style={{
            position: "relative",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateX(0)" : "translateX(40px)",
            transition: "opacity 0.9s ease 0.2s, transform 0.9s ease 0.2s",
          }}
          className="hero-visual"
        >
          {/* Main image frame */}
          <div
            style={{
              borderRadius: 24,
              overflow: "hidden",
              aspectRatio: "4/5",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              position: "relative",
              maxWidth: 380,
              marginLeft: "auto",
            }}
          >
            <Image
              src="/hero-1.jpg"
              alt="Featured collection"
              fill
              style={{ objectFit: "cover" }}
              priority
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            {/* Overlay gradient */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, rgba(6,42,95,0.6) 0%, transparent 60%)",
              }}
            />
            {/* Product tag */}
            <div
              style={{
                position: "absolute",
                bottom: 20,
                left: 20,
                right: 20,
                background: "rgba(11,61,145,0.85)",
                backdropFilter: "blur(12px)",
                borderRadius: 14,
                padding: "0.875rem 1rem",
                border: "1px solid rgba(212,175,55,0.25)",
              }}
            >
              <p
                style={{
                  color: "#d4af37",
                  fontSize: 11,
                  fontWeight: 600,
                  fontFamily: "'DM Sans', sans-serif",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginBottom: 2,
                }}
              >
                New Arrival
              </p>
              <p
                style={{
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 600,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Premium Panjabi Collection
              </p>
            </div>
          </div>

          {/* Floating card — top left */}
          <div
            style={{
              position: "absolute",
              top: "8%",
              left: "-12%",
              background: "rgba(11,61,145,0.9)",
              backdropFilter: "blur(16px)",
              borderRadius: 16,
              padding: "1rem 1.25rem",
              border: "1px solid rgba(212,175,55,0.3)",
              minWidth: 140,
              boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
              animation: "floatA 4s ease-in-out infinite",
            }}
          >
            <p
              style={{
                color: "#d4af37",
                fontSize: 22,
                fontWeight: 800,
                fontFamily: "'DM Sans', sans-serif",
                lineHeight: 1,
              }}
            >
              COD
            </p>
            <p
              style={{
                color: "rgba(255,255,255,0.7)",
                fontSize: 11,
                fontFamily: "'DM Sans', sans-serif",
                marginTop: 3,
              }}
            >
              Cash on Delivery
            </p>
          </div>

          {/* Floating card — bottom right */}
          <div
            style={{
              position: "absolute",
              bottom: "12%",
              right: "-8%",
              background: "rgba(212,175,55,0.15)",
              backdropFilter: "blur(16px)",
              borderRadius: 16,
              padding: "1rem 1.25rem",
              border: "1px solid rgba(212,175,55,0.4)",
              minWidth: 130,
              boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
              animation: "floatB 5s ease-in-out infinite",
            }}
          >
            <p
              style={{
                color: "#d4af37",
                fontSize: 22,
                fontWeight: 800,
                fontFamily: "'DM Sans', sans-serif",
                lineHeight: 1,
              }}
            >
              100%
            </p>
            <p
              style={{
                color: "rgba(255,255,255,0.7)",
                fontSize: 11,
                fontFamily: "'DM Sans', sans-serif",
                marginTop: 3,
              }}
            >
              Authentic quality
            </p>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div
        style={{
          position: "absolute",
          bottom: 32,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
          opacity: 0.5,
          animation: "scrollBounce 2s ease-in-out infinite",
        }}
      >
        <span
          style={{
            color: "#fff",
            fontSize: 10,
            letterSpacing: "0.12em",
            fontFamily: "'DM Sans', sans-serif",
            textTransform: "uppercase",
          }}
        >
          Scroll
        </span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M8 3v10M4 9l4 4 4-4"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <style>{`
        @keyframes floatA {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes floatB {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(8px); }
        }
        @keyframes scrollBounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(6px); }
        }
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 3rem !important; }
          .hero-visual { display: none !important; }
        }
      `}</style>
    </section>
  );
}

// ─── Feature Strip ───────────────────────────────────────────────────────────
function FeatureStrip() {
  const features = [
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <rect
            x="2"
            y="6"
            width="18"
            height="12"
            rx="3"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M6 6V5a5 5 0 0110 0v1"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="11" cy="12" r="1.5" fill="currentColor" />
        </svg>
      ),
      title: "Cash on Delivery",
      desc: "Pay when you receive — zero upfront risk",
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path
            d="M11 2l2.4 7.2H21l-6.2 4.5 2.4 7.2L11 16.4l-6.2 5.3 2.4-7.2L1 9.2h7.6L11 2z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      ),
      title: "Premium Fabric",
      desc: "Carefully sourced materials, crafted to last",
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path
            d="M4 4h14a2 2 0 012 2v8a2 2 0 01-2 2H7l-5 4V6a2 2 0 012-2z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      ),
      title: "WhatsApp Support",
      desc: "Always available — reply within minutes",
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path
            d="M11 2C6.03 2 2 6.03 2 11s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M11 6v5l3 3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      title: "Fast Delivery",
      desc: "Delivered to your door across Bangladesh",
    },
  ];

  return (
    <section
      style={{
        background: "#f8f6f1",
        borderTop: "1px solid #eae7df",
        borderBottom: "1px solid #eae7df",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "2rem",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "0",
        }}
        className="feature-grid"
      >
        {features.map((f, i) => (
          <div
            key={f.title}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "0.875rem",
              padding: "1.75rem 1.5rem",
              borderRight:
                i < features.length - 1 ? "1px solid #eae7df" : "none",
            }}
            className="feature-item"
          >
            <div
              style={{
                width: 44,
                height: 44,
                flexShrink: 0,
                borderRadius: 12,
                background: "rgba(11,61,145,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#0b3d91",
              }}
            >
              {f.icon}
            </div>
            <div>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: 14,
                  color: "#0b3d91",
                  marginBottom: 3,
                }}
              >
                {f.title}
              </p>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 12,
                  color: "#7a7a7a",
                  lineHeight: 1.5,
                }}
              >
                {f.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
      <style>{`
        @media (max-width: 900px) {
          .feature-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .feature-item:nth-child(2) { border-right: none !important; }
          .feature-item:nth-child(n+3) { border-top: 1px solid #eae7df; }
        }
        @media (max-width: 500px) {
          .feature-grid { grid-template-columns: 1fr !important; }
          .feature-item { border-right: none !important; border-top: 1px solid #eae7df; }
          .feature-item:first-child { border-top: none; }
        }
      `}</style>
    </section>
  );
}

// ─── Skeleton Card ───────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 20,
        overflow: "hidden",
        boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
      }}
    >
      <div
        style={{
          aspectRatio: "4/5",
          background:
            "linear-gradient(90deg, #f0ede6 0%, #e8e4dc 50%, #f0ede6 100%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.4s linear infinite",
        }}
      />
      <div style={{ padding: "1.25rem" }}>
        <div
          style={{
            height: 16,
            width: "75%",
            borderRadius: 6,
            background: "#f0ede6",
            marginBottom: 10,
            animation: "shimmer 1.4s linear infinite",
            backgroundSize: "200% 100%",
            backgroundImage:
              "linear-gradient(90deg, #f0ede6 0%, #e8e4dc 50%, #f0ede6 100%)",
          }}
        />
        <div
          style={{
            height: 12,
            width: "90%",
            borderRadius: 6,
            background: "#f0ede6",
            marginBottom: 6,
            animation: "shimmer 1.4s linear infinite 0.1s",
            backgroundSize: "200% 100%",
            backgroundImage:
              "linear-gradient(90deg, #f0ede6 0%, #e8e4dc 50%, #f0ede6 100%)",
          }}
        />
        <div
          style={{
            height: 22,
            width: "45%",
            borderRadius: 6,
            background: "#f0ede6",
            marginTop: 14,
            animation: "shimmer 1.4s linear infinite 0.2s",
            backgroundSize: "200% 100%",
            backgroundImage:
              "linear-gradient(90deg, #f0ede6 0%, #e8e4dc 50%, #f0ede6 100%)",
          }}
        />
        <div
          style={{
            height: 40,
            borderRadius: 10,
            background: "#f0ede6",
            marginTop: 14,
            animation: "shimmer 1.4s linear infinite 0.3s",
            backgroundSize: "200% 100%",
            backgroundImage:
              "linear-gradient(90deg, #f0ede6 0%, #e8e4dc 50%, #f0ede6 100%)",
          }}
        />
      </div>
      <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>
    </div>
  );
}

// ─── Product Card ────────────────────────────────────────────────────────────
function ProductCard({ product }) {
  const [hovered, setHovered] = useState(false);
  const isOut = product.stock === 0;
  const img = product.images?.[0] || "/placeholder.jpg";
  const hasDiscount =
    product.discountPrice && product.discountPrice < product.price;
  const discount = hasDiscount
    ? Math.round(
        ((product.price - product.discountPrice) / product.price) * 100
      )
    : 0;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#fff",
        borderRadius: 20,
        overflow: "hidden",
        boxShadow: hovered
          ? "0 16px 48px rgba(11,61,145,0.14), 0 4px 16px rgba(0,0,0,0.06)"
          : "0 2px 16px rgba(0,0,0,0.06)",
        transition: "box-shadow 0.3s ease, transform 0.3s ease",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Image */}
      <Link
        href={`/orders/${product._id}`}
        style={{ textDecoration: "none", display: "block" }}
      >
        <div
          style={{
            position: "relative",
            aspectRatio: "4/5",
            background: "#f5f2eb",
            overflow: "hidden",
          }}
        >
          <Image
            src={img}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            style={{
              objectFit: "cover",
              transition: "transform 0.5s ease",
              transform: hovered ? "scale(1.05)" : "scale(1)",
            }}
          />
          {/* Out of stock overlay */}
          {isOut && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(0,0,0,0.52)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  background: "#e53e3e",
                  color: "#fff",
                  padding: "0.35rem 1rem",
                  borderRadius: 999,
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: 13,
                }}
              >
                Out of Stock
              </span>
            </div>
          )}
          {/* Discount badge */}
          {hasDiscount && !isOut && (
            <div
              style={{
                position: "absolute",
                top: 12,
                left: 12,
                background: "linear-gradient(135deg, #d4af37, #b8922b)",
                color: "#062a5f",
                padding: "0.25rem 0.6rem",
                borderRadius: 999,
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 700,
                fontSize: 11,
              }}
            >
              -{discount}%
            </div>
          )}
          {/* Featured badge */}
          {product.featured && !isOut && (
            <div
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                background: "rgba(11,61,145,0.9)",
                backdropFilter: "blur(8px)",
                color: "#d4af37",
                padding: "0.25rem 0.6rem",
                borderRadius: 999,
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 600,
                fontSize: 10,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              Featured
            </div>
          )}
        </div>
      </Link>

      {/* Info */}
      <div
        style={{
          padding: "1.1rem 1.25rem 1.25rem",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Link
          href={`/orders/${product._id}`}
          style={{ textDecoration: "none" }}
        >
          <h3
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 700,
              fontSize: 15,
              color: "#1a1a2e",
              lineHeight: 1.35,
              marginBottom: "0.3rem",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              minHeight: 42,
            }}
          >
            {product.name}
          </h3>
        </Link>

        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 12,
            color: "#888",
            lineHeight: 1.5,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            minHeight: 36,
            marginBottom: "0.75rem",
          }}
        >
          {product.description}
        </p>

        {/* Price */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "0.875rem",
          }}
        >
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 800,
              fontSize: 19,
              color: "#0b3d91",
            }}
          >
            {formatPrice(hasDiscount ? product.discountPrice : product.price)}
          </span>
          {hasDiscount && (
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                color: "#bbb",
                textDecoration: "line-through",
              }}
            >
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        {/* Stock indicator */}
        {!isOut && product.stock <= 10 && (
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 11,
              color: "#d97706",
              fontWeight: 600,
              marginBottom: "0.6rem",
            }}
          >
            Only {product.stock} left!
          </p>
        )}

        {/* CTA button */}
        <Link
          href={`/orders/${product._id}`}
          style={{
            display: "block",
            marginTop: "auto",
            textAlign: "center",
            padding: "0.7rem",
            borderRadius: 12,
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 700,
            fontSize: 14,
            textDecoration: "none",
            transition: "all 0.2s ease",
            ...(isOut
              ? {
                  background: "#f0ede6",
                  color: "#aaa",
                  pointerEvents: "none",
                }
              : {
                  background: hovered
                    ? "linear-gradient(135deg, #0b3d91, #062a5f)"
                    : "#0b3d91",
                  color: "#fff",
                  boxShadow: hovered
                    ? "0 4px 16px rgba(11,61,145,0.4)"
                    : "none",
                }),
          }}
        >
          {isOut ? "Out of Stock" : "Order Now →"}
        </Link>
      </div>
    </div>
  );
}

// ─── Products Section ────────────────────────────────────────────────────────
function ProductsSection() {
  const [products, setProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(8);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetch("/api/products")
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data) => {
        if (mounted) setProducts(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (mounted) setProducts([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return products;
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
        (p.name || "").toLowerCase().includes(q) ||
        (p.description || "").toLowerCase().includes(q)
    );
  }, [products, query]);

  const visible = filtered.slice(0, visibleCount);
  const canLoadMore = filtered.length > visibleCount;

  return (
    <section id="products" style={{ background: "#faf8f4", padding: "5rem 0" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 2rem" }}>
        {/* Section header */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: "1.5rem",
            marginBottom: "2.5rem",
          }}
        >
          <div>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 12,
                fontWeight: 600,
                color: "#d4af37",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              Our Collection
            </p>
            <h2
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
                fontWeight: 700,
                color: "#0b3d91",
                letterSpacing: "-0.02em",
                lineHeight: 1.15,
              }}
            >
              Featured Products
            </h2>
          </div>

          {/* Search */}
          <div
            style={{
              position: "relative",
              width: "min(320px, 100%)",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 14,
                top: "50%",
                transform: "translateY(-50%)",
                color: focused ? "#0b3d91" : "#aaa",
                transition: "color 0.2s",
                pointerEvents: "none",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle
                  cx="7"
                  cy="7"
                  r="5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M11 11l3 3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setVisibleCount(8);
              }}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Search products..."
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "0.65rem 1rem 0.65rem 2.4rem",
                borderRadius: 12,
                border: focused ? "1.5px solid #0b3d91" : "1.5px solid #e8e4dc",
                background: "#fff",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                color: "#1a1a2e",
                outline: "none",
                transition: "border-color 0.2s, box-shadow 0.2s",
                boxShadow: focused ? "0 0 0 3px rgba(11,61,145,0.1)" : "none",
              }}
            />
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "5rem 0",
              background: "#fff",
              borderRadius: 20,
              border: "1.5px dashed #e8e4dc",
            }}
          >
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 16,
                color: "#aaa",
              }}
            >
              {query
                ? `No products found for "${query}"`
                : "No products available yet"}
            </p>
            {query && (
              <button
                onClick={() => setQuery("")}
                style={{
                  marginTop: "0.75rem",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#0b3d91",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 14,
                  fontWeight: 600,
                  textDecoration: "underline",
                }}
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {visible.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>

            {canLoadMore && (
              <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
                <button
                  onClick={() => setVisibleCount((c) => c + 8)}
                  style={{
                    background: "transparent",
                    border: "2px solid #0b3d91",
                    color: "#0b3d91",
                    padding: "0.75rem 2.5rem",
                    borderRadius: 999,
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 700,
                    fontSize: 15,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#0b3d91";
                    e.currentTarget.style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#0b3d91";
                  }}
                >
                  Load more ({filtered.length - visibleCount} remaining)
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

// ─── How It Works ────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Pick a product",
      desc: "Browse our curated collection and choose the piece that speaks to you.",
      icon: (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path
            d="M6 8h16M6 14h10M6 20h13"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
    {
      num: "02",
      title: "Place your order",
      desc: "Fill in your name, phone number, and delivery address. We'll call to confirm.",
      icon: (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <rect
            x="5"
            y="4"
            width="18"
            height="20"
            rx="3"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M9 10h10M9 14h7M9 18h5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
    {
      num: "03",
      title: "Pay on delivery",
      desc: "Receive your order at home and pay cash to the delivery rider. Simple.",
      icon: (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path
            d="M5 14l6 6 12-12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
  ];

  return (
    <section
      id="how-it-works"
      style={{
        background: "linear-gradient(160deg, #0b3d91 0%, #062a5f 100%)",
        padding: "5.5rem 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* BG decoration */}
      <div
        style={{
          position: "absolute",
          top: "-30%",
          right: "-5%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          border: "1px solid rgba(212,175,55,0.1)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 2rem",
          position: "relative",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 12,
              fontWeight: 600,
              color: "#d4af37",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            Simple process
          </p>
          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
              fontWeight: 700,
              color: "#fff",
              letterSpacing: "-0.02em",
            }}
          >
            How it works
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "2rem",
            position: "relative",
          }}
          className="steps-grid"
        >
          {/* Connector line */}
          <div
            style={{
              position: "absolute",
              top: 56,
              left: "20%",
              right: "20%",
              height: 1,
              background:
                "linear-gradient(90deg, transparent, rgba(212,175,55,0.3) 20%, rgba(212,175,55,0.3) 80%, transparent)",
              pointerEvents: "none",
            }}
            className="steps-connector"
          />

          {steps.map((step, i) => (
            <div
              key={step.num}
              style={{
                textAlign: "center",
                padding: "2rem 1.5rem",
                background: "rgba(255,255,255,0.05)",
                backdropFilter: "blur(8px)",
                borderRadius: 20,
                border: "1px solid rgba(255,255,255,0.1)",
                transition: "border-color 0.3s, background 0.3s",
                position: "relative",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.09)";
                e.currentTarget.style.borderColor = "rgba(212,175,55,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
              }}
            >
              {/* Icon circle */}
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, rgba(212,175,55,0.2), rgba(212,175,55,0.08))",
                  border: "1.5px solid rgba(212,175,55,0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1.25rem",
                  color: "#d4af37",
                }}
              >
                {step.icon}
              </div>

              <div
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "rgba(212,175,55,0.6)",
                  letterSpacing: "0.12em",
                  marginBottom: 8,
                }}
              >
                {step.num}
              </div>

              <h3
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "1.15rem",
                  fontWeight: 700,
                  color: "#fff",
                  marginBottom: "0.75rem",
                }}
              >
                {step.title}
              </h3>

              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  color: "rgba(255,255,255,0.6)",
                  lineHeight: 1.65,
                }}
              >
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 700px) {
          .steps-grid { grid-template-columns: 1fr !important; }
          .steps-connector { display: none; }
        }
      `}</style>
    </section>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────────
function Footer() {
  const appName = process.env.NEXT_PUBLIC_APP_NAME || "Rihbd Fashion";
  const whatsapp = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(
    /^\+/,
    ""
  );

  return (
    <footer
      style={{
        background: "#0a0f1e",
        borderTop: "1px solid rgba(212,175,55,0.15)",
        padding: "3rem 2rem",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1.5rem",
        }}
      >
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "linear-gradient(135deg, #d4af37, #b8922b)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                color: "#0b3d91",
                fontWeight: 800,
                fontSize: 14,
                fontFamily: "serif",
              }}
            >
              R
            </span>
          </div>
          <div>
            <p
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontWeight: 700,
                fontSize: 16,
                color: "#fff",
              }}
            >
              {appName}
            </p>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 11,
                color: "rgba(255,255,255,0.4)",
              }}
            >
              Premium Bangladeshi Fashion
            </p>
          </div>
        </div>

        {/* Links */}
        <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
          {whatsapp && (
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noreferrer"
              style={{
                color: "#25D366",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              WhatsApp
            </a>
          )}
          <a
            href="#products"
            style={{
              color: "rgba(255,255,255,0.5)",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13,
              textDecoration: "none",
            }}
          >
            Collection
          </a>
          <Link
            href="/admin"
            style={{
              color: "rgba(255,255,255,0.3)",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13,
              textDecoration: "none",
            }}
          >
            Admin
          </Link>
        </div>

        {/* Copyright */}
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 12,
            color: "rgba(255,255,255,0.3)",
          }}
        >
          © {new Date().getFullYear()} {appName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

// ─── WhatsApp FAB ─────────────────────────────────────────────────────────────
function WhatsAppFAB() {
  const raw = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
  if (!raw) return null;
  const number = raw.replace(/^\+/, "");
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={`https://wa.me/${number}?text=${encodeURIComponent(
        "Hello! I have a question about your products."
      )}`}
      target="_blank"
      rel="noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "fixed",
        bottom: 28,
        right: 28,
        zIndex: 999,
        width: 56,
        height: 56,
        borderRadius: "50%",
        background: "#25D366",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: hovered
          ? "0 8px 32px rgba(37,211,102,0.55)"
          : "0 4px 20px rgba(37,211,102,0.4)",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
        transform: hovered ? "scale(1.1)" : "scale(1)",
      }}
    >
      <WhatsAppIcon size={26} color="#fff" />
      {/* Pulse ring */}
      <div
        style={{
          position: "absolute",
          inset: -4,
          borderRadius: "50%",
          border: "2px solid rgba(37,211,102,0.4)",
          animation: "waPulse 2s ease-in-out infinite",
        }}
      />
      <style>{`
        @keyframes waPulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.18); opacity: 0; }
        }
      `}</style>
    </a>
  );
}

// ─── WhatsApp Icon ────────────────────────────────────────────────────────────
function WhatsAppIcon({ size = 20, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.6 12.6 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

// ─── Page root ───────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #faf8f4; }
      `}</style>
      <Navbar />
      <Hero />
      <FeatureStrip />
      <ProductsSection />
      <HowItWorks />
      <Footer />
      <WhatsAppFAB />
    </>
  );
}
