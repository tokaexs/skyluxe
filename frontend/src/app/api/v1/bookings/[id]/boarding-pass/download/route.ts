import { NextRequest, NextResponse } from "next/server";
import { getBookingById } from "@/lib/bookingsService";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const booking = getBookingById(id);

  const passengerName = booking?.passengers?.[0]
    ? `${booking.passengers[0].firstName} ${booking.passengers[0].lastName}`
    : "SKYLUXE MEMBER";
  const pnr = booking?.bookingReference || `SKL${id.substring(0, 5)}`;
  const flightNum = booking?.flight?.flightNumber || booking?.aircraftModel || "SG-101";
  const airline = booking?.flight?.airline?.airlineName || "SpiceJet";
  const from = booking?.flight?.origin || "BOM";
  const to = booking?.flight?.destination || "DEL";
  const seat = booking?.seat_number || "14B";
  const gate = booking?.boardingPass?.gate || "Gate 14";
  const terminal = booking?.boardingPass?.terminal || "Terminal 2";

  // Return a printable HTML boarding pass e-ticket
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>SkyLuxe Boarding Pass - ${pnr}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0b0f19; color: #fff; margin: 0; padding: 40px; display: flex; justify-content: center; }
    .ticket { background: #111827; border: 1px solid #374151; border-radius: 16px; width: 680px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
    .header { background: linear-gradient(135deg, #1e293b, #0f172a); padding: 24px; border-bottom: 2px dashed #374151; display: flex; justify-content: space-between; align-items: center; }
    .header h1 { margin: 0; font-size: 20px; letter-spacing: 2px; color: #d4af37; text-transform: uppercase; }
    .body { padding: 32px; display: grid; grid-template-columns: 2fr 1fr; gap: 24px; }
    .flight-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .city { font-size: 32px; font-weight: 800; color: #f3f4f6; }
    .details-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
    .item label { display: block; font-size: 11px; color: #9ca3af; text-transform: uppercase; margin-bottom: 4px; }
    .item span { font-size: 15px; font-weight: 600; color: #fff; }
    .qr-pane { background: #1f2937; border-radius: 12px; padding: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
    .qr-pane img { width: 120px; height: 120px; margin-bottom: 12px; }
    .footer { background: #0d131f; padding: 16px 32px; text-align: center; font-size: 12px; color: #6b7280; }
    @media print { body { background: #fff; color: #000; padding: 0; } .ticket { border: 1px solid #ccc; box-shadow: none; } }
  </style>
</head>
<body>
  <div class="ticket">
    <div class="header">
      <div>
        <h1>SkyLuxe Aviation</h1>
        <div style="color: #9ca3af; font-size: 12px; margin-top: 4px;">Official Digital Boarding Pass</div>
      </div>
      <div style="text-align: right;">
        <div style="font-size: 11px; color: #9ca3af;">PNR / BOOKING REF</div>
        <div style="font-size: 18px; font-weight: 800; color: #d4af37; letter-spacing: 2px;">${pnr}</div>
      </div>
    </div>
    <div class="body">
      <div>
        <div class="flight-row">
          <div>
            <div class="city">${from}</div>
            <div style="color: #9ca3af; font-size: 13px;">Departure</div>
          </div>
          <div style="color: #d4af37; font-size: 20px;">✈</div>
          <div style="text-align: right;">
            <div class="city">${to}</div>
            <div style="color: #9ca3af; font-size: 13px;">Arrival</div>
          </div>
        </div>
        <div class="details-grid">
          <div class="item"><label>Passenger</label><span>${passengerName}</span></div>
          <div class="item"><label>Flight</label><span>${flightNum}</span></div>
          <div class="item"><label>Airline</label><span>${airline}</span></div>
          <div class="item"><label>Seat</label><span>${seat}</span></div>
          <div class="item"><label>Gate</label><span>${gate}</span></div>
          <div class="item"><label>Terminal</label><span>${terminal}</span></div>
        </div>
      </div>
      <div class="qr-pane">
        <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(pnr + '-' + flightNum)}" alt="Boarding QR" />
        <div style="font-size: 11px; color: #9ca3af;">Scan at Security & Gate</div>
      </div>
    </div>
    <div class="footer">
      SKYLUXE PRIVILEGED ACCESS &bull; GATE CLOSES 20 MINUTES PRIOR TO DEPARTURE &bull; HAVE A SAFE FLIGHT
    </div>
  </div>
  <script>window.onload = function() { setTimeout(function() { window.print(); }, 500); };</script>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html" },
  });
}
