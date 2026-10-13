import { Link } from 'react-router-dom';

const FALLBACK = 'https://placehold.co/600x400?text=No+Image';

export default function ListingCard({ listing }) {
  const { _id, title, city, type, pricePerNight, images, avgRating, reviewCount } = listing;

  return (
    <Link to={`/listing/${_id}`} className="card">
      <img
        src={images?.[0] || FALLBACK}
        alt={title}
        loading="lazy"
        onError={(e) => { e.currentTarget.src = FALLBACK; }}
      />
      <div className="card-body">
        <div className="card-top">
          <h3>{title}</h3>
          {reviewCount > 0 && <span className="rating">⭐ {avgRating}</span>}
        </div>
        <p className="muted">{city} · {type}</p>
        <p className="price"><strong>₹{pricePerNight}</strong> / night</p>
      </div>
    </Link>
  );
}