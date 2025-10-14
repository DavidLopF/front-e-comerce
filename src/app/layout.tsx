import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConditionalNavbar from "@/shared/ui/ConditionalNavbar";
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
      <head>
        <script src="https://cdn.jsdelivr.net/npm/flowbite@2.5.2/dist/flowbite.min.js" defer></script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StoreConfigProvider>
          <AuthProvider>
            <ConditionalNavbar />
            {children}
          </AuthProvider>
        </StoreConfigProvider>
      </body>
    </html>
  );
}
