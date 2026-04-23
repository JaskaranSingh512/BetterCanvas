import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { login } from '../../lib/api';

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('student@university.edu');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (submitError: any) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: 'var(--dashboard-card-bg)' }}>
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-xl p-8 space-y-5"
        style={{ backgroundColor: 'var(--dashboard-hover)', border: '1px solid var(--dashboard-border)' }}
      >
        <div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--dashboard-text-primary)' }}>
            BetterCanvas Login
          </h1>
          <p style={{ color: 'var(--dashboard-text-secondary)' }}>
            Sign in with your demo account.
          </p>
        </div>
        <label className="block">
          <span className="text-sm font-medium" style={{ color: 'var(--dashboard-text-primary)' }}>Email</span>
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1 w-full rounded-lg px-3 py-2 focus:outline-none focus:ring-2"
            style={{ backgroundColor: 'var(--dashboard-card-bg)', border: '1px solid var(--dashboard-border)', color: 'var(--dashboard-text-primary)' }}
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium" style={{ color: 'var(--dashboard-text-primary)' }}>Password</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1 w-full rounded-lg px-3 py-2 focus:outline-none focus:ring-2"
            style={{ backgroundColor: 'var(--dashboard-card-bg)', border: '1px solid var(--dashboard-border)', color: 'var(--dashboard-text-primary)' }}
          />
        </label>
        {error && (
          <div className="text-sm" style={{ color: 'var(--dashboard-accent-red)' }}>
            {error}
          </div>
        )}
        <button
          disabled={loading}
          className="w-full min-h-[44px] rounded-lg font-semibold focus:outline-none focus:ring-2"
          style={{ backgroundColor: 'var(--dashboard-info)', color: '#fff', opacity: loading ? 0.8 : 1 }}
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
