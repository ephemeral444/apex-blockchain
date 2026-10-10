import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { ProveedorSesion } from "@/features/auth/viewmodel/session-context";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Data Concierge — Historias clínicas protegidas",
  description:
    "Prototipo funcional: gestión de expedientes clínicos con sello de integridad y respaldo externo.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-svh flex-col">
        <ProveedorSesion>{children}</ProveedorSesion>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
