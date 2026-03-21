export default function CheckoutStepper({ current }: { current: 1 | 2 | 3 }) {
  const steps = [
    { n: 1, label: "Your Details" },
    { n: 2, label: "Payment" },
    { n: 3, label: "Confirmed" },
  ];

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, maxWidth: 420 }}>
      {steps.map((step, i) => {
        const done = step.n < current;
        const active = step.n === current;
        return (
          <div key={step.n} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : "auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
              <div
                style={{
                  width: 28, height: 28, borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.75rem", fontWeight: 700,
                  background: done ? "var(--clr-gold)" : active ? "var(--clr-gold-dim)" : "transparent",
                  border: `1.5px solid ${done || active ? "var(--clr-gold)" : "var(--clr-border)"}`,
                  color: done ? "#080811" : active ? "var(--clr-gold)" : "var(--clr-text-muted)",
                  transition: "all 0.3s",
                }}
              >
                {done ? "✓" : step.n}
              </div>
              <span style={{
                fontSize: "0.75rem", fontWeight: active ? 600 : 400,
                color: active ? "var(--clr-cream)" : done ? "var(--clr-gold)" : "var(--clr-text-muted)",
                letterSpacing: "0.04em",
              }}>
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div style={{ flex: 1, height: 1, margin: "0 12px", background: done ? "var(--clr-gold)" : "var(--clr-border)", transition: "background 0.3s" }} />
            )}
          </div>
        );
      })}
    </div>
  );
}
