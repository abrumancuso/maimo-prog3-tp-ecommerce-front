import "./globals.css";
import { ShopProvider } from "@/context/ShopContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "VinylVerse",
  description: "E-commerce de vinilos • Next.js + Tailwind",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white">
        <ShopProvider>
          <Navbar />
          <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
          <Footer />
        </ShopProvider>
      </body>
    </html>
  );
}