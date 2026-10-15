import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'guest' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await register(form);
      navigate(location.state?.from || '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="auth-box">
      <h2>Create your account</h2>
      <form onSubmit={submit}>
        <input name="name" placeholder="Full name" value={form.name} onChange={change} required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={change} required />
        <input name="password" type="password" placeholder="Password (min 6 characters)"
          value={form.password} onChange={change} minLength={6} required />
        <select name="role" value={form.role} onChange={change}>
          <option value="guest">I want to book stays (Guest)</option>
          <option value="host">I want to list my place (Host)</option>
        </select>
        {error && <p className="error">{error}</p>}
        <button className="btn btn-primary" disabled={busy}>
          {busy ? 'Creating...' : 'Sign up'}
        </button>
      </form>
      <p className="muted">Already have an account? <Link to="/login">Login</Link></p>
    </main>
  );
}