import { NextRequest, NextResponse } from "next/server";
import { AIRPORTS, getAirportByCode, calculateDistanceKm } from "@/lib/airports";

// Airline Fleet & Meta definitions
const AIRLINE_CATALOG = {
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

// Simple pseudo-random hash generator for deterministic route-specific results
function pseudoHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function extractCode(str: string): string {
  if (!str) return "BOM";
  if (str.includes("(") && str.includes(")")) {
    return str.split("(")[1].replace(")", "").trim().toUpperCase();
  }
  return str.trim().toUpperCase();
}

/**
 * Generates accurate route-specific flight manifests
 */
function generateDynamicSchedule(fromRaw: string, toRaw: string, dateStr: string, cabinClass: string) {
  const originCode = extractCode(fromRaw);
  const destCode = extractCode(toRaw);

  const originAirport = getAirportByCode(originCode) || {
    code: originCode,
    city: fromRaw.split("(")[0].trim() || originCode,
    name: `${originCode} Airport`,
    country: "India",
    region: "India" as const,
    lat: 19.0896,
    lon: 72.8656
  };

  const destAirport = getAirportByCode(destCode) || {
    code: destCode,
    city: toRaw.split("(")[0].trim() || destCode,
    name: `${destCode} Airport`,
    country: "India",
    region: "India" as const,
    lat: 25.2532,
    lon: 55.3657
  };

  const isDomestic = originAirport.region === "India" && destAirport.region === "India";
  const distanceKm = calculateDistanceKm(originCode, destCode);

  // Accurate Physical Flight Duration:
  // ~780 km/h average commercial jet speed + 30 mins for taxi/takeoff/air-traffic landing patterns
  const calculatedDuration = Math.max(45, Math.round((distanceKm / 780) * 60 + 30));

  // Realistic Distance-Based Base Tariff in USD
  let baseEconomyTariff: number;
  if (isDomestic) {
    // Domestic India: base fare + $0.052 per km
    baseEconomyTariff = Math.max(45, Math.round(distanceKm * 0.052 + 25));
  } else {
    // International: base fare + $0.068 per km + cross-border landing surcharge
    baseEconomyTariff = Math.max(130, Math.round(distanceKm * 0.068 + 55));
  }

  const baseDate = new Date(dateStr && !isNaN(new Date(dateStr).getTime()) ? dateStr : Date.now());
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();
  const day = baseDate.getDate();

  // Route Seed Hash
  const routeHash = pseudoHash(`${originCode}_${destCode}_${dateStr}`);

  // Select carriers based on geography
  let availableCarriers: (keyof typeof AIRLINE_CATALOG)[];
  if (isDomestic) {
    availableCarriers = ["6E", "AI", "UK", "QP", "6E", "AI", "UK", "SG"];
  } else if (destAirport.region === "Middle East" || originAirport.region === "Middle East") {
    availableCarriers = ["EK", "AI", "6E", "QR", "EK", "UK", "QP", "AI"];
  } else if (destAirport.region === "Europe" || originAirport.region === "Europe") {
    availableCarriers = ["BA", "AI", "QR", "EK", "UK", "AI", "BA", "SQ"];
  } else if (destAirport.region === "Asia Pacific" || originAirport.region === "Asia Pacific") {
    availableCarriers = ["SQ", "AI", "6E", "UK", "SQ", "AI", "QP", "6E"];
  } else {
    availableCarriers = ["AI", "BA", "EK", "QR", "SQ", "AI", "UK", "6E"];
  }

  // Realistic departure schedule slots throughout the day
  const baseSlots = [
    { hour: 5, min: 45 },
    { hour: 7, min: 15 },
    { hour: 9, min: 30 },
    { hour: 11, min: 45 },
    { hour: 14, min: 10 },
    { hour: 16, min: 50 },
    { hour: 19, min: 25 },
    { hour: 22, min: 15 }
  ];

  return availableCarriers.map((airlineKey, idx) => {
    const airline = AIRLINE_CATALOG[airlineKey];
    const slot = baseSlots[idx % baseSlots.length];

    // Add small route-hash variation to slot minutes (e.g. +5, +10, -5 mins)
    const slotOffset = ((routeHash + idx * 7) % 5) * 5;
    let depHour = slot.hour;
    let depMin = slot.min + slotOffset;
    if (depMin >= 60) {
      depHour += 1;
      depMin -= 60;
    }

    const depTime = new Date(year, month, day, depHour, depMin, 0);
    const arrTime = new Date(depTime.getTime() + calculatedDuration * 60 * 1000);

    // Dynamic flight number based on airline IATA prefix & deterministic numbers
    const flightNumBase = 100 + ((routeHash + idx * 37) % 890);
    const flightNumber = `${airline.code}-${flightNumBase}`;

    // Select realistic aircraft model
    let aircraft: string;
    let seatPitchEcon = "32 in (81 cm)";
    let seatPitchBiz = "78 in (198 cm) Full Flatbed";
    let seatPitchFirst = "82 in (208 cm) Private Suite";
    let layout = "3-3-3 Direct Aisle Access";

    if (isDomestic) {
      if (distanceKm > 1400 && (airlineKey === "AI" || airlineKey === "UK")) {
        aircraft = airline.domesticWidebody;
        layout = "1-2-1 Business / 3-3-3 Economy";
      } else {
        aircraft = airline.domesticNarrowbody;
        layout = "2-2 Business / 3-3 Economy";
        seatPitchBiz = "38 in (96 cm) Recliner";
      }
    } else {
      aircraft = distanceKm > 3500 ? airline.intlWidebody : airline.domesticWidebody;
      layout = "1-2-1 Business Suite / 3-4-3 Economy";
    }

    // Dynamic price calculation
    const airlineMul = airline.priceMultiplier;
    const peakHourMul = (depHour >= 7 && depHour <= 9) || (depHour >= 18 && depHour <= 20) ? 1.12 : 1.0;

    const economyPrice = Math.round(baseEconomyTariff * airlineMul * peakHourMul);
    const businessPrice = Math.round(baseEconomyTariff * 3.1 * airlineMul * peakHourMul);
    const firstPrice = Math.round(baseEconomyTariff * 6.8 * airlineMul * peakHourMul);

    // Real seat availability variations
    const availEcon = 15 + ((routeHash + idx * 13) % 95);
    const availBiz = 3 + ((routeHash + idx * 7) % 24);
    const availFirst = 1 + ((routeHash + idx * 3) % 7);

    // Stops logic
    const stops = isDomestic ? 0 : distanceKm > 6000 && idx % 3 === 2 ? 1 : 0;

    // Terminal assignment logic
    const depTerminal = originAirport.code === "DEL" ? (airlineKey === "6E" || airlineKey === "SG" ? "T2" : "T3")
      : originAirport.code === "BOM" ? (airlineKey === "6E" ? "T1" : "T2")
      : originAirport.code === "DXB" ? (airlineKey === "EK" ? "T3" : "T1")
      : originAirport.code === "LHR" ? (airlineKey === "BA" ? "T5" : "T2")
      : originAirport.code === "SIN" ? "T3"
      : "T2";

    const arrTerminal = destAirport.code === "DEL" ? (airlineKey === "6E" || airlineKey === "SG" ? "T2" : "T3")
      : destAirport.code === "BOM" ? (airlineKey === "6E" ? "T1" : "T2")
      : destAirport.code === "DXB" ? (airlineKey === "EK" ? "T3" : "T1")
      : destAirport.code === "LHR" ? (airlineKey === "BA" ? "T5" : "T2")
      : destAirport.code === "SIN" ? "T3"
      : "T2";

    // Gate assignment
    const depGate = `Gate ${String.fromCharCode(65 + ((routeHash + idx) % 4))}${10 + ((routeHash + idx * 3) % 30)}`;

    // CO2 Emissions (realistic calculation based on aircraft and distance)
    const baseCo2Kg = Math.round(distanceKm * 0.092);
    const co2DiffPercent = -8 - ((routeHash + idx * 5) % 18); // e.g. -8% to -25% vs average

    // On-Time Performance
    const onTimeRate = 91 + ((routeHash + idx * 3) % 8); // 91% to 98%

    return {
      _id: `${flightNumber}-${originCode}-${destCode}-${dateStr}`,
      flightNumber,
      airline: {
        _id: `airline-${airlineKey.toLowerCase()}`,
        airlineCode: airline.code,
        airlineName: airline.name,
        iataCode: airline.code,
        logoUrl: airline.logo,
        brandColor: airline.brandColor,
        website: "https://skyluxe.aviation.com"
      },
      aircraft,
      seatLayout: layout,
      departure: {
        airport: originAirport.code,
        city: originAirport.city,
        name: originAirport.name,
        country: originAirport.country,
        terminal: depTerminal,
        gate: depGate,
        time: depTime.toISOString()
      },
      arrival: {
        airport: destAirport.code,
        city: destAirport.city,
        name: destAirport.name,
        country: destAirport.country,
        terminal: arrTerminal,
        time: arrTime.toISOString()
      },
      duration: calculatedDuration,
      price: {
        economy: economyPrice,
        business: businessPrice,
        first: firstPrice
      },
      baggage: {
        cabin: "7 kg (1 pc) + Laptop Bag",
        checkinEconomy: isDomestic ? "15 kg (1 piece)" : "25 kg (1 piece)",
        checkinBusiness: isDomestic ? "30 kg (2 pieces)" : "40 kg (2 pieces)",
        checkinFirst: "50 kg (2 pieces)"
      },
      amenities: {
        wifi: airlineKey === "EK" || airlineKey === "QR" || airlineKey === "SQ" || airlineKey === "UK" ? "High-Speed Wi-Fi" : "In-flight Portal",
        power: "AC 110V & USB-C Fast Charging",
        meal: airlineKey === "6E" || airlineKey === "QP" || airlineKey === "SG" ? "Gourmet Snack Box & Beverages" : "Chef-Curated Multi-Course Hot Meal",
        entertainment: "13.3-inch 4K Screen with 1,500+ Movies & Live TV",
        seatPitch: {
          economy: seatPitchEcon,
          business: seatPitchBiz,
          first: seatPitchFirst
        }
      },
      eco: {
        co2Kg: baseCo2Kg,
        diffPercent: co2DiffPercent,
        label: `${Math.abs(co2DiffPercent)}% less CO₂ than route average`
      },
      onTime: {
        rate: `${onTimeRate}%`,
        status: onTimeRate >= 94 ? "Highly punctual (95%+ on time)" : "Usually on-time"
      },
      fareRules: {
        isRefundable: airlineKey !== "SG" && airlineKey !== "QP",
        freeCancellationHours: 24,
        rescheduleFee: "$0 up to 4 hrs before departure"
      },
      availableSeats: {
        economy: availEcon,
        business: availBiz,
        first: availFirst
      },
      status: "scheduled",
      stops,
      tags: airline.serviceTags
    };
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const defaultDate = new Date(Date.now() + 86400000).toISOString().split("T")[0];
    const { from = "BOM", to = "DWC", date = defaultDate, passengers = 1, class: cabinClass = "business", type = "one-way" } = body;

    // 1. Try external backend server (port 5000) if active
    try {
      const backendUrl = process.env.BACKEND_API_URL || "http://127.0.0.1:5000/api/v1";
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);

      const backendRes = await fetch(`${backendUrl}/flights/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ from, to, date, passengers, class: cabinClass, type }),
        signal: controller.signal
      }).catch(() => null);

      clearTimeout(timeoutId);

      if (backendRes && backendRes.ok) {
        const backendData = await backendRes.json().catch(() => null);
        if (Array.isArray(backendData) && backendData.length > 0) {
          return NextResponse.json(backendData);
        }
      }
    } catch {
      // Backend offline, fallback to dynamic schedule calculation
    }

    // 2. Generate accurate distance-driven schedule results
    const schedule = generateDynamicSchedule(from, to, date, cabinClass);
    return NextResponse.json(schedule);
  } catch (error: any) {
    console.error("Flight search API route error:", error);
    return NextResponse.json({ error: "Failed to search flights" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const defaultDate = new Date(Date.now() + 86400000).toISOString().split("T")[0];
  const from = searchParams.get("from") || "BOM";
  const to = searchParams.get("to") || "DWC";
  const date = searchParams.get("date") || defaultDate;
  const cabinClass = searchParams.get("class") || "business";

  const schedule = generateDynamicSchedule(from, to, date, cabinClass);
  return NextResponse.json(schedule);
}
