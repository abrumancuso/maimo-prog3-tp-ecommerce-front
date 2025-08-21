export default function FilterBar({ genres, value, onChange }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-end justify-between">
      <input
        placeholder="Buscar por título o artista…"
        className="flex-1 rounded-xl bg-white/5 border border-white/15 px-4 py-2 outline-none"
        value={value.q}
        onChange={(e) => onChange({ ...value, q: e.target.value })}
      />
      <div className="flex gap-3">
        <select
          className="rounded-xl bg-white/5 border border-white/15 px-3 py-2"
          value={value.genre}
          onChange={(e) => onChange({ ...value, genre: e.target.value })}
        >
          <option value="">Todos</option>
          {genres.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
        <select
          className="rounded-xl bg-white/5 border border-white/15 px-3 py-2"
          value={value.sort}
          onChange={(e) => onChange({ ...value, sort: e.target.value })}
        >
          <option value="">Ordenar</option>
          <option value="price-asc">Precio ↑</option>
          <option value="price-desc">Precio ↓</option>
          <option value="year-desc">Más nuevos</option>
        </select>
      </div>
    </div>
  );
}