const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');
const Membership = require('../src/models/Membership');

describe('Membership Routes', () => {
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
    await Membership.deleteMany({});
    await mongoose.connection.close();
  });

  describe('GET /api/membership/tiers', () => {
    it('should get all membership tiers', async () => {
      const res = await request(app)
        .get('/api/membership/tiers');

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0]).toHaveProperty('name');
      expect(res.body[0]).toHaveProperty('price');
      expect(res.body[0]).toHaveProperty('benefits');
    });
  });

  describe('POST /api/membership/purchase', () => {
    it('should purchase membership with valid data', async () => {
      const res = await request(app)
        .post('/api/membership/purchase')
        .set('Authorization', `Bearer ${token}`)
        .send({
          tier: 'silver',
          paymentMethod: 'card',
          cardDetails: {
            number: '4242424242424242',
            expMonth: 12,
            expYear: 2025,
            cvc: '123'
          }
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('membershipId');
      expect(res.body).toHaveProperty('status', 'active');
      expect(res.body).toHaveProperty('tier', 'silver');
    });

    it('should not purchase membership without authentication', async () => {
      const res = await request(app)
        .post('/api/membership/purchase')
        .send({
          tier: 'silver',
          paymentMethod: 'card',
          cardDetails: {
            number: '4242424242424242',
            expMonth: 12,
            expYear: 2025,
            cvc: '123'
          }
        });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error');
    });

    it('should not purchase invalid tier', async () => {
      const res = await request(app)
        .post('/api/membership/purchase')
        .set('Authorization', `Bearer ${token}`)
        .send({
          tier: 'invalid',
          paymentMethod: 'card',
          cardDetails: {
            number: '4242424242424242',
            expMonth: 12,
            expYear: 2025,
            cvc: '123'
          }
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('GET /api/membership/details', () => {
    it('should get user membership details with valid token', async () => {
      const res = await request(app)
        .get('/api/membership/details')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('tier');
      expect(res.body).toHaveProperty('status');
      expect(res.body).toHaveProperty('expiryDate');
    });

    it('should not get membership details without token', async () => {
      const res = await request(app)
        .get('/api/membership/details');

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('POST /api/membership/renew', () => {
    it('should renew membership with valid data', async () => {
      const res = await request(app)
        .post('/api/membership/renew')
        .set('Authorization', `Bearer ${token}`)
        .send({
          paymentMethod: 'card',
          cardDetails: {
            number: '4242424242424242',
            expMonth: 12,
            expYear: 2025,
            cvc: '123'
          }
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('status', 'active');
      expect(res.body).toHaveProperty('renewalDate');
    });

    it('should not renew membership without authentication', async () => {
      const res = await request(app)
        .post('/api/membership/renew')
        .send({
          paymentMethod: 'card',
          cardDetails: {
            number: '4242424242424242',
            expMonth: 12,
            expYear: 2025,
            cvc: '123'
          }
        });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error');
    });
  });
}); 