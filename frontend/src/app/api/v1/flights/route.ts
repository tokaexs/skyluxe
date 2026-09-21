import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const origin = searchParams.get("origin") || "BOM";
    const destination = searchParams.get("destination") || "DWC";

    // Proxy to search handler
    const backendUrl = process.env.BACKEND_API_URL || "http://127.0.0.1:5000/api/v1";
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);

      const res = await fetch(`${backendUrl}/flights`, { signal: controller.signal }).catch(() => null);
      clearTimeout(timeoutId);

      if (res && res.ok) {
        const data = await res.json().catch(() => null);
        if (data) return NextResponse.json(data);
      }
    } catch {
      // Fallback
    }

    // Call search API logic
    const searchRes = await fetch(`${req.nextUrl.origin}/api/v1/flights/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ from: origin, to: destination, date: new Date().toISOString().split("T")[0] })
    }).catch(() => null);

    if (searchRes && searchRes.ok) {
      const data = await searchRes.json();
      return NextResponse.json(data);
    }

    return NextResponse.json([]);
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to fetch flights" }, { status: 500 });
  }
}
