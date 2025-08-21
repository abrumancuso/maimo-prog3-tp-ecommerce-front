"use client";
import { useShop } from "@/context/ShopContext";

export default function ProductDetail({ product }) {
  const { addToCart, favorites, toggleFav } = useShop();
  const isFav = favorites.includes(product.id);

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/5">
        <img src={product.cover} alt={product.title} className="w-full h-full object-cover" />
      </div>
      <div className="space-y-4">
        <h1 className="text-3xl font-extrabold">{product.artist} — {product.title}</h1>
        <p className="text-white/70">{product.genre} • {product.year}</p>
        <p className="text-lg">{product.description}</p>
        <div className="text-3xl font-bold mt-2">${product.price?.toFixed(2)}</div>
        <div className="flex gap-3 pt-2">
          <button onClick={() => addToCart(product)} className="rounded-xl px-5 py-3 bg-white text-black font-medium hover:opacity-90">
            Agregar al carrito
          </button>
          <button onClick={() => toggleFav(product.id)} className={`rounded-xl px-5 py-3 border border-white/20 hover:bg-white/10 ${isFav ? "text-fuchsia-400" : ""}`}>
            {isFav ? "Quitar de Favoritos" : "Agregar a Favoritos"}
          </button>
        </div>
      </div>
    </div>
  );
}
