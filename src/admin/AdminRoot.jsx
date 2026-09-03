// Provides the admin auth context to every /admin route.
import { Outlet } from 'react-router-dom';
import { AuthProvider } from './AuthContext';

export default function AdminRoot() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}
