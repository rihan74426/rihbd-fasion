"use client";

import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
  useCallback,
} from "react";
import Link from "next/link";
import Image from "next/image";

function formatPrice(price) {
  const num = typeof price === "string" ? parseFloat(price) : price;
  return `৳${num.toLocaleString("en-BD")}`;
}

// ─── Navbar ──────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const whatsapp = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(
    /^\+/,
    ""
  );
  const appName = process.env.NEXT_PUBLIC_APP_NAME || "Rihbd Fashion";

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: "background 0.4s, box-shadow 0.4s",
        background: scrolled ? "rgba(6,42,95,0.96)" : "transparent",
        backdropFilter: scrolled ? "blur(14px)" : "none",
        boxShadow: scrolled ? "0 2px 28px rgba(0,0,0,0.22)" : "none",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 1.75rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: scrolled ? 62 : 78,
          transition: "height 0.3s",
        }}
      >
        <Link
          href="/"
          style={{
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "0.55rem",
          }}
        >
          <div
            style={{
              width: scrolled ? 34 : 40,
              height: scrolled ? 34 : 40,
              borderRadius: 10,
              overflow: "hidden",
              flexShrink: 0,
              transition: "width 0.3s, height 0.3s",
              position: "relative",
            }}
          >
            <Image
              src="/logo-bgremoved.png"
              alt={appName}
              fill
              sizes="(max-width: 768px) 100vw, 380px"
              style={{ objectFit: "contain" }}
              onError={(e) => {
                e.currentTarget.src = "/logo.png";
              }}
            />
          </div>
          <span
            style={{
              fontFamily: "'Playfair Display',Georgia,serif",
              fontSize: scrolled ? 18 : 20,
              fontWeight: 700,
              color: "#fff",
              letterSpacing: "-0.02em",
              transition: "font-size 0.3s",
            }}
          >
            {appName}
          </span>
        </Link>

        <div
          style={{ display: "flex", alignItems: "center", gap: "1.75rem" }}
          className="rnav-desktop"
        >
          {[
            ["Collection", "#products"],
            ["How it works", "#how-it-works"],
          ].map(([l, h]) => (
            <a
              key={l}
              href={h}
              style={{
                color: "rgba(255,255,255,0.85)",
                textDecoration: "none",
                fontSize: 13.5,
                fontWeight: 500,
                fontFamily: "'DM Sans',sans-serif",
                letterSpacing: "0.01em",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#d4af37")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "rgba(255,255,255,0.85)")
              }
            >
              {l}
            </a>
          ))}
          {whatsapp && (
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
                background: "#25D366",
                color: "#fff",
                padding: "0.42rem 1rem",
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 600,
                textDecoration: "none",
                fontFamily: "'DM Sans',sans-serif",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow =
                  "0 4px 14px rgba(37,211,102,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = "";
              }}
            >
              <WAIcon size={13} /> WhatsApp
            </a>
          )}
          <a
            href="#products"
            style={{
              background: "linear-gradient(135deg,#d4af37,#b8922b)",
              color: "#062a5f",
              padding: "0.48rem 1.2rem",
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 700,
              textDecoration: "none",
              fontFamily: "'DM Sans',sans-serif",
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

        <button
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Menu"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 8,
            display: "none",
          }}
          className="rnav-burger"
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: i === 2 ? 14 : 22,
                height: 2,
                background: "#fff",
                borderRadius: 2,
                marginBottom: i < 2 ? 5 : 0,
              }}
            />
          ))}
        </button>
      </div>

      {menuOpen && (
        <div
          style={{
            background: "#062a5f",
            padding: "1rem 1.75rem 1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            borderTop: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <a
            href="#products"
            onClick={() => setMenuOpen(false)}
            style={{
              color: "rgba(255,255,255,0.85)",
              textDecoration: "none",
              fontFamily: "'DM Sans',sans-serif",
              fontSize: 15,
            }}
          >
            Collection
          </a>
          <a
            href="#how-it-works"
            onClick={() => setMenuOpen(false)}
            style={{
              color: "rgba(255,255,255,0.85)",
              textDecoration: "none",
              fontFamily: "'DM Sans',sans-serif",
              fontSize: 15,
            }}
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
                fontFamily: "'DM Sans',sans-serif",
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
              background: "linear-gradient(135deg,#d4af37,#b8922b)",
              color: "#062a5f",
              padding: "0.6rem 1.25rem",
              borderRadius: 999,
              fontSize: 14,
              fontWeight: 700,
              textDecoration: "none",
              fontFamily: "'DM Sans',sans-serif",
              display: "inline-block",
              width: "fit-content",
            }}
          >
            Shop Now
          </a>
        </div>
      )}

      <style>{`@media(max-width:768px){.rnav-desktop{display:none!important;}.rnav-burger{display:block!important;}}`}</style>
    </nav>
  );
}

