"use client";
import { useEffect } from "react";
import axios from "axios";
import { useShop } from "@/context/ShopContext";
import HomeContainer from "@/components/HomeContainer";

export default function Page() {
  const { products, setProducts, loading, setLoading, error, setError } = useShop();

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}products`);
        const list = Array.isArray(data?.products) ? data.products : [];
        const mapped = list.map((p) => ({
          id: p._id || p.id || "",
          title: p.name || p.title || "",
          artist: p.artist || "",
          genre: (Array.isArray(p.categories) && p.categories[0]?.name) || p.genre || "",
          year: typeof p.year === "number" ? p.year : null,
          price: typeof p.finalPrice === "number" ? p.finalPrice : Number(p.price || 0),
          cover: p.cover || "",
          description: p.description || "",
        }));
        setProducts(mapped);
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
