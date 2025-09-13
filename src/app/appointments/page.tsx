"use client";
import { useState } from "react";

export default function AppointmentsPage() {
  const [patientEmail, setEmail] = useState("");
  const [startsAt, setStart] = useState("");
  const [endsAt, setEnd] = useState("");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    const res = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ patientEmail, startsAt, endsAt, notes }),
    });
    const data = await res.json();
    if (res.ok) setMessage("Booked!"); else setMessage(data.error || "Error");
  }

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Book an Appointment</h1>
      <form onSubmit={submit} className="grid gap-3">
        <input className="border p-2 rounded" placeholder="Patient email" value={patientEmail} onChange={e=>setEmail(e.target.value)} required />
        <label className="grid gap-1">
          <span className="text-sm">Starts at</span>
          <input className="border p-2 rounded" type="datetime-local" value={startsAt} onChange={e=>setStart(e.target.value)} required />
        </label>
        <label className="grid gap-1">
          <span className="text-sm">Ends at</span>
          <input className="border p-2 rounded" type="datetime-local" value={endsAt} onChange={e=>setEnd(e.target.value)} required />
        </label>
        <textarea className="border p-2 rounded" placeholder="Notes (optional)" value={notes} onChange={e=>setNotes(e.target.value)} />
        <button className="bg-black text-white rounded px-4 py-2" type="submit">Book</button>
      </form>
      {message && <p className="mt-3">{message}</p>}
    </main>
  );
}
