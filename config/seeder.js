const mongoose = require('mongoose');
const User = require('../models/User');
const Flight = require('../models/Flight');
const Fleet = require('../models/Fleet');
const Coupon = require('../models/Coupon');
const Airline = require('../models/Airline');
const ARIS = require('../models/ARIS');

async function seedDatabase() {
  try {
    console.log('Seeder: Starting database seeding check...');

    // 1. Seed VIP Demo User
    const demoEmail = 'demo@skyluxe.com';
    let demoUser = await User.findOne({ email: demoEmail });
    if (!demoUser) {
      console.log('Seeder: Demo user not found. Creating Eashan Sterling (demo@skyluxe.com)...');
      demoUser = new User({
        firstName: 'Eashan',
        lastName: 'Sterling',
        email: demoEmail,
        password: 'Password123', // Will be hashed via pre-save hook
        phone: '+1 (555) 019-9233',
        membership: 'black elite',
        role: 'admin',
        membershipExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year expiry
        points: 25000,
        coins: 12500,
        wallet: {
          balance: 1500000, // $1.5M FBO Wallet Balance
          transactions: [
            { id: 'TX-2901', title: 'Aircraft Charter: BOM - DWC', amount: 51500, type: 'debit', date: new Date('2026-05-28'), invoice: 'INV-2901' },
            { id: 'TX-2800', title: 'Wallet Funding via Wire', amount: 250000, type: 'credit', date: new Date('2026-05-20') },
            { id: 'TX-1002', title: 'Signature Membership Renewal', amount: 100000, type: 'debit', date: new Date('2026-01-01'), invoice: 'INV-1002' },
            { id: 'TX-2844', title: 'Catering Surcharge (BOM-DEL)', amount: 1250, type: 'debit', date: new Date('2026-05-15'), invoice: 'INV-2844' }
          ]
        },
        preferences: {
          dietary: 'No shellfish. Preferred sparkling water.',
          beverages: 'Macallan 18, San Pellegrino, Espresso',
          groundTransport: 'Luxury SUV (Cadillac Escalade / Range Rover)',
          cabinAmbiance: 'Dimmed lighting during night flights. Temperature set to 21°C.'
        },
        passportStats: {
          countriesVisited: ['India', 'United Arab Emirates', 'United Kingdom'],
          favoriteDestinations: ['Dubai (DWC)', 'London (LHR)', 'Mumbai (BOM)'],
          privateJetHours: 35,
          flightsTaken: 8,
          stamps: [
            { stampId: 'stamp_bom', title: 'Mumbai BOM Departure', country: 'India', date: new Date('2026-05-15') },
            { stampId: 'stamp_dwc', title: 'Dubai DWC VIP Lounge', country: 'United Arab Emirates', date: new Date('2026-05-28') },
            { stampId: 'stamp_lhr', title: 'London Heathrow Arrival', country: 'United Kingdom', date: new Date('2026-05-30') }
          ]
        },
        achievements: ['first_flight', 'dubai_explorer', 'luxury_traveler', 'jet_setter', 'global_voyager', 'black_elite_veteran']
      });
      await demoUser.save();
      console.log('Seeder: Demo user created successfully!');
    } else {
      console.log('Seeder: Demo user already exists. Enforcing admin role, passport stats, and achievements.');
      demoUser.role = 'admin';
      demoUser.passportStats = {
        countriesVisited: ['India', 'United Arab Emirates', 'United Kingdom'],
        favoriteDestinations: ['Dubai (DWC)', 'London (LHR)', 'Mumbai (BOM)'],
        privateJetHours: 35,
        flightsTaken: 8,
        stamps: [
          { stampId: 'stamp_bom', title: 'Mumbai BOM Departure', country: 'India', date: new Date('2026-05-15') },
          { stampId: 'stamp_dwc', title: 'Dubai DWC VIP Lounge', country: 'United Arab Emirates', date: new Date('2026-05-28') },
          { stampId: 'stamp_lhr', title: 'London Heathrow Arrival', country: 'United Kingdom', date: new Date('2026-05-30') }
        ]
      };
      demoUser.achievements = ['first_flight', 'dubai_explorer', 'luxury_traveler', 'jet_setter', 'global_voyager', 'black_elite_veteran'];
      await demoUser.save();
    }

    // 2. Seed Private Jets Fleet
    const jetCount = await Fleet.countDocuments();
    if (jetCount === 0) {
      console.log('Seeder: No private jets found. Seeding fleet marketplace...');
      const jets = [
        {
          model: 'Gulfstream G700',
          range: '7,500 nm',
          speed: 'Mach 0.925',
          capacity: 19,
          hourlyRate: 9500,
          classType: 'Ultra Long Range',
          description: 'The flagship of luxury private aviation. Unmatched space and comfort.',
          imageUrl: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=800',
          amenities: ['Full Bedroom', 'High-Speed Wi-Fi', 'Showers', 'Gourmet Galley']
        },
        {
          model: 'Gulfstream G650ER',
          range: '7,500 nm',
          speed: 'Mach 0.925',
          capacity: 16,
          hourlyRate: 8500,
          classType: 'Ultra Long Range',
          description: 'Extended range masterclass. Classic beauty with high-speed performance.',
          imageUrl: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=800',
          amenities: ['Shower', 'Conference Area', 'Ka-Band Wi-Fi']
        },
        {
          model: 'Bombardier Global 7500',
          range: '7,700 nm',
          speed: 'Mach 0.925',
          capacity: 19,
          hourlyRate: 9800,
          classType: 'Ultra Long Range',
          description: 'The largest and longest range business jet. Four true living spaces.',
          imageUrl: 'https://images.unsplash.com/photo-1583095117208-161b585d9d4d?q=80&w=800',
          amenities: ['Master Suite', 'Dedicated Crew Suite', 'Cinema Room']
        },
        {
          model: 'Falcon 8X',
          range: '6,450 nm',
          speed: 'Mach 0.90',
          capacity: 14,
          hourlyRate: 7800,
          classType: 'Long Range Trijet',
          description: 'The trijet standard of elegance and airport accessibility.',
          imageUrl: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=800',
          amenities: ['Ultra-Quiet Cabin', 'Low Cabin Altitude', 'Shower']
        },
        {
          model: 'Challenger 650',
          range: '4,000 nm',
          speed: 'Mach 0.85',
          capacity: 12,
          hourlyRate: 6200,
          classType: 'Large Jet',
          description: 'Versatile heavy jet class with executive work environments.',
          imageUrl: 'https://images.unsplash.com/photo-1583095117208-161b585d9d4d?q=80&w=800',
          amenities: ['Ka-band Wi-Fi', 'Gourmet Galley', 'Enclosed Lavatory']
        },
        {
          model: 'Boeing Business Jet',
          range: '6,200 nm',
          speed: 'Mach 0.82',
          capacity: 28,
          hourlyRate: 15000,
          classType: 'VIP Airliner',
          description: 'A true home in the sky. Massive living areas for long distance VIP travel.',
          imageUrl: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=800',
          amenities: ['Master Bedroom', 'Boardroom', 'Dining Salon', 'VIP Lounge']
        },
        {
          model: 'Airbus Corporate Jet',
          range: '6,000 nm',
          speed: 'Mach 0.82',
          capacity: 25,
          hourlyRate: 14500,
          classType: 'VIP Airliner',
          description: 'Modern styling and unmatched living space.',
          imageUrl: 'https://images.unsplash.com/photo-1583095117208-161b585d9d4d?q=80&w=800',
          amenities: ['Stateroom', 'Lounge', 'Office Area', 'Gourmet Kitchen']
        }
      ];
      await Fleet.insertMany(jets);
      console.log('Seeder: Seeded private fleet successfully.');
    } else {
      console.log('Seeder: Fleet marketplace already seeded.');
    }

    // 3. Seed Airlines Brand Registry
    console.log('Seeder: Seeding Airlines brand registry...');
    await Airline.deleteMany({}); // Reset registry
    const seededAirlines = await Airline.insertMany([
      { airlineCode: 'AI', airlineName: 'Air India', iataCode: 'AI', icaoCode: 'AIC', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Air_India_Logo.svg/240px-Air_India_Logo.svg.png', brandColor: '#e01d23', country: 'India', website: 'airindia.com', alliance: 'Star Alliance' },
      { airlineCode: '6E', airlineName: 'IndiGo', iataCode: '6E', icaoCode: 'IGO', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/IndiGo_Airlines_logo.svg/240px-IndiGo_Airlines_logo.svg.png', brandColor: '#001d6c', country: 'India', website: 'goindigo.in', alliance: 'None' },
      { airlineCode: 'QP', airlineName: 'Akasa Air', iataCode: 'QP', icaoCode: 'AKJ', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Akasa_Air_logo.svg/240px-Akasa_Air_logo.svg.png', brandColor: '#ff6f00', country: 'India', website: 'akasaair.com', alliance: 'None' },
      { airlineCode: 'SG', airlineName: 'SpiceJet', iataCode: 'SG', icaoCode: 'SEJ', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/SpiceJet_logo.svg/240px-SpiceJet_logo.svg.png', brandColor: '#c8102e', country: 'India', website: 'spicejet.com', alliance: 'None' },
      { airlineCode: 'I5', airlineName: 'AirAsia India', iataCode: 'I5', icaoCode: 'IAD', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/AirAsia_logo.svg/240px-AirAsia_logo.svg.png', brandColor: '#ff0000', country: 'India', website: 'airasia.com', alliance: 'None' },
      { airlineCode: 'UK', airlineName: 'Vistara', iataCode: 'UK', icaoCode: 'VTI', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f5/Vistara_Logo.svg/240px-Vistara_Logo.svg.png', brandColor: '#5f2545', country: 'India', website: 'airvistara.com', alliance: 'None' },
      { airlineCode: 'EK', airlineName: 'Emirates', iataCode: 'EK', icaoCode: 'UAE', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Emirates_logo.svg/240px-Emirates_logo.svg.png', brandColor: '#d71920', country: 'UAE', website: 'emirates.com', alliance: 'None' },
      { airlineCode: 'QR', airlineName: 'Qatar Airways', iataCode: 'QR', icaoCode: 'QTR', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Qatar_Airways_logo.svg/240px-Qatar_Airways_logo.svg.png', brandColor: '#5c0632', country: 'Qatar', website: 'qatarairways.com', alliance: 'oneworld' },
      { airlineCode: 'EY', airlineName: 'Etihad Airways', iataCode: 'EY', icaoCode: 'ETD', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Etihad_airways_logo.svg/240px-Etihad_airways_logo.svg.png', brandColor: '#7d6b58', country: 'UAE', website: 'etihad.com', alliance: 'None' },
      { airlineCode: 'LH', airlineName: 'Lufthansa', iataCode: 'LH', icaoCode: 'DLH', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Lufthansa_Logo_2018.svg/240px-Lufthansa_Logo_2018.svg.png', brandColor: '#002f6c', country: 'Germany', website: 'lufthansa.com', alliance: 'Star Alliance' },
      { airlineCode: 'SQ', airlineName: 'Singapore Airlines', iataCode: 'SQ', icaoCode: 'SIA', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Singapore_Airlines_Logo_2.svg/240px-Singapore_Airlines_Logo_2.svg.png', brandColor: '#1d2c5c', country: 'Singapore', website: 'singaporeair.com', alliance: 'Star Alliance' },
      { airlineCode: 'BA', airlineName: 'British Airways', iataCode: 'BA', icaoCode: 'BAW', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/British_Airways_Logo.svg/240px-British_Airways_Logo.svg.png', brandColor: '#072286', country: 'UK', website: 'britishairways.com', alliance: 'oneworld' },
      { airlineCode: 'TK', airlineName: 'Turkish Airlines', iataCode: 'TK', icaoCode: 'THY', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Turkish_Airlines_logo_2019.svg/240px-Turkish_Airlines_logo_2019.svg.png', brandColor: '#d81f26', country: 'Turkey', website: 'turkishairlines.com', alliance: 'Star Alliance' },
      { airlineCode: 'KL', airlineName: 'KLM', iataCode: 'KL', icaoCode: 'KLM', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/KLM_logo.svg/240px-KLM_logo.svg.png', brandColor: '#00a1de', country: 'Netherlands', website: 'klm.com', alliance: 'SkyTeam' },
      { airlineCode: 'AF', airlineName: 'Air France', iataCode: 'AF', icaoCode: 'AFR', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Air_France_Logo.svg/240px-Air_France_Logo.svg.png', brandColor: '#002395', country: 'France', website: 'airfrance.com', alliance: 'SkyTeam' },
      { airlineCode: 'CX', airlineName: 'Cathay Pacific', iataCode: 'CX', icaoCode: 'CPA', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Cathay_Pacific_logo.svg/240px-Cathay_Pacific_logo.svg.png', brandColor: '#006564', country: 'Hong Kong', website: 'cathaypacific.com', alliance: 'oneworld' },
      { airlineCode: 'VS', airlineName: 'Virgin Atlantic', iataCode: 'VS', icaoCode: 'VIR', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Virgin_Atlantic_logo.svg/240px-Virgin_Atlantic_logo.svg.png', brandColor: '#da291c', country: 'UK', website: 'virginatlantic.com', alliance: 'SkyTeam' },
      { airlineCode: 'LX', airlineName: 'Swiss', iataCode: 'LX', icaoCode: 'SWR', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Swiss_International_Air_Lines_logo.svg/240px-Swiss_International_Air_Lines_logo.svg.png', brandColor: '#e10600', country: 'Switzerland', website: 'swiss.com', alliance: 'Star Alliance' },
      { airlineCode: 'WY', airlineName: 'Oman Air', iataCode: 'WY', icaoCode: 'OMA', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Oman_Air_logo.svg/240px-Oman_Air_logo.svg.png', brandColor: '#9d8349', country: 'Oman', website: 'omanair.com', alliance: 'None' },
      { airlineCode: 'FZ', airlineName: 'FlyDubai', iataCode: 'FZ', icaoCode: 'FDB', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Flydubai_logo.svg/240px-Flydubai_logo.svg.png', brandColor: '#007ac2', country: 'UAE', website: 'flydubai.com', alliance: 'None' }
    ]);
    console.log('Seeder: Seeded 20 airlines successfully.');

    // 4. Seed Commercial Flights
    console.log('Seeder: Resetting flights schedule...');
    await Flight.deleteMany({});

    const flightsToSeed = [];
    const airIndia = seededAirlines.find(a => a.airlineCode === 'AI')._id;
    const indigo = seededAirlines.find(a => a.airlineCode === '6E')._id;
    const akasa = seededAirlines.find(a => a.airlineCode === 'QP')._id;
    const emirates = seededAirlines.find(a => a.airlineCode === 'EK')._id;
    const qatar = seededAirlines.find(a => a.airlineCode === 'QR')._id;
    const singapore = seededAirlines.find(a => a.airlineCode === 'SQ')._id;
    const vistara = seededAirlines.find(a => a.airlineCode === 'UK')._id;

    // Create daily flights for the next 7 days
    for (let day = 0; day < 7; day++) {
      const dateStr = new Date();
      dateStr.setDate(dateStr.getDate() + day);
      
      // 1. BOM to DWC flights (Mumbai to Dubai)
      const depTimeEK = new Date(dateStr); depTimeEK.setHours(9, 0, 0, 0);
      const arrTimeEK = new Date(depTimeEK); arrTimeEK.setHours(11, 30, 0, 0);
      flightsToSeed.push({
        flightNumber: `EK-${500 + day}`,
        airline: emirates,
        aircraft: 'Airbus A380',
        departure: { airport: 'BOM', city: 'Mumbai', time: depTimeEK },
        arrival: { airport: 'DWC', city: 'Dubai Al Maktoum', time: arrTimeEK },
        duration: 150,
        price: { economy: 450, business: 1500, first: 3800 },
        availableSeats: { economy: 120, business: 32, first: 8 },
        status: 'scheduled',
        amenities: ['wifi', 'meals', 'entertainment', 'lounge', 'priority']
      });

      const depTimeAI = new Date(dateStr); depTimeAI.setHours(14, 0, 0, 0);
      const arrTimeAI = new Date(depTimeAI); arrTimeAI.setHours(16, 30, 0, 0);
      flightsToSeed.push({
        flightNumber: `AI-${100 + day}`,
        airline: airIndia,
        aircraft: 'Airbus A350-900',
        departure: { airport: 'BOM', city: 'Mumbai', time: depTimeAI },
        arrival: { airport: 'DWC', city: 'Dubai Al Maktoum', time: arrTimeAI },
        duration: 150,
        price: { economy: 350, business: 1200, first: 3100 },
        availableSeats: { economy: 150, business: 24, first: 6 },
        status: 'scheduled',
        amenities: ['wifi', 'meals', 'entertainment', 'lounge', 'priority']
      });

      const depTime6E = new Date(dateStr); depTime6E.setHours(20, 15, 0, 0);
      const arrTime6E = new Date(depTime6E); arrTime6E.setHours(22, 45, 0, 0);
      flightsToSeed.push({
        flightNumber: `6E-${300 + day}`,
        airline: indigo,
        aircraft: 'Airbus A321neo',
        departure: { airport: 'BOM', city: 'Mumbai', time: depTime6E },
        arrival: { airport: 'DWC', city: 'Dubai Al Maktoum', time: arrTime6E },
        duration: 150,
        price: { economy: 210, business: 790, first: 1900 },
        availableSeats: { economy: 180, business: 12, first: 0 },
        status: 'scheduled',
        amenities: ['meals', 'priority']
      });

      const depTimeQP = new Date(dateStr); depTimeQP.setHours(7, 15, 0, 0);
      const arrTimeQP = new Date(depTimeQP); arrTimeQP.setHours(9, 45, 0, 0);
      flightsToSeed.push({
        flightNumber: `QP-${400 + day}`,
        airline: akasa,
        aircraft: 'Boeing 737 MAX 8',
        departure: { airport: 'BOM', city: 'Mumbai', time: depTimeQP },
        arrival: { airport: 'DWC', city: 'Dubai Al Maktoum', time: arrTimeQP },
        duration: 150,
        price: { economy: 180, business: 650, first: 1600 },
        availableSeats: { economy: 170, business: 8, first: 0 },
        status: 'scheduled',
        amenities: ['meals']
      });

      // 2. SIN to BOM flights (Singapore to Mumbai)
      const depTimeSQ = new Date(dateStr); depTimeSQ.setHours(7, 30, 0, 0);
      const arrTimeSQ = new Date(depTimeSQ); arrTimeSQ.setHours(11, 0, 0, 0);
      flightsToSeed.push({
        flightNumber: `SQ-${420 + day}`,
        airline: singapore,
        aircraft: 'Boeing 777-300ER',
        departure: { airport: 'SIN', city: 'Singapore', time: depTimeSQ },
        arrival: { airport: 'BOM', city: 'Mumbai', time: arrTimeSQ },
        duration: 210,
        price: { economy: 550, business: 1800, first: 4200 },
        availableSeats: { economy: 90, business: 24, first: 4 },
        status: 'scheduled',
        amenities: ['wifi', 'meals', 'entertainment', 'lounge', 'priority']
      });

      // 3. DWC to LHR flights (Dubai to London)
      const depTimeQR = new Date(dateStr); depTimeQR.setHours(13, 0, 0, 0);
      const arrTimeQR = new Date(depTimeQR); arrTimeQR.setHours(17, 30, 0, 0);
      flightsToSeed.push({
        flightNumber: `QR-${200 + day}`,
        airline: qatar,
        aircraft: 'Airbus A350-1000',
        departure: { airport: 'DWC', city: 'Dubai Al Maktoum', time: depTimeQR },
        arrival: { airport: 'LHR', city: 'London Heathrow', time: arrTimeQR },
        duration: 270,
        price: { economy: 850, business: 2800, first: 6500 },
        availableSeats: { economy: 150, business: 40, first: 12 },
        status: 'scheduled',
        amenities: ['wifi', 'meals', 'entertainment', 'lounge', 'priority']
      });
    }

    await Flight.insertMany(flightsToSeed);
    console.log('Seeder: Seeded commercial flights successfully.');

    // 5. Seed Reward Coupons
    const couponCount = await Coupon.countDocuments();
    if (couponCount === 0) {
      console.log('Seeder: No reward vouchers found. Seeding coupons marketplace...');
      const coupons = [
        {
          brand: 'Zara',
          offer: '₹5,000 Premium Voucher',
          pointsRequired: 500,
          imageUrl: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=800'
        },
        {
          brand: 'Apple',
          offer: 'AirPods Pro (2nd Gen)',
          pointsRequired: 1000,
          imageUrl: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?q=80&w=800'
        },
        {
          brand: 'Air India',
          offer: 'Complimentary Business Upgrade',
          pointsRequired: 1500,
          imageUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=800'
        },
        {
          brand: 'Luxury Hotels',
          offer: 'VIP Helicopter Transfer (DWC)',
          pointsRequired: 3000,
          imageUrl: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=800'
        },
        {
          brand: 'Lounge Upgrades',
          offer: 'Complimentary 1-Night Suite',
          pointsRequired: 5000,
          imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800'
        }
      ];
      await Coupon.insertMany(coupons);
      console.log('Seeder: Seeded rewards vouchers successfully.');
    } else {
      console.log('Seeder: Rewards vouchers already seeded.');
    }

    // 6. Seed ARIS (Airline Reintelligence System) Collections
    const arisCount = await ARIS.DemandForecast.countDocuments();
    if (arisCount === 0) {
      console.log('Seeder: No ARIS intelligence metrics found. Initializing AI reintelligence data...');

      // 6.1 Demand Forecasts
      const demandData = [
        { route: 'BOM-DWC', date: new Date(), demandIndex: 94, confidenceLevel: 92, forecast7d: 95, forecast30d: 91, forecast90d: 88, forecast365d: 85, seasonalFactors: ['Weekend business rush', 'Dubai Summer Shopping Festival'] },
        { route: 'CDG-AUS', date: new Date(), demandIndex: 87, confidenceLevel: 89, forecast7d: 82, forecast30d: 85, forecast90d: 92, forecast365d: 89, seasonalFactors: ['SXSW Festival', 'Summer tourism surge'] },
        { route: 'SIN-BOM', date: new Date(), demandIndex: 76, confidenceLevel: 91, forecast7d: 78, forecast30d: 75, forecast90d: 80, forecast365d: 82, seasonalFactors: ['Monsoon business travel'] },
        { route: 'DEL-GOA', date: new Date(), demandIndex: 88, confidenceLevel: 90, forecast7d: 92, forecast30d: 86, forecast90d: 79, forecast365d: 91, seasonalFactors: ['Festivals holiday rush', 'Weekend getaway peak'] }
      ];
      await ARIS.DemandForecast.insertMany(demandData);

      // 6.2 Route Recommendations
      const routeData = [
        { origin: 'Lucknow', destination: 'Dubai', confidence: 88, expectedLoadFactor: 81, expectedRevenue: 14000000, reason: 'High direct search traffic and high-yield business travel.', status: 'high_growth' },
        { origin: 'Bengaluru', destination: 'London', confidence: 82, expectedLoadFactor: 78, expectedRevenue: 22000000, reason: 'Underserved business connectivity for tech corporations.', status: 'emerging' },
        { origin: 'Mumbai', destination: 'New York', confidence: 91, expectedLoadFactor: 84, expectedRevenue: 45000000, reason: 'High-value direct segment currently utilizing secondary hubs.', status: 'high_growth' },
        { origin: 'Delhi', destination: 'Singapore', confidence: 72, expectedLoadFactor: 65, expectedRevenue: 12000000, reason: 'High competitor capacity density reducing load margins.', status: 'declining' }
      ];
      await ARIS.RouteRecommendation.insertMany(routeData);

      // 6.3 Customer Segments
      const segmentData = [
        { segment: 'Luxury Traveler', upgradeProbability: 85, membershipConversion: 78, lifetimeValue: 450000, churnRisk: 8, travelIntent: 'Leisure / Yacht Charters', recommendedActions: ['Offer bespoke VIP lounge upgrades', 'Personalized private jet charters'] },
        { segment: 'Business Traveler', upgradeProbability: 65, membershipConversion: 91, lifetimeValue: 280000, churnRisk: 12, travelIntent: 'Frequent Corporate', recommendedActions: ['Fast-track security clearances', 'Corporate wallet credit programs'] },
        { segment: 'Frequent Flyer', upgradeProbability: 40, membershipConversion: 55, lifetimeValue: 150000, churnRisk: 18, travelIntent: 'Mix Business & Leisure', recommendedActions: ['Targeted membership renewal rewards', 'SkyCoins bonus point campaigns'] }
      ];
      await ARIS.CustomerSegment.insertMany(segmentData);

      // 6.4 Pricing Insights
      const pricingData = [
        { flightNumber: 'EK-500', currentPrice: 450, recommendedPrice: 480, revenueGain: 7, elasticity: 'low', sensitivity: 22, priceHistory: [{ date: new Date(Date.now() - 3 * 24 * 3600 * 1000), price: 420 }, { date: new Date(Date.now() - 24 * 3600 * 1000), price: 450 }] },
        { flightNumber: 'AI-100', currentPrice: 350, recommendedPrice: 370, revenueGain: 6, elasticity: 'low', sensitivity: 31, priceHistory: [{ date: new Date(Date.now() - 3 * 24 * 3600 * 1000), price: 340 }, { date: new Date(Date.now() - 24 * 3600 * 1000), price: 350 }] }
      ];
      await ARIS.PricingInsight.insertMany(pricingData);

      // 6.5 Fleet Analytics
      const fleetData = [
        { aircraftModel: 'Gulfstream G700', currentHub: 'Mumbai (BOM)', recommendedHub: 'Dubai (DWC)', usageHours: 1200, idleHours: 350, maintenanceCycle: 88, utilizationRate: 77, expectedImprovement: 12 },
        { aircraftModel: 'Bombardier Global 7500', currentHub: 'Dubai (DWC)', recommendedHub: 'Singapore (SIN)', usageHours: 1400, idleHours: 250, maintenanceCycle: 92, utilizationRate: 85, expectedImprovement: 8 },
        { aircraftModel: 'Boeing Business Jet', currentHub: 'Delhi (DEL)', recommendedHub: 'London (LHR)', usageHours: 850, idleHours: 600, maintenanceCycle: 78, utilizationRate: 58, expectedImprovement: 15 }
      ];
      await ARIS.FleetAnalytic.insertMany(fleetData);

      // 6.6 Revenue Forecasts
      const revenueData = [
        { month: '2026-06', projectedRevenue: 5200000, expectedGrowth: 12, commercialRevenue: 1500000, charterRevenue: 2500000, membershipRevenue: 1200000 },
        { month: '2026-07', projectedRevenue: 5800000, expectedGrowth: 11, commercialRevenue: 1750000, charterRevenue: 2800000, membershipRevenue: 1250000 },
        { month: '2026-08', projectedRevenue: 6400000, expectedGrowth: 10, commercialRevenue: 2000000, charterRevenue: 3100000, membershipRevenue: 1300000 }
      ];
      await ARIS.RevenueForecast.insertMany(revenueData);

      // 6.7 Operational Alerts
      const operationalData = [
        { airport: 'BOM (Mumbai)', delayMinutes: 12, congestionLevel: 'medium', recommendations: 'Initiate FBO ground handling ramp buffer.', impact: 8 },
        { airport: 'DWC (Dubai)', delayMinutes: 24, congestionLevel: 'high', recommendations: 'Increase turnaround buffer at DWC FBO hangar.', impact: 11 },
        { airport: 'LHR (London)', delayMinutes: 35, congestionLevel: 'high', recommendations: 'Pre-file landing slots via alternative VIP terminal.', impact: 14 }
      ];
      await ARIS.OperationalAlert.insertMany(operationalData);

      // 6.8 Loyalty Insights
      if (demoUser) {
        await new ARIS.LoyaltyInsight({
          user: demoUser._id,
          redemptionLikelihood: 82,
          campaignOffered: 'Lounge Vouchers Bonus Program',
          couponRecommended: 'VIP Helicopter Transfer (DWC)',
          membershipUpgradeLikelihood: 15
        }).save();

        // 6.9 Travel Passport Analytics
        await new ARIS.TravelPassportAnalytic({
          user: demoUser._id,
          profileType: 'High Value Voyager',
          countriesVisitedCount: 8,
          totalJetHours: 42,
          milestonesUnlockedCount: 6
        }).save();

        // 6.10 AI Recommendations
        await new ARIS.AIRecommendation({
          user: demoUser._id,
          destination: 'Dubai (DWC)',
          hotels: [
            { name: 'Armani Hotel Dubai', rating: 4.8, price: 850 },
            { name: 'Burj Al Arab Jumeirah', rating: 4.9, price: 1650 }
          ],
          transfers: [
            { type: 'Rolls Royce Phantom VIP Transfer', price: 450 },
            { type: 'H145 Helicopter Shuttle DWC-DXB', price: 1200 }
          ],
          dining: [
            { name: 'Al Mahara (Undersea Dining)', cuisine: 'Seafood Fine Dining' },
            { name: 'Tresind Studio (2 Michelin Stars)', cuisine: 'Modern Indian Gastronomy' }
          ],
          experiences: [
            { title: 'Private Helicopter Tour of Palm Jumeirah', price: 900 },
            { title: 'Sunset Yacht Charter from Dubai Marina', price: 2500 }
          ]
        }).save();
      }

      // 6.11 Model Metrics
      const metricsData = [
        { modelName: 'DemandForecaster', accuracy: 94.2, loss: 0.045, version: 'v2.1.0' },
        { modelName: 'PricingOptimizer', accuracy: 91.5, loss: 0.071, version: 'v1.4.2' },
        { modelName: 'RoutePlanner', accuracy: 88.7, loss: 0.112, version: 'v3.0.1' }
      ];
      await ARIS.ModelMetric.insertMany(metricsData);

      // 6.12 Executive Insights
      const insightsData = [
        { title: 'Highest Revenue Route', category: 'revenue', description: 'Mumbai to Dubai flights led domestic & regional charter revenues.', value: '$1.2M', trend: '+14% vs last month' },
        { title: 'Underutilized Asset', category: 'fleet', description: 'Boeing Business Jet BBJ idle time exceeded 40% at Delhi Hub.', value: 'BBJ-02', trend: 'Recommend shift to London Hub' },
        { title: 'Redemption Trend Alert', category: 'loyalty', description: 'Lounge voucher redemptions spiked by 35% in Executive tier.', value: 'Vouchers', trend: '+35% redemption volume' }
      ];
      await ARIS.ExecutiveInsight.insertMany(insightsData);

      console.log('Seeder: Seeded ARIS intelligence metrics successfully.');
    } else {
      console.log('Seeder: ARIS intelligence metrics already seeded.');
    }

    console.log('Seeder: Completed database seeding checks.');
  } catch (error) {
    console.error('Seeder: Database seeding failed:', error);
  }
}

module.exports = { seedDatabase };
