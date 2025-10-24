"use client";
import { useEffect } from "react";
import axios from "axios";
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
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}products`, {
          params: { category: slug }
        });
        const list = Array.isArray(data?.products) ? data.products : data;
        setProducts(list);
      } catch (e) {
        setError("Error al cargar categoría");
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchCategory();
  }, [slug, setLoading, setError, setProducts]);

  if (loading) return <div className="py-12">Cargando categoría…</div>;
  if (error) return <div className="py-12 text-red-400">{error}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold capitalize">Categoría: {slug}</h1>
      <HomeContainer products={products} />
    </div>
  );
}