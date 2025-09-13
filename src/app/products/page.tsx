async function getProducts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/products`, { cache: "no-store" });
  return res.json();
}

export default async function ProductsPage() {
  const products = await getProducts();
  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Healthcare Products</h1>
      <ul className="grid gap-4">
        {products.map((p: any) => (
          <li key={p.id} className="border rounded-xl p-4">
            <div className="font-medium">{p.name}</div>
            <div className="text-sm text-gray-600">{p.description}</div>
            <div className="mt-2">£{(p.priceCents/100).toFixed(2)}</div>
          </li>
        ))}
      </ul>
    </main>
  );
}
