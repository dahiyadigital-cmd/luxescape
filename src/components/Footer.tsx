import Link from "next/link";
import { FiInstagram, FiFacebook, FiTwitter, FiMail } from "react-icons/fi";

const footerLinks = [
  {
    heading: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "How It Works", href: "/about#how" },
      { label: "Careers", href: "#" },
    ],
  },
  {
    heading: "Explore",
    links: [
      { label: "All Deals", href: "/deals" },
      { label: "Beach Escapes", href: "/deals?cat=beach" },
      { label: "City Breaks", href: "/deals?cat=city" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "FAQ", href: "#" },
      { label: "Contact", href: "#" },
      { label: "Privacy Policy", href: "#" },
    ],
  },
];

const socials = [
  { icon: <FiInstagram />, href: "#", label: "Instagram" },
  { icon: <FiFacebook />, href: "#", label: "Facebook" },
  { icon: <FiTwitter />, href: "#", label: "Twitter" },
  { icon: <FiMail />, href: "#", label: "Email" },
];

export default function Footer() {
  return (
    <footer
      style={{
        background: "var(--clr-bg2)",
        borderTop: "1px solid var(--clr-border)",
        paddingTop: 64,
        paddingBottom: 32,
      }}
    >
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: 40,
            marginBottom: 48,
          }}
          className="footer-grid"
        >
          {/* Brand */}
          <div>
            <Link href="/">
              <span
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "2rem",
                  color: "var(--clr-gold)",
                  letterSpacing: "0.04em",
                }}
              >
                LuxEscape
              </span>
            </Link>
            <p
              style={{
                color: "var(--clr-text-muted)",
                fontSize: "0.875rem",
                lineHeight: 1.7,
                marginTop: 16,
                maxWidth: 260,
              }}
            >
              Handpicked luxury travel experiences curated for the discerning traveller. Built for training &amp; education.
            </p>
            {/* Socials */}
            <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    border: "1px solid var(--clr-border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--clr-text-muted)",
                    fontSize: "1rem",
                    transition: "var(--transition)",
                  }}
                  className="social-icon"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((col) => (
            <div key={col.heading}>
              <p
                style={{
                  fontSize: "0.7rem",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "var(--clr-gold)",
                  marginBottom: 16,
                  fontWeight: 600,
                }}
              >
                {col.heading}
              </p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      style={{
                        fontSize: "0.875rem",
                        color: "var(--clr-text-muted)",
                        transition: "color 0.2s",
                      }}
                      className="footer-link"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: "1px solid var(--clr-border)",
            paddingTop: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <p style={{ fontSize: "0.8rem", color: "var(--clr-text-muted)" }}>
            © {new Date().getFullYear()} LuxEscape. Built for training &amp; education purposes only.
          </p>
          <p style={{ fontSize: "0.8rem", color: "var(--clr-text-muted)" }}>
            This site is not affiliated with LuxuryEscapes.com
          </p>
        </div>
      </div>

      <style>{`
        .footer-link:hover { color: var(--clr-gold) !important; }
        .social-icon:hover { border-color: var(--clr-gold); color: var(--clr-gold) !important; background: var(--clr-gold-dim); }
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}
