export default function Footer() {
  return (
    <footer className="mt-12 border-t border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-sm text-white/60">
        © {new Date().getFullYear()} VinylVerse — Sonido cálido, envíos rápidos.
      </div>
    </footer>
  );
}