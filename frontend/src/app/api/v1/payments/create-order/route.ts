import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { amount, type = "commercial", itemId, userId } = body;

    const backendUrl = process.env.BACKEND_API_URL || "http://127.0.0.1:5000/api/v1";
    try {
      const backendRes = await fetch(`${backendUrl}/payments/create-order`, {
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
      // Backend not running; handle locally
    }

    const numericAmount = Number(amount) || 5000;
    // Standard INR paise conversion (1 USD = 83 INR, or if INR 1 INR = 100 paise)
    const inrPaise = Math.round(numericAmount * 100);

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || "rzp_test_skyluxe_sandbox";
    const orderId = `order_mock_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    return NextResponse.json({
      orderId,
      amount: inrPaise,
      currency: "INR",
      keyId,
      notes: {
        userId: userId || "guest_user",
        type,
        itemId: itemId || "SG-101",
      },
    });
  } catch (error: any) {
    console.error("Error creating payment order:", error);
    return NextResponse.json(
      { error: "Failed to initialize payment order", message: error.message },
      { status: 500 }
    );
  }
}
