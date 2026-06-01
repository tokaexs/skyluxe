const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const Flight = require('../src/models/Flight');
const User = require('../src/models/User');

describe('Flight Routes', () => {
  let testUser;
  let testFlight;
  let token;

  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Create test user
    testUser = await User.create({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'password123',
      phoneNumber: '1234567890'
    });

    // Create test flight
    testFlight = await Flight.create({
      flightNumber: 'SL101',
      departure: {
        city: 'Mumbai',
        airport: 'BOM',
        time: new Date('2024-04-01T10:00:00Z')
      },
      arrival: {
        city: 'Delhi',
        airport: 'DEL',
        time: new Date('2024-04-01T12:00:00Z')
      },
      aircraft: 'Boeing 787',
      price: {
        economy: 5000,
        business: 15000,
        first: 25000
      },
      seats: {
        total: 300,
        available: 250
      }
    });

    // Login to get token
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
    token = loginRes.body.token;
  });

  afterAll(async () => {
    // Clean up test data
    await User.deleteMany({});
    await Flight.deleteMany({});
    await mongoose.connection.close();
  });

  describe('POST /api/flights/search', () => {
    it('should search flights with valid criteria', async () => {
      const res = await request(app)
        .post('/api/flights/search')
        .send({
          from: 'Mumbai',
          to: 'Delhi',
          date: '2024-04-01',
          passengers: 1,
          class: 'economy'
        });

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0]).toHaveProperty('flightNumber', 'SL101');
    });

    it('should return empty array for no matching flights', async () => {
      const res = await request(app)
        .post('/api/flights/search')
        .send({
          from: 'Mumbai',
          to: 'London',
          date: '2024-04-01',
          passengers: 1,
          class: 'economy'
        });

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBe(0);
    });
  });

  describe('GET /api/flights/:id', () => {
    it('should get flight details by ID', async () => {
      const res = await request(app)
        .get(`/api/flights/${testFlight._id}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('flightNumber', 'SL101');
      expect(res.body).toHaveProperty('departure');
      expect(res.body).toHaveProperty('arrival');
      expect(res.body).toHaveProperty('price');
    });

    it('should return 404 for non-existent flight', async () => {
      const res = await request(app)
        .get('/api/flights/507f1f77bcf86cd799439011');

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('POST /api/flights/book', () => {
    it('should book a flight with valid data', async () => {
      const res = await request(app)
        .post('/api/flights/book')
        .set('Authorization', `Bearer ${token}`)
        .send({
          flightId: testFlight._id,
          passengers: [{
            firstName: 'Test',
            lastName: 'User',
            age: 30,
            gender: 'male'
          }],
          class: 'economy',
          paymentMethod: 'card'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('bookingId');
      expect(res.body).toHaveProperty('status', 'confirmed');
    });

    it('should not book flight without authentication', async () => {
      const res = await request(app)
        .post('/api/flights/book')
        .send({
          flightId: testFlight._id,
          passengers: [{
            firstName: 'Test',
            lastName: 'User',
            age: 30,
            gender: 'male'
          }],
          class: 'economy',
          paymentMethod: 'card'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('GET /api/flights/bookings/user', () => {
    it('should get user bookings with valid token', async () => {
      const res = await request(app)
        .get('/api/flights/bookings/user')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
    });

    it('should not get bookings without token', async () => {
      const res = await request(app)
        .get('/api/flights/bookings/user');

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error');
    });
  });
}); 