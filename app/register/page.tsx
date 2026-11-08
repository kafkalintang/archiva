'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Archive, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { register } from '@/lib/auth';
import { ApiError } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await register(form);
      router.push('/app');
      router.refresh();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* KIRI: VISUAL */}
      <div className="hidden lg:flex flex-1 bg-sidebar-gradient items-center justify-center p-12 relative overflow-hidden order-2">
        <div className="relative text-center text-white max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
            <Archive className="w-8 h-8" strokeWidth={2} />
          </div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Start archiving today.
          </h2>
          <p className="text-sm text-white/70 mt-3">
            Create your free account and bring every file, note, and memory
            into one beautiful place.
          </p>
          <ul className="mt-6 space-y-2 text-left inline-block text-sm text-white/80">
            {[
              'Unlimited notes & folders',
              'Nine note templates',
              'Personal media gallery',
            ].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-white/70" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* KANAN: FORM */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white order-1">
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center gap-2 mb-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-navy to-royal flex items-center justify-center shadow-sm">
              <Archive className="w-5 h-5 text-white" strokeWidth={2.2} />
            </div>
            <span className="text-lg font-semibold text-navy">ARCHIVA</span>
          </Link>

          <h1 className="text-2xl font-semibold text-navy tracking-tight">
            Create your account
          </h1>
          <p className="text-sm text-slate-soft mt-1.5">
            It only takes a minute.
          </p>

          {error && (
            <div className="mt-6 flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="block text-sm font-medium text-navy mb-1.5">
                Full name
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="Jane Doe"
                className="w-full px-4 py-2.5 rounded-xl border border-line bg-white text-sm focus:border-royal focus:ring-2 focus:ring-royal/20 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-navy mb-1.5">
                Email
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-line bg-white text-sm focus:border-royal focus:ring-2 focus:ring-royal/20 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-navy mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, password: e.target.value }))
                  }
                  placeholder="At least 6 characters"
                  className="w-full px-4 py-2.5 pr-10 rounded-xl border border-line bg-white text-sm focus:border-royal focus:ring-2 focus:ring-royal/20 outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-soft hover:text-navy transition"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-navy to-royal text-white font-medium text-sm shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed transition-all"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-soft">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-medium text-royal hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}