import { useAuth } from '../hooks/useAuth';

export const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <section className="dashboard">
      <h1>Dashboard</h1>
      <p className="hero-sub">You're logged in. This route is protected by ProtectedRoute.</p>

      <div className="profile-card">
        <div className="profile-row">
          <span className="profile-label">Name</span>
          <span>{user?.name}</span>
        </div>
        <div className="profile-row">
          <span className="profile-label">Email</span>
          <span>{user?.email}</span>
        </div>
        <div className="profile-row">
          <span className="profile-label">Role</span>
          <span>{user?.role}</span>
        </div>
        <div className="profile-row">
          <span className="profile-label">Joined</span>
          <span>{user ? new Date(user.createdAt).toLocaleDateString() : ''}</span>
        </div>
      </div>
    </section>
  );
};
