import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/listing/:id" element={<main className="container"><p>Listing detail page: Module 3 me banayenge.</p></main>} />
        <Route path="*" element={<main className="container"><h2>404: Page not found</h2></main>} />
      </Routes>
    </>
  );
}