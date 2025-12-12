import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getWeatherRiskForEvent } from "@/lib/weather";
import { broadcastWhatsApp } from "@/lib/whatsapp";
import { EventStatus, LogType } from "@prisma/client";

export async function GET() {
  const now = new Date();
  const in12h = new Date(now.getTime() + 12 * 60 * 60 * 1000);

  const events = await prisma.event.findMany({
    where: {
      status: EventStatus.SCHEDULED,
      dateTime: {
        gte: now,
        lte: in12h
      }
    },
    include: { organiser: true, attendees: true }
  });

  for (const event of events) {
    // Weather check
    const risk = await getWeatherRiskForEvent();

    if (risk === "HIGH" && event.coverageWeather) {
      await prisma.event.update({
        where: { id: event.id },
        data: { status: EventStatus.AT_RISK }
      });

      await prisma.eventLog.create({
        data: {
          eventId: event.id,
          type: LogType.WEATHER_WARNING,
          message: "High weather risk detected"
        }
      });

      await broadcastWhatsApp(
        [event.organiser.phone],
        `⚠️ EventShield Alert: High weather risk for "${event.title}". Reply:\n1 - Continue\n2 - Reschedule\n3 - Cancel & start refund flow`
      );
    }

    // Low turnout check (simple)
    if (
      event.coverageLowTurnout &&
      event.attendees.length < event.minParticipants
    ) {
      await prisma.event.update({
        where: { id: event.id },
        data: { status: EventStatus.AT_RISK }
      });

      await prisma.eventLog.create({
        data: {
          eventId: event.id,
          type: LogType.LOW_TURNOUT_WARNING,
          message: "Low turnout detected"
        }
      });

      await broadcastWhatsApp(
        [event.organiser.phone],
        `⚠️ Low turnout for "${event.title}". Only ${event.attendees.length} attendees.\nReply:\n1 - Continue\n2 - Reschedule\n3 - Cancel`
      );
    }
  }

  return NextResponse.json({ ok: true });
}

