const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');
const AnalyticsEvent = require('../models/AnalyticsEvent');

describe('Telemetry & Instrumentation Tests', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await AnalyticsEvent.deleteMany({});
  });

  afterAll(async () => {
    await User.deleteMany({});
    await AnalyticsEvent.deleteMany({});
    await mongoose.connection.close();
  });

  it('should log register and login events during user auth flows', async () => {
    // 1. Register a new user
    const regRes = await request(app)
      .post('/api/auth/register')
      .send({
        firstName: 'Telemetry',
        lastName: 'Tester',
        email: 'telemetry.test@example.com',
        password: 'password123',
        phone: '1234567890'
      });

    expect(regRes.statusCode).toBe(201);

    // Verify 'register' event is created
    const registerEvent = await AnalyticsEvent.findOne({ eventType: 'register' });
    expect(registerEvent).toBeTruthy();
    expect(registerEvent.userId.toString()).toBe(regRes.body.user.id.toString());
    expect(registerEvent.metadata.email).toBe('telemetry.test@example.com');

    // 2. Login the user
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'telemetry.test@example.com',
        password: 'password123'
      });

    expect(loginRes.statusCode).toBe(200);

    // Verify 'login' event is created
    const loginEvent = await AnalyticsEvent.findOne({ eventType: 'login' });
    expect(loginEvent).toBeTruthy();
    expect(loginEvent.userId.toString()).toBe(regRes.body.user.id.toString());
    expect(loginEvent.metadata.email).toBe('telemetry.test@example.com');
  });

  it('should log search_flights events during flight searches', async () => {
    const searchRes = await request(app)
      .post('/api/flights/search')
      .send({
        from: 'BOM',
        to: 'DWC',
        date: '2026-06-15',
        passengers: 2,
        class: 'business'
      });

    expect(searchRes.statusCode).toBe(200);

    // Verify 'search_flights' event is created
    const searchEvent = await AnalyticsEvent.findOne({ eventType: 'search_flights' });
    expect(searchEvent).toBeTruthy();
    expect(searchEvent.metadata.from).toBe('BOM');
    expect(searchEvent.metadata.to).toBe('DWC');
    expect(searchEvent.metadata.class).toBe('business');
    expect(searchEvent.metadata.passengers).toBe(2);
  });
});
