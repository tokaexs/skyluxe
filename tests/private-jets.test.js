const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');
const PrivateJet = require('../src/models/PrivateJet');
const CharterRequest = require('../src/models/CharterRequest');

describe('Private Jets Routes', () => {
  let testUser;
  let testJet;
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

    // Create test private jet
    testJet = await PrivateJet.create({
      name: 'Gulfstream G650',
      type: 'luxury',
      capacity: 19,
      range: 7000,
      speed: 956,
      amenities: [
        'Wi-Fi',
        'Entertainment System',
        'Conference Room',
        'Bedroom',
        'Galley'
      ],
      hourlyRate: 150000,
      image: 'g650.jpg',
      description: 'Ultra-long-range jet with exceptional comfort and luxury.'
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
    await PrivateJet.deleteMany({});
    await CharterRequest.deleteMany({});
    await mongoose.connection.close();
  });

  describe('GET /api/private-jets', () => {
    it('should get all private jets', async () => {
      const res = await request(app)
        .get('/api/private-jets');

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0]).toHaveProperty('name');
      expect(res.body[0]).toHaveProperty('type');
      expect(res.body[0]).toHaveProperty('capacity');
    });
  });

  describe('GET /api/private-jets/:id', () => {
    it('should get private jet details by ID', async () => {
      const res = await request(app)
        .get(`/api/private-jets/${testJet._id}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('name', 'Gulfstream G650');
      expect(res.body).toHaveProperty('type', 'luxury');
      expect(res.body).toHaveProperty('capacity', 19);
    });

    it('should return 404 for non-existent jet', async () => {
      const res = await request(app)
        .get('/api/private-jets/507f1f77bcf86cd799439011');

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('POST /api/private-jets/charter', () => {
    it('should submit charter request with valid data', async () => {
      const res = await request(app)
        .post('/api/private-jets/charter')
        .set('Authorization', `Bearer ${token}`)
        .send({
          jetId: testJet._id,
          departure: {
            city: 'Mumbai',
            airport: 'BOM',
            date: '2024-05-01',
            time: '10:00'
          },
          arrival: {
            city: 'Dubai',
            airport: 'DXB',
            date: '2024-05-01',
            time: '12:00'
          },
          passengers: 4,
          specialRequests: 'Need wheelchair assistance',
          paymentMethod: 'card',
          cardDetails: {
            number: '4242424242424242',
            expMonth: 12,
            expYear: 2025,
            cvc: '123'
          }
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('requestId');
      expect(res.body).toHaveProperty('status', 'pending');
      expect(res.body).toHaveProperty('jetId');
    });

    it('should not submit charter request without authentication', async () => {
      const res = await request(app)
        .post('/api/private-jets/charter')
        .send({
          jetId: testJet._id,
          departure: {
            city: 'Mumbai',
            airport: 'BOM',
            date: '2024-05-01',
            time: '10:00'
          },
          arrival: {
            city: 'Dubai',
            airport: 'DXB',
            date: '2024-05-01',
            time: '12:00'
          },
          passengers: 4,
          specialRequests: 'Need wheelchair assistance',
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

    it('should not submit charter request for non-existent jet', async () => {
      const res = await request(app)
        .post('/api/private-jets/charter')
        .set('Authorization', `Bearer ${token}`)
        .send({
          jetId: '507f1f77bcf86cd799439011',
          departure: {
            city: 'Mumbai',
            airport: 'BOM',
            date: '2024-05-01',
            time: '10:00'
          },
          arrival: {
            city: 'Dubai',
            airport: 'DXB',
            date: '2024-05-01',
            time: '12:00'
          },
          passengers: 4,
          specialRequests: 'Need wheelchair assistance',
          paymentMethod: 'card',
          cardDetails: {
            number: '4242424242424242',
            expMonth: 12,
            expYear: 2025,
            cvc: '123'
          }
        });

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('GET /api/private-jets/charter/requests', () => {
    it('should get user charter requests with valid token', async () => {
      const res = await request(app)
        .get('/api/private-jets/charter/requests')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body[0]).toHaveProperty('requestId');
      expect(res.body[0]).toHaveProperty('status');
      expect(res.body[0]).toHaveProperty('jetId');
    });

    it('should not get charter requests without token', async () => {
      const res = await request(app)
        .get('/api/private-jets/charter/requests');

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('POST /api/private-jets/charter/requests/:id/cancel', () => {
    let requestId;

    beforeEach(async () => {
      // Create a test charter request
      const createRes = await request(app)
        .post('/api/private-jets/charter')
        .set('Authorization', `Bearer ${token}`)
        .send({
          jetId: testJet._id,
          departure: {
            city: 'Mumbai',
            airport: 'BOM',
            date: '2024-05-01',
            time: '10:00'
          },
          arrival: {
            city: 'Dubai',
            airport: 'DXB',
            date: '2024-05-01',
            time: '12:00'
          },
          passengers: 4,
          specialRequests: 'Need wheelchair assistance',
          paymentMethod: 'card',
          cardDetails: {
            number: '4242424242424242',
            expMonth: 12,
            expYear: 2025,
            cvc: '123'
          }
        });
      requestId = createRes.body.requestId;
    });

    it('should cancel charter request with valid ID', async () => {
      const res = await request(app)
        .post(`/api/private-jets/charter/requests/${requestId}/cancel`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('status', 'cancelled');
    });

    it('should not cancel request without authentication', async () => {
      const res = await request(app)
        .post(`/api/private-jets/charter/requests/${requestId}/cancel`);

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error');
    });

    it('should not cancel non-existent request', async () => {
      const res = await request(app)
        .post('/api/private-jets/charter/requests/507f1f77bcf86cd799439011/cancel')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error');
    });
  });
}); 