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
        const res = await fetch(`http://localhost:4000/products/${id}`, { cache: "no-store" });
        if (!res.ok) throw new Error("Error al cargar producto");
        const data = await res.json();
        const p = data?.product || {};
        const normalized = {
          id: p._id || p.id || "",
          title: p.title || p.name || "",
          artist: p.artist || "",
          genre: p.genre || "",
          year: p.year ?? null,
          price: typeof p.finalPrice === "number" ? p.finalPrice
               : typeof p.price === "number" ? p.price : 0,
          cover: p.cover || "",
          description: p.description || "",
          // además pasamos opciones por si las usás en el detalle
          condition: p.condition,
          packaging: p.packaging,
          protection: !!p.protection,
          giftWrap: !!p.giftWrap,
          basePrice: p.price
        };
        setProduct(normalized);
      } catch (e) {
        setError(e.message || "Error al cargar producto");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchOne();
  }, [id]);

  if (loading) return <div className="py-12">Cargando producto…</div>;
  if (error)   return <div className="py-12 text-red-400">{error}</div>;
  if (!product) return <div className="py-12">Producto no encontrado.</div>;

  return <ProductDetail product={product} />;
}