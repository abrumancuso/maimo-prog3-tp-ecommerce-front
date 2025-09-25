"use client";
import { useState } from "react";
import { useShop } from "@/context/ShopContext";

export default function CheckoutPage() {
  const { cart, totalItems, totalPrice, updateQty, removeFromCart, clearCart, checkout } = useShop();
  const [msg, setMsg] = useState("");

  const onBuy = async () => {
    try {
      const order = await checkout({ name: "Cliente Demo", email: "demo@example.com" });
      setMsg(`Compra realizada. Pedido: ${order.orderId}`);
    } catch (e) {
      setMsg(`Error: ${e.message}`);
    }
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
        {cart.map(item => (
          <div key={item.__key} className="flex items-center justify-between gap-4 border border-white/10 rounded-xl p-3 bg-white/5">
            <div className="flex items-center gap-3">
              {item.cover ? <img src={item.cover} alt={item.title} className="w-16 h-16 object-cover rounded-lg" /> : null}
              <div>
                <div className="font-semibold">{item.title}</div>
                <div className="text-xs text-white/60">
                  {item.options?.condition} • {item.options?.packaging}
                  {item.options?.protection ? " • protección" : ""}{item.options?.giftWrap ? " • regalo" : ""}
                </div>
                <div className="text-sm">${item.price?.toFixed(2)}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                value={item.qty}
                onChange={(e) => updateQty(item.__key, Math.max(1, Number(e.target.value) || 1))}
                className="w-20 rounded-xl bg-white/5 border border-white/20 px-3 py-2"
              />
              <button onClick={() => removeFromCart(item.__key)} className="px-3 py-2 border border-white/20 rounded-xl hover:bg-white/10">
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="text-white/80">Total ítems: {totalItems}</div>
        <div className="text-2xl font-bold">${totalPrice.toFixed(2)}</div>
      </div>

      <div className="flex gap-3">
        <button onClick={onBuy} className="rounded-xl px-5 py-3 bg-white text-black font-medium hover:opacity-90">
          Comprar
        </button>
        <button onClick={clearCart} className="rounded-xl px-5 py-3 border border-white/20 hover:bg-white/10">
          Vaciar carrito
        </button>
      </div>

      {msg && <p className="text-sm text-white/80">{msg}</p>}
    </div>
  );
}
