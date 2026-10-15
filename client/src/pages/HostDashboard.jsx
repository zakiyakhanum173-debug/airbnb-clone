import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { prettyDate } from '../utils/dates';

export default function HostDashboard() {
  const [stats, setStats] = useState(null);
  const [listings, setListings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    Promise.all([api.get('/host/stats'), api.get('/listings/mine'), api.get('/host/bookings')])
      .then(([s, l, b]) => { setStats(s.data); setListings(l.data); setBookings(b.data); })
      .catch(() => setError('Could not load dashboard'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    if (!window.confirm('Delete this listing permanently?')) return;
    try {
      await api.delete(`/listings/${id}`);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not delete');
    }
  };

  if (loading) return <main className="container"><p>Loading dashboard...</p></main>;
  if (error) return <main className="container state"><p>⚠️ {error}</p></main>;

  return (
    <main className="container">
      <div className="dash-head">
        <h1>Host dashboard</h1>
        <Link to="/host/new" className="btn btn-primary">+ New listing</Link>
      </div>

      <div className="stats">
        <div className="stat"><span>Listings</span><strong>{stats.totalListings}</strong></div>
        <div className="stat"><span>Bookings</span><strong>{stats.totalBookings}</strong></div>
        <div className="stat"><span>Earnings</span><strong>₹{stats.earnings}</strong></div>
        <div className="stat"><span>Avg rating</span><strong>{stats.avgRating || '-'}</strong></div>
      </div>

      <h2 className="section-title">My listings</h2>
      {listings.length === 0 ? (
        <div className="state"><p>You have no listings yet.</p></div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Title</th><th>City</th><th>Price</th><th>Rating</th><th></th></tr>
            </thead>
            <tbody>
              {listings.map((l) => (
                <tr key={l._id}>
                  <td><Link to={`/listing/${l._id}`}>{l.title}</Link></td>
                  <td>{l.city}</td>
                  <td>₹{l.pricePerNight}</td>
                  <td>{l.reviewCount > 0 ? `⭐ ${l.avgRating} (${l.reviewCount})` : '-'}</td>
                  <td className="actions">
                    <Link to={`/host/edit/${l._id}`} className="btn btn-outline">Edit</Link>
                    <button className="btn btn-outline" onClick={() => remove(l._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h2 className="section-title">Incoming bookings</h2>
      {bookings.length === 0 ? (
        <div className="state"><p>No bookings yet.</p></div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Listing</th><th>Guest</th><th>Dates</th><th>Total</th><th>Status</th></tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id}>
                  <td>{b.listing?.title || 'Removed'}</td>
                  <td>{b.guest?.name}<br /><span className="muted">{b.guest?.email}</span></td>
                  <td>{prettyDate(b.checkIn)} → {prettyDate(b.checkOut)}</td>
                  <td>₹{b.totalPrice}</td>
                  <td>{b.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}