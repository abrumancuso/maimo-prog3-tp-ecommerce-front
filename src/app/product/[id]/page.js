"use client";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useShop } from "@/context/ShopContext";
import ProductDetail from "@/components/ProductDetail";

export default function ProductPage() {
  const { id } = useParams();
  const { product, setProduct, loading, setLoading, error, setError } = useShop();

  useEffect(() => {
    const fetchOne = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:4000/products/${id}`);
        const data = await res.json();
        setProduct(data.product || data);
      } catch (e) {
        setError("Error al cargar producto");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchOne();
  }, [id]);

  if (loading) return <div className="py-12">Cargando producto…</div>;
  if (error) return <div className="py-12 text-red-400">{error}</div>;
  if (!product) return <div className="py-12">Producto no encontrado.</div>;

  return <ProductDetail product={product} />;
}
