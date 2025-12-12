"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    organiserName: "",
    organiserPhone: "",
    organiserEmail: "",
    title: "",
    description: "",
    dateTime: "",
    city: "",
    venueLat: "",
    venueLon: "",
    ticketPrice: "499",
    expectedAttendees: "20",
    minParticipants: "8",
    coverageWeather: true,
    coverageInstructor: true,
    coverageLowTurnout: true,
    refundPolicyType: "REFUND_OR_RESCHEDULE"
  });

  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...form,
      ticketPrice: Number(form.ticketPrice),
      expectedAttendees: Number(form.expectedAttendees),
      minParticipants: Number(form.minParticipants),
      venueLat: form.venueLat ? Number(form.venueLat) : null,
      venueLon: form.venueLon ? Number(form.venueLon) : null
    };

    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      router.push("/");
      router.refresh();
    } else {
      alert("Error creating event");
    }

    setLoading(false);
  }

  return (
    <main>
      <h2 className="text-xl font-semibold mb-6">Create Protected Event</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ORGANISER */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className="bg-gray-900 border border-gray-700 px-3 py-2 rounded"
            placeholder="Organiser Name"
            value={form.organiserName}
            onChange={(e) => update("organiserName", e.target.value)}
            required
          />

          <input
            className="bg-gray-900 border border-gray-700 px-3 py-2 rounded"
            placeholder="WhatsApp Phone +91..."
            value={form.organiserPhone}
            onChange={(e) => update("organiserPhone", e.target.value)}
            required
          />
        </div>

        {/* EVENT BASICS */}
        <input
          className="w-full bg-gray-900 border border-gray-700 px-3 py-2 rounded"
          placeholder="Event Title"
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          required
        />

        <textarea
          className="w-full bg-gray-900 border border-gray-700 px-3 py-2 rounded"
          placeholder="Description"
          rows={3}
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
        />

        <input
          type="datetime-local"
          className="w-full bg-gray-900 border border-gray-700 px-3 py-2 rounded"
          value={form.dateTime}
          onChange={(e) => update("dateTime", e.target.value)}
          required
        />

        <input
          className="w-full bg-gray-900 border border-gray-700 px-3 py-2 rounded"
          placeholder="City"
          value={form.city}
          onChange={(e) => update("city", e.target.value)}
          required
        />

        {/* NUMBERS */}
        <div className="grid grid-cols-3 gap-4">
          <input
            type="number"
            className="bg-gray-900 border border-gray-700 px-3 py-2 rounded"
            placeholder="Ticket Price"
            value={form.ticketPrice}
            onChange={(e) => update("ticketPrice", e.target.value)}
          />

          <input
            type="number"
            className="bg-gray-900 border border-gray-700 px-3 py-2 rounded"
            placeholder="Expected Attendees"
            value={form.expectedAttendees}
            onChange={(e) => update("expectedAttendees", e.target.value)}
          />

          <input
            type="number"
            className="bg-gray-900 border border-gray-700 px-3 py-2 rounded"
            placeholder="Min Participants"
            value={form.minParticipants}
            onChange={(e) => update("minParticipants", e.target.value)}
          />
        </div>

        {/* PROTECTION TOGGLES */}
        <div className="space-y-2">
          <label>
            <input
              type="checkbox"
              checked={form.coverageWeather}
              onChange={(e) => update("coverageWeather", e.target.checked)}
            />{" "}
            Weather Disruptions
          </label>

          <label>
            <input
              type="checkbox"
              checked={form.coverageInstructor}
              onChange={(e) => update("coverageInstructor", e.target.checked)}
            />{" "}
            Instructor Cancellation
          </label>

          <label>
            <input
              type="checkbox"
              checked={form.coverageLowTurnout}
              onChange={(e) => update("coverageLowTurnout", e.target.checked)}
            />{" "}
            Low Turnout Protection
          </label>
        </div>

        {/* SUBMIT */}
        <button
          disabled={loading}
          className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded text-sm"
        >
          {loading ? "Creating..." : "Create Protected Event"}
        </button>
      </form>
    </main>
  );
}

