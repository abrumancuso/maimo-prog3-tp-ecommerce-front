"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useShop } from "@/context/ShopContext";

export default function Navbar() {
  const pathname = usePathname();
  const { totalItems, totalPrice } = useShop();

  const LinkItem = ({ href, label }) => (
    <Link
      href={href}
      className={`px-3 py-2 rounded-lg hover:bg-white/10 ${
        pathname === href ? "bg-white/10" : "text-white/80"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-40 backdrop-blur border-b border-white/10 bg-black/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="font-extrabold text-lg">
          VinylVerse
        </Link>

        <nav className="flex gap-1">
          <LinkItem href="/" label="Inicio" />
          <LinkItem href="/favorites" label="Favoritos" />
        </nav>

        <div className="text-sm">
          {totalItems > 0 ? (
            <span className="font-semibold">
              ${totalPrice.toFixed(2)} • {totalItems} ítems
            </span>
          ) : (
            <span className="text-white/70">Carrito vacío</span>
          )}
        </div>
      </div>
    </header>
  );
}