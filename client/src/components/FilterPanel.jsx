import { useState } from 'react';

const TYPES = ['', 'apartment', 'house', 'villa', 'cabin', 'room'];

export default function FilterPanel({ params, onApply, onClear }) {
  const [minPrice, setMinPrice] = useState(params.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(params.get('maxPrice') || '');
  const [type, setType] = useState(params.get('type') || '');

  return (
    <div className="filters">
      <select value={type} onChange={(e) => setType(e.target.value)}>
        {TYPES.map((t) => (
          <option key={t} value={t}>{t === '' ? 'All types' : t}</option>
        ))}
      </select>
      <input
        type="number"
        min="0"
        placeholder="Min ₹"
        value={minPrice}
        onChange={(e) => setMinPrice(e.target.value)}
      />
      <input
        type="number"
        min="0"
        placeholder="Max ₹"
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
      />
      <button className="btn btn-primary" onClick={() => onApply({ type, minPrice, maxPrice })}>
        Apply filters
      </button>
      <button className="btn btn-outline" onClick={onClear}>Clear all</button>
    </div>
  );
}