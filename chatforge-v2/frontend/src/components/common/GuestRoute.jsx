import { Navigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';

// The inverse of ProtectedRoute: keeps an already-logged-in user off the
// login/register screens instead of showing them a form they don't need.
function GuestRoute({ children }) {
  const user = useAuthStore((state) => state.user);
  const isAuthChecked = useAuthStore((state) => state.isAuthChecked);

  if (!isAuthChecked) {
    return null;
  }

  if (user) {
    return <Navigate to="/chat" replace />;
  }

  return children;
}

export default GuestRoute;
