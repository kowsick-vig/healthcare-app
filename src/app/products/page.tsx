import Link from "next/link";
import { prisma } from "@/lib/db";
import AddButton from "./AddButton";

export default async function ProductsPage() {
  const items = await prisma.product.findMany({ where: { active: true }, orderBy: { createdAt: "desc" } });
  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Products</h1>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(p => (
          <li key={p.id} className="border rounded p-0 overflow-hidden">
            {/* Make the whole card clickable */}
            <Link
              href={`/products/${p.id}`}
              className="block p-4 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <div className="space-y-1">
                <div className="font-medium">{p.name}</div>
                <div className="text-sm text-gray-600">SKU: {p.sku}</div>
                <div className="text-sm">£{(p.priceCents/100).toFixed(2)}</div>
              </div>
            </Link>
            {/* Separate footer area with Add to Cart */}
            <div className="p-3 border-t flex items-center justify-between">
              <Link className="underline text-sm" href={`/products/${p.id}`}>View</Link>
              <AddButton product={{ id: p.id, name: p.name, priceCents: p.priceCents }} />
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
