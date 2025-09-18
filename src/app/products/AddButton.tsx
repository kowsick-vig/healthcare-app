'use client';

export default function AddButton({ product }: { product: { id: string; name: string; priceCents: number } }) {
  function add() {
    const key = "cart.v1";
    const cart = JSON.parse(localStorage.getItem(key) || "[]");
    const i = cart.findIndex((x: any) => x.productId === product.id);
    if (i >= 0) cart[i].qty += 1;
    else cart.push({ productId: product.id, name: product.name, priceCents: product.priceCents, qty: 1 });
    localStorage.setItem(key, JSON.stringify(cart));
    alert("Added to cart");
  }
  return (
    <button className="border px-3 py-1 rounded" onClick={add}>
      Add to Cart
    </button>
  );
}
