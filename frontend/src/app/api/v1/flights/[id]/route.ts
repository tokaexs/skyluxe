import { NextRequest, NextResponse } from "next/server";
import { getAirportByCode, calculateDistanceKm } from "@/lib/airports";

// Airline Fleet & Meta definitions matching search route
const AIRLINE_CATALOG: Record<string, any> = {
  AI: {
    code: "AI",
    name: "Air India",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Air_India_Logo.svg/240px-Air_India_Logo.svg.png",
    brandColor: "#e01d23",
    domesticNarrowbody: "Airbus A320neo",
    domesticWidebody: "Boeing 787-8 Dreamliner",
    intlWidebody: "Airbus A350-900",
    serviceTags: ["Direct", "Complimentary Hot Meal", "Maharaja Lounge Access"],
    priceMultiplier: 1.15
  },
  "6E": {
    code: "6E",
    name: "IndiGo",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/IndiGo_Airlines_logo.svg/240px-IndiGo_Airlines_logo.svg.png",
    brandColor: "#001d6c",
    domesticNarrowbody: "Airbus A321neo",
    domesticWidebody: "Boeing 777-300ER",
    intlWidebody: "Boeing 777-300ER",
    serviceTags: ["Direct", "Fast Forward Priority", "Gourmet Snack Box"],
    priceMultiplier: 0.88
  },
  UK: {
    code: "UK",
    name: "Vistara",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f5/Vistara_Logo.svg/240px-Vistara_Logo.svg.png",
    brandColor: "#5f2545",
    domesticNarrowbody: "Airbus A321neo",
    domesticWidebody: "Boeing 787-9 Dreamliner",
    intlWidebody: "Boeing 787-9 Dreamliner",
    serviceTags: ["Direct", "Flatbed & Fine Dining", "Signature Lounge Access"],
    priceMultiplier: 1.25
  },
  QP: {
    code: "QP",
    name: "Akasa Air",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Akasa_Air_logo.svg/240px-Akasa_Air_logo.svg.png",
    brandColor: "#ff6f00",
    domesticNarrowbody: "Boeing 737 MAX 8",
    domesticWidebody: "Boeing 737 MAX 8-200",
    intlWidebody: "Boeing 737 MAX 8",
    serviceTags: ["Direct", "Cafe Akasa Fresh Food", "On-Time Guarantee"],
    priceMultiplier: 0.82
  },
  SG: {
    code: "SG",
    name: "SpiceJet",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/SpiceJet_logo.svg/240px-SpiceJet_logo.svg.png",
    brandColor: "#c8102e",
    domesticNarrowbody: "Boeing 737-800",
    domesticWidebody: "Boeing 737 MAX 8",
    intlWidebody: "Boeing 737-800",
    serviceTags: ["Direct", "SpiceMax Extra Legroom", "Hot Meals Available"],
    priceMultiplier: 0.78
  },
  EK: {
    code: "EK",
    name: "Emirates",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Emirates_logo.svg/240px-Emirates_logo.svg.png",
    brandColor: "#d71920",
    domesticNarrowbody: "Boeing 777-300ER",
    domesticWidebody: "Airbus A380-800",
    intlWidebody: "Airbus A380-800",
    serviceTags: ["Direct", "Private Shower Spa", "First Class Lounge"],
    priceMultiplier: 1.85
  },
  QR: {
    code: "QR",
    name: "Qatar Airways",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Qatar_Airways_logo.svg/240px-Qatar_Airways_logo.svg.png",
    brandColor: "#5c0632",
    domesticNarrowbody: "Boeing 777-300ER",
    domesticWidebody: "Airbus A350-1000",
    intlWidebody: "Airbus A350-1000",
    serviceTags: ["Qsuite Private Cabin", "Michelin Dining", "Al Mourjan Lounge"],
    priceMultiplier: 1.75
  },
  SQ: {
    code: "SQ",
    name: "Singapore Airlines",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Singapore_Airlines_Logo_2.svg/240px-Singapore_Airlines_Logo_2.svg.png",
    brandColor: "#1d2c5c",
    domesticNarrowbody: "Airbus A350-900",
    domesticWidebody: "Boeing 777-300ER",
    intlWidebody: "Airbus A380-800",
    serviceTags: ["Direct", "Book the Cook Menu", "SilverKris Lounge"],
    priceMultiplier: 1.6
  },
  BA: {
    code: "BA",
    name: "British Airways",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/British_Airways_Logo.svg/240px-British_Airways_Logo.svg.png",
    brandColor: "#072286",
    domesticNarrowbody: "Boeing 787-10",
    domesticWidebody: "Airbus A350-1000",
    intlWidebody: "Boeing 777-300ER",
    serviceTags: ["Club Suite Flatbed", "Concorde Room", "Direct Flight"],
    priceMultiplier: 1.5
  }
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const fromCode = (searchParams.get("from") || "BOM").toUpperCase();
    const toCode = (searchParams.get("to") || "DEL").toUpperCase();
    const dateStr = searchParams.get("date") || new Date().toISOString().split("T")[0];

    // Try external backend first
    try {
      const backendUrl = process.env.BACKEND_API_URL || "http://127.0.0.1:5000/api/v1";
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);

      const res = await fetch(`${backendUrl}/flights/${id}`, { signal: controller.signal }).catch(() => null);
      clearTimeout(timeoutId);

      if (res && res.ok) {
        const data = await res.json().catch(() => null);
        if (data) return NextResponse.json(data);
      }
    } catch {
      // Fallback
    }

    const originAirport = getAirportByCode(fromCode) || {
      code: fromCode,
      city: fromCode,
      name: `${fromCode} International Airport`,
      country: "India",
      region: "India" as const
    };

    const destAirport = getAirportByCode(toCode) || {
      code: toCode,
      city: toCode,
      name: `${toCode} International Airport`,
      country: "India",
      region: "India" as const
    };

    const isDomestic = originAirport.region === "India" && destAirport.region === "India";
    const dist = calculateDistanceKm(fromCode, toCode);
    const duration = Math.max(45, Math.round((dist / 780) * 60 + 30));

    // Extract carrier code from ID prefix
    const carrierPrefix = id.split("-")[0]?.toUpperCase() || "AI";
    const airline = AIRLINE_CATALOG[carrierPrefix] || AIRLINE_CATALOG["AI"];

    // Base fare formula matching /flights/search route
    let baseEconomyTariff: number;
    if (isDomestic) {
      baseEconomyTariff = Math.max(45, Math.round(dist * 0.052 + 25));
    } else {
      baseEconomyTariff = Math.max(130, Math.round(dist * 0.068 + 55));
    }

    const economyPrice = Math.round(baseEconomyTariff * airline.priceMultiplier);
    const businessPrice = Math.round(baseEconomyTariff * 3.1 * airline.priceMultiplier);
    const firstPrice = Math.round(baseEconomyTariff * 6.8 * airline.priceMultiplier);

    let aircraft: string;
    if (isDomestic) {
      aircraft = dist > 1400 && (carrierPrefix === "AI" || carrierPrefix === "UK")
        ? airline.domesticWidebody
        : airline.domesticNarrowbody;
    } else {
      aircraft = dist > 3500 ? airline.intlWidebody : airline.domesticWidebody;
    }

    // Terminal assignment
    const depTerminal = originAirport.code === "DEL" ? (carrierPrefix === "6E" || carrierPrefix === "SG" ? "T2" : "T3")
      : originAirport.code === "BOM" ? (carrierPrefix === "6E" ? "T1" : "T2")
      : originAirport.code === "DXB" ? (carrierPrefix === "EK" ? "T3" : "T1")
      : originAirport.code === "LHR" ? (carrierPrefix === "BA" ? "T5" : "T2")
      : "T2";

    const arrTerminal = destAirport.code === "DEL" ? (carrierPrefix === "6E" || carrierPrefix === "SG" ? "T2" : "T3")
      : destAirport.code === "BOM" ? (carrierPrefix === "6E" ? "T1" : "T2")
      : destAirport.code === "DXB" ? (carrierPrefix === "EK" ? "T3" : "T1")
      : destAirport.code === "LHR" ? (carrierPrefix === "BA" ? "T5" : "T2")
      : "T3";

    return NextResponse.json({
      _id: id,
      flightNumber: id,
      airline: {
        airlineName: airline.name,
        logoUrl: airline.logo,
        brandColor: airline.brandColor,
        iataCode: airline.code
      },
      aircraft,
      departure: {
        airport: originAirport.code,
        city: originAirport.city,
        name: originAirport.name,
        terminal: depTerminal,
        gate: "Gate B14",
        time: new Date().toISOString()
      },
      arrival: {
        airport: destAirport.code,
        city: destAirport.city,
        name: destAirport.name,
        terminal: arrTerminal,
        time: new Date(Date.now() + duration * 60000).toISOString()
      },
      duration,
      price: {
        economy: economyPrice,
        business: businessPrice,
        first: firstPrice
      },
      baggage: {
        cabin: "7 kg (1 pc) + Laptop",
        checkinEconomy: isDomestic ? "15 kg" : "25 kg",
        checkinBusiness: isDomestic ? "30 kg" : "40 kg",
        checkinFirst: "50 kg"
      },
      amenities: {
        wifi: carrierPrefix === "EK" || carrierPrefix === "QR" || carrierPrefix === "SQ" || carrierPrefix === "UK" ? "High-Speed Wi-Fi" : "In-flight Portal",
        power: "AC 110V & USB-C Charging",
        meal: carrierPrefix === "6E" || carrierPrefix === "QP" || carrierPrefix === "SG" ? "Gourmet Snack Box" : "Chef-Curated Multi-Course Hot Meal",
        entertainment: "13.3-inch 4K IFE Console",
        seatPitch: {
          economy: "32 in",
          business: "78 in Lie-Flat",
          first: "82 in Private Suite"
        }
      },
      eco: {
        co2Kg: Math.round(dist * 0.09),
        diffPercent: -14
      },
      stops: 0,
      tags: airline.serviceTags,
      status: "scheduled"
    });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to fetch flight" }, { status: 500 });
  }
}
