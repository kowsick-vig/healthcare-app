import Link from "next/link";
export default function Home() {
  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold">HealthCo Starter</h1>
      <p className="mt-2 text-gray-600">Browse products and book appointments.</p>
      <div className="mt-4 flex gap-4">
        <Link href="/products" className="underline">Products</Link>
        <Link href="/appointments" className="underline">Appointments</Link>
      </div>
    </main>
  );
}
