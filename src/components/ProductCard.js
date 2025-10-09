"use client";
import Link from "next/link";
import { useShop } from "@/context/ShopContext";

export default function ProductCard({ product }) {
  const { addToCart, favorites, toggleFav } = useShop();
  const isFav = favorites.includes(product.id);
  const priceToShow = typeof product.price === "number" ? product.price : 0;

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition">
      <Link href={`/product/${product.id}`} className="block aspect-square overflow-hidden">
        <img src={product.cover || "/covers/placeholder.jpg"} alt={product.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      </Link>

      <div className="p-4 space-y-1">
        <span className="text-xs uppercase tracking-wide text-white/60">
          {product.genre} {product.year ? `• ${product.year}` : ""}
        </span>
        <h3 className="font-semibold leading-tight">
          {product.title}
        </h3>
        <p className="pt-1 text-lg font-bold">
          ${priceToShow.toLocaleString("es-AR")}
        </p>
      </div>

      <div className="p-4 pt-0 flex items-center justify-between gap-2">
        <button
          onClick={() => addToCart(product)}
          className="rounded-xl px-4 py-2 bg-white text-black font-medium hover:opacity-90"
        >
          Agregar
        </button>
        <button
          onClick={() => toggleFav(product.id)}
          className={`rounded-xl px-3 py-2 border border-white/15 hover:bg-white/10 ${isFav ? "text-fuchsia-400" : "text-white/80"}`}
        >
          {isFav ? "★ Favorito" : "☆ Favorito"}
        </button>
      </div>
    </article>
  );
}