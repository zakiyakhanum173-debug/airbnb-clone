import ListingCard from './ListingCard';

export default function ListingGrid({ items, loading, error, onRetry, onClear }) {
  if (loading) {
    return (
      <div className="grid">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="card skeleton">
            <div className="sk-img" />
            <div className="card-body">
              <div className="sk-line" />
              <div className="sk-line short" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="state">
        <p>⚠️ {error}</p>
        <button className="btn btn-primary" onClick={onRetry}>Try again</button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="state">
        <p>😕 No stays match your filters.</p>
        <button className="btn btn-primary" onClick={onClear}>Clear filters</button>
      </div>
    );
  }

  return (
    <div className="grid">
      {items.map((l) => <ListingCard key={l._id} listing={l} />)}
    </div>
  );
}