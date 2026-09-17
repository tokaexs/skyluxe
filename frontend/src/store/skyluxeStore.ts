import { create } from "zustand";
import { api, getAuthToken } from "@/lib/api";

export interface FlightLeg {
  from: string;
  to: string;
  date: string;
}

export interface FlightBooking {
  id: string;
  type: "commercial" | "private";
  airline?: string;
  logo?: string;
  aircraft: string;
  departure: { time: string; code: string; city: string };
  arrival: { time: string; code: string; city: string };
  duration: string;
  seatNumber?: string;
  passengers: number;
  cost: number;
  status: "Confirmed" | "Completed" | "Pending" | "Cancelled";
  date: string;
  catering?: string;
  chauffeur?: string;
  security?: string;
  legs?: FlightLeg[];
  boardingTime?: string;
  gate?: string;
  terminal?: string;
  brandColor?: string;
  iataCode?: string;
  pnr?: string;
  passengerName?: string;
  fareClass?: string;
  boardingGroup?: string;
  bookingDbId?: string;
}

export interface Coupon {
  id?: string;
  brand: string;
  offer: string;
  points: number;
  locked: boolean;
  img: string;
  redeemed: boolean;
}

export interface Transaction {
  id: string;
  title: string;
  date: string;
  amount: number;
  type: "debit" | "credit";
  invoice?: string;
}

export interface ConciergeRequest {
  id: string;
  type: "Catering" | "Chauffeur" | "Security" | "Helicopter" | "Private Chef" | "Private Security" | "Hotel Booking" | "Business Meeting" | "Airport Assistance" | "VIP Lounge" | "Travel Insurance";
  details: string;
  status: "Pending" | "Assigned" | "In Progress" | "In Transit" | "Completed";
  flightId?: string;
  createdAt?: string;
}

export interface SavedTrip {
  id: string;
  title: string;
  destination: string;
  dates: string;
  budget: string;
  style: string;
  itinerary: { day: number; activities: string[] }[];
  createdAt: string;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  unread: boolean;
  type: "security" | "flight" | "wallet";
}

export interface ChatMessage {
  id: string;
  sender: "ai" | "user";
  text: string;
  widget?: "itinerary" | "approval";
}

interface SkyLuxeState {
  // User Profile
  profile: {
    id?: string;
    name: string;
    email: string;
    phone: string;
    residence: string;
    avatar: string;
    passport: string;
    preferences: {
      dietary: string;
      beverages: string;
      groundTransport: string;
      cabinAmbiance: string;
    };
    role?: string;
    membership?: string;
    passportStats?: {
      countriesVisited: string[];
      favoriteDestinations: string[];
      privateJetHours: number;
      flightsTaken: number;
      stamps: { stampId: string; title: string; country: string; date: string }[];
    };
    achievements?: string[];
  };
  
  // Wallet
  walletBalance: number;
  transactions: Transaction[];
  savedCards: { id: string; brand: string; last4: string; exp: string; primary: boolean }[];
  
  // Loyalty Rewards
  coins: number;
  coupons: Coupon[];
  
  // Flight Logs
  flights: FlightBooking[];
  
  // Concierge Operations
  conciergeRequests: ConciergeRequest[];
  chatHistory: ChatMessage[];
  savedTrips: SavedTrip[];
  
  // Notifications
  notifications: SystemNotification[];
 
  // Currency Settings
  currency: "USD" | "INR";
 
