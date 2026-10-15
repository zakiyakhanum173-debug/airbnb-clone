import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { parseDay, prettyDate } from '../utils/dates';

const FALLBACK = 'https://placehold.co/300x200?text=No+Image';

export default function MyTrips() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    api
      .get('/bookings/mine')
      .then((r) => setBookings(r.data))
      .catch(() => setError('Could not load your trips'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const cancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await api.patch(`/bookings/${id}/cancel`);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not cancel');
    }
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = bookings.filter((b) => b.status === 'confirmed' && parseDay(b.checkOut) >= today);
  const past = bookings.filter((b) => b.status === 'confirmed' && parseDay(b.checkOut) < today);
  const cancelled = bookings.filter((b) => b.status === 'cancelled');

  const Trip = ({ b }) => (
    <div className="trip">
      <img
        src={b.listing?.images?.[0] || FALLBACK}
        alt=""
        onError={(e) => { e.currentTarget.src = FALLBACK; }}
      />
      <div className="trip-info">
        <h3>{b.listing ? <Link to={`/listing/${b.listing._id}`}>{b.listing.title}</Link> : 'Listing removed'}</h3>
        <p className="muted">{b.listing?.city}</p>
        <p>{prettyDate(b.checkIn)} → {prettyDate(b.checkOut)} · {b.guests} guest{b.guests > 1 ? 's' : ''}</p>
        <p><strong>₹{b.totalPrice}</strong></p>
        {b.status === 'confirmed' && parseDay(b.checkIn) > today && (
          <button className="btn btn-outline" onClick={() => cancel(b._id)}>Cancel booking</button>
        )}
      </div>
    </div>
  );

  if (loading) return <main className="container"><p>Loading your trips...</p></main>;
  if (error) return <main className="container state"><p>⚠️ {error}</p></main>;

  return (
    <main className="container">
      <h1 style={{ marginBottom: 16 }}>My trips</h1>

      {bookings.length === 0 && (
        <div className="state">
          <p>No trips yet.</p>
          <Link to="/" className="btn btn-primary">Find a place</Link>
        </div>
      )}

      {upcoming.length > 0 && <><h2 className="section-title">Upcoming</h2>{upcoming.map((b) => <Trip key={b._id} b={b} />)}</>}
      {past.length > 0 && <><h2 className="section-title">Past</h2>{past.map((b) => <Trip key={b._id} b={b} />)}</>}
      {cancelled.length > 0 && <><h2 className="section-title">Cancelled</h2>{cancelled.map((b) => <Trip key={b._id} b={b} />)}</>}
    </main>
  );
}