import ProductDetail from "@/components/ProductDetail";

export default async function ProductPage({ params }) {
  const res = await fetch(`https://miapi.com/products/${params.id}`, { cache: "no-store" });
  const product = await res.json();

  return <ProductDetail product={product} />;
}