import HomeContainer from "@/components/HomeContainer";

export default async function Page() {
  // api real
  const res = await fetch("https://miapi.com/products", { cache: "no-store" });
  const products = await res.json();

  return <HomeContainer products={products} />;
}