  // Actions
  fetchInitialData: () => Promise<void>;
  syncUserFromClerk: (user: any) => void;
  updateProfile: (profile: Partial<SkyLuxeState["profile"]>) => Promise<void>;
  updatePreferences: (preferences: Partial<SkyLuxeState["profile"]["preferences"]>) => Promise<void>;
  addFunds: (amount: number) => Promise<void>;
  chargeWallet: (amount: number, description: string) => Promise<boolean>;
  addCoins: (amount: number) => Promise<void>;
  redeemCoupon: (brand: string) => Promise<boolean>;
  bookFlight: (booking: Omit<FlightBooking, "id" | "status" | "boardingTime" | "gate" | "terminal">) => Promise<FlightBooking>;
  addConciergeRequest: (request: Omit<ConciergeRequest, "id" | "status">) => Promise<void>;
  addSavedTrip: (trip: Omit<SavedTrip, "id" | "createdAt">) => Promise<void>;
  addChatMessage: (msg: Omit<ChatMessage, "id">) => void;
  clearChatHistory: () => void;
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  addSavedCard: (card: Omit<{ id: string; brand: string; last4: string; exp: string; primary: boolean }, "id">) => void;
  removeSavedCard: (id: string) => void;
  withdrawFunds: (amount: number) => Promise<boolean>;
  setCurrency: (currency: "USD" | "INR") => void;
  formatAmount: (amount: number) => string;
  cancelBooking: (bookingId: string) => Promise<boolean>;
}

