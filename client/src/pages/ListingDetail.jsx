import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/axios';
import BookingWidget from '../components/BookingWidget';

const FALLBACK = 'https://placehold.co/900x500?text=No+Image';

export default function ListingDetail() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [booked, setBooked] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadBooked = useCallback(() => {
    api.get(`/listings/${id}/bookings`).then((r) => setBooked(r.data)).catch(() => {});
  }, [id]);

  useEffect(() => {
  let cancelled = false;
  api
    .get(`/listings/${id}`)
    .then((r) => { if (!cancelled) { setListing(r.data); setError(''); } })
    .catch((e) => { if (!cancelled) setError(e.response?.status === 404 ? 'Listing not found' : 'Could not load this listing'); })
    .finally(() => { if (!cancelled) setLoading(false); });
  loadBooked();
  return () => { cancelled = true; };
}, [id, loadBooked]);

  if (loading) return <main className="container"><p>Loading...</p></main>;
  if (error) {
    return (
      <main className="container state">
        <p>⚠️ {error}</p>
        <Link to="/" className="btn btn-primary">Back to listings</Link>
      </main>
    );
  }

  return (
    <main className="container">
      <Link to="/" className="muted">← Back to all stays</Link>
      <h1 className="detail-title">{listing.title}</h1>
      <p className="muted">
        {listing.city} · {listing.type}
        {listing.reviewCount > 0 && ` · ⭐ ${listing.avgRating} (${listing.reviewCount} reviews)`}
      </p>

      <img
        className="detail-img"
        src={listing.images?.[0] || FALLBACK}
        alt={listing.title}
        onError={(e) => { e.currentTarget.src = FALLBACK; }}
      />

      <div className="detail-layout">
        <section>
          <h3>Hosted by {listing.host?.name || 'Host'}</h3>
          <p className="muted">Up to {listing.maxGuests} guests</p>
          <hr />
          <h3>About this place</h3>
          <p>{listing.description || 'No description yet.'}</p>
          {listing.amenities?.length > 0 && (
            <>
              <h3 style={{ marginTop: 20 }}>Amenities</h3>
              <ul className="amenities">
                {listing.amenities.map((a) => <li key={a}>✓ {a}</li>)}
              </ul>
            </>
          )}
        </section>

        <BookingWidget listing={listing} bookedRanges={booked} onRefresh={loadBooked} />
      </div>
    </main>
  );
}