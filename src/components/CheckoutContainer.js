"use client";
import { useState } from "react";
import Link from "next/link";
import { useShop } from "@/context/ShopContext";
import FormCheckout from "./FormCheckout";

const LABELS = {
  new: "Nuevo",
  used: "Usado",
  vinyl_only: "Vinilo solo",
  box_only: "Solo caja",
  vinyl_with_box: "Vinilo + Caja",
  protection: "Protección",
  giftWrap: "Envoltura para regalo",
};

function translate(key) {
  return LABELS[key] || key;
}
function fmt(n) {
  return Number(n || 0).toLocaleString("es-AR");
}

export default function CheckoutContainer() {
  const {
    cart,
    totalItems,
    totalPrice,
    updateQty,
    removeFromCart,
    clearCart,
    checkout,
  } = useShop();

  const [placed, setPlaced] = useState(null);

  const handleSubmit = async (values) => {
    const resp = await checkout(values);
    setPlaced(resp.order);
    clearCart();
  };

  if (placed) {
    const { customer, totals, items, _id } = placed;
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">¡Compra realizada!</h1>

        <p className="text-white/70">
          Gracias{customer?.name ? `, ${customer.name}` : ""}. Te enviamos un
          correo a {customer?.email || "tu email"}.
        </p>

        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-white/60">Nº de orden</div>
              <div className="font-semibold break-all">{_id}</div>
            </div>
            <div>
              <div className="text-sm text-white/60">Ítems</div>
              <div className="font-semibold">{totals?.items ?? 0}</div>
            </div>
            <div className="text-right sm:text-left">
              <div className="text-sm text-white/60">Total</div>
              <div className="font-extrabold text-xl">
                ${fmt(totals?.amount)}{" "}
                <span className="text-sm font-normal text-white/60">
                  {totals?.currency || "ARS"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 overflow-hidden">
          <div className="px-4 py-3 bg-white/5 font-semibold">Resumen</div>
          <div className="divide-y divide-white/10">
            {items?.map((it, i) => (
              <div key={i} className="px-4 py-3 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="font-medium truncate">{it.name}</div>
                  <div className="text-xs text-white/60">
                    {translate(it?.options?.condition)} •{" "}
                    {translate(it?.options?.packaging)}
                    {it?.options?.protection ? ` • ${translate("protection")}` : ""}
                    {it?.options?.giftWrap ? ` • ${translate("giftWrap")}` : ""}
                    {" • "}
                    x{it.qty} @ ${fmt(it.unitPrice)}
                  </div>
                </div>
                <div className="font-semibold whitespace-nowrap">
                  ${fmt(it.lineTotal)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <Link
            href="/"
            className="rounded-xl px-5 py-3 border border-white/20 hover:bg-white/10"
          >
            Volver al inicio
          </Link>
          <Link
            href="/"
            className="rounded-xl px-5 py-3 bg-white text-black font-medium hover:opacity-90"
          >
            Seguir comprando
          </Link>
        </div>
      </div>
    );
  }

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
          const album = (item.title || "").trim();

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

                  <div className="text-xs text-white/60 mt-0.5">
                    {translate(item.options?.condition)} •{" "}
                    {translate(item.options?.packaging)}
                    {item.options?.protection ? ` • ${translate("protection")}` : ""}
                    {item.options?.giftWrap ? ` • ${translate("giftWrap")}` : ""}
                  </div>

                  <div className="text-sm mt-1">
                    ${fmt(item.price)}
                  </div>
                </div>
              </div>

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
        <div className="text-2xl font-bold">${fmt(totalPrice)}</div>
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
    </div>
  );
}
