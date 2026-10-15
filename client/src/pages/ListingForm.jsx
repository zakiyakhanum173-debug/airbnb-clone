import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../utils/leafletIcon';
import api from '../api/axios';

const EMPTY = {
  title: '', description: '', pricePerNight: '', city: '', address: '',
  maxGuests: 1, type: 'apartment', amenities: '', images: '', lat: '', lng: '',
};

function PinPicker({ onPick }) {
  useMapEvents({ click: (e) => onPick(e.latlng.lat, e.latlng.lng) });
  return null;
}

export default function ListingForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(Boolean(id));

  useEffect(() => {
    if (!id) return;
    api
      .get(`/listings/${id}`)
      .then((r) => {
        const l = r.data;
        setForm({
          title: l.title || '',
          description: l.description || '',
          pricePerNight: l.pricePerNight ?? '',
          city: l.city || '',
          address: l.address || '',
          maxGuests: l.maxGuests ?? 1,
          type: l.type || 'apartment',
          amenities: (l.amenities || []).join(', '),
          images: (l.images || []).join('\n'),
          lat: l.lat ?? '',
          lng: l.lng ?? '',
        });
      })
      .catch(() => setError('Could not load listing'))
      .finally(() => setLoading(false));
  }, [id]);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const pick = (lat, lng) => setForm((f) => ({ ...f, lat: lat.toFixed(5), lng: lng.toFixed(5) }));

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    const payload = {
      title: form.title,
      description: form.description,
      pricePerNight: Number(form.pricePerNight),
      city: form.city,
      address: form.address,
      maxGuests: Number(form.maxGuests),
      type: form.type,
      amenities: form.amenities.split(',').map((s) => s.trim()).filter(Boolean),
      images: form.images.split('\n').map((s) => s.trim()).filter(Boolean),
    };
    if (form.lat !== '' && form.lng !== '') {
      payload.lat = Number(form.lat);
      payload.lng = Number(form.lng);
    }
    try {
      if (id) await api.put(`/listings/${id}`, payload);
      else await api.post('/listings', payload);
      navigate('/host/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save listing');
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <main className="container"><p>Loading...</p></main>;

  const hasPin = form.lat !== '' && form.lng !== '';
  const center = hasPin ? [Number(form.lat), Number(form.lng)] : [20.59, 78.96];

  return (
    <main className="container">
      <h1 style={{ marginBottom: 16 }}>{id ? 'Edit listing' : 'New listing'}</h1>
      <form className="listing-form" onSubmit={submit}>
        <label>Title<input name="title" value={form.title} onChange={change} required /></label>
        <label>Description<textarea name="description" rows="4" value={form.description} onChange={change} /></label>

        <div className="form-row">
          <label>Price per night (₹)<input name="pricePerNight" type="number" min="0" value={form.pricePerNight} onChange={change} required /></label>
          <label>Max guests<input name="maxGuests" type="number" min="1" value={form.maxGuests} onChange={change} required /></label>
          <label>Type
            <select name="type" value={form.type} onChange={change}>
              {['apartment', 'house', 'villa', 'cabin', 'room'].map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </label>
        </div>

        <div className="form-row">
          <label>City<input name="city" value={form.city} onChange={change} required /></label>
          <label>Address<input name="address" value={form.address} onChange={change} /></label>
        </div>

        <label>Amenities (comma separated)<input name="amenities" placeholder="WiFi, AC, Pool" value={form.amenities} onChange={change} /></label>
        <label>Image URLs (ek line me ek)<textarea name="images" rows="3" value={form.images} onChange={change} /></label>

        <p className="muted">Map pe click karke location chuno {hasPin && `(${form.lat}, ${form.lng})`}</p>
        <MapContainer key={hasPin ? 'pinned' : 'free'} center={center} zoom={hasPin ? 11 : 5} className="map-box small">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
          <PinPicker onPick={pick} />
          {hasPin && <Marker position={center} />}
        </MapContainer>

        {error && <p className="error">{error}</p>}
        <div className="row-gap">
          <button className="btn btn-primary" disabled={busy}>{busy ? 'Saving...' : 'Save listing'}</button>
          <button type="button" className="btn btn-outline" onClick={() => navigate('/host/dashboard')}>Cancel</button>
        </div>
      </form>
    </main>
  );
}
