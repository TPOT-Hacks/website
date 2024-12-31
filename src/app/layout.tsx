import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Nav } from "./components/nav";
import { Footer } from "./components/footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "TPOT Hacks",
  description: "Weekly programming challenges and solutions",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-black text-white">
      <body
        className={`${inter.variable} font-mono antialiased max-w-4xl mx-auto min-h-screen px-6 py-8`}
      >
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
