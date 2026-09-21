// In-memory / fallback store for bookings when external backend is offline

export interface StoredBooking {
  _id: string;
  id?: string;
  user: string;
  type: "commercial" | "private";
  status: "Confirmed" | "Completed" | "Pending" | "Cancelled";
  bookingReference: string;
  total_amount: number;
  class?: string;
  seat_number?: string;
  passengers: Array<{
    firstName: string;
    lastName: string;
    age?: number;
    passportNumber?: string;
    nationality?: string;
  }>;
  flight?: {
    _id: string;
    flightNumber: string;
    aircraft: string;
    airline: {
      airlineName: string;
      logoUrl: string;
      brandColor: string;
      iataCode: string;
    };
    origin: string;
    destination: string;
    departureTime: string;
    arrivalTime: string;
  };
  aircraftModel?: string;
  legs?: Array<{ from: string; to: string; date: string }>;
  catering?: string;
  chauffeur?: string;
  security?: string;
  boardingPass?: {
    boardingTime: string;
    gate: string;
    terminal: string;
    seat: string;
    pnr: string;
    qrData: string;
  };
  createdAt: string;
}

const globalBookings: Map<string, StoredBooking> = new Map();

export function saveBooking(booking: StoredBooking): StoredBooking {
  globalBookings.set(booking._id, booking);
  return booking;
}

export function getBookingById(id: string): StoredBooking | undefined {
  return globalBookings.get(id);
}

export function getBookingsByUser(userId: string, type?: "commercial" | "private"): StoredBooking[] {
  const all = Array.from(globalBookings.values());
  return all.filter((b) => {
    const matchUser = !userId || b.user === userId || userId === "all";
    const matchType = !type || b.type === type;
    return matchUser && matchType;
  });
}

const AIRLINES_MAP: Record<string, { name: string; logo: string; brandColor: string; iata: string }> = {
  "SG": {
    name: "SpiceJet",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/SpiceJet_logo.svg/320px-SpiceJet_logo.svg.png",
    brandColor: "#D32F2F",
    iata: "SG"
  },
  "QP": {
    name: "Akasa Air",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Akasa_Air_Logo.svg/320px-Akasa_Air_Logo.svg.png",
    brandColor: "#FF6F00",
    iata: "QP"
  },
  "6E": {
    name: "IndiGo",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/IndiGo_Airlines_logo.svg/320px-IndiGo_Airlines_logo.svg.png",
    brandColor: "#002060",
    iata: "6E"
  },
  "AI": {
    name: "Air India",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Air_India_2023.svg/320px-Air_India_2023.svg.png",
    brandColor: "#B71C1C",
    iata: "AI"
  },
  "UK": {
    name: "Vistara",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Vistara_Logo.svg/320px-Vistara_Logo.svg.png",
    brandColor: "#581845",
    iata: "UK"
  },
  "EK": {
    name: "Emirates",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Emirates_logo.svg/320px-Emirates_logo.svg.png",
    brandColor: "#D71921",
    iata: "EK"
  },
  "BA": {
    name: "British Airways",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/British_Airways_Logo.svg/320px-British_Airways_Logo.svg.png",
    brandColor: "#075AAA",
    iata: "BA"
  },
  "QR": {
    name: "Qatar Airways",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Qatar_Airways_Logo.svg/320px-Qatar_Airways_Logo.svg.png",
    brandColor: "#5C0632",
    iata: "QR"
  },
  "SQ": {
    name: "Singapore Airlines",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Singapore_Airlines_Logo.svg/320px-Singapore_Airlines_Logo.svg.png",
    brandColor: "#F58220",
    iata: "SQ"
  }
};

export function getAirlineInfo(prefixOrCode: string) {
  const upper = (prefixOrCode || "AI").toUpperCase();
  for (const [code, info] of Object.entries(AIRLINES_MAP)) {
    if (upper.includes(code) || upper.includes(info.name.toUpperCase())) {
      return info;
    }
  }
  return AIRLINES_MAP["AI"];
}
