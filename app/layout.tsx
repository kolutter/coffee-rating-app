import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "☕ Kaffee-Rating",
  description: "PuBa's Kaffee-Bewertungs-Tagebuch",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className="bg-coffee-50 text-coffee-900 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}