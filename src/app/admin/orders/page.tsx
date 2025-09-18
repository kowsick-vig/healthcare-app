import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";

export default async function AdminOrders() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role || "PATIENT";
  if (!session?.user) redirect("/api/auth/signin?callbackUrl=/admin/orders");
  if (role !== "ADMIN") return <main className="p-6">Not authorized.</main>;

  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Orders</h1>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <table className="w-full border border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Date</th>
              <th className="border p-2 text-left">Order ID</th>
              <th className="border p-2 text-left">User</th>
              <th className="border p-2 text-right">Total</th>
              <th className="border p-2 text-left">Status</th>
              <th className="border p-2">Items</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id}>
                <td className="border p-2">{new Date(o.createdAt).toLocaleString()}</td>
                <td className="border p-2">
                  <Link className="underline" href={`/admin/orders/${o.id}`}>{o.id}</Link>
                </td>
                <td className="border p-2">{o.userEmail}</td>
                <td className="border p-2 text-right">£{(o.totalCents/100).toFixed(2)}</td>
                <td className="border p-2">{o.status}</td>
                <td className="border p-2">{o.items.reduce((s,i)=>s+i.qty,0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