export const useSkyLuxeStore = create<SkyLuxeState>((set, get) => ({
  profile: {
    name: "",
    email: "",
    phone: "",
    residence: "Mumbai, IND",
    avatar: "SL",
    passport: "United States • ••••••892",
    preferences: {
      dietary: "No shellfish. Preferred sparkling water.",
      beverages: "Macallan 18, San Pellegrino, Espresso",
      groundTransport: "Luxury SUV (Cadillac Escalade / Range Rover)",
      cabinAmbiance: "Dimmed lighting during night flights. Temperature set to 21°C.",
    },
  },
  
  currency: "USD",
  walletBalance: 450000,
  
  transactions: [
    { id: "TX-2901", title: "Aircraft Charter: BOM - DWC", date: "May 28, 2026", amount: -51500, type: "debit", invoice: "INV-2901" },
    { id: "TX-2800", title: "Wallet Funding via Wire", date: "May 20, 2026", amount: 250000, type: "credit" },
    { id: "TX-1002", title: "Signature Membership Renewal", date: "Jan 01, 2026", amount: -100000, type: "debit", invoice: "INV-1002" },
    { id: "TX-2844", title: "Catering Surcharge (BOM-DEL)", date: "May 15, 2026", amount: -1250, type: "debit", invoice: "INV-2844" },
  ],
  
  savedCards: [
    { id: "c1", brand: "Apple Pay", last4: "", exp: "Primary", primary: true },
    { id: "c2", brand: "VISA", last4: "4242", exp: "12/28", primary: false },
  ],
  
  coins: 1250,
  
  coupons: [
    { brand: "Zara", offer: "₹5,000 Premium Voucher", points: 500, locked: false, img: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=800", redeemed: false },
    { brand: "Apple", offer: "AirPods Pro (2nd Gen)", points: 1000, locked: false, img: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?q=80&w=800", redeemed: false },
    { brand: "Air India", offer: "Complimentary Business Upgrade", points: 1500, locked: true, img: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=800", redeemed: false },
    { brand: "Luxury Hotels", offer: "VIP Helicopter Transfer (DWC)", points: 3000, locked: true, img: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=800", redeemed: false },
    { brand: "Lounge Upgrades", offer: "Complimentary 1-Night Suite", points: 5000, locked: true, img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800", redeemed: false },
  ],
  
  flights: [
    {
      id: "PNR-G650ER",
      type: "private",
      aircraft: "Gulfstream G650ER",
      departure: { time: "09:00", code: "BOM", city: "Mumbai" },
      arrival: { time: "11:30", code: "DWC", city: "Dubai Al Maktoum" },
      duration: "3h 30m",
      passengers: 3,
      cost: 51500,
      status: "Confirmed",
      date: "2026-06-04",
      catering: "Michelin-Grade Fine Dining",
      chauffeur: "Maybach S-Class Chauffeur",
      security: "Standard Terminal Security",
      legs: [{ from: "Mumbai (BOM)", to: "Dubai (DWC)", date: "2026-06-04" }],
      boardingTime: "08:30",
      gate: "V1",
      terminal: "VIP Terminal 1",
    }
  ],
  
  conciergeRequests: [
    { id: "CR-1", type: "Chauffeur", details: "Maybach S-Class ground transport pickup from BOM terminal", status: "Assigned", flightId: "PNR-G650ER" }
  ],
  
  chatHistory: [
    {
      id: "1",
      sender: "ai",
      text: "Good evening. I have analyzed your upcoming schedule. You have an executive summit in Dubai next Tuesday. I have pre-calculated the logistics from Mumbai (BOM) to Dubai (DWC).",
      widget: "itinerary",
    },
  ],

  savedTrips: [
    {
      id: "ST-001",
      title: "Dubai Executive Summit",
      destination: "Dubai, UAE",
      dates: "Jun 4–7, 2026",
      budget: "$58,000",
      style: "Business",
      itinerary: [
        { day: 1, activities: ["Arrive DWC via Gulfstream G650ER", "Helicopter transfer to Palm Jumeirah", "Check-in Atlantis The Royal"] },
        { day: 2, activities: ["Executive Summit — DIFC", "Dinner at Nobu Dubai", "Cigar lounge — Burj Al Arab"] },
      ],
      createdAt: "2026-05-28",
    },
  ],
  
  notifications: [
    { id: "n1", title: "Flight Prepared", message: "Gulfstream G650ER is fueled and positioned at BOM VIP Terminal.", time: "2 hours ago", unread: true, type: "flight" }
  ],

  // Actions implementations
  syncUserFromClerk: (user: any) => {
    if (!user) return;
    const fullName = user.fullName || `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username || "";
    const email = user.primaryEmailAddress?.emailAddress || user.emailAddresses?.[0]?.emailAddress || "";
    const phone = user.primaryPhoneNumber?.phoneNumber || user.phoneNumbers?.[0]?.phoneNumber || "";
    const initials = fullName 
      ? fullName.split(" ").filter(Boolean).map((n: string) => n[0]).join("").toUpperCase().substring(0, 2)
      : (email ? email.substring(0, 2).toUpperCase() : "SL");

    set((state) => ({
      profile: {
        ...state.profile,
        id: user.id || state.profile.id,
        name: fullName || state.profile.name || "SkyLuxe Member",
        email: email || state.profile.email,
        phone: phone || state.profile.phone,
        avatar: initials || state.profile.avatar || "SL",
      }
    }));
  },

  fetchInitialData: async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        // No custom JWT token present (e.g. Clerk authenticated or unauthenticated). Skip backend /auth/me request.
        return;
      }

      // 1. Fetch current user from JWT token if available
      const user = await api.get<any>("/auth/me").catch(() => null);
      if (!user || !user.id) return;
      
      const userId = user.id;

      // 2. Fetch wallet balance and transactions
      const wallet = await api.get<any>(`/wallet?user_id=${userId}`).catch(() => null);
      
      // 3. Fetch rewards, coupons, and redemptions
      const rewards = await api.get<any>(`/rewards?user_id=${userId}`).catch(() => null);
      
      // 4. Fetch flight bookings and charters
      const bookings = await api.get<any[]>(`/bookings?user_id=${userId}`).catch(() => []);
      const charters = await api.get<any[]>(`/bookings/charters?user_id=${userId}`).catch(() => []);
      
      // 5. Fetch concierge requests
      const concierge = await api.get<any[]>(`/ai/concierge-requests?user_id=${userId}`).catch(() => []);
      
      // 6. Fetch notifications
      const notifications = await api.get<any[]>(`/notifications?user_id=${userId}`).catch(() => []);

      // Map backend bookings to Zustand FlightBooking array
      const mappedFlights: FlightBooking[] = [];
      
      // Map commercial bookings
      for (const b of bookings) {
        mappedFlights.push({
          id: b.id.substring(0, 8).toUpperCase(),
          type: "commercial",
          airline: b.flight?.airline_code === "EK" ? "Emirates" : b.flight?.airline_code === "SQ" ? "Singapore Airlines" : "Qatar Airways",
          logo: b.flight?.airline_code === "EK" 
            ? "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Emirates_logo.svg/150px-Emirates_logo.svg.png" 
            : "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/IndiGo_Airlines_logo.svg/120px-IndiGo_Airlines_logo.svg.png",
          aircraft: b.flight?.aircraft_id || "Airbus A350-900",
          departure: { 
            time: b.flight ? new Date(b.flight.departure_time).toLocaleTimeString("en-US", {hour: '2-digit', minute:'2-digit', hour12: false}) : "09:00", 
            code: b.flight?.origin || "BOM", 
            city: b.flight?.origin === "BOM" ? "Mumbai" : b.flight?.origin || "Mumbai" 
          },
          arrival: { 
            time: b.flight ? new Date(b.flight.arrival_time).toLocaleTimeString("en-US", {hour: '2-digit', minute:'2-digit', hour12: false}) : "11:30", 
            code: b.flight?.destination || "DWC", 
            city: b.flight?.destination === "DWC" ? "Dubai Al Maktoum" : b.flight?.destination || "Dubai" 
          },
          duration: "4h 00m",
          seatNumber: b.seat_number,
          passengers: b.passengers?.length || 1,
          cost: b.total_amount,
          status: b.status,
          date: b.flight ? new Date(b.flight.departure_time).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
          boardingTime: b.boarding_passes?.[0]?.boarding_time || "08:15",
          gate: b.boarding_passes?.[0]?.gate || "B3",
          terminal: b.boarding_passes?.[0]?.terminal || "Terminal 3",
          bookingDbId: b.id
        });
      }
      
      // Map charter bookings
      for (const c of charters) {
        mappedFlights.push({
          id: c.id.substring(0, 8).toUpperCase(),
          type: "private",
          aircraft: "Gulfstream G700",
          departure: { time: "09:00", code: c.legs?.[0]?.from || "BOM", city: c.legs?.[0]?.from === "BOM" ? "Mumbai" : c.legs?.[0]?.from || "Mumbai" },
          arrival: { time: "11:30", code: c.legs?.[c.legs.length - 1]?.to || "DWC", city: c.legs?.[c.legs.length - 1]?.to === "DWC" ? "Dubai Al Maktoum" : c.legs?.[c.legs.length - 1]?.to || "Dubai" },
          duration: `${c.legs?.length * 3.5}h`,
          passengers: c.legs?.[0]?.passengers || 4,
          cost: c.price,
          status: c.status,
          date: c.legs?.[0]?.date || new Date().toISOString().split("T")[0],
          legs: c.legs,
          catering: c.catering,
          chauffeur: c.chauffeur,
          security: c.security,
          boardingTime: "08:30",
          gate: "V1",
          terminal: "VIP Terminal",
          bookingDbId: c.id
        });
      }

      set({
        profile: {
          id: user.id,
          name: `${user.first_name || user.firstName || ""} ${user.last_name || user.lastName || ""}`.trim(),
          email: user.email,
          phone: user.phone || "+1 (555) 019-9233",
          residence: user.country || "Mumbai, IND",
          avatar: `${(user.first_name || user.firstName || "E")[0] || ""}${(user.last_name || user.lastName || "S")[0] || ""}`.toUpperCase() || "ES",
          passport: "United States • ••••••892",
          preferences: {
            dietary: "No shellfish. Preferred sparkling water.",
            beverages: "Macallan 18, San Pellegrino, Espresso",
            groundTransport: "Luxury SUV (Cadillac Escalade / Range Rover)",
            cabinAmbiance: "Dimmed lighting during night flights. Temperature set to 21°C."
          },
          role: user.role || "user",
          membership: user.membership || "none",
          passportStats: user.passportStats || { countriesVisited: [], favoriteDestinations: [], stamps: [], flightsTaken: 0, privateJetHours: 0 },
          achievements: user.achievements || []
        },
        walletBalance: wallet ? wallet.balance : 0.0,
        transactions: wallet ? wallet.transactions.map((tx: any) => ({
          id: tx.id.substring(0, 8).toUpperCase(),
          title: tx.title || tx.description || "Aviation Transaction",
          date: new Date(tx.date || tx.created_at || Date.now()).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
          amount: tx.type === "debit" ? -Math.abs(tx.amount) : Math.abs(tx.amount),
          type: tx.type,
          invoice: tx.invoice
        })) : [],
        coins: rewards ? rewards.coins_balance : 0,
        coupons: rewards ? rewards.coupons.map((cp: any) => {
          const isRedeemed = rewards.redemptions.some((rd: any) => rd.coupon_id === cp.id);
          return {
            id: cp.id,
            brand: cp.brand,
            offer: cp.offer,
            points: cp.points_required,
            img: cp.image_url || "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=800",
            locked: (rewards.coins_balance < cp.points_required),
            redeemed: isRedeemed
          };
        }) : [],
        flights: mappedFlights.length > 0 ? mappedFlights : get().flights,
        conciergeRequests: concierge.length > 0 ? concierge.map((req: any) => ({
          id: req.id,
          type: req.type,
          details: req.details,
          status: req.status,
          createdAt: req.created_at
        })) : get().conciergeRequests,
        notifications: notifications.length > 0 ? notifications.map((notif: any) => ({
          id: notif.id,
          title: notif.title,
          message: notif.message,
          time: new Date(notif.created_at).toLocaleTimeString("en-US", {hour: '2-digit', minute:'2-digit'}),
          unread: notif.unread,
          type: notif.type
        })) : get().notifications
      });
    } catch (e) {
      console.error("Failed to fetch dashboard data:", e);
    }
  },

  updateProfile: async (updated) => {
    const profile = get().profile;
    if (!profile.id) return;
    try {
      const nameParts = (updated.name || profile.name).split(" ");
      const first_name = nameParts[0] || "";
      const last_name = nameParts.slice(1).join(" ") || "";
      await api.patch(`/users/${profile.id}`, {
        first_name,
        last_name,
        phone: updated.phone || profile.phone,
        country: updated.residence || profile.residence
      });
      await get().fetchInitialData();
    } catch (e) {
      console.error("Failed to update profile on backend:", e);
    }
  },
  
  updatePreferences: async (prefs) => {
    // Currently fallback to updating local state and preference logging
    set((state) => ({
      profile: {
        ...state.profile,
        preferences: { ...state.profile.preferences, ...prefs },
      },
    }));
  },
  
  addFunds: async (amount) => {
    const profile = get().profile;
    if (!profile.id) return;
    try {
      await api.post(`/wallet/topup?user_id=${profile.id}`, { amount });
      await get().fetchInitialData();
    } catch (e) {
      console.error("Top-up failed:", e);
      throw e;
    }
  },
  
  chargeWallet: async (amount, description) => {
    const profile = get().profile;
    if (!profile.id) return false;
    try {
      // If it's a membership subscription charge
      if (description.toLowerCase().includes("membership")) {
        const plans = await api.get<any[]>("/memberships");
        const match = plans.find(p => description.toLowerCase().includes(p.name.toLowerCase())) || plans[0];
        if (match) {
          await api.post(`/memberships/subscribe?user_id=${profile.id}`, { plan_id: match.id });
          await get().fetchInitialData();
          return true;
        }
      }
      return false;
    } catch (e) {
      console.error("Failed to charge wallet on backend:", e);
      return false;
    }
  },
  
  addCoins: async (amount) => {
    // Loyalty coins added automatically by flight/charter booking endpoints on backend
  },
  
  redeemCoupon: async (brand) => {
    const profile = get().profile;
    const coupons = get().coupons;
    if (!profile.id) return false;
    const coupon = coupons.find(c => c.brand === brand);
    if (!coupon || !coupon.id) return false;
    try {
      await api.post(`/rewards/redeem?user_id=${profile.id}`, { coupon_id: coupon.id });
      await get().fetchInitialData();
      return true;
    } catch (e) {
      console.error("Redemption failed:", e);
      return false;
    }
  },
  
  bookFlight: async (booking) => {
    const profile = get().profile;
    if (!profile.id) throw new Error("Unauthenticated");
    try {
      if (booking.type === "commercial") {
        const flights = await api.get<any[]>("/flights");
        const match = flights[0]; // Take first seeded flight as route fallback
        const response = await api.post<any>(`/bookings/?user_id=${profile.id}`, {
          flight_id: match ? match.id : "00000000-0000-0000-0000-000000000000",
          total_amount: booking.cost,
          seat_number: booking.seatNumber || "1A",
          passengers: [] // Let backend generate default
        });
        await get().fetchInitialData();
        return {
          ...booking,
          id: response.id.substring(0, 8).toUpperCase(),
          status: "Confirmed"
        };
      } else {
        const jets = await api.get<any[]>("/jets");
        // Try matching selected aircraft model to seeded private aircrafts
        const match = jets.find(j => j.model.toLowerCase() === booking.aircraft.toLowerCase()) || jets[0];
        const response = await api.post<any>(`/bookings/charter?user_id=${profile.id}`, {
          aircraft_id: match ? match.id : "00000000-0000-0000-0000-000000000000",
          legs: booking.legs || [],
          catering: booking.catering,
          chauffeur: booking.chauffeur,
          security: booking.security,
          price: booking.cost
        });
        await get().fetchInitialData();
        return {
          ...booking,
          id: response.id.substring(0, 8).toUpperCase(),
          status: "Confirmed"
        };
      }
    } catch (e) {
      console.error("Booking transaction failed:", e);
      throw e;
    }
  },
  
  addConciergeRequest: async (request) => {
    const profile = get().profile;
    if (!profile.id) return;
    try {
      await api.post(`/ai/concierge-requests?user_id=${profile.id}`, {
        type: request.type,
        details: request.details
      });
      await get().fetchInitialData();
    } catch (e) {
      console.error("Failed to add concierge request:", e);
    }
  },
  
  addSavedTrip: async (trip) => {
    set((state) => ({
      savedTrips: [
        { ...trip, id: "ST-" + Date.now(), createdAt: new Date().toISOString().split("T")[0] },
        ...state.savedTrips,
      ],
    }));
  },

  addChatMessage: (msg) => set((state) => ({
    chatHistory: [...state.chatHistory, { ...msg, id: Date.now().toString() }],
  })),
  
  clearChatHistory: () => set({ chatHistory: [] }),
  
  markNotificationRead: async (id) => {
    try {
      await api.post(`/notifications/${id}/read`);
      await get().fetchInitialData();
    } catch (e) {
      console.error("Failed to read notification:", e);
    }
  },
  
  markAllNotificationsRead: async () => {
    const unread = get().notifications.filter(n => n.unread);
    try {
      for (const n of unread) {
        await api.post(`/notifications/${n.id}/read`);
      }
      await get().fetchInitialData();
    } catch (e) {
      console.error("Failed to read all notifications:", e);
    }
  },
  addSavedCard: (card) => set((state) => {
    const updatedCards = state.savedCards.map(c => card.primary ? { ...c, primary: false } : c);
    return {
      savedCards: [...updatedCards, { ...card, id: "c-" + Date.now() }]
    };
  }),
  removeSavedCard: (id) => set((state) => ({
    savedCards: state.savedCards.filter(c => c.id !== id)
  })),
  withdrawFunds: async (amount) => {
    const profile = get().profile;
    if (!profile.id) return false;
    try {
      await api.post(`/wallet/withdraw?user_id=${profile.id}`, { amount });
      await get().fetchInitialData();
      return true;
    } catch (e) {
      console.error("Failed to withdraw funds:", e);
      return false;
    }
  },
  setCurrency: (currency) => set({ currency }),
  formatAmount: (amount) => {
    const isUSD = get().currency === "USD";
    const absVal = Math.abs(amount);
    if (isUSD) {
      return amount < 0 
        ? `-$${absVal.toLocaleString()}` 
        : `$${amount.toLocaleString()}`;
    } else {
      const inrValue = Math.round(absVal * 83);
      return amount < 0 
        ? `-₹${inrValue.toLocaleString()}` 
        : `₹${Math.round(amount * 83).toLocaleString()}`;
    }
  },
  cancelBooking: async (bookingId: string) => {
    const flights = get().flights;
    const flight = flights.find(f => f.id === bookingId || f.bookingDbId === bookingId);
    const dbId = flight?.bookingDbId || bookingId;
    try {
      await api.post(`/bookings/${dbId}/cancel`);
      await get().fetchInitialData();
      return true;
    } catch (e) {
      console.error("Failed to cancel booking:", e);
      return false;
    }
  }
}));
