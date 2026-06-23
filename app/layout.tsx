import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import portfolio from "@/data/portfolio.json";

const inter = Inter({ subsets: ["latin", "vietnamese"] });

export const metadata: Metadata = {
  title: `${portfolio.person.name} | Growth Marketing Portfolio`,
  description: portfolio.person.tagline,
  keywords: [
    "Growth Marketing",
    "Product Marketing",
    "Marketing Analytics",
    "Community Building",
    portfolio.person.name
  ],
  openGraph: {
    title: `${portfolio.person.name} | ${portfolio.person.title}`,
    description: portfolio.person.tagline,
    type: "website"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
