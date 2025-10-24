"use client";
import { useEffect } from "react";
import axios from "axios";
import { useShop } from "@/context/ShopContext";
import HomeContainer from "@/components/HomeContainer";

export default function Page() {
  const { products, setProducts, loading, setLoading, error, setError } = useShop();

  const normalize = (p) => ({
    id: p.id || p._id || "",
    title: p.title || p.name || "",
    artist: p.artist || "",
    genre: p.genre || (Array.isArray(p.categories) && p.categories[0]?.name) || "",
    year: typeof p.year === "number" ? p.year : null,
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
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}products`);
        const raw = Array.isArray(data?.products) ? data.products : [];
        setProducts(raw.map(normalize));
      } catch (e) {
        setError(e.message || "Error al cargar productos");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [setLoading, setError, setProducts]);

  if (loading) return <div className="py-12">Cargando catálogo…</div>;
  if (error)   return <div className="py-12 text-red-400">Error: {error}</div>;

  return <HomeContainer products={products} />;
}