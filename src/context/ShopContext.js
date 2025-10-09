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
  // ---- Catálogo / detalle (necesarios para tus pages) ----
  const [products, setProducts] = useState([]);     // listado home / categoría
  const [product, setProduct]   = useState(null);   // detalle
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  // ---- Carrito / favoritos ----
  const [cart, setCart] = useState([]);             // [{ __key, id, title, price, cover, qty, options }]
  const [favorites, setFavorites] = useState([]);   // [id]

  function addToCart(item) {
    const options = {
      condition: item.condition || "new",
      packaging: item.packaging || "vinyl_only",
      protection: !!item.protection,
      giftWrap: !!item.giftWrap,
    };
    const key = item.__key || makeKey({ id: item.id, ...options });
    const qty = Math.max(1, Number(item.qty) || 1);

    setCart(prev => {
      const existing = prev.find(x => x.__key === key);
      if (existing) {
        return prev.map(x => x.__key === key ? { ...x, qty: x.qty + qty } : x);
      }
      return [
        ...prev,
        {
          __key: key,
          id: item.id,
          title: item.title,
          price: Number(item.price) || 0,
          cover: item.cover || "",
          qty,
          options
        }
      ];
    });
  }

  function updateQty(keyOrId, qty) {
    const q = Math.max(1, Number(qty) || 1);
    setCart(prev => {
      if (prev.some(x => x.__key === keyOrId)) {
        return prev.map(x => x.__key === keyOrId ? { ...x, qty: q } : x);
      }
      return prev.map(x => x.id === keyOrId ? { ...x, qty: q } : x);
    });
  }

  function removeFromCart(keyOrId) {
    setCart(prev => {
      if (prev.some(x => x.__key === keyOrId)) {
        return prev.filter(x => x.__key !== keyOrId);
      }
      return prev.filter(x => x.id !== keyOrId);
    });
  }

  function clearCart() {
    setCart([]);
  }

  function toggleFav(id) {
    setFavorites(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  const totalItems = cart.reduce((a, b) => a + b.qty, 0);
  const totalPrice = cart.reduce((a, b) => a + b.qty * b.price, 0);

  async function checkout(customer) {
    // Simulación simple. Cuando tengas API real, reemplazá esto.
    return new Promise((resolve) =>
      setTimeout(() => resolve({
        ok: true,
        orderId: "ORD-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
        customer,
        items: cart
      }), 500)
    );
  }

  const value = useMemo(() => ({
    // catálogo / detalle
    products, setProducts,
    product, setProduct,
    loading, setLoading,
    error, setError,
    // carrito / favs
    cart, favorites,
    addToCart, updateQty, removeFromCart, clearCart, toggleFav,
    totalItems, totalPrice,
    // checkout
    checkout,
  }), [products, product, loading, error, cart, favorites, totalItems, totalPrice]);

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export const useShop = () => useContext(ShopContext);