import { Link, Navigate, useLocation } from 'react-router-dom';
import { prettyDate } from '../utils/dates';

export default function BookingConfirmed() {
  const { state } = useLocation();
  if (!state?.booking) return <Navigate to="/my-trips" replace />;

  const { booking, listing } = state;

  return (
    <main className="auth-box" style={{ maxWidth: 480 }}>
      <h2>🎉 Booking confirmed!</h2>
      <p className="muted" style={{ marginBottom: 16 }}>Booking ID: {booking._id}</p>
      <div className="price-summary">
        <div><span>Stay</span><span>{listing.title}</span></div>
        <div><span>City</span><span>{listing.city}</span></div>
        <div><span>Check-in</span><span>{prettyDate(booking.checkIn)}</span></div>
        <div><span>Check-out</span><span>{prettyDate(booking.checkOut)}</span></div>
        <div><span>Guests</span><span>{booking.guests}</span></div>
        <div className="total"><span>Total paid</span><span>₹{booking.totalPrice}</span></div>
      </div>
      <div className="row-gap">
        <Link to="/my-trips" className="btn btn-primary">View my trips</Link>
        <Link to="/" className="btn btn-outline">Keep browsing</Link>
      </div>
    </main>
  );
}