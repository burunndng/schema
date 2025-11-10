import React, { useState } from 'react';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { authService } from '../services/authService';
import { User } from '../types/auth';

interface LoginPageProps {
  onLoginSuccess: (user: User) => void;
  onSwitchToRegister: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!email || !password) {
      setError('Email and password are required');
      setLoading(false);
      return;
    }

    // Attempt login
    const user = authService.login(email, password);

    if (!user) {
      setError('Invalid email or password');
      setLoading(false);
      return;
    }

    onLoginSuccess(user);
  };

  const handleDemoLogin = () => {
    setLoading(true);
    const user = authService.login('demo@burundanga.com', 'demo123');
    if (user) {
      onLoginSuccess(user);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">Login</h2>
        <p className="text-[var(--text-secondary)] text-center mb-6">Welcome back to Burundanga</p>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-white mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[var(--primary-500)]"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[var(--primary-500)]"
              disabled={loading}
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--primary-500)] hover:bg-[var(--primary-600)] text-white font-semibold py-2"
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <div className="mt-4">
          <button
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 rounded-lg transition-colors"
          >
            Try Demo Account
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-[var(--text-secondary)] text-sm">
            Don't have an account?{' '}
            <button
              onClick={onSwitchToRegister}
              className="text-[var(--primary-500)] hover:text-[var(--primary-600)] font-semibold"
            >
              Register here
            </button>
          </p>
        </div>

        <div className="mt-4 text-center text-xs text-[var(--text-secondary)]">
          <p>Demo credentials: demo@burundanga.com / demo123</p>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
