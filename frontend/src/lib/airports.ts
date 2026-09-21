export interface Airport {
  code: string;
  city: string;
  name: string;
  country: string;
  region: "India" | "Middle East" | "Europe" | "Americas" | "Asia Pacific";
  lat: number;
  lon: number;
}

export const AIRPORTS: Airport[] = [
  // --- INDIA: Tier 1 Metros & Gateways ---
  { code: "BOM", city: "Mumbai", name: "Chhatrapati Shivaji Maharaj Int'l", country: "India", region: "India", lat: 19.0896, lon: 72.8656 },
  { code: "DEL", city: "Delhi", name: "Indira Gandhi Int'l", country: "India", region: "India", lat: 28.5562, lon: 77.1000 },
  { code: "BLR", city: "Bengaluru", name: "Kempegowda Int'l", country: "India", region: "India", lat: 13.1986, lon: 77.7066 },
  { code: "HYD", city: "Hyderabad", name: "Rajiv Gandhi Int'l", country: "India", region: "India", lat: 17.2403, lon: 78.4294 },
  { code: "MAA", city: "Chennai", name: "Chennai Int'l", country: "India", region: "India", lat: 12.9941, lon: 80.1709 },
  { code: "CCU", city: "Kolkata", name: "Netaji Subhash Chandra Bose Int'l", country: "India", region: "India", lat: 22.6547, lon: 88.4467 },
  { code: "AMD", city: "Ahmedabad", name: "Sardar Vallabhbhai Patel Int'l", country: "India", region: "India", lat: 23.0772, lon: 72.6347 },
  { code: "PNQ", city: "Pune", name: "Pune Int'l", country: "India", region: "India", lat: 18.5822, lon: 73.9197 },

  // --- INDIA: Tier 2, State Capitals & Tourism Hubs ---
  { code: "GOI", city: "Goa (Dabolim)", name: "Dabolim Airport", country: "India", region: "India", lat: 15.3808, lon: 73.8314 },
  { code: "GOX", city: "Goa (Mopa)", name: "Manohar Int'l Airport", country: "India", region: "India", lat: 15.7667, lon: 73.8667 },
  { code: "COK", city: "Kochi", name: "Cochin Int'l Airport", country: "India", region: "India", lat: 10.1556, lon: 76.4019 },
  { code: "JAI", city: "Jaipur", name: "Jaipur Int'l Airport", country: "India", region: "India", lat: 26.8242, lon: 75.8122 },
  { code: "LKO", city: "Lucknow", name: "Chaudhary Charan Singh Int'l", country: "India", region: "India", lat: 26.7606, lon: 80.8893 },
  { code: "VNS", city: "Varanasi", name: "Lal Bahadur Shastri Int'l", country: "India", region: "India", lat: 25.4522, lon: 82.8594 },
  { code: "SXR", city: "Srinagar", name: "Sheikh ul-Alam Int'l Airport", country: "India", region: "India", lat: 33.9871, lon: 74.7742 },
  { code: "IXC", city: "Chandigarh", name: "Shaheed Bhagat Singh Int'l", country: "India", region: "India", lat: 30.6735, lon: 76.7885 },
  { code: "ATQ", city: "Amritsar", name: "Sri Guru Ram Dass Jee Int'l", country: "India", region: "India", lat: 31.7096, lon: 74.7973 },
  { code: "GAU", city: "Guwahati", name: "Lokpriya Gopinath Bordoloi Int'l", country: "India", region: "India", lat: 26.1061, lon: 91.5859 },
  { code: "BBI", city: "Bhubaneswar", name: "Biju Patnaik Int'l", country: "India", region: "India", lat: 20.2444, lon: 85.8178 },
  { code: "IDR", city: "Indore", name: "Devi Ahilyabai Holkar Int'l", country: "India", region: "India", lat: 22.7217, lon: 75.8011 },
  { code: "PAT", city: "Patna", name: "Jay Prakash Narayan Airport", country: "India", region: "India", lat: 25.5913, lon: 85.0880 },
  { code: "TRV", city: "Thiruvananthapuram", name: "Trivandrum Int'l Airport", country: "India", region: "India", lat: 8.4821, lon: 76.9200 },
  { code: "CCJ", city: "Kozhikode", name: "Calicut Int'l Airport", country: "India", region: "India", lat: 11.1369, lon: 75.9553 },
  { code: "CJB", city: "Coimbatore", name: "Coimbatore Int'l Airport", country: "India", region: "India", lat: 11.0300, lon: 77.0434 },
  { code: "IXE", city: "Mangalore", name: "Mangaluru Int'l Airport", country: "India", region: "India", lat: 12.9613, lon: 74.8900 },
  { code: "VTZ", city: "Visakhapatnam", name: "Visakhapatnam Int'l", country: "India", region: "India", lat: 17.7215, lon: 83.2245 },
  { code: "IXB", city: "Bagdogra / Siliguri", name: "Bagdogra Airport", country: "India", region: "India", lat: 26.6812, lon: 88.3286 },
  { code: "UDR", city: "Udaipur", name: "Maharana Pratap Airport", country: "India", region: "India", lat: 24.6177, lon: 73.8961 },
  { code: "DED", city: "Dehradun", name: "Jolly Grant Airport", country: "India", region: "India", lat: 30.1897, lon: 78.1803 },
  { code: "IXR", city: "Ranchi", name: "Birsa Munda Airport", country: "India", region: "India", lat: 23.3143, lon: 85.3217 },
  { code: "BHO", city: "Bhopal", name: "Raja Bhoj Airport", country: "India", region: "India", lat: 23.2875, lon: 77.3378 },
  { code: "STV", city: "Surat", name: "Surat Int'l Airport", country: "India", region: "India", lat: 21.1139, lon: 72.7419 },
  { code: "NAG", city: "Nagpur", name: "Dr. Babasaheb Ambedkar Int'l", country: "India", region: "India", lat: 21.0922, lon: 79.0472 },
  { code: "BDQ", city: "Vadodara", name: "Vadodara Airport", country: "India", region: "India", lat: 22.3362, lon: 73.2263 },
  { code: "RPR", city: "Raipur", name: "Swami Vivekananda Airport", country: "India", region: "India", lat: 21.1804, lon: 81.7388 },
  { code: "IXM", city: "Madurai", name: "Madurai Airport", country: "India", region: "India", lat: 9.8345, lon: 78.0934 },
  { code: "TRZ", city: "Tiruchirappalli", name: "Tiruchirappalli Int'l", country: "India", region: "India", lat: 10.7654, lon: 78.7097 },
  { code: "IMF", city: "Imphal", name: "Bir Tikendrajit Int'l", country: "India", region: "India", lat: 24.7600, lon: 93.8967 },
  { code: "IXA", city: "Agartala", name: "Maharaja Bir Bikram Airport", country: "India", region: "India", lat: 23.8870, lon: 91.2404 },
  { code: "IXZ", city: "Port Blair", name: "Veer Savarkar Int'l", country: "India", region: "India", lat: 11.6410, lon: 92.7297 },
  { code: "IXL", city: "Leh", name: "Kushok Bakula Rimpochee Airport", country: "India", region: "India", lat: 34.1359, lon: 77.5465 },
  { code: "AYJ", city: "Ayodhya", name: "Maharishi Valmiki Int'l", country: "India", region: "India", lat: 26.7461, lon: 82.1558 },
  { code: "JRH", city: "Jorhat", name: "Jorhat Airport", country: "India", region: "India", lat: 26.7319, lon: 94.1755 },
  { code: "DIB", city: "Dibrugarh", name: "Dibrugarh Airport", country: "India", region: "India", lat: 27.4839, lon: 95.0185 },
  { code: "GWL", city: "Gwalior", name: "Rajmata Vijaya Raje Scindia", country: "India", region: "India", lat: 26.2933, lon: 78.2278 },
  { code: "JGA", city: "Jamnagar", name: "Jamnagar Airport", country: "India", region: "India", lat: 22.4650, lon: 70.0125 },
  { code: "RAJ", city: "Rajkot", name: "Rajkot Int'l Airport", country: "India", region: "India", lat: 22.3092, lon: 70.7794 },

  // --- MIDDLE EAST & VIP HUBS ---
  { code: "DWC", city: "Dubai (DWC)", name: "Al Maktoum VIP / Executive", country: "UAE", region: "Middle East", lat: 24.8960, lon: 55.1614 },
  { code: "DXB", city: "Dubai (DXB)", name: "Dubai Int'l Airport", country: "UAE", region: "Middle East", lat: 25.2532, lon: 55.3657 },
  { code: "AUH", city: "Abu Dhabi", name: "Zayed Int'l Airport", country: "UAE", region: "Middle East", lat: 24.4330, lon: 54.6511 },
  { code: "DOH", city: "Doha", name: "Hamad Int'l Airport", country: "Qatar", region: "Middle East", lat: 25.2731, lon: 51.6081 },
  { code: "MCT", city: "Muscat", name: "Muscat Int'l Airport", country: "Oman", region: "Middle East", lat: 23.5933, lon: 58.2844 },
  { code: "BAH", city: "Bahrain", name: "Bahrain Int'l Airport", country: "Bahrain", region: "Middle East", lat: 26.2708, lon: 50.6336 },
  { code: "RUH", city: "Riyadh", name: "King Khalid Int'l", country: "Saudi Arabia", region: "Middle East", lat: 24.9576, lon: 46.6988 },
  { code: "JED", city: "Jeddah", name: "King Abdulaziz Int'l", country: "Saudi Arabia", region: "Middle East", lat: 21.6796, lon: 39.1565 },

  // --- EUROPE & UK ---
  { code: "LHR", city: "London (Heathrow)", name: "Heathrow Airport", country: "United Kingdom", region: "Europe", lat: 51.4700, lon: -0.4543 },
  { code: "FAB", city: "London (Farnborough)", name: "Farnborough Executive FBO", country: "United Kingdom", region: "Europe", lat: 51.2758, lon: -0.7763 },
  { code: "LGW", city: "London (Gatwick)", name: "Gatwick Airport", country: "United Kingdom", region: "Europe", lat: 51.1537, lon: -0.1821 },
  { code: "CDG", city: "Paris (CDG)", name: "Charles de Gaulle", country: "France", region: "Europe", lat: 49.0097, lon: 2.5479 },
  { code: "LBG", city: "Paris (Le Bourget)", name: "Paris Le Bourget VIP FBO", country: "France", region: "Europe", lat: 48.9694, lon: 2.4414 },
  { code: "FRA", city: "Frankfurt", name: "Frankfurt Airport", country: "Germany", region: "Europe", lat: 50.0379, lon: 8.5622 },
  { code: "MUC", city: "Munich", name: "Munich Airport", country: "Germany", region: "Europe", lat: 48.3537, lon: 11.7750 },
  { code: "AMS", city: "Amsterdam", name: "Amsterdam Schiphol", country: "Netherlands", region: "Europe", lat: 52.3105, lon: 4.7683 },
  { code: "ZRH", city: "Zurich", name: "Zurich Airport", country: "Switzerland", region: "Europe", lat: 47.4582, lon: 8.5555 },
  { code: "GVA", city: "Geneva", name: "Geneva Cointrin FBO", country: "Switzerland", region: "Europe", lat: 46.2370, lon: 6.1092 },
  { code: "FCO", city: "Rome", name: "Leonardo da Vinci–Fiumicino", country: "Italy", region: "Europe", lat: 41.8003, lon: 12.2389 },
  { code: "MXP", city: "Milan", name: "Milan Malpensa", country: "Italy", region: "Europe", lat: 45.6301, lon: 8.7255 },

  // --- ASIA PACIFIC & LUXURY ISLANDS ---
  { code: "SIN", city: "Singapore", name: "Singapore Changi Airport", country: "Singapore", region: "Asia Pacific", lat: 1.3644, lon: 103.9915 },
  { code: "MLE", city: "Malé (Maldives)", name: "Velana Int'l Airport", country: "Maldives", region: "Asia Pacific", lat: 4.1918, lon: 73.5290 },
  { code: "BKK", city: "Bangkok", name: "Suvarnabhumi Airport", country: "Thailand", region: "Asia Pacific", lat: 13.6900, lon: 100.7501 },
  { code: "HKT", city: "Phuket", name: "Phuket Int'l Airport", country: "Thailand", region: "Asia Pacific", lat: 8.1132, lon: 98.3169 },
  { code: "DPS", city: "Bali (Denpasar)", name: "Ngurah Rai Int'l", country: "Indonesia", region: "Asia Pacific", lat: -8.7482, lon: 115.1672 },
  { code: "HND", city: "Tokyo (Haneda)", name: "Haneda Airport", country: "Japan", region: "Asia Pacific", lat: 35.5494, lon: 139.7798 },
  { code: "NRT", city: "Tokyo (Narita)", name: "Narita Int'l", country: "Japan", region: "Asia Pacific", lat: 35.7720, lon: 140.3929 },
  { code: "HKG", city: "Hong Kong", name: "Hong Kong Int'l", country: "Hong Kong", region: "Asia Pacific", lat: 22.3080, lon: 113.9185 },
  { code: "SYD", city: "Sydney", name: "Kingsford Smith", country: "Australia", region: "Asia Pacific", lat: -33.9399, lon: 151.1753 },
  { code: "MEL", city: "Melbourne", name: "Melbourne Airport", country: "Australia", region: "Asia Pacific", lat: -37.6690, lon: 144.8410 },

  // --- AMERICAS ---
  { code: "JFK", city: "New York (JFK)", name: "John F. Kennedy Int'l", country: "United States", region: "Americas", lat: 40.6413, lon: -73.7781 },
  { code: "EWR", city: "New York (Newark)", name: "Newark Liberty Int'l", country: "United States", region: "Americas", lat: 40.6895, lon: -74.1745 },
  { code: "LAX", city: "Los Angeles", name: "Los Angeles Int'l", country: "United States", region: "Americas", lat: 33.9416, lon: -118.4085 },
  { code: "SFO", city: "San Francisco", name: "San Francisco Int'l", country: "United States", region: "Americas", lat: 37.6213, lon: -122.3790 },
  { code: "ORD", city: "Chicago", name: "O'Hare Int'l", country: "United States", region: "Americas", lat: 41.9742, lon: -87.9073 },
  { code: "MIA", city: "Miami", name: "Miami Int'l", country: "United States", region: "Americas", lat: 25.7959, lon: -80.2870 },
  { code: "YYZ", city: "Toronto", name: "Toronto Pearson Int'l", country: "Canada", region: "Americas", lat: 43.6777, lon: -79.6248 },
  { code: "YVR", city: "Vancouver", name: "Vancouver Int'l", country: "Canada", region: "Americas", lat: 49.1967, lon: -123.1815 }
];

