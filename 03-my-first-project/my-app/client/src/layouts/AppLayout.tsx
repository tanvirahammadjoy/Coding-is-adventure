import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const AppLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <Link to="/" className="brand">
          my-app
        </Link>
        <nav className="app-nav">
          {user ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <span className="user-pill">{user.name}</span>
              <button type="button" onClick={handleLogout} className="btn-ghost">
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Log in</Link>
              <Link to="/register" className="btn-primary-link">
                Sign up
              </Link>
            </>
          )}
        </nav>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
};
