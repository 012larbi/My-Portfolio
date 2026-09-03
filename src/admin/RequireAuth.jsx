// Route guard for protected /admin pages.
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './authCore';

export default function RequireAuth() {
  const { ready, isAuthed } = useAuth();
  const location = useLocation();

  if (!ready) {
    return <div className="admin-boot">Loading…</div>;
  }
  if (!isAuthed) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }
  return <Outlet />;
}
