import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Home() {
  const { user, logout, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="container">
        <div className="card loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <h1>CAS SSO Demo - Home</h1>
        <p>Welcome to the CAS Single Sign-On demonstration client.</p>
        
        {user ? (
          <div>
            <p>You are logged in as: <strong>{user.username}</strong></p>
            <Link to="/dashboard">
              <button>Go to Dashboard</button>
            </Link>
            <button className="secondary" onClick={logout}>
              Logout
            </button>
          </div>
        ) : (
          <div>
            <p>You are not logged in.</p>
            <Link to="/dashboard">
              <button>Login (via CAS)</button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
