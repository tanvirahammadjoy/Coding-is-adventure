import { Link } from 'react-router-dom';

export const NotFoundPage = () => {
  return (
    <section className="not-found">
      <h1>404</h1>
      <p>This page doesn't exist.</p>
      <Link to="/" className="btn-primary">
        Back home
      </Link>
    </section>
  );
};
