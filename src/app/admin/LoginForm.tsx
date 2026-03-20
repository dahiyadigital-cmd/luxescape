"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";

const initialState: { error?: string } = {};

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--clr-bg)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 380,
          padding: "48px 40px",
          background: "var(--clr-surface)",
          border: "1px solid var(--clr-border)",
          borderRadius: "var(--radius-md)",
        }}
      >
        <p
          style={{
            fontSize: "0.7rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--clr-gold)",
            marginBottom: 8,
          }}
        >
          LuxEscape
        </p>
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "1.8rem",
            color: "var(--clr-cream)",
            fontWeight: 300,
            marginBottom: 32,
          }}
        >
          Admin
        </h1>

        <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={labelStyle}>Password</label>
            <input
              name="password"
              type="password"
              required
              autoFocus
              style={inputStyle}
              placeholder="Enter admin password"
            />
          </div>

          {state?.error && (
            <p style={{ color: "#f87171", fontSize: "0.85rem" }}>{state.error}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="btn-primary"
            style={{ width: "100%", justifyContent: "center", marginTop: 8 }}
          >
            {pending ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.75rem",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "var(--clr-text-muted)",
  marginBottom: 6,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  background: "var(--clr-bg)",
  border: "1px solid var(--clr-border)",
  borderRadius: "var(--radius-sm)",
  color: "var(--clr-text)",
  fontSize: "0.95rem",
  fontFamily: "var(--font-sans)",
  outline: "none",
  boxSizing: "border-box",
};
