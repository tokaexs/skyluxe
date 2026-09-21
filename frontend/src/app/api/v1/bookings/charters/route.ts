import { NextRequest, NextResponse } from "next/server";
import { getBookingsByUser } from "@/lib/bookingsService";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("user_id") || "user_active";

  const backendUrl = process.env.BACKEND_API_URL || "http://127.0.0.1:5000/api/v1";
  try {
    const backendRes = await fetch(`${backendUrl}/bookings/charters?user_id=${userId}`, {
      signal: AbortSignal.timeout(2000),
    });
    if (backendRes.ok) {
      const data = await backendRes.json();
      return NextResponse.json(data);
    }
  } catch {
    // Backend offline
  }

  const charters = getBookingsByUser(userId, "private");
  return NextResponse.json(charters);
}
