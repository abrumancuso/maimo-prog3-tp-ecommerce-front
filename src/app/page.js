"use client";
import { useEffect } from "react";
import { useShop } from "@/context/ShopContext";
import HomeContainer from "@/components/HomeContainer";

export default function Page() {
  const { products, fetchProducts, loading, error } = useShop();

  useEffect(() => {
    fetchProducts(); 
  }, []);

  if (loading) return <div className="py-12">Cargando catálogo…</div>;
  if (error)   return <div className="py-12 text-red-400">Error: {error}</div>;

  return <HomeContainer products={products} />;
}
