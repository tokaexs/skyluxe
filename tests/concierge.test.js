const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');
const ConciergeRequest = require('../src/models/ConciergeRequest');

describe('Concierge Routes', () => {
  let testUser;
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
    await ConciergeRequest.deleteMany({});
    await mongoose.connection.close();
  });

  describe('GET /api/concierge/services', () => {
    it('should get all concierge services', async () => {
      const res = await request(app)
        .get('/api/concierge/services');

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0]).toHaveProperty('name');
      expect(res.body[0]).toHaveProperty('description');
      expect(res.body[0]).toHaveProperty('price');
    });
  });

  describe('POST /api/concierge/request', () => {
    it('should submit concierge request with valid data', async () => {
      const res = await request(app)
        .post('/api/concierge/request')
        .set('Authorization', `Bearer ${token}`)
        .send({
          service: 'travel_planning',
          details: 'Need help planning a luxury vacation to Maldives',
          preferredDate: '2024-05-01',
          budget: 500000,
          additionalNotes: 'Interested in overwater villas'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('requestId');
      expect(res.body).toHaveProperty('status', 'pending');
      expect(res.body).toHaveProperty('service', 'travel_planning');
    });

    it('should not submit request without authentication', async () => {
      const res = await request(app)
        .post('/api/concierge/request')
        .send({
          service: 'travel_planning',
          details: 'Need help planning a luxury vacation to Maldives',
          preferredDate: '2024-05-01',
          budget: 500000,
          additionalNotes: 'Interested in overwater villas'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error');
    });

    it('should not submit request with invalid service', async () => {
      const res = await request(app)
        .post('/api/concierge/request')
        .set('Authorization', `Bearer ${token}`)
        .send({
          service: 'invalid_service',
          details: 'Need help planning a luxury vacation to Maldives',
          preferredDate: '2024-05-01',
          budget: 500000,
          additionalNotes: 'Interested in overwater villas'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('GET /api/concierge/requests', () => {
    it('should get user concierge requests with valid token', async () => {
      const res = await request(app)
        .get('/api/concierge/requests')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body[0]).toHaveProperty('requestId');
      expect(res.body[0]).toHaveProperty('status');
      expect(res.body[0]).toHaveProperty('service');
    });

    it('should not get requests without token', async () => {
      const res = await request(app)
        .get('/api/concierge/requests');

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('POST /api/concierge/requests/:id/cancel', () => {
    let requestId;

    beforeEach(async () => {
      // Create a test request
      const createRes = await request(app)
        .post('/api/concierge/request')
        .set('Authorization', `Bearer ${token}`)
        .send({
          service: 'travel_planning',
          details: 'Need help planning a luxury vacation to Maldives',
          preferredDate: '2024-05-01',
          budget: 500000,
          additionalNotes: 'Interested in overwater villas'
        });
      requestId = createRes.body.requestId;
    });

    it('should cancel concierge request with valid ID', async () => {
      const res = await request(app)
        .post(`/api/concierge/requests/${requestId}/cancel`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('status', 'cancelled');
    });

    it('should not cancel request without authentication', async () => {
      const res = await request(app)
        .post(`/api/concierge/requests/${requestId}/cancel`);

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error');
    });

    it('should not cancel non-existent request', async () => {
      const res = await request(app)
        .post('/api/concierge/requests/507f1f77bcf86cd799439011/cancel')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error');
    });
  });
}); 