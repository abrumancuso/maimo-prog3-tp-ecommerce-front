"use client";
import { createContext, useContext, useMemo, useState } from "react";

const ShopContext = createContext(null);

function makeKey({ id, condition, packaging, protection, giftWrap }) {
  const c = condition || "new";
  const p = packaging || "vinyl_only";
  const prot = protection ? "1" : "0";
  const gift = giftWrap ? "1" : "0";
  return `${id}|${c}|${p}|${prot}|${gift}`;
}

export function ShopProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);

  function addToCart(item) {
    const options = {
      condition: item.condition || "new",
      packaging: item.packaging || "vinyl_only",
      protection: !!item.protection,
      giftWrap: !!item.giftWrap,
    };
    const key = item.__key || makeKey({ id: item.id, ...options });
    const qty = Math.max(1, Number(item.qty) || 1);

    setCart((prev) => {
      const existing = prev.find((x) => x.__key === key);
      if (existing) {
        return prev.map((x) => (x.__key === key ? { ...x, qty: x.qty + qty } : x));
      }
      return [
        ...prev,
        {
          __key: key,
          id: item.id,
          title: item.title,
          artist: item.artist || "",
          year: typeof item.year === "number" ? item.year : null,
          price: Number(item.price) || 0,
          cover: item.cover || "",
          qty,
          options,
        },
      ];
    });
  }

  function updateQty(keyOrId, qty) {
    const q = Math.max(1, Number(qty) || 1);
    setCart((prev) => {
      if (prev.some((x) => x.__key === keyOrId)) {
        return prev.map((x) => (x.__key === keyOrId ? { ...x, qty: q } : x));
      }
      return prev.map((x) => (x.id === keyOrId ? { ...x, qty: q } : x));
    });
  }

  function removeFromCart(keyOrId) {
    setCart((prev) => {
      if (prev.some((x) => x.__key === keyOrId)) {
        return prev.filter((x) => x.__key !== keyOrId);
      }
      return prev.filter((x) => x.id !== keyOrId);
    });
  }

  function clearCart() {
    setCart([]);
  }

  function toggleFav(id) {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  const totalItems = cart.reduce((a, b) => a + b.qty, 0);
  const totalPrice = cart.reduce((a, b) => a + b.qty * b.price, 0);

  function normalizeBase(url) {
    const fallback = "http://localhost:4000";
    const base = (url && url.trim()) || fallback;
    return base.replace(/\/+$/, "");
  }

  async function checkout(customer) {
    const API_BASE = normalizeBase(process.env.NEXT_PUBLIC_API_URL);
    const payload = {
      customer: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone || "",
        address: customer.address || "",
        city: customer.city || "",
        zip: customer.zip || "",
      },
      items: cart.map((it) => ({
        productId: it.id,
        qty: it.qty,
        options: {
          condition: it.options?.condition ?? "new",
          packaging: it.options?.packaging ?? "vinyl_only",
          protection: !!it.options?.protection,
          giftWrap: !!it.options?.giftWrap,
        },
      })),
    };

    const res = await fetch(`${API_BASE}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `Error ${res.status}`);
    }

    const data = await res.json();
    return {
      ok: true,
      orderId: data?.order?._id || "",
      order: data?.order,
    };
  }

  const value = useMemo(
    () => ({
      products,
      setProducts,
      product,
      setProduct,
      loading,
      setLoading,
      error,
      setError,
      cart,
      favorites,
      addToCart,
      updateQty,
      removeFromCart,
      clearCart,
      toggleFav,
      totalItems,
      totalPrice,
      checkout,
    }),
    [products, product, loading, error, cart, favorites, totalItems, totalPrice]
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export const useShop = () => useContext(ShopContext);
