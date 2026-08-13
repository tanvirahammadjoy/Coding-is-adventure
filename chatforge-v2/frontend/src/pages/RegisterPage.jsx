import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';

function RegisterPage() {
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);
  const authError = useAuthStore((state) => state.authError);
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = await register(form);
    setIsSubmitting(false);
    if (success) navigate('/chat');
  };

  return (
    <div className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-bg px-4">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-accent-secondary/10 blur-3xl" />

      <div className="relative w-full max-w-sm animate-modal-in rounded-2xl border border-border-subtle bg-surface p-8">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent/15 text-accent">
          <MessageCircle size={22} />
        </div>
        <h1 className="mt-4 font-display text-2xl font-medium text-text-primary">Roomtone</h1>
        <p className="mt-1 text-sm text-text-secondary">Create an account to start chatting.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
          <div>
            <label htmlFor="username" className="mb-1 block text-sm text-text-secondary">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              minLength={3}
              maxLength={30}
              required
              value={form.username}
              onChange={handleChange}
              className="w-full rounded-lg border border-border-subtle bg-surface-elevated px-3 py-2 text-text-primary outline-none focus:border-accent"
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-1 block text-sm text-text-secondary">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-lg border border-border-subtle bg-surface-elevated px-3 py-2 text-text-primary outline-none focus:border-accent"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm text-text-secondary">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-lg border border-border-subtle bg-surface-elevated px-3 py-2 text-text-primary outline-none focus:border-accent"
            />
            <p className="mt-1 text-xs text-text-muted">At least 8 characters.</p>
          </div>

          {authError && <p className="text-sm text-danger">{authError}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-accent px-3 py-2 font-medium text-bg transition-colors hover:bg-accent-hover disabled:opacity-60"
          >
            {isSubmitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-text-secondary">
          Already have an account?{' '}
          <Link to="/login" className="text-accent hover:text-accent-hover">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
