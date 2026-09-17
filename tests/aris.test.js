const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../models/User');
const ARIS = require('../models/ARIS');
const Payment = require('../models/Payment');
const Booking = require('../models/Booking');

describe('ARIS (Airline Reintelligence System) Routes', () => {
  let testUser;
  let token;

  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGODB_URI);

    // Clear ARIS collections
    await User.deleteMany({});
    await ARIS.DemandForecast.deleteMany({});
    await ARIS.RouteRecommendation.deleteMany({});
    await ARIS.CustomerSegment.deleteMany({});
    await ARIS.PricingInsight.deleteMany({});
    await ARIS.FleetAnalytic.deleteMany({});
    await ARIS.OperationalAlert.deleteMany({});
    await ARIS.LoyaltyInsight.deleteMany({});
    await ARIS.ExecutiveInsight.deleteMany({});
    await ARIS.ModelMetric.deleteMany({});
    await ARIS.InferenceLog.deleteMany({});
    await ARIS.FlightSearch.deleteMany({});
    await Booking.deleteMany({});
    await Payment.deleteMany({});

    // Create test admin user
    testUser = await User.create({
      firstName: 'Eashan',
      lastName: 'Sterling',
      email: 'exec@skyluxe.com',
      password: 'password123',
      role: 'admin'
    });

    // Seed extra mock users
    await User.create([
      { firstName: 'Sarah', lastName: 'Jenkins', email: 'sarah@jenkins.com', password: 'password123' },
      { firstName: 'Rahul', lastName: 'Mehta', email: 'rahul@mehta.com', password: 'password123' },
      { firstName: 'David', lastName: 'Sterling', email: 'david@sterling.com', password: 'password123' },
      { firstName: 'Emma', lastName: 'Watson', email: 'emma@watson.com', password: 'password123' }
    ]);

    // Seed searches
    for (let i = 0; i < 12; i++) {
      await new ARIS.FlightSearch({
        from: i % 2 === 0 ? 'BOM' : 'LHR',
        to: 'DWC',
        cabinClass: 'economy',
        passengers: 1,
        timestamp: new Date()
      }).save();
    }

    // Seed bookings
    const seededUsers = await User.find();
    for (let i = 0; i < 9; i++) {
      const u = seededUsers[i % seededUsers.length];
      await Booking.create({
        user: u._id,
        flight: new mongoose.Types.ObjectId(),
        seats: ['10A'],
        passengers: [{ firstName: u.firstName, lastName: u.lastName, age: 30 }],
        status: 'Confirmed',
        totalPrice: 15000
      });
    }

    // Seed Completed payments
    const bookings = await Booking.find();
    for (let i = 0; i < 6; i++) {
      const b = bookings[i];
      await Payment.create({
        user: b.user,
        booking: b._id,
        amount: b.totalPrice,
        currency: 'INR',
        status: 'Completed',
        orderId: `order_${Date.now()}_${i}_${Math.floor(Math.random() * 10000)}`,
        paymentId: `PAY-${20000 + i}`,
        type: 'flight'
      });
    }

    // Login to get token
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'exec@skyluxe.com',
        password: 'password123'
      });
    token = loginRes.body.token;

    // Seed mock data for ARIS tests
    await ARIS.DemandForecast.create({
      route: 'BOM-DWC',
      date: new Date(),
      demandIndex: 94,
      confidenceLevel: 88,
      forecast7d: 92,
      forecast30d: 93,
      forecast90d: 95,
      forecast365d: 89,
      seasonalFactors: ['Monsoon', 'Summer Festival']
    });

    await ARIS.RouteRecommendation.create({
      origin: 'LKO',
      destination: 'DXB',
      confidence: 88,
      expectedLoadFactor: 81,
      expectedRevenue: 14000000,
      reason: 'Underutilized regional corridor with high growth demand metrics.',
      status: 'emerging'
    });

    await ARIS.CustomerSegment.create({
      segment: 'VIP Jet Customer',
      upgradeProbability: 82,
      membershipConversion: 91,
      lifetimeValue: 1200000,
      churnRisk: 8,
      travelIntent: 'High frequency luxury business travel',
      recommendedActions: ['Target with Gulfstream hourly rate discounts']
    });

    await ARIS.PricingInsight.create({
      flightNumber: 'AI-101',
      currentPrice: 24500,
      recommendedPrice: 26000,
      revenueGain: 8,
      elasticity: 'low',
      sensitivity: 35
    });

    await ARIS.FleetAnalytic.create({
      aircraftModel: 'Gulfstream G700',
      currentHub: 'BOM',
      recommendedHub: 'DWC',
      usageHours: 180,
      idleHours: 42,
      maintenanceCycle: 85,
      utilizationRate: 78,
      expectedImprovement: 12
    });

    await ARIS.OperationalAlert.create({
      airport: 'DXB',
      delayMinutes: 35,
      congestionLevel: 'high',
      recommendations: 'Increase turnaround buffer at DXB by 10 minutes.',
      impact: 11
    });

    await ARIS.LoyaltyInsight.create({
      user: testUser._id,
      redemptionLikelihood: 82,
      campaignOffered: 'Lounge Pass VIP Upgrade',
      couponRecommended: 'LOUNGE_VAL_100',
      membershipUpgradeLikelihood: 85
    });

    await ARIS.ExecutiveInsight.create({
      title: 'Regional Revenue Lead',
      category: 'revenue',
      description: 'Mumbai-Dubai corridor remains highest margins generator.',
      value: '$1.2M',
      trend: '+12% vs last month'
    });

    await ARIS.ModelMetric.create({
      modelName: 'Demand Forecaster',
      accuracy: 94.5,
      loss: 0.052,
      version: 'v1.4.2'
    });
  });

  afterAll(async () => {
    // Clean up test data
    await User.deleteMany({});
    await ARIS.DemandForecast.deleteMany({});
    await ARIS.RouteRecommendation.deleteMany({});
    await ARIS.CustomerSegment.deleteMany({});
    await ARIS.PricingInsight.deleteMany({});
    await ARIS.FleetAnalytic.deleteMany({});
    await ARIS.OperationalAlert.deleteMany({});
    await ARIS.LoyaltyInsight.deleteMany({});
    await ARIS.ExecutiveInsight.deleteMany({});
    await ARIS.ModelMetric.deleteMany({});
    await ARIS.InferenceLog.deleteMany({});
    await ARIS.FlightSearch.deleteMany({});
    await Booking.deleteMany({});
    await Payment.deleteMany({});
    await mongoose.connection.close();
  });

  describe('GET /api/v1/aris/executive/metrics', () => {
    it('should fetch executive dashboard summary metrics and logs', async () => {
      const res = await request(app)
        .get('/api/v1/aris/executive/metrics')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('summary');
      expect(res.body.summary).toHaveProperty('totalUsers');
      expect(res.body.summary).toHaveProperty('totalBookings');
      expect(res.body.summary).toHaveProperty('totalRevenue');
      expect(Array.isArray(res.body.insights)).toBeTruthy();
      expect(res.body.insights[0]).toHaveProperty('title', 'Regional Revenue Lead');
    });
  });

  describe('GET /api/v1/aris/demand', () => {
    it('should fetch route demand forecasts', async () => {
      const res = await request(app)
        .get('/api/v1/aris/demand')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body[0]).toHaveProperty('route', 'BOM-DWC');
      expect(res.body[0]).toHaveProperty('demandIndex', 94);
    });
  });

  describe('GET /api/v1/aris/pricing', () => {
    it('should fetch pricing optimization recommendations', async () => {
      const res = await request(app)
        .get('/api/v1/aris/pricing')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body[0]).toHaveProperty('flightNumber', 'AI-101');
      expect(res.body[0]).toHaveProperty('recommendedPrice', 26000);
    });
  });

  describe('GET /api/v1/aris/routes', () => {
    it('should fetch proposed route optimization suggestions', async () => {
      const res = await request(app)
        .get('/api/v1/aris/routes')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body[0]).toHaveProperty('origin', 'LKO');
      expect(res.body[0]).toHaveProperty('destination', 'DXB');
    });
  });

  describe('GET /api/v1/aris/fleet', () => {
    it('should fetch fleet optimization metrics', async () => {
      const res = await request(app)
        .get('/api/v1/aris/fleet')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body[0]).toHaveProperty('aircraftModel', 'Gulfstream G700');
      expect(res.body[0]).toHaveProperty('utilizationRate', 78);
    });
  });

  describe('GET /api/v1/aris/customers', () => {
    it('should fetch customer segments prediction models', async () => {
      const res = await request(app)
        .get('/api/v1/aris/customers')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body[0]).toHaveProperty('segment', 'VIP Jet Customer');
      expect(res.body[0]).toHaveProperty('upgradeProbability', 82);
    });
  });

  describe('GET /api/v1/aris/loyalty', () => {
    it('should fetch user loyalty recommendations with valid user_id query parameter', async () => {
      const res = await request(app)
        .get(`/api/v1/aris/loyalty?user_id=${testUser._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('redemptionLikelihood', 82);
      expect(res.body).toHaveProperty('couponRecommended', 'LOUNGE_VAL_100');
    });

    it('should reject requests missing user_id query parameter', async () => {
      const res = await request(app)
        .get('/api/v1/aris/loyalty')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(400);
    });
  });

  describe('GET /api/v1/aris/operations', () => {
    it('should fetch airport delay and operations alert models', async () => {
      const res = await request(app)
        .get('/api/v1/aris/operations')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body[0]).toHaveProperty('airport', 'DXB');
      expect(res.body[0]).toHaveProperty('delayMinutes', 35);
    });
  });

  describe('GET /api/v1/aris/payments', () => {
    it('should compile transaction analytics metrics', async () => {
      const res = await request(app)
        .get('/api/v1/aris/payments')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('successRate');
      expect(res.body).toHaveProperty('revenueBilled');
      expect(res.body).toHaveProperty('refundsIssued');
    });
  });

  describe('POST /api/v1/aris/query', () => {
    it('should correctly parse high-revenue routes executive query', async () => {
      const res = await request(app)
        .post('/api/v1/aris/query')
        .set('Authorization', `Bearer ${token}`)
        .send({ query: 'Which routes generated the highest revenue this month?' });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('category', 'revenue');
      expect(res.body).toHaveProperty('responseText');
      expect(res.body).toHaveProperty('chartData');
      expect(res.body.actions.length).toBeGreaterThan(0);
    });

    it('should correctly parse top-destinations executive query', async () => {
      const res = await request(app)
        .post('/api/v1/aris/query')
        .set('Authorization', `Bearer ${token}`)
        .send({ query: 'Predict our top destinations next quarter.' });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('category', 'demand');
      expect(res.body).toHaveProperty('chartData');
    });

    it('should fall back gracefully to general query handling for unspecified directives', async () => {
      const res = await request(app)
        .post('/api/v1/aris/query')
        .set('Authorization', `Bearer ${token}`)
        .send({ query: 'Analyze general user feedback' });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('category', 'general');
    });
  });
});
