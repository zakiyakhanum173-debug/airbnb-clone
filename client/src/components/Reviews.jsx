import { useCallback, useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import StarRating from './StarRating';
import { prettyDate } from '../utils/dates';

export default function Reviews({ listingId, onAdded }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [canReview, setCanReview] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    api.get(`/listings/${listingId}/reviews`).then((r) => setReviews(r.data)).catch(() => {});
    if (user) {
      api.get(`/listings/${listingId}/can-review`).then((r) => setCanReview(r.data.canReview)).catch(() => {});
    } else {
      setCanReview(false);
    }
  }, [listingId, user]);

  useEffect(() => { load(); }, [load]);

  const submit = async (e) => {
    e.preventDefault();
    if (!rating) { setError('Please select a star rating'); return; }
    setBusy(true);
    setError('');
    try {
      await api.post(`/listings/${listingId}/reviews`, { rating, comment });
      setRating(0);
      setComment('');
      load();
      if (onAdded) onAdded();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not submit review');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="reviews">
      <h2>Reviews ({reviews.length})</h2>

      {canReview && (
        <form className="review-form" onSubmit={submit}>
          <h3>Write a review</h3>
          <StarRating value={rating} onChange={setRating} />
          <textarea
            rows="3"
            placeholder="How was your stay?"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          {error && <p className="error">{error}</p>}
          <button className="btn btn-primary" disabled={busy}>
            {busy ? 'Submitting...' : 'Submit review'}
          </button>
        </form>
      )}

      {reviews.length === 0 && <p className="muted">No reviews yet.</p>}

      {reviews.map((r) => (
        <div key={r._id} className="review">
          <div className="review-head">
            <strong>{r.guest?.name || 'Guest'}</strong>
            <span className="muted">{prettyDate(r.createdAt)}</span>
          </div>
          <StarRating value={r.rating} />
          {r.comment && <p>{r.comment}</p>}
        </div>
      ))}
    </section>
  );
}