'use client';
import { useEffect, useState } from "react";

export default function PortalUI({ email }: { email: string }) {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setLoading(true);
    const r = await fetch("/api/appointments?me=1", { cache: "no-store" });
    setList(await r.json());
    setLoading(false);
  }
  useEffect(() => { refresh(); }, []);

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">My Appointments</h1>
      <p className="text-sm text-gray-600">Signed in as {email}</p>
      {loading ? <p>Loading…</p> : (
        <ul className="space-y-2">
          {list.map(a => (
            <li key={a.id} className="border p-3 rounded">
              <div><b>{new Date(a.startsAt).toLocaleString()}</b> → {new Date(a.endsAt).toLocaleString()}</div>
              <div className="text-sm text-gray-500">{a.patientEmail}</div>
              {a.notes && <div className="text-sm">{a.notes}</div>}
            </li>
          ))}
          {list.length === 0 && <li className="text-sm text-gray-500">You have no appointments.</li>}
        </ul>
      )}
    </main>
  );
}
