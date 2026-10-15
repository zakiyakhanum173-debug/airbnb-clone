import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ListingDetail from './pages/ListingDetail';
import BookingConfirmed from './pages/BookingConfirmed';
import MyTrips from './pages/MyTrips';

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/listing/:id" element={<ListingDetail />} />
        <Route path="/booking-confirmed" element={<ProtectedRoute><BookingConfirmed /></ProtectedRoute>} />
        <Route path="/my-trips" element={<ProtectedRoute><MyTrips /></ProtectedRoute>} />
        <Route path="*" element={<main className="container"><h2>404: Page not found</h2></main>} />
      </Routes>
    </>
  );
}