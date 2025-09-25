"use client";
import axios from "axios";
import { createContext, useContext, useMemo, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL; // ej: http://localhost:4000
const ShopContext = createContext(null);

export function ShopProvider({ children }) {
  // ------- Estado remoto (catálogo) -------
  const [products, setProducts] = useState([]);   // listado (home / categoría)
  const [product, setProduct] = useState(null);   // detalle
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Normalizador por si después la API cambia nombres (_id vs id, name vs title, etc.)
  const normalize = (p) => ({
    id: p.id || p._id || "",
    title: p.title || p.name || "",
    artist: p.artist || "",
    genre: p.genre || "",
    year: p.year ?? null,
    price: typeof p.price === "number" ? p.price : (p.basePrice ?? 0),
    cover: p.cover || p.image || "",
    description: p.description || "",
    condition: p.condition || "new",
    packaging: p.packaging || "vinyl_only",
    protection: !!p.protection,
    giftWrap: !!p.giftWrap,
    categories: p.categories || []
  });

  // Obtener TODOS los productos
  const fetchProducts = async (params = {}) => {
    setLoading(true); setError("");
    try {
      if (!API) { setProducts([]); return; } // no rompe si no hay API aún
      const { data } = await axios.get(`${API}/products`, { params });
      const list = Array.isArray(data?.products) ? data.products
                 : Array.isArray(data?.data)     ? data.data
                 : Array.isArray(data)           ? data : [];
      setProducts(list.map(normalize));
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Error");
      setProducts([]);
    } finally { setLoading(false); }
  };

  // Obtener un producto por ID
  const fetchProduct = async (id) => {
    setLoading(true); setError("");
    try {
      if (!API) { setProduct(null); return; }
      const { data } = await axios.get(`${API}/products/${id}`);
      setProduct(normalize(data?.product || data));
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Error");
      setProduct(null);
    } finally { setLoading(false); }
  };

  // Obtener productos por categoría (slug)
  const fetchProductsByCategory = async (slug) => {
    setLoading(true); setError("");
    try {
      if (!API) { setProducts([]); return; }
      // Si tu backend usa otro parámetro (ej: ?genre=), cambiás "category" por el que corresponda
      const { data } = await axios.get(`${API}/products`, { params: { category: slug } });
      const list = Array.isArray(data?.products) ? data.products
                 : Array.isArray(data?.data)     ? data.data
                 : Array.isArray(data)           ? data : [];
      setProducts(list.map(normalize));
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Error");
      setProducts([]);
    } finally { setLoading(false); }
  };

  // ------- Carrito / Favoritos -------
  const [cart, setCart] = useState([]);        // [{__key,id,title,price,cover,options,qty}]
  const [favorites, setFavorites] = useState([]); // [id]

  // ⚠️ Extendí la firma para aceptar opciones y cantidad (compatibilidad: si llamás solo con product, funciona igual)
  const addToCart = (item, options = {}, qty = 1) => {
    setCart(prev => {
      const key = `${item.id}-${JSON.stringify(options)}`;
      const f = prev.find(p => p.__key === key);
      if (f) return prev.map(p => p.__key === key ? { ...p, qty: p.qty + qty } : p);
      return [...prev, {
        __key: key,
        id: item.id, title: item.title, price: item.price, cover: item.cover,
        options, qty
      }];
    });
  };

  const removeFromCart = (idOrKey) => setCart(prev => prev.filter(p => p.__key !== idOrKey && p.id !== idOrKey));
  const updateQty = (idOrKey, qty) => setCart(prev => prev.map(p => (p.__key === idOrKey || p.id === idOrKey) ? { ...p, qty } : p));
  const clearCart = () => setCart([]);

  const toggleFav = (id) => setFavorites(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const totalItems = cart.reduce((a, b) => a + b.qty, 0);
  const totalPrice = cart.reduce((a, b) => a + b.qty * (b.price ?? 0), 0);

  // Checkout (solo front por ahora: simula éxito)
  const checkout = async (customer = {}) => {
    // Cuando tengas backend: POST `${API}/orders` con {items, totals, customer}
    // Por ahora, simulamos y limpiamos el carrito.
    const order = { ok: true, orderId: `TEST-${Date.now()}`, items: cart, totals: { items: totalItems, amount: totalPrice }, customer };
    clearCart();
    return order;
  };

  const value = useMemo(() => ({
    // remoto
    products, product, loading, error,
    fetchProducts, fetchProduct, fetchProductsByCategory,
    // carrito / favoritos
    cart, favorites, addToCart, updateQty, removeFromCart, clearCart, toggleFav,
    totalItems, totalPrice,
    // checkout
    checkout
  }), [products, product, loading, error, cart, favorites, totalItems, totalPrice]);

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export const useShop = () => useContext(ShopContext);
