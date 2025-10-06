import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/shared/ui/Navbar";
import { StoreConfigProvider } from "@/shared/providers/StoreConfigProvider";
import { AuthProvider } from "@/shared/providers/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mi Tienda - E-commerce",
  description: "Tienda en línea con los mejores productos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StoreConfigProvider>
          <AuthProvider>
            <Navbar />
            {children}
          </AuthProvider>
        </StoreConfigProvider>
      </body>
    </html>
  );
}
