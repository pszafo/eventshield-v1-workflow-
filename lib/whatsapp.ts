export async function sendWhatsAppMessage(to: string, msg: string) {
  console.log(`[WhatsApp] → ${to}: ${msg}`);
}

export async function broadcastWhatsApp(numbers: string[], msg: string) {
  await Promise.all(numbers.map((n) => sendWhatsAppMessage(n, msg)));
}

