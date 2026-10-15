export default function StarRating({ value = 0, onChange }) {
  return (
    <span className="stars">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          type="button"
          key={n}
          className={n <= value ? 'star on' : 'star'}
          onClick={() => onChange && onChange(n)}
          disabled={!onChange}
          aria-label={`${n} star`}
        >
          ★
        </button>
      ))}
    </span>
  );
}