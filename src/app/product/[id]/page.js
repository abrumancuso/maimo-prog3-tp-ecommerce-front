"use client";
import { useEffect } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { useShop } from "@/context/ShopContext";
import ProductDetail from "@/components/ProductDetail";

export default function ProductPage() {
  const { id } = useParams();
  const { product, setProduct, loading, setLoading, error, setError } = useShop();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError("");
    setProduct(null);

    (async () => {
      try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}products/${id}`);
        const p = data?.product || {};
        const normalized = {
          id: p._id || p.id || "",
          title: p.title || p.name || "",
          artist: p.artist || "",
          genre: p.genre || (Array.isArray(p.categories) && p.categories[0]?.name) || "",
          year: p.year ?? null,
          price: typeof p.finalPrice === "number" ? p.finalPrice
               : typeof p.price === "number" ? p.price : 0,
          cover: p.cover || "",
          description: p.description || "",
          // opciones para el detalle
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
    })();
  }, [id, setError, setLoading, setProduct]);

  if (loading) return <div className="py-12">Cargando producto…</div>;
  if (error)   return <div className="py-12 text-red-400">{error}</div>;
  if (!product) return <div className="py-12">Producto no encontrado.</div>;

  return <ProductDetail product={product} />;
}