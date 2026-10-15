import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { differenceInCalendarDays } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { parseDay, toApiDate, lastNight } from '../utils/dates';

export default function BookingWidget({ listing, bookedRanges, onRefresh }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [range, setRange] = useState([null, null]);
  const [start, end] = range;
  const [guests, setGuests] = useState(1);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  // Booked dates calendar me grey (disabled) dikhengi
  const excluded = useMemo(
    () => bookedRanges.map((b) => ({ start: parseDay(b.checkIn), end: lastNight(b.checkOut) })),
    [bookedRanges]
  );

  // Selected range kisi booked raat ke upar se guzar raha hai?
  const hasConflict =
    start && end && bookedRanges.some((b) => parseDay(b.checkIn) < end && parseDay(b.checkOut) > start);

  const nights = start && end ? differenceInCalendarDays(end, start) : 0;
  const total = nights * listing.pricePerNight;
  const isOwner = user && listing.host && listing.host._id === user.id;

  const reserve = async () => {
    if (!user) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    setBusy(true);
    setError('');
    try {
      const res = await api.post('/bookings', {
        listingId: listing._id,
        checkIn: toApiDate(start),
        checkOut: toApiDate(end),
        guests: Number(guests),
      });
      navigate('/booking-confirmed', {
        state: {
          booking: res.data,
          listing: { title: listing.title, city: listing.city, images: listing.images },
        },
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Try again.');
      if (err.response?.status === 409) {
        setRange([null, null]);
        onRefresh();
      }
    } finally {
      setBusy(false);
    }
  };

  const canReserve = start && end && !hasConflict && !busy && !isOwner;

  return (
    <aside className="booking-box">
      <p className="price">
        <strong>₹{listing.pricePerNight}</strong> / night
      </p>

      <DatePicker
        selectsRange
        inline
        startDate={start}
        endDate={end}
        onChange={(dates) => { setRange(dates); setError(''); }}
        minDate={new Date()}
        excludeDateIntervals={excluded}
      />

      <label className="field-label">Guests (max {listing.maxGuests})</label>
      <input
        type="number"
        min="1"
        max={listing.maxGuests}
        value={guests}
        onChange={(e) => setGuests(e.target.value)}
      />

      {hasConflict && <p className="error">Selected dates include a booked night. Choose other dates.</p>}

      {nights > 0 && !hasConflict && (
        <div className="price-summary">
          <div><span>₹{listing.pricePerNight} × {nights} night{nights > 1 ? 's' : ''}</span><span>₹{total}</span></div>
          <div className="total"><span>Total</span><span>₹{total}</span></div>
        </div>
      )}

      {isOwner && <p className="muted">This is your own listing.</p>}
      {error && <p className="error">{error}</p>}

      <button className="btn btn-primary full" disabled={!canReserve} onClick={reserve}>
        {busy ? 'Reserving...' : user ? 'Reserve' : 'Login to reserve'}
      </button>
      {!start || !end ? <p className="muted center">Select check-in and check-out dates</p> : null}
    </aside>
  );
}