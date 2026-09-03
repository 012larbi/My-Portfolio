// ===============================================================
//  ADMIN LOGIN
// ===============================================================
import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../admin/authCore';
import './admin.css';

export default function AdminLogin() {
  const { isAuthed, ready, mode, signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const from = location.state?.from?.pathname || '/admin';

  if (ready && isAuthed) return <Navigate to={from} replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    const res = await signIn({ email, password });
    setBusy(false);
    if (res.ok) navigate(from, { replace: true });
    else setError(res.error || 'Sign in failed.');
  };

  return (
    <div className="admin-login">
      <div className="admin-login__card">
        <h1>Admin sign in</h1>
        <p className="sub">
          {mode === 'firebase'
            ? 'Sign in with your admin email and password.'
            : mode === 'passcode'
              ? 'Enter the admin passcode to continue.'
              : 'Admin access is not configured yet.'}
        </p>

        {error && <div className="admin-login__error">{error}</div>}

        {mode === 'unconfigured' ? (
          <div className="admin-note">
            Set the <code>VITE_FIREBASE_*</code> environment variables (recommended)
            or <code>VITE_ADMIN_PASSCODE</code> for local use, then reload.
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            {mode === 'firebase' && (
              <div className="admin-field">
                <label className="admin-label" htmlFor="al-email">
                  Email
                </label>
                <input
                  id="al-email"
                  type="email"
                  className="admin-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>
            )}

            <div className="admin-field">
              <label className="admin-label" htmlFor="al-pass">
                {mode === 'firebase' ? 'Password' : 'Passcode'}
              </label>
              <input
                id="al-pass"
                type="password"
                className="admin-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>

            <button
              type="submit"
              className="admin-btn admin-btn--primary"
              style={{ width: '100%', marginTop: '0.5rem' }}
              disabled={busy}
            >
              {busy ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        )}

        <div className="admin-login__foot">
          <Link to="/">← Back to portfolio</Link>
        </div>
      </div>
    </div>
  );
}
