import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const events = await prisma.event.findMany({
    orderBy: { dateTime: "asc" },
    include: { organiser: true, attendees: true }
  });

  return NextResponse.json({ events });
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const organiser = await prisma.organiser.upsert({
      where: { phone: data.organiserPhone },
      update: {
        name: data.organiserName,
        email: data.organiserEmail
      },
      create: {
        name: data.organiserName,
        phone: data.organiserPhone,
        email: data.organiserEmail
      }
    });

    const event = await prisma.event.create({
      data: {
        organiserId: organiser.id,
        title: data.title,
        description: data.description,
        dateTime: new Date(data.dateTime),
        city: data.city,
        venueLat: data.venueLat,
        venueLon: data.venueLon,
        ticketPrice: data.ticketPrice,
        expectedAttendees: data.expectedAttendees,
        minParticipants: data.minParticipants,
        coverageWeather: data.coverageWeather,
        coverageInstructor: data.coverageInstructor,
        coverageLowTurnout: data.coverageLowTurnout,
        refundPolicyType: data.refundPolicyType
      }
    });

    return NextResponse.json({ event }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}

