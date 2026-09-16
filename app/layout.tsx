import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatBar from "@/components/FloatBar";

export const metadata: Metadata = {
  title: "Agrofarms237 — La qualité commence à la ferme",
  description:
    "Agrofarms237, production agricole camerounaise à Yaoundé. Silure frais du bassin à votre table, livraison à Yaoundé, commande simple par WhatsApp.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500&family=Manrope:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="pb-16 md:pb-0 font-sans">
        <Header />
        <main className="pt-[68px]">{children}</main>
        <Footer />
        <FloatBar />
      </body>
    </html>
  );
}
