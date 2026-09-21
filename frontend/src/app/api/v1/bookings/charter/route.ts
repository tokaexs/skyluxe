import { NextRequest, NextResponse } from "next/server";
import { saveBooking, StoredBooking } from "@/lib/bookingsService";

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("user_id") || "user_active";
    const body = await req.json().catch(() => ({}));

    const backendUrl = process.env.BACKEND_API_URL || "http://127.0.0.1:5000/api/v1";
    try {
      const backendRes = await fetch(`${backendUrl}/bookings/charter?user_id=${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(2000),
      });
      if (backendRes.ok) {
        const data = await backendRes.json();
        return NextResponse.json(data);
      }
    } catch {
      // Backend offline; create local charter booking
    }

    const {
      aircraft_id = "Gulfstream G700",
      legs = [{ from: "BOM", to: "DWC", date: new Date().toISOString().split("T")[0] }],
      catering = "VIP Catering",
      chauffeur = "Executive Transfer",
      security = "VIP Fast Track",
      price = 51500,
    } = body;

    const bookingId = `CH-${Date.now().toString().slice(-6)}${Math.floor(1000 + Math.random() * 9000)}`;
    const pnr = `SKL${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    const newBooking: StoredBooking = {
      _id: bookingId,
      id: bookingId,
      user: userId,
      type: "private",
      status: "Confirmed",
      bookingReference: pnr,
      total_amount: Number(price),
      passengers: [
        {
          firstName: "SkyLuxe",
          lastName: "VIP",
          age: 38,
          nationality: "Indian",
        },
      ],
      aircraftModel: aircraft_id,
      legs: legs,
      catering: catering,
      chauffeur: chauffeur,
      security: security,
      boardingPass: {
        boardingTime: "08:30",
        gate: "VIP Hangar Gate 1",
        terminal: "Private Aviation FBO",
        seat: "VIP Suite 01",
        pnr: pnr,
        qrData: `SKYLUXE-CHARTER-${pnr}-${bookingId}`,
      },
      createdAt: new Date().toISOString(),
    };

    saveBooking(newBooking);
    return NextResponse.json(newBooking);
  } catch (error: any) {
    console.error("Error creating charter booking:", error);
    return NextResponse.json(
      { message: error.message || "Failed to process charter booking" },
      { status: 500 }
    );
  }
}