// ─── Hero Carousel ────────────────────────────────────────────────────────────
const HERO_IMGS = ["/hero-1.jpg", "/hero-2.jpg", "/hero-3.jpg", "/hero-4.jpg"];

function HeroCarousel() {
  const [cur, setCur] = useState(0);
  const [fading, setFading] = useState(false);
  const timerRef = useRef(null);

  const go = useCallback((idx) => {
    setFading(true);
    setTimeout(() => {
      setCur((idx + HERO_IMGS.length) % HERO_IMGS.length);
      setFading(false);
    }, 300);
  }, []);

  const next = useCallback(() => go(cur + 1), [cur, go]);
  const prev = useCallback(() => go(cur - 1), [cur, go]);

  useEffect(() => {
    timerRef.current = setInterval(next, 4500);
    return () => clearInterval(timerRef.current);
  }, [next]);

  const stopAndGo = (fn) => {
    clearInterval(timerRef.current);
    fn();
  };

  return (
    <div
      style={{
        position: "relative",
        borderRadius: 24,
        overflow: "hidden",
        aspectRatio: "4/5",
        maxWidth: 380,
        marginLeft: "auto",
        border: "1px solid rgba(255,255,255,0.12)",
        background: "#0b3d91",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: fading ? 0 : 1,
          transition: "opacity 0.32s ease",
        }}
      >
        <Image
          src={HERO_IMGS[cur]}
          alt={`Collection ${cur + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 380px"
          style={{ objectFit: "cover" }}
          priority={cur === 0}
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top,rgba(6,42,95,0.72) 0%,rgba(0,0,0,0.08) 55%,transparent 100%)",
          }}
        />
      </div>

      {/* Prev / Next */}
      {[
        { fn: () => stopAndGo(prev), d: -1 },
        { fn: () => stopAndGo(next), d: 1 },
      ].map(({ fn, d }) => (
        <button
          key={d}
          onClick={fn}
          style={{
            position: "absolute",
            top: "50%",
            [d === -1 ? "left" : "right"]: 10,
            transform: "translateY(-50%)",
            background: "rgba(255,255,255,0.18)",
            backdropFilter: "blur(8px)",
            border: "none",
            cursor: "pointer",
            width: 36,
            height: 36,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            transition: "background 0.2s",
            zIndex: 2,
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.32)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.18)")
          }
        >
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
            <path
              d={d === -1 ? "M10 3L5 8l5 5" : "M6 3l5 5-5 5"}
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      ))}

      {/* Dots */}
      <div
        style={{
          position: "absolute",
          bottom: 72,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 5,
          zIndex: 2,
        }}
      >
        {HERO_IMGS.map((_, i) => (
          <button
            key={i}
            onClick={() => stopAndGo(() => go(i))}
            style={{
              width: i === cur ? 20 : 6,
              height: 6,
              borderRadius: 3,
              background: i === cur ? "#d4af37" : "rgba(255,255,255,0.42)",
              border: "none",
              cursor: "pointer",
              padding: 0,
              transition: "width 0.3s, background 0.3s",
            }}
          />
        ))}
      </div>

      {/* Tag */}
      <div
        style={{
          position: "absolute",
          bottom: 18,
          left: 18,
          right: 18,
          background: "rgba(11,61,145,0.82)",
          backdropFilter: "blur(12px)",
          borderRadius: 14,
          padding: "0.8rem 1rem",
          border: "1px solid rgba(212,175,55,0.28)",
          zIndex: 2,
        }}
      >
        <p
          style={{
            color: "#d4af37",
            fontSize: 10,
            fontWeight: 700,
            fontFamily: "'DM Sans',sans-serif",
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
            fontSize: 13,
            fontWeight: 600,
            fontFamily: "'DM Sans',sans-serif",
          }}
        >
          Premium Panjabi Collection
        </p>
      </div>
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  const [vis, setVis] = useState(false);
  const whatsapp = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(
    /^\+/,
    ""
  );
  useEffect(() => {
    const t = setTimeout(() => setVis(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(145deg,#062a5f 0%,#0b3d91 48%,#1a5dbf 100%)",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div
          style={{
            position: "absolute",
            top: "-15%",
            right: "-8%",
            width: 580,
            height: 580,
            borderRadius: "50%",
            border: "1px solid rgba(212,175,55,0.14)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "-8%",
            right: "-3%",
            width: 420,
            height: 420,
            borderRadius: "50%",
            border: "1px solid rgba(212,175,55,0.09)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-20%",
            left: "-10%",
            width: 480,
            height: 480,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.05)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "repeating-linear-gradient(-45deg,transparent,transparent 80px,rgba(255,255,255,0.011) 80px,rgba(255,255,255,0.011) 81px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "18%",
            left: 0,
            right: 0,
            height: 1,
            background:
              "linear-gradient(90deg,transparent,rgba(212,175,55,0.22) 30%,rgba(212,175,55,0.22) 70%,transparent)",
          }}
        />
      </div>

      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "7rem 1.75rem 5rem",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "4rem",
          alignItems: "center",
          width: "100%",
          position: "relative",
          zIndex: 1,
        }}
        className="rhero-grid"
      >
        {/* Left */}
        <div
          style={{
            opacity: vis ? 1 : 0,
            transform: vis ? "none" : "translateY(32px)",
            transition: "opacity 0.8s, transform 0.8s",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "rgba(212,175,55,0.14)",
              border: "1px solid rgba(212,175,55,0.35)",
              borderRadius: 999,
              padding: "0.32rem 0.9rem",
              marginBottom: "1.4rem",
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
                fontSize: 11,
                fontWeight: 700,
                fontFamily: "'DM Sans',sans-serif",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Premium Bangladeshi Fashion
            </span>
          </div>

          <h1
            style={{
              fontFamily: "'Playfair Display',Georgia,serif",
              fontSize: "clamp(2.6rem,4.8vw,4rem)",
              fontWeight: 700,
              color: "#fff",
              lineHeight: 1.12,
              marginBottom: "1.2rem",
              letterSpacing: "-0.02em",
            }}
          >
            Wear the Art of <span style={{ color: "#d4af37" }}>Tradition</span>
          </h1>

          <p
            style={{
              color: "rgba(255,255,255,0.7)",
              fontSize: "1.02rem",
              lineHeight: 1.78,
              maxWidth: 450,
              marginBottom: "2.2rem",
              fontFamily: "'DM Sans',sans-serif",
              opacity: vis ? 1 : 0,
              transform: vis ? "none" : "translateY(16px)",
              transition: "opacity 0.8s 0.15s, transform 0.8s 0.15s",
            }}
          >
            Handpicked panjabi &amp; apparel — crafted with care, delivered to
            your door. Pay cash on delivery. No fuss, just quality.
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.85rem",
              opacity: vis ? 1 : 0,
              transform: vis ? "none" : "translateY(16px)",
              transition: "opacity 0.8s 0.3s, transform 0.8s 0.3s",
            }}
          >
            <a
              href="#products"
              style={{
                background: "linear-gradient(135deg,#d4af37,#b8922b)",
                color: "#062a5f",
                padding: "0.85rem 1.9rem",
                borderRadius: 999,
                fontWeight: 700,
                fontSize: 14.5,
                textDecoration: "none",
                fontFamily: "'DM Sans',sans-serif",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                boxShadow: "0 4px 24px rgba(212,175,55,0.38)",
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
                  "0 4px 24px rgba(212,175,55,0.38)";
              }}
            >
              Browse Collection{" "}
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.8"
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
                  padding: "0.85rem 1.7rem",
                  borderRadius: 999,
                  fontWeight: 500,
                  fontSize: 14.5,
                  textDecoration: "none",
                  fontFamily: "'DM Sans',sans-serif",
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
                <WAIcon size={15} color="#25D366" /> Chat with us
              </a>
            )}
          </div>

          <div
            style={{
              display: "flex",
              gap: "1.4rem",
              marginTop: "2.8rem",
              flexWrap: "wrap",
              opacity: vis ? 1 : 0,
              transition: "opacity 0.8s 0.5s",
            }}
          >
            {[["Cash on Delivery"], ["Premium Quality"], ["Fast Delivery"]].map(
              ([lb]) => (
                <div
                  key={lb}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.38rem",
                  }}
                >
                  <span
                    style={{
                      color: "rgba(255,255,255,0.6)",
                      fontSize: 11.5,
                      fontFamily: "'DM Sans',sans-serif",
                      fontWeight: 500,
                    }}
                  >
                    {lb}
                  </span>
                </div>
              )
            )}
          </div>
        </div>

        {/* Right — Carousel (Hidden on mobile, visible on desktop) */}
        <div
          style={{
            opacity: vis ? 1 : 0,
            transform: vis ? "none" : "translateX(36px)",
            transition: "opacity 0.9s 0.2s, transform 0.9s 0.2s",
          }}
          className="rhero-visual"
        >
          <div
            style={{
              position: "relative",
              paddingTop: "2.5rem",
              paddingBottom: "2.5rem",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: "-10%",
                background: "rgba(11,61,145,0.88)",
                backdropFilter: "blur(16px)",
                borderRadius: 16,
                padding: "0.9rem 1.15rem",
                border: "1px solid rgba(212,175,55,0.3)",
                minWidth: 130,
                boxShadow: "0 8px 32px rgba(0,0,0,0.28)",
                animation: "floatA 4s ease-in-out infinite",
                zIndex: 3,
              }}
            >
              <p
                style={{
                  color: "#d4af37",
                  fontSize: 21,
                  fontWeight: 800,
                  fontFamily: "'DM Sans',sans-serif",
                  lineHeight: 1,
                }}
              >
                COD
              </p>
              <p
                style={{
                  color: "rgba(255,255,255,0.65)",
                  fontSize: 10.5,
                  fontFamily: "'DM Sans',sans-serif",
                  marginTop: 3,
                }}
              >
                Cash on Delivery
              </p>
            </div>
            <HeroCarousel />
            <div
              style={{
                position: "absolute",
                bottom: 0,
                right: "-6%",
                background: "rgba(212,175,55,0.14)",
                backdropFilter: "blur(16px)",
                borderRadius: 16,
                padding: "0.9rem 1.15rem",
                border: "1px solid rgba(212,175,55,0.4)",
                minWidth: 120,
                boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
                animation: "floatB 5s ease-in-out infinite",
                zIndex: 3,
              }}
            >
              <p
                style={{
                  color: "#d4af37",
                  fontSize: 21,
                  fontWeight: 800,
                  fontFamily: "'DM Sans',sans-serif",
                  lineHeight: 1,
                }}
              >
                100%
              </p>
              <p
                style={{
                  color: "rgba(255,255,255,0.65)",
                  fontSize: 10.5,
                  fontFamily: "'DM Sans',sans-serif",
                  marginTop: 3,
                }}
              >
                Authentic quality
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Carousel Background */}
      <div
        className="rhero-mobile-carousel"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          display: "none",
        }}
      >
        <HeroCarouselMobile />
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 28,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 5,
          opacity: 0.45,
          animation: "scrollBounce 2s ease-in-out infinite",
        }}
      >
        <span
          style={{
            color: "#fff",
            fontSize: 9.5,
            letterSpacing: "0.12em",
            fontFamily: "'DM Sans',sans-serif",
            textTransform: "uppercase",
          }}
        >
          Scroll
        </span>
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
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
        @keyframes floatA{0%,100%{transform:translateY(0)}50%{transform:translateY(-9px)}}
        @keyframes floatB{0%,100%{transform:translateY(0)}50%{transform:translateY(8px)}}
        @keyframes scrollBounce{0%,100%{transform:translateX(-50%) translateY(0)}50%{transform:translateX(-50%) translateY(6px)}}
        @media(max-width:768px){
          .rhero-grid{grid-template-columns:1fr!important;gap:2.5rem!important;}
          .rhero-visual{display:none!important;}
          .rhero-mobile-carousel{display:block!important;}
          section{background:transparent!important;}
        }
      `}</style>
    </section>
  );
}

