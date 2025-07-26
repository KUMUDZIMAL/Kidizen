'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.status === 200) {
        const userResponse = await fetch('/api/auth/user', {
          method: 'GET',
          credentials: 'include',
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          const redirectPath = userData.isTeenUser
            ? '/sweetworld2'
            : '/sweetworld';
          router.push(redirectPath);
        } else {
          throw new Error('Failed to fetch user data');
        }
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch {
      setError('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex h-screen w-full items-center justify-center bg-white  overflow-hidden">
      {/* Subtle Blurred Circles */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-72 h-72 bg-purple-400/40 rounded-full blur-2xl animate-blob1"></div>
        <div className="absolute top-[5%] right-[-5%] w-80 h-80 bg-purple-300/40 rounded-full blur-2xl animate-blob2"></div>
        <div className="absolute bottom-[-15%] left-[15%] w-64 h-64 bg-purple-300/40 rounded-full blur-2xl animate-blob3"></div>
      </div>

      {/* Centered Login Form */}
      <div className="relative z-10 flex justify-center items-center w-full">
        <div className="w-80 p-6 bg-white/90 rounded-2xl backdrop-blur-sm shadow-lg">
          <h2 className="text-3xl font-bold text-center text-purple-600 mb-6">
            Login
          </h2>
          {error && (
            <p className="text-red-500 text-center mb-4 text-sm">
              {error}
            </p>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 w-full rounded-lg border-2 border-transparent bg-gray-100 p-2 text-gray-800 placeholder-gray-600 focus:border-purple-600 focus:bg-white focus:outline-none transition"
                placeholder="Enter your username"
                required
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border-2 border-transparent bg-gray-100 p-2 text-gray-800 placeholder-gray-600 focus:border-purple-600 focus:bg-white focus:outline-none transition"
                placeholder="Enter your password"
                required
              />
            </div>
            <button
              type="submit"
              className="flex w-full items-center justify-center rounded-full bg-purple-600 px-4 py-2 text-lg font-semibold text-white shadow-md transition hover:bg-purple-700 disabled:opacity-70"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          {/* Forgot Password & Sign Up Links */}
          <div className="mt-4 text-center">
            <a
              href="/auth/ForgotPassword"
              className="text-sm text-purple-600 hover:underline"
            >
              Forgot Password?
            </a>
            <p className="mt-2 text-sm text-gray-700">
              Don't have an account?{' '}
              <a
                href="/auth/register"
                className="text-purple-600 font-medium hover:underline"
              >
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
