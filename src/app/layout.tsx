import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "LuxEscape – Luxury Travel Escapes",
  description:
    "Discover handpicked luxury travel deals at unbeatable prices. LuxEscape is a training and education website inspired by luxury travel platforms.",
  keywords: "luxury travel, escapes, deals, hotel deals, training, education",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
