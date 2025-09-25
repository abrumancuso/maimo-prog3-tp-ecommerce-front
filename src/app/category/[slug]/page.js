"use client";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useShop } from "@/context/ShopContext";
import HomeContainer from "@/components/HomeContainer";

export default function CategoryPage() {
  const { slug } = useParams();
  const { products, fetchProductsByCategory, loading, error } = useShop();

  useEffect(() => {
    if (slug) fetchProductsByCategory(slug);
  }, [slug]);

  if (loading) return <div className="py-12">Cargando categoría…</div>;
  if (error)   return <div className="py-12 text-red-400">Error: {error}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold capitalize">Categoría: {slug}</h1>
      <HomeContainer products={products} />
    </div>
  );
}
