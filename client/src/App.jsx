import { useEffect, useState } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import LoadingSpinner from './components/LoadingSpinner';
import { baseApi } from './config/baseApi';
import Dashboard from './pages/Dashboard';
import ShopDashboard from './pages/ShopDashboard';
import Signin from './pages/Signin';
import Signup from './pages/Signup';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubdomain, setIsSubdomain] = useState(false);

  useEffect(() => {
    checkAuth();
    checkSubdomain();
  }, []);

  const checkSubdomain = () => {
    const hostname = window.location.hostname;
    const isSubdomainCheck = hostname !== 'localhost' && hostname.endsWith('.localhost');
    setIsSubdomain(isSubdomainCheck);
  };

  const checkAuth = async () => {
    try {
      const response = await fetch(baseApi + '/api/auth/verify', {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  // Handle subdomain routing
  if (isSubdomain) {
    const shopName = window.location.hostname.split('.')[0];
    return <ShopDashboard shopName={shopName} user={user} />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route
            path="/signup"
            element={user ? <Navigate to="/dashboard" /> : <Signup />}
          />
          <Route
            path="/signin"
            element={user ? <Navigate to="/dashboard" /> : <Signin setUser={setUser} />}
          />
          <Route
            path="/dashboard"
            element={user ? <Dashboard user={user} setUser={setUser} /> : <Navigate to="/signin" />}
          />
          <Route path="/" element={<Navigate to="/signin" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;