"use client";
import { useEffect, useState } from "react";
import { useShop } from "@/context/ShopContext";
import ProductGrid from "@/components/ProductGrid";

export default function FavoritesPage() {
  const { favorites } = useShop();
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!favorites.length) { setItems([]); return; }
    // api real 
    const url = `https://miapi.com/products?ids=${favorites.join(",")}`;
    fetch(url, { cache: "no-store" })
      .then(r => r.json())
      .then(setItems);
  }, [favorites]);

  if (!favorites.length) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold">Tus favoritos</h1>
        <p className="text-white/60 mt-2">Todavía no agregaste vinilos.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Tus favoritos</h1>
      <ProductGrid items={items} />
    </div>
  );
}