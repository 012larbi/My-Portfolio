// ===============================================================
//  ADMIN LAYOUT  — shell around the protected dashboard pages
// ===============================================================
import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../admin/authCore';
import { projectsBackend } from '../../projects/projectsStore';
import './admin.css';

export default function AdminLayout() {
  const { user, signOutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOutUser();
    navigate('/admin/login', { replace: true });
  };

  const who = user?.email || (user?.name ? user.name : 'Signed in');

  return (
    <div className="admin">
      <div className="admin-shell">
        <header className="admin-header">
          <div className="admin-header__titles">
            <h1>Dashboard</h1>
            <p>
              Manage your portfolio ·{' '}
              {projectsBackend === 'firebase'
                ? 'saved to Firebase'
                : 'saved in this browser'}
            </p>
          </div>
          <div className="admin-header__actions">
            <Link to="/portfolio" className="admin-backlink">
              View live page ↗
            </Link>
            <span className="admin-badge">{who}</span>
            <button
              type="button"
              className="admin-btn admin-btn--sm"
              onClick={handleLogout}
            >
              Log out
            </button>
          </div>
        </header>

        <nav className="admin-tabs">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              isActive ? 'admin-tab admin-tab--active' : 'admin-tab'
            }
          >
            Projects
          </NavLink>
          <NavLink
            to="/admin/categories"
            className={({ isActive }) =>
              isActive ? 'admin-tab admin-tab--active' : 'admin-tab'
            }
          >
            Categories
          </NavLink>
          <NavLink
            to="/admin/about"
            className={({ isActive }) =>
              isActive ? 'admin-tab admin-tab--active' : 'admin-tab'
            }
          >
            About page
          </NavLink>
        </nav>

        <Outlet />
      </div>
    </div>
  );
}
