'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('Signing in...');
    const res = await signIn('credentials', { email, redirect: false });
    if (res?.error) setStatus(`Error: ${res.error}`);
    else if (res?.ok) { setStatus('Signed in! Redirecting…'); window.location.href = '/'; }
    else setStatus('Unknown response, check server logs.');
  }

  return (
    <main className="max-w-sm mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Dev Login</h1>
      <form onSubmit={onSubmit} className="grid gap-3">
        <input className="border rounded p-2" type="email" placeholder="you@example.com"
               value={email} onChange={e=>setEmail(e.target.value)} required />
        <button className="bg-black text-white rounded px-4 py-2" type="submit">Sign in</button>
      </form>
      {status && <p className="mt-3">{status}</p>}
      <p className="mt-6 text-sm text-gray-600">Or try email magic link at <code>/api/auth/signin</code>.</p>
    </main>
  );
}
