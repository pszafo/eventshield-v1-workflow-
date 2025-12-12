import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  console.log("WhatsApp Webhook Received:", body);

  // TODO: Match organiser reply (1/2/3)
  // For now, no-op.

  return NextResponse.json({ ok: true });
}

