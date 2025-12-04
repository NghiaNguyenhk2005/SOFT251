import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="container">
      <div className="card">
        <span className="admin-badge">🔐 ADMIN CLIENT - PORT 3001</span>
        <h1><span className="highlight">Admin</span> Dashboard</h1>
        
        {user && (
          <div className="sso-indicator">
            ✓ Authenticated via CAS SSO
          </div>
        )}
        
        <p>Welcome to the Admin Dashboard, <strong>{user?.username || 'User'}</strong>!</p>
        <p>Email: {user?.email}</p>
        <p>User ID: {user?.id}</p>
        
        <div style={{ marginTop: '2rem' }}>
          <p>This is the <strong>Admin Client</strong> (running on port 3001).</p>
          <p>Notice that you didn't need to enter credentials again if you already logged in on the main client!</p>
          
          <div className="info-box">
            <strong>🎯 SSO in Action:</strong><br/>
            Both clients (port 3000 and 3001) share the same CAS session via cookies. When you log in once, you're authenticated everywhere!
          </div>
          
          <button className="secondary" onClick={logout}>
            Logout from Admin
          </button>
          
          <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
            <strong>Note:</strong> Logging out here will end your session across all clients.
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
