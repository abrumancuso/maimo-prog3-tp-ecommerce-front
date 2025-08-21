import HomeContainer from "@/components/HomeContainer";

export default async function Page() {
  // mock local temporal
  const products = [
    { id: "1", title: "Discovery", artist: "Daft Punk", genre: "Electronica", year: 2001, price: 45.9, cover: "/covers/discovery.jpg" },
    { id: "2", title: "Rumours", artist: "Fleetwood Mac", genre: "Rock", year: 1977, price: 39.5, cover: "/covers/rumours.jpg" },
  ];

  return <HomeContainer products={products} />;
}