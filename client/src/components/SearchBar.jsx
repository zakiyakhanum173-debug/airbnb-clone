import { useState } from 'react';

export default function SearchBar({ params, onSearch }) {
  const [city, setCity] = useState(params.get('city') || '');
  const [guests, setGuests] = useState(params.get('guests') || '');

  const submit = (e) => {
    e.preventDefault();
    onSearch({ city: city.trim(), guests });
  };

  return (
    <form className="searchbar" onSubmit={submit}>
      <input
        type="text"
        placeholder="Where to? (e.g. Goa)"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <input
        type="number"
        min="1"
        placeholder="Guests"
        value={guests}
        onChange={(e) => setGuests(e.target.value)}
      />
      <button type="submit" className="btn btn-primary">Search</button>
    </form>
  );
}