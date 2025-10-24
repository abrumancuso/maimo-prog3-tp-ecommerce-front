"use client";
import { useState } from "react";
import { useShop } from "@/context/ShopContext";
import FormCheckout from "./FormCheckout";

const LABELS = {
  new: "Nuevo",
  used: "Usado",

  vinyl_only: "Vinilo solo",
  box_only: "Solo caja",
  vinyl_with_box: "Vinilo + Caja",

  protection: "Protección",
  giftWrap: "Envoltura para regalo"
};

function translate(key) {
  return LABELS[key] || key;
}

export default function CheckoutContainer() {
  const {
    cart, totalItems, totalPrice,
    updateQty, removeFromCart, clearCart, checkout
  } = useShop();
  const [msg, setMsg] = useState("");

  const handleSubmit = async (values) => {
    const order = await checkout(values);
    setMsg(`Compra realizada. Pedido: ${order.orderId}`);
    clearCart();
  };

  if (!cart.length) {
    return (
      <div className="py-12">
        <h1 className="text-2xl font-bold">Checkout</h1>
        <p className="text-white/60 mt-2">Tu carrito está vacío.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Checkout</h1>

      <div className="space-y-4">
        {cart.map((item, i) => {
          const key = item.__key || `${item.id}#${i}`;
          const removeId = item.__key || item.id;

          const artist = (item.artist || "").trim();
          const album  = (item.title  || "").trim();

          return (
            <div
              key={key}
              className="flex items-center justify-between gap-4 border border-white/10 rounded-xl p-3 bg-white/5"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                {item.cover ? (
                  <img
                    src={item.cover}
                    alt={album || "Cover"}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                ) : null}

                <div className="min-w-0 flex-1">
                  {/* 🟡 Título + Artista con viñeta */}
                  <div className="flex flex-wrap items-baseline gap-1">
                    <span className="font-semibold truncate">{album}</span>
                    {artist && (
                      <>
                        <span className="text-white/40">•</span>
                        <span className="text-sm text-white/60 font-normal truncate">
                          {artist}
                        </span>
                      </>
                    )}
                  </div>

                  {/* 🧾 Meta */}
                  <div className="text-xs text-white/60 mt-0.5">
                    {translate(item.options?.condition)} • {translate(item.options?.packaging)}
                    {item.options?.protection ? ` • ${translate("protection")}` : ""}
                    {item.options?.giftWrap ? ` • ${translate("giftWrap")}` : ""}
                  </div>

                  {/* 💲 Precio */}
                  <div className="text-sm mt-1">
                    ${item.price?.toLocaleString("es-AR")}
                  </div>
                </div>
              </div>

              {/* 🧮 Controles */}
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  value={item.qty}
                  onChange={(e) =>
                    updateQty(removeId, Math.max(1, Number(e.target.value) || 1))
                  }
                  className="w-20 rounded-xl bg-white/5 border border-white/20 px-3 py-2"
                />
                <button
                  onClick={() => removeFromCart(removeId)}
                  className="px-3 py-2 border border-white/20 rounded-xl hover:bg-white/10"
                >
                  Eliminar
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between">
        <div className="text-white/80">Total ítems: {totalItems}</div>
        <div className="text-2xl font-bold">
          ${totalPrice.toLocaleString("es-AR")}
        </div>
      </div>

      <FormCheckout onSubmit={handleSubmit} />

      <div className="flex gap-3">
        <button
          onClick={clearCart}
          className="rounded-xl px-5 py-3 border border-white/20 hover:bg-white/10"
        >
          Vaciar carrito
        </button>
      </div>

      {msg && <p className="text-sm text-white/80">{msg}</p>}
    </div>
  );
}