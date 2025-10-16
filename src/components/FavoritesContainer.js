"use client";
import { useEffect, useState } from "react";
import { useShop } from "@/context/ShopContext";
import ProductGrid from "@/components/ProductGrid";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function normalize(p) {
  return {
    id: p?.id || p?._id || "",
    title: p?.title || p?.name || "",
    artist: p?.artist || "",
    genre: p?.genre || "",
    year: typeof p?.year === "number" ? p.year : null,
    price: typeof p?.price === "number" ? p.price : 0,
    cover: p?.cover || "",
    description: p?.description || "",
  };
}

export default function FavoritesContainer() {
  const { favorites } = useShop();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!favorites.length) {
      setItems([]);
      return;
    }
    let cancelled = false;

    const fetchFavs = async () => {
      setLoading(true);
      setError("");
      try {
        const results = await Promise.all(
          favorites.map(async (id) => {
            const res = await fetch(`${API}/products/${id}`, { cache: "no-store" });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            return normalize(data.product || data);
          })
        );
        if (!cancelled) setItems(results.filter(Boolean));
      } catch {
        if (!cancelled) {
          setError("No se pudieron cargar tus favoritos");
          setItems([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchFavs();
    return () => {
      cancelled = true;
    };
  }, [favorites]);

  if (!favorites.length) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold">Tus favoritos</h1>
        <p className="text-white/60 mt-2">Todavía no agregaste vinilos.</p>
      </div>
    );
  }

  if (loading) return <div className="py-12">Cargando favoritos…</div>;
  if (error) return <div className="py-12 text-red-400">{error}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Tus favoritos</h1>
      <ProductGrid items={items} />
    </div>
  );
}