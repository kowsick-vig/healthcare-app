'use client';
import { useEffect, useState } from "react";

type Item = { productId: string; name: string; priceCents: number; qty: number };

export default function CartPage() {
  const key = "cart.v1";
  const [items, setItems] = useState<Item[]>([]);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    setItems(JSON.parse(localStorage.getItem(key) || "[]"));
  }, []);

  const total = items.reduce((sum, i) => sum + i.priceCents * i.qty, 0);

  function save(next: Item[]) {
    setItems(next);
    localStorage.setItem(key, JSON.stringify(next));
  }

  function inc(i: number) {
    const next = [...items];
    next[i].qty += 1;
    save(next);
  }
  function dec(i: number) {
    const next = [...items];
    next[i].qty = Math.max(1, next[i].qty - 1);
    save(next);
  }
  function remove(i: number) {
    const next = items.filter((_, idx) => idx !== i);
    save(next);
  }

  async function checkout() {
    setError(null); setPlacing(true); setOrderId(null);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type":"application/json" },
        body: JSON.stringify({ items: items.map(i => ({ productId: i.productId, qty: i.qty })) }),
      });
      const j = await res.json().catch(()=>({}));
      if (!res.ok) { setError(j?.error || "Checkout failed"); setPlacing(false); return; }
      setOrderId(j.orderId);
      localStorage.setItem(key, JSON.stringify([]));
      setItems([]);
    } catch (e:any) {
      setError(e?.message || "Network error");
    } finally {
      setPlacing(false);
    }
  }

  return (
    <main className="p-6 space-y-4 max-w-2xl">
      <h1 className="text-2xl font-semibold">Cart</h1>
      {items.length === 0 ? <p>Your cart is empty.</p> : (
        <>
          <ul className="space-y-2">
            {items.map((it, i) => (
              <li key={it.productId} className="border rounded p-3 flex items-center justify-between gap-2">
                <div>
                  <div className="font-medium">{it.name}</div>
                  <div className="text-sm text-gray-600">£{(it.priceCents/100).toFixed(2)} × {it.qty}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="border px-2 rounded" onClick={() => dec(i)}>-</button>
                  <span>{it.qty}</span>
                  <button className="border px-2 rounded" onClick={() => inc(i)}>+</button>
                  <button className="border px-3 py-1 rounded" onClick={() => remove(i)}>Remove</button>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between">
            <div className="text-lg font-medium">Total: £{(total/100).toFixed(2)}</div>
            <button className="border px-4 py-2 rounded" disabled={placing} onClick={checkout}>
              {placing ? "Placing..." : "Checkout"}
            </button>
          </div>
          {error && <p className="text-red-600">{error}</p>}
          {orderId && <p className="text-green-700">Order placed: {orderId}</p>}
        </>
      )}
    </main>
  );
}
