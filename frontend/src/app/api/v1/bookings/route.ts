import { NextRequest, NextResponse } from "next/server";
import { saveBooking, getBookingsByUser, StoredBooking, getAirlineInfo } from "@/lib/bookingsService";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("user_id") || "user_active";

  const backendUrl = process.env.BACKEND_API_URL || "http://127.0.0.1:5000/api/v1";
  try {
    const backendRes = await fetch(`${backendUrl}/bookings?user_id=${userId}`, {
      signal: AbortSignal.timeout(2000),
    });
    if (backendRes.ok) {
      const data = await backendRes.json();
      return NextResponse.json(data);
    }
  } catch {
    // Backend offline; return locally stored bookings
  }

  const localBookings = getBookingsByUser(userId, "commercial");
  return NextResponse.json(localBookings);
}

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("user_id") || "user_active";
    const body = await req.json().catch(() => ({}));

    const backendUrl = process.env.BACKEND_API_URL || "http://127.0.0.1:5000/api/v1";
    try {
      const backendRes = await fetch(`${backendUrl}/bookings?user_id=${userId}`, {
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
      // Backend offline; create local booking
    }

    const { flight_id = "SG-101", total_amount = 5000, seat_number = "12A", passengers = [] } = body;
    const bookingId = `BK-${Date.now().toString().slice(-6)}${Math.floor(1000 + Math.random() * 9000)}`;
    const pnr = `SKL${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const airlineInfo = getAirlineInfo(flight_id);

    const newBooking: StoredBooking = {
      _id: bookingId,
      id: bookingId,
      user: userId,
      type: "commercial",
      status: "Confirmed",
      bookingReference: pnr,
      total_amount: Number(total_amount),
      class: body.class || "economy",
      seat_number: seat_number,
      passengers: passengers.length > 0 ? passengers : [
        {
          firstName: "SkyLuxe",
          lastName: "Member",
          age: 32,
          nationality: "Indian",
        },
      ],
      flight: {
        _id: flight_id,
        flightNumber: flight_id,
        aircraft: flight_id.startsWith("SG") ? "Boeing 737-800" : "Airbus A320neo",
        airline: {
          airlineName: airlineInfo.name,
          logoUrl: airlineInfo.logo,
          brandColor: airlineInfo.brandColor,
          iataCode: airlineInfo.iata,
        },
        origin: "BOM",
        destination: "DEL",
        departureTime: new Date().toISOString(),
        arrivalTime: new Date(Date.now() + 2 * 3600 * 1000).toISOString(),
      },
      boardingPass: {
        boardingTime: "08:15",
        gate: "Gate 12",
        terminal: "Terminal 2",
        seat: seat_number,
        pnr: pnr,
        qrData: `SKYLUXE-BOARDING-${pnr}-${bookingId}`,
      },
      createdAt: new Date().toISOString(),
    };

    saveBooking(newBooking);
    return NextResponse.json(newBooking);
  } catch (error: any) {
    console.error("Error creating commercial booking:", error);
    return NextResponse.json(
      { message: error.message || "Failed to process commercial booking" },
      { status: 500 }
    );
  }
}
