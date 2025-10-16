"use client";
import { useEffect } from "react";
import { useShop } from "@/context/ShopContext";
import HomeContainer from "@/components/HomeContainer";

export default function Page() {
  const { products, setProducts, loading, setLoading, error, setError } = useShop();

  const normalize = (p) => ({
    id: p.id || p._id || "",
    // el front espera title; la API trae name
    title: p.title || p.name || "",
    // no tenemos artist en la API: dejamos string vacío
    artist: p.artist || "",
    genre: p.genre || "",
    year: p.year ?? null,
    // prioridad al finalPrice del backend
    price: typeof p.finalPrice === "number" ? p.finalPrice
         : typeof p.price === "number" ? p.price : 0,
    cover: p.cover || "",
    description: p.description || "",
  });

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("http://localhost:4000/products", { cache: "no-store" });
        if (!res.ok) throw new Error("Error al cargar productos");
        const data = await res.json();
        const raw = Array.isArray(data?.products) ? data.products : [];
        setProducts(raw.map(normalize));
      } catch (e) {
        setError(e.message || "Error al cargar productos");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) return <div className="py-12">Cargando catálogo…</div>;
  if (error)   return <div className="py-12 text-red-400">Error: {error}</div>;

  return <HomeContainer products={products} />;
}