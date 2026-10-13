import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import ListingGrid from '../components/ListingGrid';
import Pagination from '../components/Pagination';

export default function Home() {
  const [params, setParams] = useSearchParams();
  const [data, setData] = useState({ items: [], total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);

  const query = params.toString();
  const page = Number(params.get('page') || 1);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    api
      .get(`/listings?${query}`)
      .then((res) => { if (!cancelled) setData(res.data); })
      .catch(() => { if (!cancelled) setError('Could not load listings. Is the server running?'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [query, retry]);

  // URL ke params update karne ka helper
  const update = (changes) => {
    const next = new URLSearchParams(params);
    Object.entries(changes).forEach(([key, value]) => {
      if (value === '' || value == null) next.delete(key);
      else next.set(key, value);
    });
    if (!('page' in changes)) next.delete('page'); // filter badle to page 1 se shuru
    setParams(next);
  };

  const clearAll = () => setParams(new URLSearchParams());

  return (
    <main className="container">
      <SearchBar key={`s-${query}`} params={params} onSearch={update} />
      <FilterPanel key={`f-${query}`} params={params} onApply={update} onClear={clearAll} />

      {!loading && !error && (
        <p className="muted result-count">{data.total} stays found</p>
      )}

      <ListingGrid
        items={data.items}
        loading={loading}
        error={error}
        onRetry={() => setRetry((r) => r + 1)}
        onClear={clearAll}
      />

      <Pagination page={page} pages={data.pages} onChange={(p) => update({ page: p })} />
    </main>
  );
}