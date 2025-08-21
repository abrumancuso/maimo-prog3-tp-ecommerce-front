import ProductDetail from "@/components/ProductDetail";

const MOCK_PRODUCTS = [
  { id: "1", title: "Discovery", artist: "Daft Punk", genre: "Electronica", year: 2001, price: 45.9, cover: "https://picsum.photos/seed/discovery/1000/1000", description: "Vista previa sin API." },
  { id: "2", title: "Rumours", artist: "Fleetwood Mac", genre: "Rock", year: 1977, price: 39.5, cover: "https://picsum.photos/seed/rumours/1000/1000", description: "Vista previa sin API." },
];

export default async function ProductPage({ params }) {
  let product = null;

  // API REAL (cuando la tengas, descomentá esto y borrá el mock)
  // const res = await fetch(`https://miapi.com/products/${params.id}`, { cache: "no-store" });
  // if (res.ok) product = await res.json();

  // PREVIEW SIN API
  if (!product) {
    product =
      MOCK_PRODUCTS.find(p => p.id === params.id) ||
      {
        id: params.id,
        title: "Vinilo demo",
        artist: "Artista demo",
        genre: "Rock",
        year: 1970,
        price: 39.9,
        cover: `https://picsum.photos/seed/${params.id}/1000/1000`,
        description: "Esta es una vista previa del detalle sin API. Reemplazalo cuando conectes tu endpoint."
      };
  }

  return <ProductDetail product={product} />;
}