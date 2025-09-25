"use client";
import { useState } from "react";
import { useShop } from "@/context/ShopContext";

export default function ProductDetail({ product }) {
  const { addToCart, favorites, toggleFav } = useShop();
  const isFav = favorites.includes(product.id);

  const [options, setOptions] = useState({
    condition: product.condition || "new",
    packaging: product.packaging || "vinyl_only",
    protection: !!product.protection,
    giftWrap: !!product.giftWrap
  });
  const [qty, setQty] = useState(1);

  const onAdd = () => addToCart(product, options, qty);

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

        {/* Customización */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
          <label className="flex flex-col gap-1">
            <span className="text-sm text-white/70">Estado</span>
            <select
              className="rounded-xl bg-white/5 border border-white/20 px-3 py-2"
              value={options.condition}
              onChange={(e) => setOptions(o => ({ ...o, condition: e.target.value }))}
            >
              <option value="new">Nuevo</option>
              <option value="used">Usado</option>
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm text-white/70">Packaging</span>
            <select
              className="rounded-xl bg-white/5 border border-white/20 px-3 py-2"
              value={options.packaging}
              onChange={(e) => setOptions(o => ({ ...o, packaging: e.target.value }))}
            >
              <option value="vinyl_only">Vinilo solo</option>
              <option value="vinyl_with_box">Vinilo con caja</option>
              <option value="box_only">Solo caja</option>
            </select>
          </label>

          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              className="size-4"
              checked={options.protection}
              onChange={(e) => setOptions(o => ({ ...o, protection: e.target.checked }))}
            />
            <span className="text-sm">Con protección</span>
          </label>

          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              className="size-4"
              checked={options.giftWrap}
              onChange={(e) => setOptions(o => ({ ...o, giftWrap: e.target.checked }))}
            />
            <span className="text-sm">Envuelto para regalo</span>
          </label>

          <label className="flex items-center gap-3">
            <span className="text-sm text-white/70">Cantidad</span>
            <input
              type="number"
              min={1}
              value={qty}
              onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
              className="w-20 rounded-xl bg-white/5 border border-white/20 px-3 py-2"
            />
          </label>
        </div>

        <div className="flex gap-3 pt-4">
          <button onClick={onAdd} className="rounded-xl px-5 py-3 bg-white text-black font-medium hover:opacity-90">
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
