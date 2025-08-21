"use client";
import { useState } from "react";
import ProductGrid from "./ProductGrid";
import FilterBar from "./FilterBar";

export default function HomeContainer({ products }) {
  const [filters, setFilters] = useState({ q: "", genre: "", sort: "" });
  const filtered = products.filter(p =>
    p.title.toLowerCase().includes(filters.q.toLowerCase()) ||
    p.artist.toLowerCase().includes(filters.q.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
        <h1 className="text-4xl font-extrabold">VinylVerse</h1>
        <p className="text-white/80 mt-2">Descubrí ediciones icónicas y nuevas joyas en vinilo.</p>
      </section>

      <FilterBar value={filters} onChange={setFilters} />
      <ProductGrid items={filtered} />
    </div>
  );
}