// ─── Mobile Hero Carousel ─────────────────────────────────────────────────────
function HeroCarouselMobile() {
  const [cur, setCur] = useState(0);
  const [fading, setFading] = useState(false);
  const timerRef = useRef(null);

  const go = useCallback((idx) => {
    setFading(true);
    setTimeout(() => {
      setCur((idx + HERO_IMGS.length) % HERO_IMGS.length);
      setFading(false);
    }, 300);
  }, []);

  const next = useCallback(() => go(cur + 1), [cur, go]);

  useEffect(() => {
    timerRef.current = setInterval(next, 4500);
    return () => clearInterval(timerRef.current);
  }, [next]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: fading ? 0 : 1,
          transition: "opacity 0.32s ease",
        }}
      >
        <Image
          src={HERO_IMGS[cur]}
          alt={`Collection ${cur + 1}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vh"
          style={{ objectFit: "cover" }}
          priority={cur === 0}
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
        {/* Dark overlay for text readability */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(6,42,95,0.5) 0%, rgba(6,42,95,0.4) 50%, rgba(6,42,95,0.7) 100%)",
          }}
        />
      </div>

      {/* Dots indicator at bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 20,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 5,
          zIndex: 2,
        }}
      >
        {HERO_IMGS.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            style={{
              width: i === cur ? 20 : 6,
              height: 6,
              borderRadius: 3,
              background: i === cur ? "#d4af37" : "rgba(255,255,255,0.42)",
              border: "none",
              cursor: "pointer",
              padding: 0,
              transition: "width 0.3s, background 0.3s",
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Feature Strip ────────────────────────────────────────────────────────────
function FeatureStrip() {
  const items = [
    {
      title: "Cash on Delivery",
      desc: "Pay when you receive — zero upfront risk",
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
    },
    {
      title: "Premium Fabric",
      desc: "Carefully sourced materials, crafted to last",
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
    },
    {
      title: "WhatsApp Support",
      desc: "Always available — reply within minutes",
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
    },
    {
      title: "Fast Delivery",
      desc: "Delivered to your door across Bangladesh",
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
          padding: "2rem 1.75rem",
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
        }}
        className="rfeat-grid"
      >
        {items.map((f, i) => (
          <div
            key={f.title}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "0.85rem",
              padding: "1.65rem 1.4rem",
              borderRight: i < items.length - 1 ? "1px solid #eae7df" : "none",
            }}
            className="rfeat-item"
          >
            <div
              style={{
                width: 42,
                height: 42,
                flexShrink: 0,
                borderRadius: 11,
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
                  fontFamily: "'DM Sans',sans-serif",
                  fontWeight: 700,
                  fontSize: 13.5,
                  color: "#0b3d91",
                  marginBottom: 3,
                }}
              >
                {f.title}
              </p>
              <p
                style={{
                  fontFamily: "'DM Sans',sans-serif",
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
        @media(max-width:900px){.rfeat-grid{grid-template-columns:repeat(2,1fr)!important;}.rfeat-item:nth-child(2){border-right:none!important;}.rfeat-item:nth-child(n+3){border-top:1px solid #eae7df;}}
        @media(max-width:500px){.rfeat-grid{grid-template-columns:1fr!important;}.rfeat-item{border-right:none!important;border-top:1px solid #eae7df;}.rfeat-item:first-child{border-top:none;}}
      `}</style>
    </section>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function SkeletonCard() {
  const sh = {
    backgroundImage:
      "linear-gradient(90deg,#f0ede6 0%,#e8e4dc 50%,#f0ede6 100%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.4s linear infinite",
    borderRadius: 6,
  };
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 20,
        overflow: "hidden",
        boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
      }}
    >
      <div style={{ aspectRatio: "4/5", ...sh }} />
      <div style={{ padding: "1.2rem" }}>
        <div style={{ height: 15, width: "72%", marginBottom: 10, ...sh }} />
        <div style={{ height: 11, width: "90%", marginBottom: 6, ...sh }} />
        <div style={{ height: 22, width: "44%", marginTop: 14, ...sh }} />
        <div style={{ height: 38, borderRadius: 10, marginTop: 14, ...sh }} />
      </div>
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
    </div>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({ product }) {
  const [hov, setHov] = useState(false);
  const isOut = product.stock === 0;
  const img = product.images?.[0] || "/placeholder.jpg";
  const hasDiscount =
    product.discountPrice && product.discountPrice < product.price;
  const pct = hasDiscount
    ? Math.round(
        ((product.price - product.discountPrice) / product.price) * 100
      )
    : 0;
  const sizes =
    Array.isArray(product.sizes) && product.sizes.length ? product.sizes : [];

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: "#fff",
        borderRadius: 20,
        overflow: "hidden",
        boxShadow: hov
          ? "0 16px 48px rgba(11,61,145,0.13),0 4px 16px rgba(0,0,0,0.06)"
          : "0 2px 16px rgba(0,0,0,0.06)",
        transition: "box-shadow 0.3s, transform 0.3s",
        transform: hov ? "translateY(-4px)" : "none",
        display: "flex",
        flexDirection: "column",
      }}
    >
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
            sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,25vw"
            style={{
              objectFit: "cover",
              transition: "transform 0.5s",
              transform: hov ? "scale(1.05)" : "scale(1)",
            }}
          />
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
                  padding: "0.32rem 0.9rem",
                  borderRadius: 999,
                  fontFamily: "'DM Sans',sans-serif",
                  fontWeight: 700,
                  fontSize: 12.5,
                }}
              >
                Out of Stock
              </span>
            </div>
          )}
          {hasDiscount && !isOut && (
            <div
              style={{
                position: "absolute",
                top: 11,
                left: 11,
                background: "linear-gradient(135deg,#d4af37,#b8922b)",
                color: "#062a5f",
                padding: "0.22rem 0.55rem",
                borderRadius: 999,
                fontFamily: "'DM Sans',sans-serif",
                fontWeight: 700,
                fontSize: 10.5,
              }}
            >
              -{pct}%
            </div>
          )}
          {product.featured && !isOut && (
            <div
              style={{
                position: "absolute",
                top: 11,
                right: 11,
                background: "rgba(11,61,145,0.88)",
                backdropFilter: "blur(8px)",
                color: "#d4af37",
                padding: "0.22rem 0.55rem",
                borderRadius: 999,
                fontFamily: "'DM Sans',sans-serif",
                fontWeight: 600,
                fontSize: 9.5,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              Featured
            </div>
          )}
        </div>
      </Link>

      <div
        style={{
          padding: "1.05rem 1.2rem 1.2rem",
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
              fontFamily: "'DM Sans',sans-serif",
              fontWeight: 700,
              fontSize: 14.5,
              color: "#1a1a2e",
              lineHeight: 1.35,
              marginBottom: "0.28rem",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              minHeight: 40,
            }}
          >
            {product.name}
          </h3>
        </Link>

        <p
          style={{
            fontFamily: "'DM Sans',sans-serif",
            fontSize: 11.5,
            color: "#888",
            lineHeight: 1.5,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            minHeight: 34,
            marginBottom: "0.6rem",
          }}
        >
          {product.description}
        </p>

        {/* Size pills */}
        {sizes.length > 0 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 4,
              marginBottom: "0.72rem",
            }}
          >
            {sizes.map((s) => (
              <span
                key={s}
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 10,
                  fontWeight: 600,
                  color: "#0b3d91",
                  border: "1px solid rgba(11,61,145,0.22)",
                  borderRadius: 4,
                  padding: "1px 6px",
                  background: "rgba(11,61,145,0.04)",
                }}
              >
                {s}
              </span>
            ))}
          </div>
        )}

        {/* Price */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.45rem",
            marginBottom: "0.8rem",
          }}
        >
          <span
            style={{
              fontFamily: "'DM Sans',sans-serif",
              fontWeight: 800,
              fontSize: 18.5,
              color: "#0b3d91",
            }}
          >
            {formatPrice(hasDiscount ? product.discountPrice : product.price)}
          </span>
          {hasDiscount && (
            <span
              style={{
                fontFamily: "'DM Sans',sans-serif",
                fontSize: 12.5,
                color: "#bbb",
                textDecoration: "line-through",
              }}
            >
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        {!isOut && product.stock <= 10 && (
          <p
            style={{
              fontFamily: "'DM Sans',sans-serif",
              fontSize: 10.5,
              color: "#d97706",
              fontWeight: 600,
              marginBottom: "0.55rem",
            }}
          >
            Only {product.stock} left!
          </p>
        )}

        <Link
          href={`/orders/${product._id}`}
          style={{
            display: "block",
            marginTop: "auto",
            textAlign: "center",
            padding: "0.68rem",
            borderRadius: 11,
            fontFamily: "'DM Sans',sans-serif",
            fontWeight: 700,
            fontSize: 13.5,
            textDecoration: "none",
            transition: "all 0.2s",
            ...(isOut
              ? { background: "#f0ede6", color: "#aaa", pointerEvents: "none" }
              : {
                  background: hov
                    ? "linear-gradient(135deg,#0b3d91,#062a5f)"
                    : "#0b3d91",
                  color: "#fff",
                  boxShadow: hov ? "0 4px 16px rgba(11,61,145,0.38)" : "none",
                }),
          }}
        >
          {isOut ? "Out of Stock" : "Order Now →"}
        </Link>
      </div>
    </div>
  );
}

