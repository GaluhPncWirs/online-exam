"use client";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";
import { Open_Sans, Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const fontStyle = Open_Sans({
  subsets: ["latin"],
  weight: ["400"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("scroll-smooth", "font-sans", inter.variable)}>
      <body className={fontStyle.className}>
        <SessionProvider>
          <Toaster richColors />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
