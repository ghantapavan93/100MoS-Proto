import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { CartProvider } from "@/components/commerce/CartContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "100 Miles of Summer | Mirror+ Live Demo",
  description: "All paces and faces. A summer promise you can actually keep. No lost miles. No lost progress.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white selection:bg-orange-500/30 selection:text-orange-500`}
      >
        <CartProvider>
          <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-[100] bg-orange-500 text-black px-4 py-2 rounded-lg font-black uppercase text-xs">
            Skip to content
          </a>
          <Navigation />
          <main id="main-content" className="min-h-screen">
            {children}
          </main>
        </CartProvider>
      </body>
    </html>
  );
}
