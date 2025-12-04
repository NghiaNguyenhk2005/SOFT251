import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="container">
      <div className="card">
        <h1>Dashboard</h1>
        <p>Welcome, <strong>{user?.username || 'User'}</strong>!</p>
        <p>Email: {user?.email}</p>
        <p>User ID: {user?.id}</p>
        
        <div style={{ marginTop: '2rem' }}>
          <p>This is a protected page. Only authenticated users can access it.</p>
          <button className="secondary" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
