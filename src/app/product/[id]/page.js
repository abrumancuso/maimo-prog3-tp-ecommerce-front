"use client";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useShop } from "@/context/ShopContext";
import ProductDetail from "@/components/ProductDetail";

export default function ProductPage() {
  const { id } = useParams();
  const { product, fetchProduct, loading, error } = useShop();

  useEffect(() => {
    if (id) fetchProduct(id);
  }, [id]);

  if (loading)   return <div className="py-12">Cargando producto…</div>;
  if (error)     return <div className="py-12 text-red-400">Error: {error}</div>;
  if (!product)  return <div className="py-12">Producto no encontrado.</div>;

  return <ProductDetail product={product} />;
}
