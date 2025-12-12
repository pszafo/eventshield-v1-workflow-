import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { EventStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const events = await prisma.event.findMany({
    orderBy: { dateTime: "asc" },
    include: {
      organiser: true,
      attendees: true
    }
  });

  return (
    <main>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Your Events</h2>
        <Link
          href="/events/new"
          className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-md text-sm"
        >
          + Create Protected Event
        </Link>
      </div>

      {events.length === 0 && (
        <p className="text-gray-400">No events yet. Create one to begin.</p>
      )}

      <div className="space-y-4">
        {events.map((e) => (
          <div
            key={e.id}
            className="border border-gray-700 p-4 rounded-lg"
          >
            <div className="flex justify-between">
              <div>
                <h3 className="font-semibold">{e.title}</h3>
                <p className="text-xs text-gray-400">
                  {new Date(e.dateTime).toLocaleString()} · {e.city}
                </p>
              </div>

              <span
                className={`px-2 py-1 rounded text-xs ${
                  e.status === "SCHEDULED"
                    ? "bg-green-900 text-green-200"
                    : e.status === "AT_RISK"
                    ? "bg-yellow-900 text-yellow-200"
                    : e.status === "CANCELLED"
                    ? "bg-red-900 text-red-200"
                    : "bg-gray-700 text-gray-300"
                }`}
              >
                {e.status}
              </span>
            </div>

            <p className="text-sm mt-1">
              Ticket ₹{e.ticketPrice} · Expected {e.expectedAttendees} · Min{" "}
              {e.minParticipants}
            </p>
            <p className="text-xs text-gray-400">
              Organiser: {e.organiser.name} ({e.organiser.phone})
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}

