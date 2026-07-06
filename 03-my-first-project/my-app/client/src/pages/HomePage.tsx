import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const HomePage = () => {
  const { user } = useAuth();

  return (
    <section className="hero">
      <p className="eyebrow">React · Express · MongoDB · JWT</p>
      <h1>A full-stack starter that's actually wired up.</h1>
      <p className="hero-sub">
        Auth, protected routes, and a typed API layer are already connected end to end —
        register a user and see it work.
      </p>
      <div className="hero-actions">
        {user ? (
          <Link to="/dashboard" className="btn-primary">
            Go to dashboard
          </Link>
        ) : (
          <>
            <Link to="/register" className="btn-primary">
              Create an account
            </Link>
            <Link to="/login" className="btn-secondary">
              Log in
            </Link>
          </>
        )}
      </div>
    </section>
  );
};
