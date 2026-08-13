import { Navigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';

function ProtectedRoute({ children }) {
  const user = useAuthStore((state) => state.user);
  const isAuthChecked = useAuthStore((state) => state.isAuthChecked);

  // Wait for the initial checkAuth() call to resolve before deciding -
  // otherwise a page refresh briefly bounces a logged-in user to /login.
  if (!isAuthChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <p className="text-text-muted">Loading…</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
