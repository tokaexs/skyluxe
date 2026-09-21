import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("user_id") || "user_active";

  const backendUrl = process.env.BACKEND_API_URL || "http://127.0.0.1:5000/api/v1";
  try {
    const backendRes = await fetch(`${backendUrl}/notifications?user_id=${userId}`, {
      signal: AbortSignal.timeout(2000),
    });
    if (backendRes.ok) {
      const data = await backendRes.json();
      return NextResponse.json(data);
    }
  } catch {
    // Backend offline
  }

  return NextResponse.json([
    {
      id: "n1",
      title: "Flight Prepared",
      message: "Your upcoming flight itinerary is synced and confirmed.",
      time: "Just now",
      unread: true,
      type: "flight",
    },
  ]);
}
