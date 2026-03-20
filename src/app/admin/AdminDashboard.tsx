"use client";

import { useState, useTransition } from "react";
import type { HotelWithRooms, HotelRow, RoomPackageRow } from "@/lib/database.types";
import {
  logoutAction,
  createDealAction,
  updateDealAction,
  deleteDealAction,
  toggleActiveAction,
} from "./actions";

// ── Styles ────────────────────────────────────────────────────────────────────

const input: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  background: "var(--clr-bg)",
  border: "1px solid var(--clr-border)",
  borderRadius: "var(--radius-sm)",
  color: "var(--clr-text)",
  fontSize: "0.88rem",
  fontFamily: "var(--font-sans)",
  outline: "none",
  boxSizing: "border-box",
};

const textarea: React.CSSProperties = {
  ...input,
  resize: "vertical",
  minHeight: 80,
};

const label: React.CSSProperties = {
  display: "block",
  fontSize: "0.7rem",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "var(--clr-text-muted)",
  marginBottom: 4,
};

const fieldGroup = (span = 1): React.CSSProperties => ({
  gridColumn: `span ${span}`,
  display: "flex",
  flexDirection: "column",
  gap: 4,
});

// ── Field component ───────────────────────────────────────────────────────────

function Field({
  label: lbl,
  name,
  type = "text",
  defaultValue = "",
  placeholder = "",
  span = 1,
  multiline = false,
  rows = 3,
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string | number;
  placeholder?: string;
  span?: number;
  multiline?: boolean;
  rows?: number;
  required?: boolean;
}) {
  return (
    <div style={fieldGroup(span)}>
      <label style={label}>{lbl}</label>
      {multiline ? (
        <textarea
          name={name}
          defaultValue={String(defaultValue)}
          placeholder={placeholder}
          rows={rows}
          style={textarea}
        />
      ) : (
        <input
          name={name}
          type={type}
          defaultValue={String(defaultValue)}
          placeholder={placeholder}
          required={required}
          style={input}
        />
      )}
    </div>
  );
}

// ── Room package section ──────────────────────────────────────────────────────

function PackageFields({ n, pkg }: { n: number; pkg?: RoomPackageRow }) {
  return (
    <div
      style={{
        padding: "16px",
        background: "rgba(0,0,0,0.2)",
        borderRadius: "var(--radius-sm)",
        border: "1px solid var(--clr-border)",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 12,
      }}
    >
      <p
        style={{
          gridColumn: "span 2",
          fontSize: "0.7rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--clr-gold)",
          marginBottom: 4,
        }}
      >
        Package {n} {n === 2 && <span style={{ color: "var(--clr-text-muted)" }}>(optional)</span>}
      </p>
      <Field label="Slug (e.g. r9a)" name={`pkg${n}_slug`} defaultValue={pkg?.package_slug ?? ""} placeholder={`r9${n === 1 ? "a" : "b"}`} />
      <Field label="Name" name={`pkg${n}_name`} defaultValue={pkg?.name ?? ""} span={1} />
      <Field label="Nights" name={`pkg${n}_nights`} type="number" defaultValue={pkg?.nights ?? ""} />
      <Field label="Original Price" name={`pkg${n}_original_price`} type="number" defaultValue={pkg?.original_price ?? ""} />
      <Field label="Sale Price" name={`pkg${n}_sale_price`} type="number" defaultValue={pkg?.sale_price ?? ""} />
      <Field label="Per Night" name={`pkg${n}_per_night`} type="number" defaultValue={pkg?.per_night ?? ""} />
      <Field label="Beds" name={`pkg${n}_beds`} defaultValue={pkg?.beds ?? "1 King Bed"} />
      <Field label="Max Guests" name={`pkg${n}_max_guests`} type="number" defaultValue={pkg?.max_guests ?? 2} />
      <div style={fieldGroup(2)}>
        <label style={label}>Features (one per line)</label>
        <textarea
          name={`pkg${n}_features`}
          defaultValue={(pkg?.features ?? []).join("\n")}
          rows={3}
          style={textarea}
          placeholder="Sea-View Balcony&#10;Daily Breakfast&#10;Beach Club Access"
        />
      </div>
    </div>
  );
}

