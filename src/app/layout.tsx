import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/nav/nav";
import { Footer } from "@/components/footer/footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "TPOT Hacks",
  description: "Weekly programming challenges and solutions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="../public/favicon.ico" sizes="any" />
      </head>
      <body className={`${inter.variable} font-mono antialiased max-w-4xl mx-auto min-h-screen px-6 py-8 bg-black text-white`}>
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
