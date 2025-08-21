"use client";
import { useMemo, useState } from "react";
import ProductGrid from "./ProductGrid";
import FilterBar from "./FilterBar";

export default function HomeContainer({ products }) {
  const [filters, setFilters] = useState({ q: "", genre: "", sort: "" });

  const genres = useMemo(
    () => Array.from(new Set((products || []).map(p => p.genre))).filter(Boolean).sort(),
    [products]
  );

  const filtered = useMemo(() => {
    let list = [...(products || [])];

    if (filters.q) {
      const s = filters.q.toLowerCase();
      list = list.filter(p =>
        p.title.toLowerCase().includes(s) ||
        p.artist.toLowerCase().includes(s)
      );
    }
    if (filters.genre) list = list.filter(p => p.genre === filters.genre);
    if (filters.sort === "price-asc")  list.sort((a,b) => a.price - b.price);
    if (filters.sort === "price-desc") list.sort((a,b) => b.price - a.price);
    if (filters.sort === "year-desc")  list.sort((a,b) => b.year - a.year);

    return list;
  }, [products, filters]);

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
        <h1 className="text-4xl font-extrabold">VinylVerse</h1>
        <p className="text-white/80 mt-2">Descubrí ediciones icónicas y nuevas joyas en vinilo.</p>
      </section>

      <FilterBar genres={genres} value={filters} onChange={setFilters} />
      <ProductGrid items={filtered} />
    </div>
  );
}