"use client";
import Link from "next/link";
import { useShop } from "@/context/ShopContext";
import { formatARS } from "@/utils/format";

export default function ProductCard({ product }) {
  const { favorites, toggleFav } = useShop();
  const isFav = favorites.includes(product.id);
  const priceToShow = typeof product.price === "number" ? product.price : 0;

  return (
    <article className="group relative h-full flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition">
      <Link href={`/product/${product.id}`} className="block aspect-square overflow-hidden">
        <img
          src={product.cover || "/covers/placeholder.jpg"}
          alt={product.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </Link>

      <div className="p-4 flex-1 flex flex-col">
        <span className="text-xs tracking-wide text-white/60">{product.artist}</span>
        <h3 className="font-semibold leading-tight line-clamp-2">{product.title}</h3>
        {typeof product.year === "number" ? (
          <span className="mt-1 text-xs text-white/60">{product.year}</span>
        ) : null}
        <p className="mt-auto pt-1 text-lg font-bold">
          ${formatARS(priceToShow)}
        </p>
      </div>

      <div className="p-4 pt-0 mt-auto flex items-center justify-between gap-2">
        <Link
          href={`/product/${product.id}`}
          className="rounded-xl px-4 py-2 bg-white text-black font-medium hover:opacity-90"
        >
          Ver Más
        </Link>
        <button
          onClick={() => toggleFav(product.id)}
          className={`rounded-xl px-3 py-2 border border-white/15 hover:bg-white/10 ${
            isFav ? "text-fuchsia-400" : "text-white/80"
          }`}
        >
          {isFav ? "★ Favorito" : "☆ Favorito"}
        </button>
      </div>
    </article>
  );
}
