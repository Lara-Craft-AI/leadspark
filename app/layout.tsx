import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LeadSpark — AI Speed-to-Lead for Insurance Agents",
  description: "LeadSpark helps insurance agents respond and qualify new leads in 60 seconds."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="light">
      <body className={`${inter.className} bg-background text-foreground antialiased`}>{children}</body>
    </html>
  );
}
