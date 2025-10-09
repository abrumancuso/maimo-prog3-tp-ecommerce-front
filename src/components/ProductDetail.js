"use client";
import { useState, useMemo } from "react";
import { useShop } from "@/context/ShopContext";

function calcularPrecio({ price, condition, packaging, protection, giftWrap }) {
  let final = Number(price) || 0;
  if (condition === "used") final *= 0.8;
  if (packaging === "vinyl_with_box") final += 6000;
  else if (packaging === "box_only") final *= 0.25;
  if (protection) final += 1200;
  if (giftWrap) final += 1000;
  return Math.round(final / 100) * 100;
}

export default function ProductDetail({ product }) {
  const { addToCart, favorites, toggleFav } = useShop();
  const isFav = favorites.includes(product.id);

  const [condition, setCondition]   = useState(product.condition ?? "new");
  const [packaging, setPackaging]   = useState(product.packaging ?? "vinyl_only");
  const [protection, setProtection] = useState(!!product.protection);
  const [giftWrap, setGiftWrap]     = useState(!!product.giftWrap);
  const [qty, setQty]               = useState(1);

  const finalPrice = useMemo(
    () => calcularPrecio({
      price: product.basePrice ?? product.price ?? 0,
      condition, packaging, protection, giftWrap
    }),
    [product.basePrice, product.price, condition, packaging, protection, giftWrap]
  );

  const onAdd = () => {
    addToCart({
      id: product.id,
      title: product.title,
      price: finalPrice,          // al carrito va el precio final
      cover: product.cover,
      qty,
      // por si luego querés ver opciones en el carrito:
      condition, packaging, protection, giftWrap,
      basePrice: product.basePrice ?? product.price
    });
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/5">
        <img
          src={product.cover || "/covers/placeholder.jpg"}
          alt={product.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="space-y-5">
        <h1 className="text-3xl font-extrabold">{product.title || "—"}</h1>
        <p className="text-white/70">
          {product.genre || "—"} {product.year ? `• ${product.year}` : ""}
        </p>

        {product.description ? (
          <p className="text-white/80">{product.description}</p>
        ) : null}

        <div className="text-4xl font-extrabold mt-2">
          ${finalPrice.toLocaleString("es-AR")}
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm text-white/70">Estado</label>
            <select
              className="w-full rounded-xl bg-white/5 border border-white/15 px-3 py-2"
              value={condition}
              onChange={e => setCondition(e.target.value)}
            >
              <option value="new">Nuevo</option>
              <option value="used">Usado</option>
            </select>

            <label className="mt-4 block text-sm text-white/70">Packaging</label>
            <select
              className="w-full rounded-xl bg-white/5 border border-white/15 px-3 py-2"
              value={packaging}
              onChange={e => setPackaging(e.target.value)}
            >
              <option value="vinyl_only">Vinilo solo</option>
              <option value="vinyl_with_box">Vinilo + caja</option>
              <option value="box_only">Solo caja</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-white/70">Extras</label>
            <div className="flex items-center gap-3">
              <input
                id="prot"
                type="checkbox"
                checked={protection}
                onChange={e => setProtection(e.target.checked)}
              />
              <label htmlFor="prot" className="text-white/80">Con protección</label>
            </div>
            <div className="flex items-center gap-3">
              <input
                id="gift"
                type="checkbox"
                checked={giftWrap}
                onChange={e => setGiftWrap(e.target.checked)}
              />
              <label htmlFor="gift" className="text-white/80">Envuelto para regalo</label>
            </div>

            <label className="mt-4 block text-sm text-white/70">Cantidad</label>
            <input
              type="number"
              min={1}
              value={qty}
              onChange={e => setQty(Math.max(1, Number(e.target.value) || 1))}
              className="w-24 rounded-xl bg-white/5 border border-white/15 px-3 py-2"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={onAdd}
            className="rounded-xl px-5 py-3 bg-white text-black font-medium hover:opacity-90"
          >
            Agregar al carrito
          </button>
          <button
            onClick={() => toggleFav(product.id)}
            className={`rounded-xl px-5 py-3 border border-white/20 hover:bg-white/10 ${isFav ? "text-fuchsia-400" : ""}`}
          >
            {isFav ? "Quitar de Favoritos" : "Agregar a Favoritos"}
          </button>
        </div>
      </div>
    </div>
  );
}