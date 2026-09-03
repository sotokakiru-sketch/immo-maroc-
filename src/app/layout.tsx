import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { ToastProvider } from "@/components/Toast";
import { getSession } from "@/lib/session";
import type { SessionUser } from "@/lib/auth";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://immomaroc.ma"),
  title: {
    default: "Immo Maroc — Votre partenaire immobilier de confiance à Tanger",
    template: "%s · Immo Maroc",
  },
  description:
    "Agence immobilière à Tanger : achat, vente et location d'appartements en Médina, riads et villas. Note Google 5.0 ★. 17/19 Rue Jnan Kaptan, Tanger.",
  keywords: [
    "immobilier Tanger",
    "agence immobilière Tanger",
    "appartement Médina Tanger",
    "riad Tanger",
    "villa Tanger",
    "Immo Maroc",
  ],
  openGraph: {
    title: "Immo Maroc — Immobilier de confiance à Tanger",
    description:
      "Achat, vente et location de biens d'exception à Tanger et dans la Médina. Note Google 5.0 ★.",
    type: "website",
    locale: "fr_MA",
  },
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session: SessionUser | null = await getSession();
  return (
    <html lang="fr" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">
        <ToastProvider>
          <Header session={session} />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <FloatingWhatsApp />
        </ToastProvider>
      </body>
    </html>
  );
}
