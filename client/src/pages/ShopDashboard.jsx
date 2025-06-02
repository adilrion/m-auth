/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';

const ShopDashboard = ({ shopName, user }) => {
  console.log("🚀 ~ user:", user)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    verifyShopAccess();
  }, []);

  const verifyShopAccess = async () => {
    try {
      const response = await fetch(`/api/shop/dashboard/${shopName}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        setError('Unauthorized access or shop not found');
      }
    } catch (error) {
      console.log("🚀 ~ error:", error)
      setError('Failed to verify shop access');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Verifying authentication..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <a
            href="http://localhost:5173"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Go to Main Dashboard
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900 capitalize">
              This is {shopName} shop
            </h1>
            <a
              href="http://localhost:5173"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
            >
              Back to Main Dashboard
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Welcome to {shopName} Dashboard
            </h2>
            <p className="text-gray-600">
              Here you can manage your shop settings, view orders, and more.
            </p>
            {/* Additional shop management features can be added here */}
          </div>
        </div>
      </main>
      <footer className="bg-white shadow mt-6">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Your Company. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ShopDashboard;