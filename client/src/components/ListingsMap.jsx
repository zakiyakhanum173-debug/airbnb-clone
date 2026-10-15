import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import '../utils/leafletIcon';

function FitBounds({ points }) {
  const map = useMap();
  useEffect(() => {
    if (points.length) map.fitBounds(points, { padding: [40, 40], maxZoom: 12 });
  }, [points, map]);
  return null;
}

export default function ListingsMap({ items }) {
  const withCoords = useMemo(
    () => items.filter((l) => typeof l.lat === 'number' && typeof l.lng === 'number'),
    [items]
  );
  const points = useMemo(() => withCoords.map((l) => [l.lat, l.lng]), [withCoords]);

  if (withCoords.length === 0) {
    return <div className="state"><p>No listings with location to show on map.</p></div>;
  }

  return (
    <MapContainer center={points[0]} zoom={5} className="map-box">
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds points={points} />
      {withCoords.map((l) => (
        <Marker key={l._id} position={[l.lat, l.lng]}>
          <Popup>
            <strong>{l.title}</strong><br />
            {l.city} · ₹{l.pricePerNight}/night<br />
            <Link to={`/listing/${l._id}`}>View stay →</Link>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}