// ─── Products Section ─────────────────────────────────────────────────────────
function ProductsSection() {
  const [products, setProducts] = useState([]);
  const [count, setCount] = useState(8);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    let ok = true;
    fetch("/api/products")
      .then((r) => (r.ok ? r.json() : []))
      .then((d) => {
        if (ok) setProducts(Array.isArray(d) ? d : []);
      })
      .catch(() => {
        if (ok) setProducts([]);
      })
      .finally(() => {
        if (ok) setLoading(false);
      });
    return () => {
      ok = false;
    };
  }, []);

  const filtered = useMemo(() => {
    if (!q.trim()) return products;
    const lq = q.toLowerCase();
    return products.filter(
      (p) =>
        (p.name || "").toLowerCase().includes(lq) ||
        (p.description || "").toLowerCase().includes(lq)
    );
  }, [products, q]);

  const visible = filtered.slice(0, count);
  const more = filtered.length - count;

  return (
    <section id="products" style={{ background: "#faf8f4", padding: "5rem 0" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.75rem" }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: "1.5rem",
            marginBottom: "2.4rem",
          }}
        >
          <div>
            <p
              style={{
                fontFamily: "'DM Sans',sans-serif",
                fontSize: 11.5,
                fontWeight: 700,
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
                fontFamily: "'Playfair Display',Georgia,serif",
                fontSize: "clamp(1.75rem,3vw,2.35rem)",
                fontWeight: 700,
                color: "#0b3d91",
                letterSpacing: "-0.02em",
                lineHeight: 1.15,
              }}
            >
              Featured Products
            </h2>
          </div>
          <div style={{ position: "relative", width: "min(310px,100%)" }}>
            <div
              style={{
                position: "absolute",
                left: 13,
                top: "50%",
                transform: "translateY(-50%)",
                color: focused ? "#0b3d91" : "#aaa",
                transition: "color 0.2s",
                pointerEvents: "none",
              }}
            >
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
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
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setCount(8);
              }}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Search products..."
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "0.62rem 1rem 0.62rem 2.35rem",
                borderRadius: 11,
                border: focused ? "1.5px solid #0b3d91" : "1.5px solid #e8e4dc",
                background: "#fff",
                fontFamily: "'DM Sans',sans-serif",
                fontSize: 13.5,
                color: "#1a1a2e",
                outline: "none",
                transition: "border-color 0.2s, box-shadow 0.2s",
                boxShadow: focused ? "0 0 0 3px rgba(11,61,145,0.09)" : "none",
              }}
            />
          </div>
        </div>

        {loading ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(235px,1fr))",
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
                fontFamily: "'DM Sans',sans-serif",
                fontSize: 15.5,
                color: "#aaa",
              }}
            >
              {q ? `No products found for "${q}"` : "No products available yet"}
            </p>
            {q && (
              <button
                onClick={() => setQ("")}
                style={{
                  marginTop: "0.7rem",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#0b3d91",
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 13.5,
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
                gridTemplateColumns: "repeat(auto-fill,minmax(235px,1fr))",
                gap: "1.5rem",
              }}
            >
              {visible.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
            {more > 0 && (
              <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
                <button
                  onClick={() => setCount((c) => c + 8)}
                  style={{
                    background: "transparent",
                    border: "2px solid #0b3d91",
                    color: "#0b3d91",
                    padding: "0.72rem 2.4rem",
                    borderRadius: 999,
                    fontFamily: "'DM Sans',sans-serif",
                    fontWeight: 700,
                    fontSize: 14.5,
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
                  Load more ({more} remaining)
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

// ─── How It Works ─────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Pick a product",
      desc: "Browse our curated collection and choose the piece that speaks to you.",
      icon: (
        <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
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
      desc: "Fill in your details and pick your size. We'll call to confirm.",
      icon: (
        <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
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
      desc: "Receive your order at home and pay cash to the delivery rider.",
      icon: (
        <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
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
        background: "linear-gradient(160deg,#0b3d91 0%,#062a5f 100%)",
        padding: "5.5rem 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-30%",
          right: "-5%",
          width: 480,
          height: 480,
          borderRadius: "50%",
          border: "1px solid rgba(212,175,55,0.09)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 1.75rem",
          position: "relative",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <p
            style={{
              fontFamily: "'DM Sans',sans-serif",
              fontSize: 11.5,
              fontWeight: 700,
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
              fontFamily: "'Playfair Display',Georgia,serif",
              fontSize: "clamp(1.75rem,3vw,2.35rem)",
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
            gridTemplateColumns: "repeat(3,1fr)",
            gap: "2rem",
            position: "relative",
          }}
          className="rsteps-grid"
        >
          <div
            style={{
              position: "absolute",
              top: 55,
              left: "20%",
              right: "20%",
              height: 1,
              background:
                "linear-gradient(90deg,transparent,rgba(212,175,55,0.28) 20%,rgba(212,175,55,0.28) 80%,transparent)",
              pointerEvents: "none",
            }}
            className="rsteps-line"
          />
          {steps.map((s) => (
            <div
              key={s.num}
              style={{
                textAlign: "center",
                padding: "2rem 1.5rem",
                background: "rgba(255,255,255,0.05)",
                backdropFilter: "blur(8px)",
                borderRadius: 20,
                border: "1px solid rgba(255,255,255,0.1)",
                transition: "border-color 0.3s, background 0.3s",
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
              <div
                style={{
                  width: 62,
                  height: 62,
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg,rgba(212,175,55,0.2),rgba(212,175,55,0.07))",
                  border: "1.5px solid rgba(212,175,55,0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1.2rem",
                  color: "#d4af37",
                }}
              >
                {s.icon}
              </div>
              <div
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 10.5,
                  fontWeight: 700,
                  color: "rgba(212,175,55,0.6)",
                  letterSpacing: "0.12em",
                  marginBottom: 8,
                }}
              >
                {s.num}
              </div>
              <h3
                style={{
                  fontFamily: "'Playfair Display',Georgia,serif",
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: "#fff",
                  marginBottom: "0.7rem",
                }}
              >
                {s.title}
              </h3>
              <p
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 12.5,
                  color: "rgba(255,255,255,0.58)",
                  lineHeight: 1.65,
                }}
              >
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
      <style>{`@media(max-width:700px){.rsteps-grid{grid-template-columns:1fr!important;}.rsteps-line{display:none;}}`}</style>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
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
        borderTop: "1px solid rgba(212,175,55,0.14)",
      }}
    >
      {/* Main row */}
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "2.5rem 1.75rem",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "2rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 9,
              overflow: "hidden",
              position: "relative",
              flexShrink: 0,
            }}
          >
            <Image
              src="/logo-bgremoved.png"
              alt={appName}
              fill
              sizes="(max-width: 768px) 100vw, 380px"
              style={{ objectFit: "contain" }}
              onError={(e) => {
                e.currentTarget.src = "/logo.png";
              }}
            />
          </div>
          <div>
            <p
              style={{
                fontFamily: "'Playfair Display',Georgia,serif",
                fontWeight: 700,
                fontSize: 15.5,
                color: "#fff",
              }}
            >
              {appName}
            </p>
            <p
              style={{
                fontFamily: "'DM Sans',sans-serif",
                fontSize: 11,
                color: "rgba(255,255,255,0.35)",
              }}
            >
              Premium Bangladeshi Fashion
            </p>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "1.5rem",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {whatsapp && (
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noreferrer"
              style={{
                color: "#25D366",
                fontFamily: "'DM Sans',sans-serif",
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
              color: "rgba(255,255,255,0.42)",
              fontFamily: "'DM Sans',sans-serif",
              fontSize: 13,
              textDecoration: "none",
            }}
          >
            Collection
          </a>
          <a
            href="#how-it-works"
            style={{
              color: "rgba(255,255,255,0.42)",
              fontFamily: "'DM Sans',sans-serif",
              fontSize: 13,
              textDecoration: "none",
            }}
          >
            How it works
          </a>
          <Link
            href="/admin"
            style={{
              color: "rgba(255,255,255,0.22)",
              fontFamily: "'DM Sans',sans-serif",
              fontSize: 13,
              textDecoration: "none",
            }}
          >
            Admin
          </Link>
        </div>

        <p
          style={{
            fontFamily: "'DM Sans',sans-serif",
            fontSize: 12,
            color: "rgba(255,255,255,0.26)",
            alignSelf: "center",
          }}
        >
          © {new Date().getFullYear()} {appName}. All rights reserved.
        </p>
      </div>

      {/* Developer credit bar */}
      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.055)",
          padding: "1rem 1.75rem",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontFamily: "'DM Sans',sans-serif",
              fontSize: 12,
              color: "rgba(255,255,255,0.26)",
            }}
          >
            Designed &amp; developed by
          </span>
          <a
            href="https://wa.me/8801619240154"
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
              fontFamily: "'DM Sans',sans-serif",
              fontSize: 12,
              fontWeight: 700,
              color: "#d4af37",
              textDecoration: "none",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#e8c84a")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#d4af37")}
          >
            <span>Rihan</span>
            <WAIcon size={13} color="#25D366" />
          </a>
          <span
            style={{
              fontFamily: "'DM Sans',sans-serif",
              fontSize: 12,
              color: "rgba(255,255,255,0.26)",
            }}
          >
            — available for web &amp; app projects
          </span>
        </div>
      </div>
    </footer>
  );
}

// ─── WhatsApp FAB ─────────────────────────────────────────────────────────────
function WhatsAppFAB() {
  const raw = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
  if (!raw) return null;
  const number = raw.replace(/^\+/, "");
  const [hov, setHov] = useState(false);
  return (
    <a
      href={`https://wa.me/${number}?text=${encodeURIComponent(
        "Hello! I have a question about your products."
      )}`}
      target="_blank"
      rel="noreferrer"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: "fixed",
        bottom: 26,
        right: 26,
        zIndex: 999,
        width: 54,
        height: 54,
        borderRadius: "50%",
        background: "#25D366",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: hov
          ? "0 8px 32px rgba(37,211,102,0.55)"
          : "0 4px 20px rgba(37,211,102,0.38)",
        transition: "transform 0.25s, box-shadow 0.25s",
        transform: hov ? "scale(1.1)" : "scale(1)",
      }}
    >
      <WAIcon size={25} color="#fff" />
      <div
        style={{
          position: "absolute",
          inset: -4,
          borderRadius: "50%",
          border: "2px solid rgba(37,211,102,0.38)",
          animation: "waPulse 2s ease-in-out infinite",
        }}
      />
      <style>{`@keyframes waPulse{0%,100%{transform:scale(1);opacity:.6}50%{transform:scale(1.18);opacity:0}}`}</style>
    </a>
  );
}

function WAIcon({ size = 20, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.6 12.6 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0  01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function HomePage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:smooth;}
        body{background:#faf8f4;}
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
