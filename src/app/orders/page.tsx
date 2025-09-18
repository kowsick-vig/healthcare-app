import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";

export default async function MyOrders() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/api/auth/signin?callbackUrl=/orders");
  const email = session.user.email!;

  const orders = await prisma.order.findMany({
    where: { userEmail: email },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">My Orders</h1>
      {orders.length === 0 ? (
        <p>You have no orders.</p>
      ) : (
        <ul className="space-y-2">
          {orders.map(o => (
            <li key={o.id} className="border rounded p-3">
              <div className="flex justify-between">
                <div>
                  <div className="font-medium">Order {o.id}</div>
                  <div className="text-sm text-gray-600">
                    {new Date(o.createdAt).toLocaleString()} • {o.items.length} items
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">£{(o.totalCents/100).toFixed(2)}</div>
                  <div className="text-sm border rounded px-2 inline-block">{o.status}</div>
                </div>
              </div>
              <ul className="mt-2 text-sm">
                {o.items.map(i => (
                  <li key={i.id}>
                    {i.productName} — £{(i.priceCents/100).toFixed(2)} × {i.qty}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
      <p className="text-sm"><Link className="underline" href="/products">Continue shopping →</Link></p>
    </main>
  );
}
