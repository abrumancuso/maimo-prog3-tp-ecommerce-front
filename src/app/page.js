"use client";
import { useEffect } from "react";
import { useShop } from "@/context/ShopContext";
import HomeContainer from "@/components/HomeContainer";

export default function Page() {
  const { products, setProducts, loading, setLoading, error, setError } = useShop();

  const normalize = (p) => ({
    id: p.id || p._id || "",
    title: p.title || p.name || "",
    artist: p.artist || "",
    genre: p.genre || "",
    year: p.year ?? null,
    price: typeof p.price === "number" ? p.price : 0,
    cover: p.cover || "",
    description: p.description || "",
  });

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError("");
      try {
        const url = "http://localhost:4000/products"; 
        const res = await fetch(url, { cache: "no-store" });

        if (!res.ok) {
          const text = await res.text();
          console.error("API ERROR", res.status, res.statusText, text);
          throw new Error(`API ${res.status} ${res.statusText}`);
        }


        const ct = res.headers.get("content-type") || "";
        if (!ct.includes("application/json")) {
          const text = await res.text();
          console.error("NO JSON", { contentType: ct, sample: text.slice(0, 200) });
          throw new Error("La API no devolvió JSON");
        }

        const data = await res.json();
        const raw = Array.isArray(data?.products) ? data.products
                 : Array.isArray(data) ? data : [];
        const list = raw.map(normalize);
        setProducts(list);
      } catch (e) {
        console.error(e);
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
