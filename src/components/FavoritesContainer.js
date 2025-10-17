"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useShop } from "@/context/ShopContext";
import ProductGrid from "@/components/ProductGrid";

function normalize(p) {
  return {
    id: p?.id || p?._id || "",
    title: p?.title || p?.name || "",
    artist: p?.artist || "",
    genre: p?.genre || (Array.isArray(p?.categories) && p?.categories?.[0]?.name) || "",
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
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}products/${id}`);
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
    return () => { cancelled = true; };
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