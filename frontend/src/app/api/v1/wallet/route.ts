import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("user_id") || "user_active";

  const backendUrl = process.env.BACKEND_API_URL || "http://127.0.0.1:5000/api/v1";
  try {
    const backendRes = await fetch(`${backendUrl}/wallet?user_id=${userId}`, {
      signal: AbortSignal.timeout(2000),
    });
    if (backendRes.ok) {
      const data = await backendRes.json();
      return NextResponse.json(data);
    }
  } catch {
    // Backend offline
  }

  return NextResponse.json({
    balance: 75000,
    currency: "USD",
    transactions: [
      {
        id: "TX-1001",
        title: "Welcome Jetsetter Credit",
        date: new Date().toISOString().split("T")[0],
        amount: 75000,
        type: "credit",
      },
    ],
  });
}
