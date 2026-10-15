import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import RoleRoute from './components/RoleRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ListingDetail from './pages/ListingDetail';
import BookingConfirmed from './pages/BookingConfirmed';
import MyTrips from './pages/MyTrips';
import HostDashboard from './pages/HostDashboard';
import ListingForm from './pages/ListingForm';

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
        <Route path="/host/dashboard" element={<RoleRoute role="host"><HostDashboard /></RoleRoute>} />
        <Route path="/host/new" element={<RoleRoute role="host"><ListingForm /></RoleRoute>} />
        <Route path="/host/edit/:id" element={<RoleRoute role="host"><ListingForm /></RoleRoute>} />
        <Route path="*" element={<main className="container"><h2>404: Page not found</h2></main>} />
      </Routes>
    </>
  );
}