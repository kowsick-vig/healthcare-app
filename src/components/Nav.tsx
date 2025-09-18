'use client';
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Nav() {
  const { data } = useSession();
  const email = data?.user?.email || null;
  const role  = (data?.user as any)?.role || "PATIENT";

  return (
    <header className="border-b px-4 py-3 flex items-center gap-3 justify-between">
      <nav className="flex items-center gap-4">
        <Link href="/">Home</Link>
        <Link href="/products">Products</Link>
        <Link href="/cart">Cart</Link>
        <Link href="/portal">My Appointments</Link>
        {["ADMIN"].includes(role) && <Link href="/admin">Admin</Link>}
        {["PROVIDER","ADMIN"].includes(role) && <Link href="/provider">Provider</Link>}
      </nav>
      <div className="flex items-center gap-3">
        {email ? (
          <>
            <span className="text-sm text-gray-600">{email} ({role})</span>
            <button className="border px-3 py-1 rounded" onClick={() => signOut({ callbackUrl: "/" })}>Sign out</button>
          </>
        ) : (
          <button className="border px-3 py-1 rounded" onClick={() => signIn("credentials", { callbackUrl: "/" })}>
            Sign in
          </button>
        )}
      </div>
    </header>
  );
}
