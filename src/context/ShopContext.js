"use client";
import { createContext, useContext, useMemo, useState } from "react";

const ShopContext = createContext(null);

export function ShopProvider({ children }) {
  const [cart, setCart] = useState([]);        // [{id,title,price,cover,cantidad}]
  const [favorites, setFavorites] = useState([]); // [id]

  const addToCart = (item) => {
    setCart(prev => {
      const f = prev.find(p => p.id === item.id);
      if (f) return prev.map(p => p.id === item.id ? { ...p, qty: p.qty + 1 } : p);
      return [...prev, { id: item.id, title: item.title, price: item.price, cover: item.cover, qty: 1 }];
    });
  };
  const removeFromCart = (id) => setCart(prev => prev.filter(p => p.id !== id));
  const toggleFav = (id) => setFavorites(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const totalItems = cart.reduce((a, b) => a + b.qty, 0);
  const totalPrice = cart.reduce((a, b) => a + b.qty * b.price, 0);

  const value = useMemo(() => ({
    cart, favorites, addToCart, removeFromCart, toggleFav, totalItems, totalPrice
  }), [cart, favorites, totalItems, totalPrice]);

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}
export const useShop = () => useContext(ShopContext);