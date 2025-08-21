import ProductCard from "./ProductCard";

export default function ProductGrid({ items }) {
  if (!items.length) return <p className="text-white/70">No se encontraron productos.</p>;
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}
