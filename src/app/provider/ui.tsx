'use client';
import { useEffect, useState } from "react";

export default function ProviderUI({ email }: { email: string }) {
  const [list, setList] = useState<any[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formKey, setFormKey] = useState(0);  // remount form to clear it

  async function refresh() {
    const r = await fetch("/api/appointments", { cache: "no-store" });
    setList(await r.json());
  }
  useEffect(() => { refresh(); }, []);

  async function onCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);
    setSaving(true);

    // Read values BEFORE any await
    const fd = new FormData(e.currentTarget);
    const payload = {
      patientEmail: String(fd.get("patientEmail") || ""),
      startsAt:     String(fd.get("startsAt")     || ""),
      endsAt:       String(fd.get("endsAt")       || ""),
      notes:        String(fd.get("notes")        || ""),
    };

    try {
      const r = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) { setErr(j?.error || "Failed to save"); return; }

      // Clear form by remounting it (avoids .reset() + pooled events)
      setFormKey(k => k + 1);
      await refresh();
    } catch (e: any) {
      setErr(e?.message || "Network error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="p-6 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Provider Dashboard</h1>
        <p className="text-sm text-gray-600">Signed in as {email}</p>
      </header>

      <section className="max-w-xl space-y-3">
        <h2 className="text-lg font-medium">Create Appointment</h2>
        <p className="text-sm text-gray-500">
          Tip: use the date pickers. If typing, use <code>YYYY-MM-DDTHH:mm</code> or <code>DD/MM/YYYY, HH:mm</code>.
        </p>
        {err && <p className="text-red-600">{err}</p>}
        <form key={formKey} onSubmit={onCreate} className="space-y-2">
          <input name="patientEmail" type="email" placeholder="patient@example.com" required className="border p-2 w-full"/>
          <input name="startsAt" type="datetime-local" required className="border p-2 w-full"/>
          <input name="endsAt" type="datetime-local" required className="border p-2 w-full"/>
          <textarea name="notes" placeholder="Notes (optional)" className="border p-2 w-full"/>
          <button className="border px-4 py-2 rounded" disabled={saving} type="submit">
            {saving ? "Saving..." : "Save"}
          </button>
        </form>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-medium">Upcoming Appointments</h2>
        <ul className="space-y-2">
          {list.map(a => (
            <li key={a.id} className="border p-3 rounded">
              <div><b>{new Date(a.startsAt).toLocaleString()}</b> → {new Date(a.endsAt).toLocaleString()}</div>
              <div className="text-sm text-gray-500">{a.patientEmail}</div>
              {a.notes && <div className="text-sm">{a.notes}</div>}
            </li>
          ))}
          {list.length === 0 && <li className="text-sm text-gray-500">No appointments yet.</li>}
        </ul>
      </section>
    </main>
  );
}
