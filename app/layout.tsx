import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Metal Crafts - Professional Craftsmanship Manufacturer",
  description: "High-quality metal craft products with over 500+ unique designs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
