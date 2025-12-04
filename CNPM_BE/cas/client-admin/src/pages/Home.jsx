import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Home() {
  const { user, logout, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="container">
        <div className="card loading" style={{background: 'white', color: '#666'}}>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <span className="admin-badge">🔐 ADMIN CLIENT</span>
        <h1>CAS SSO Demo - <span className="highlight">Admin Portal</span></h1>
        <p>Welcome to the Admin Client (Port 3001) - demonstrating true SSO.</p>
        
        {user ? (
          <div>
            {user.username && (
              <div className="sso-indicator">
                ✓ SSO Active - Logged in as: {user.username}
              </div>
            )}
            <p>You are authenticated via the shared CAS session!</p>
            <Link to="/dashboard">
              <button>Go to Admin Dashboard</button>
            </Link>
            <button className="secondary" onClick={logout}>
              Logout
            </button>
            
            <div className="info-box">
              <strong>💡 SSO Demo:</strong><br/>
              If you logged in on the main client (port 3000), you should already be authenticated here without entering credentials again!
            </div>
          </div>
        ) : (
          <div>
            <p>You are not logged in to the Admin Portal.</p>
            <Link to="/dashboard">
              <button>Login to Admin (via CAS)</button>
            </Link>
            
            <div className="info-box">
              <strong>💡 Try this:</strong><br/>
              1. Login on the main client (port 3000)<br/>
              2. Then open this admin client (port 3001)<br/>
              3. You'll be automatically logged in! That's SSO! 🎉
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
