
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { baseApi } from '../config/baseApi';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    shopNames: ['', '', '', '']
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('shop')) {
      const index = parseInt(name.split('-')[1]);
      const newShopNames = [...formData.shopNames];
      newShopNames[index] = value;
      setFormData({ ...formData, shopNames: newShopNames });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Filter out empty shop names and ensure at least 3
    const validShopNames = formData.shopNames.filter(name => name.trim());
    if (validShopNames.length < 3) {
      setError('At least 3 shop names are required');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(baseApi + '/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          shopNames: validShopNames
        })
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/signin', { state: { message: 'Account created successfully! Please sign in.' } });
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.log("🚀 ~ error:", error)
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={formData.username}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={formData.password}
                onChange={handleChange}
              />
              <p className="mt-1 text-xs text-gray-500">
                At least 8 characters with one number and one special character
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shop Names (minimum 3 required)
              </label>
              {formData.shopNames.map((shop, index) => (
                <input
                  key={index}
                  name={`shop-${index}`}
                  type="text"
                  placeholder={`Shop ${index + 1}${index < 3 ? ' (required)' : ' (optional)'}`}
                  className="mt-1 mb-2 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={shop}
                  onChange={handleChange}
                />
              ))}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </div>

          <div className="text-center">
            <Link to="/signin" className="text-indigo-600 hover:text-indigo-500">
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;