export function getAirportByCode(code: string): Airport | undefined {
  if (!code) return undefined;
  const c = code.toUpperCase().trim();
  return AIRPORTS.find(a => a.code === c);
}

export function formatAirportDisplay(airport: Airport): string {
  return `${airport.city} (${airport.code})`;
}

export function searchAirports(query: string): Airport[] {
  if (!query) return AIRPORTS;
  const q = query.toLowerCase().trim();
  return AIRPORTS.filter(
    a =>
      a.city.toLowerCase().includes(q) ||
      a.code.toLowerCase().includes(q) ||
      a.name.toLowerCase().includes(q) ||
      a.country.toLowerCase().includes(q)
  );
}

/**
 * Calculates Great-Circle distance between two airports using the Haversine formula (in kilometers)
 */
export function calculateDistanceKm(code1: string, code2: string): number {
  const a1 = getAirportByCode(code1);
  const a2 = getAirportByCode(code2);

  if (!a1 || !a2) return 1200; // Default estimate if airport not recognized

  const R = 6371; // Earth's mean radius in km
  const dLat = ((a2.lat - a1.lat) * Math.PI) / 180;
  const dLon = ((a2.lon - a1.lon) * Math.PI) / 180;
  const lat1 = (a1.lat * Math.PI) / 180;
  const lat2 = (a2.lat * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}
