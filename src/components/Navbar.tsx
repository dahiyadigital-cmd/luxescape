"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiMenu, FiX } from "react-icons/fi";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/deals", label: "Deals" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: "background 0.35s ease, box-shadow 0.35s ease",
        background: scrolled
          ? "rgba(8,8,17,0.92)"
          : "linear-gradient(to bottom, rgba(8,8,17,0.8), transparent)",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        boxShadow: scrolled ? "0 1px 0 rgba(201,168,76,0.12)" : "none",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 72,
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "1.6rem",
              color: "var(--clr-gold)",
              letterSpacing: "0.04em",
              fontWeight: 500,
            }}
          >
            LuxEscape
          </span>
          <span
            style={{
              fontSize: "0.55rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--clr-text-muted)",
              marginTop: 4,
              borderLeft: "1px solid var(--clr-border)",
              paddingLeft: 8,
            }}
          >
            Luxury Travel
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav style={{ display: "flex", alignItems: "center", gap: 36 }}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontSize: "0.875rem",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color:
                  pathname === link.href
                    ? "var(--clr-gold)"
                    : "var(--clr-text-muted)",
                fontWeight: 500,
                transition: "color 0.2s",
                position: "relative",
              }}
              className="nav-link"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/deals" className="btn-primary" style={{ padding: "10px 20px" }}>
            View Deals
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button
          aria-label="Toggle menu"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            display: "none",
            color: "var(--clr-gold)",
            fontSize: "1.5rem",
          }}
          id="mobile-menu-btn"
        >
          {mobileOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileOpen && (
        <div
          style={{
            background: "rgba(8,8,17,0.98)",
            backdropFilter: "blur(16px)",
            borderTop: "1px solid var(--clr-border)",
            padding: "24px",
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              style={{
                display: "block",
                padding: "14px 0",
                fontFamily: "var(--font-serif)",
                fontSize: "1.25rem",
                color:
                  pathname === link.href
                    ? "var(--clr-gold)"
                    : "var(--clr-text)",
                borderBottom: "1px solid var(--clr-border)",
              }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/deals"
            onClick={() => setMobileOpen(false)}
            className="btn-primary"
            style={{ marginTop: 20, width: "100%", justifyContent: "center" }}
          >
            View All Deals
          </Link>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          nav { display: none !important; }
          #mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