// ── Deal form ─────────────────────────────────────────────────────────────────

function DealForm({
  hotel,
  onCancel,
  onSave,
}: {
  hotel?: HotelWithRooms;
  onCancel: () => void;
  onSave: (h: HotelRow) => void;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const isEdit = !!hotel;

  const handleSubmit = (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const result = isEdit
        ? await updateDealAction(hotel.id, formData)
        : await createDealAction(formData);

      if ("error" in result && result.error) {
        setError(result.error);
      } else if ("hotel" in result && result.hotel) {
        onSave(result.hotel as HotelRow);
      }
    });
  };

  const pkg1 = hotel?.room_packages?.[0];
  const pkg2 = hotel?.room_packages?.[1];

  return (
    <div>
      {/* Form header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "1.5rem",
            color: "var(--clr-cream)",
            fontWeight: 300,
          }}
        >
          {isEdit ? `Edit: ${hotel.title}` : "Add New Deal"}
        </h2>
        <button onClick={onCancel} style={btnSecondary}>
          Cancel
        </button>
      </div>

      <form action={handleSubmit}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
          }}
        >
          {/* Basic info */}
          <p style={sectionLabel}>Basic Info</p>
          {!isEdit && (
            <Field label="Slug (unique ID, e.g. 9)" name="slug" required span={1} placeholder="9" />
          )}
          <Field label="Deal Title" name="title" defaultValue={hotel?.title} required span={isEdit ? 2 : 1} />
          <Field label="Hotel Name" name="hotel_name" defaultValue={hotel?.hotel_name} required />
          <div style={fieldGroup()}>
            <label style={label}>Category</label>
            <select name="category" defaultValue={hotel?.category ?? "beach"} style={input}>
              <option value="beach">Beach & Islands</option>
              <option value="city">City Breaks</option>
              <option value="adventure">Adventure</option>
              <option value="wellness">Wellness & Spa</option>
            </select>
          </div>
          <Field label="Location (e.g. Ubud, Bali)" name="location" defaultValue={hotel?.location} required />
          <Field label="Country" name="country" defaultValue={hotel?.country} required />
          <Field label="Region" name="region" defaultValue={hotel?.region ?? ""} placeholder="Europe / Asia Pacific / Middle East / Africa & Indian Ocean" />

          {/* Pricing */}
          <p style={sectionLabel}>Pricing & Duration</p>
          <Field label="Original Price (£)" name="original_price" type="number" defaultValue={hotel?.original_price} required />
          <Field label="Sale Price (£)" name="sale_price" type="number" defaultValue={hotel?.sale_price} required />
          <Field label="Discount %" name="discount" type="number" defaultValue={hotel?.discount ?? ""} />
          <Field label="Nights" name="nights" type="number" defaultValue={hotel?.nights} required />

          {/* Ratings */}
          <p style={sectionLabel}>Ratings</p>
          <Field label="Star Rating (1–5)" name="star_rating" type="number" defaultValue={hotel?.star_rating ?? 5} />
          <Field label="Rating (e.g. 4.9)" name="rating" type="number" defaultValue={hotel?.rating ?? ""} />
          <Field label="Review Count" name="review_count" type="number" defaultValue={hotel?.review_count ?? ""} />

          {/* Description */}
          <p style={sectionLabel}>Content</p>
          <div style={fieldGroup(2)}>
            <label style={label}>Description</label>
            <textarea name="description" defaultValue={hotel?.description ?? ""} rows={4} style={textarea} />
          </div>

          {/* Arrays */}
          <div style={fieldGroup(2)}>
            <label style={label}>Images — one URL per line</label>
            <textarea
              name="images"
              defaultValue={(hotel?.images ?? []).join("\n")}
              rows={3}
              style={textarea}
              placeholder="https://images.unsplash.com/photo-xxx?w=1200&q=85"
            />
          </div>
          <div style={fieldGroup()}>
            <label style={label}>Highlights — one per line</label>
            <textarea name="highlights" defaultValue={(hotel?.highlights ?? []).join("\n")} rows={5} style={textarea} />
          </div>
          <div style={fieldGroup()}>
            <label style={label}>What&apos;s Included — one per line</label>
            <textarea name="includes" defaultValue={(hotel?.includes ?? []).join("\n")} rows={5} style={textarea} />
          </div>
          <div style={fieldGroup()}>
            <label style={label}>Amenities — one per line</label>
            <textarea name="amenities" defaultValue={(hotel?.amenities ?? []).join("\n")} rows={5} style={textarea} />
          </div>
          <div style={fieldGroup()}>
            <label style={label}>Fine Print — one per line</label>
            <textarea name="fine_print" defaultValue={(hotel?.fine_print ?? []).join("\n")} rows={5} style={textarea} />
          </div>

          {/* Dates */}
          <p style={sectionLabel}>Dates & Logistics</p>
          <Field label="Valid From (e.g. 1 June 2026)" name="valid_from" defaultValue={hotel?.valid_from ?? ""} />
          <Field label="Valid To" name="valid_to" defaultValue={hotel?.valid_to ?? ""} />
          <Field label="Book By" name="book_by" defaultValue={hotel?.book_by ?? ""} />
          <div style={fieldGroup(2)}>
            <label style={label}>Getting There</label>
            <textarea name="getting_there" defaultValue={hotel?.getting_there ?? ""} rows={3} style={textarea} />
          </div>
          <div style={fieldGroup()}>
            <label style={label}>Cancellation Policy</label>
            <textarea name="cancellation_policy" defaultValue={hotel?.cancellation_policy ?? ""} rows={3} style={textarea} />
          </div>
          <div style={fieldGroup()}>
            <label style={label}>Flexible Cancellation</label>
            <textarea name="flexible_cancellation" defaultValue={hotel?.flexible_cancellation ?? ""} rows={3} style={textarea} />
          </div>

          {/* Room packages */}
          <p style={sectionLabel}>Room Packages</p>
          <div style={{ ...fieldGroup(2), gap: 16 }}>
            <PackageFields n={1} pkg={pkg1} />
            <PackageFields n={2} pkg={pkg2} />
          </div>
        </div>

        {error && (
          <p style={{ color: "#f87171", fontSize: "0.85rem", marginTop: 16 }}>
            Error: {error}
          </p>
        )}

        <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
          <button type="submit" disabled={pending} className="btn-primary">
            {pending ? "Saving…" : isEdit ? "Save Changes" : "Create Deal"}
          </button>
          <button type="button" onClick={onCancel} style={btnSecondary}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

// ── Main dashboard ────────────────────────────────────────────────────────────

export default function AdminDashboard({
  initialHotels,
}: {
  initialHotels: HotelWithRooms[];
}) {
  const [hotels, setHotels] = useState<HotelWithRooms[]>(initialHotels);
  const [mode, setMode] = useState<"list" | "add" | "edit">("list");
  const [editingHotel, setEditingHotel] = useState<HotelWithRooms | null>(null);
  const [actionPending, startTransition] = useTransition();
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleDelete = (hotel: HotelWithRooms) => {
    if (!confirm(`Delete "${hotel.title}"? This cannot be undone.`)) return;
    startTransition(async () => {
      const result = await deleteDealAction(hotel.id);
      if (result?.error) {
        showToast(`Error: ${result.error}`);
      } else {
        setHotels((prev) => prev.filter((h) => h.id !== hotel.id));
        showToast("Deal deleted.");
      }
    });
  };

  const handleToggle = (hotel: HotelWithRooms) => {
    startTransition(async () => {
      const result = await toggleActiveAction(hotel.id, !hotel.is_active);
      if (result?.error) {
        showToast(`Error: ${result.error}`);
      } else {
        setHotels((prev) =>
          prev.map((h) =>
            h.id === hotel.id ? { ...h, is_active: !h.is_active } : h
          )
        );
      }
    });
  };

  const handleSave = (savedHotel: HotelRow) => {
    if (mode === "add") {
      setHotels((prev) => [
        ...prev,
        { ...savedHotel, room_packages: [] } as HotelWithRooms,
      ]);
      showToast("Deal created!");
    } else {
      setHotels((prev) =>
        prev.map((h) =>
          h.id === savedHotel.id
            ? { ...savedHotel, room_packages: h.room_packages }
            : h
        )
      );
      showToast("Deal updated!");
    }
    setMode("list");
    setEditingHotel(null);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--clr-bg)", paddingTop: 0 }}>
      {/* Header */}
      <div
        style={{
          background: "var(--clr-surface)",
          borderBottom: "1px solid var(--clr-border)",
          padding: "0 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 60,
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span
            style={{
              fontFamily: "var(--font-serif)",
              color: "var(--clr-gold)",
              fontSize: "1.1rem",
            }}
          >
            LuxEscape
          </span>
          <span style={{ color: "var(--clr-border)" }}>·</span>
          <span
            style={{
              fontSize: "0.75rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--clr-text-muted)",
            }}
          >
            Admin
          </span>
        </div>
        <form action={logoutAction}>
          <button type="submit" style={btnSecondary}>
            Logout
          </button>
        </form>
      </div>

      {/* Toast */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            background: "var(--clr-surface)",
            border: "1px solid var(--clr-gold)",
            color: "var(--clr-cream)",
            padding: "12px 20px",
            borderRadius: "var(--radius-sm)",
            fontSize: "0.875rem",
            zIndex: 9999,
          }}
        >
          {toast}
        </div>
      )}

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>
        {/* List view */}
        {mode === "list" && (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 28,
              }}
            >
              <div>
                <h1
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "1.8rem",
                    color: "var(--clr-cream)",
                    fontWeight: 300,
                  }}
                >
                  Deals
                </h1>
                <p style={{ color: "var(--clr-text-muted)", fontSize: "0.85rem", marginTop: 2 }}>
                  {hotels.length} total · {hotels.filter((h) => h.is_active).length} active
                </p>
              </div>
              <button className="btn-primary" onClick={() => setMode("add")}>
                + Add New Deal
              </button>
            </div>

            <div
              style={{
                background: "var(--clr-surface)",
                border: "1px solid var(--clr-border)",
                borderRadius: "var(--radius-md)",
                overflow: "hidden",
              }}
            >
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--clr-border)" }}>
                    {["Slug", "Title", "Category", "Sale Price", "Active", "Actions"].map(
                      (h) => (
                        <th
                          key={h}
                          style={{
                            padding: "12px 16px",
                            textAlign: "left",
                            fontSize: "0.7rem",
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            color: "var(--clr-text-muted)",
                            fontWeight: 500,
                          }}
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {hotels.map((hotel, i) => (
                    <tr
                      key={hotel.id}
                      style={{
                        borderBottom:
                          i < hotels.length - 1
                            ? "1px solid var(--clr-border)"
                            : "none",
                        opacity: hotel.is_active ? 1 : 0.5,
                      }}
                    >
                      <td style={td}>
                        <span
                          style={{
                            background: "var(--clr-bg)",
                            border: "1px solid var(--clr-border)",
                            borderRadius: 4,
                            padding: "2px 8px",
                            fontSize: "0.8rem",
                            fontFamily: "monospace",
                            color: "var(--clr-gold)",
                          }}
                        >
                          {hotel.slug}
                        </span>
                      </td>
                      <td style={td}>
                        <p style={{ color: "var(--clr-cream)", fontSize: "0.9rem" }}>
                          {hotel.title}
                        </p>
                        <p style={{ color: "var(--clr-text-muted)", fontSize: "0.78rem" }}>
                          {hotel.hotel_name}
                        </p>
                      </td>
                      <td style={td}>
                        <span
                          style={{
                            background: catColor(hotel.category),
                            color: "var(--clr-cream)",
                            padding: "3px 10px",
                            borderRadius: 20,
                            fontSize: "0.75rem",
                            textTransform: "capitalize",
                          }}
                        >
                          {hotel.category}
                        </span>
                      </td>
                      <td style={td}>
                        <p style={{ color: "var(--clr-cream)", fontSize: "0.9rem" }}>
                          £{hotel.sale_price.toLocaleString()}
                        </p>
                        <p
                          style={{
                            color: "var(--clr-text-muted)",
                            fontSize: "0.78rem",
                            textDecoration: "line-through",
                          }}
                        >
                          £{hotel.original_price.toLocaleString()}
                        </p>
                      </td>
                      <td style={td}>
                        <button
                          onClick={() => handleToggle(hotel)}
                          disabled={actionPending}
                          style={{
                            background: hotel.is_active
                              ? "rgba(74, 222, 128, 0.15)"
                              : "rgba(248, 113, 113, 0.15)",
                            border: `1px solid ${hotel.is_active ? "rgba(74,222,128,0.4)" : "rgba(248,113,113,0.4)"}`,
                            color: hotel.is_active ? "#4ade80" : "#f87171",
                            borderRadius: 20,
                            padding: "3px 12px",
                            fontSize: "0.75rem",
                            cursor: "pointer",
                          }}
                        >
                          {hotel.is_active ? "Active" : "Hidden"}
                        </button>
                      </td>
                      <td style={td}>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button
                            onClick={() => {
                              setEditingHotel(hotel);
                              setMode("edit");
                            }}
                            style={btnSmall}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(hotel)}
                            disabled={actionPending}
                            style={{ ...btnSmall, color: "#f87171", borderColor: "rgba(248,113,113,0.3)" }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {hotels.length === 0 && (
                <p
                  style={{
                    textAlign: "center",
                    color: "var(--clr-text-muted)",
                    padding: "48px 0",
                    fontSize: "0.9rem",
                  }}
                >
                  No deals yet. Click &ldquo;Add New Deal&rdquo; to get started.
                </p>
              )}
            </div>
          </>
        )}

        {/* Add / Edit form */}
        {(mode === "add" || mode === "edit") && (
          <DealForm
            hotel={mode === "edit" ? editingHotel ?? undefined : undefined}
            onCancel={() => {
              setMode("list");
              setEditingHotel(null);
            }}
            onSave={handleSave}
          />
        )}
      </div>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const td: React.CSSProperties = { padding: "14px 16px", verticalAlign: "middle" };

const sectionLabel: React.CSSProperties = {
  gridColumn: "span 2",
  fontSize: "0.68rem",
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "var(--clr-gold)",
  marginTop: 8,
  marginBottom: -4,
  paddingBottom: 8,
  borderBottom: "1px solid var(--clr-border)",
};

const btnSecondary: React.CSSProperties = {
  padding: "8px 16px",
  background: "transparent",
  border: "1px solid var(--clr-border)",
  borderRadius: "var(--radius-sm)",
  color: "var(--clr-text-muted)",
  fontSize: "0.82rem",
  cursor: "pointer",
  fontFamily: "var(--font-sans)",
};

const btnSmall: React.CSSProperties = {
  padding: "5px 12px",
  background: "transparent",
  border: "1px solid var(--clr-border)",
  borderRadius: "var(--radius-sm)",
  color: "var(--clr-text-muted)",
  fontSize: "0.8rem",
  cursor: "pointer",
  fontFamily: "var(--font-sans)",
};

function catColor(cat: string) {
  const map: Record<string, string> = {
    beach: "rgba(56,189,248,0.25)",
    city: "rgba(167,139,250,0.25)",
    adventure: "rgba(74,222,128,0.2)",
    wellness: "rgba(251,191,36,0.2)",
  };
  return map[cat] ?? "var(--clr-surface2)";
}
