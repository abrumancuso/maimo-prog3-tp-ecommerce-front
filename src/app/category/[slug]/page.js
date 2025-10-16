"use client";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useShop } from "@/context/ShopContext";
import HomeContainer from "@/components/HomeContainer";

export default function CategoryPage() {
  const { slug } = useParams();
  const { products, setProducts, loading, setLoading, error, setError } = useShop();

  useEffect(() => {
    const fetchCategory = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:4000/products?category=${slug}`);
        const data = await res.json();
        setProducts(data.products || data);
      } catch (e) {
        setError("Error al cargar categoría");
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchCategory();
  }, [slug]);

  if (loading) return <div className="py-12">Cargando categoría…</div>;
  if (error) return <div className="py-12 text-red-400">{error}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold capitalize">Categoría: {slug}</h1>
      <HomeContainer products={products} />
    </div>
  );
}
