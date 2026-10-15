import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar">
      <Link to="/" className="logo">🏠 StayFinder</Link>
      <nav className="nav-links">
        {user ? (
          <>
         {user.role === 'host' && <Link to="/host/dashboard" className="btn btn-outline">Host dashboard</Link>}
            <Link to="/my-trips" className="btn btn-outline">My trips</Link>
            <span className="hello">Hi, {user.name} ({user.role})</span>
            <button className="btn btn-outline" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-outline">Login</Link>
            <Link to="/register" className="btn btn-primary">Sign up</Link>
          </>
        )}
      </nav>
    </header>
  );
}