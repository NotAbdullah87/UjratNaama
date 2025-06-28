const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/User');
const mongoose = require('mongoose');

describe('Auth Protected Routes', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/payroll-test');
  });

  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  let hrToken;
  let viewerToken;

  beforeEach(async () => {
    await User.deleteMany({});
    
    // Create test users
    const hrResponse = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'hruser',
        password: 'password123',
        role: 'hr'
      });
    hrToken = hrResponse.body.token;

    const viewerResponse = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'viewer',
        password: 'password123',
        role: 'viewer'
      });
    viewerToken = viewerResponse.body.token;
  });

  test('should deny access without token', async () => {
    const res = await request(app).get('/api/employees');
    expect(res.status).toBe(401);
  });

  test('should allow HR to create employee', async () => {
    const res = await request(app)
      .post('/api/employees')
      .set('Authorization', `Bearer ${hrToken}`)
      .send({
        name: 'John Doe',
        email: 'john@example.com',
        dept: 'Engineering',
        title: 'Developer',
        hourlyRate: { amount: 50, currency: 'USD' },
        hireDate: '2023-01-01'
      });
    expect(res.status).toBe(201);
  });

  test('should deny viewer from creating employee', async () => {
    const res = await request(app)
      .post('/api/employees')
      .set('Authorization', `Bearer ${viewerToken}`)
      .send({
        name: 'Jane Doe',
        email: 'jane@example.com',
        dept: 'HR',
        title: 'Manager',
        hourlyRate: { amount: 60, currency: 'USD' },
        hireDate: '2023-01-01'
      });
    expect(res.status).toBe(403);
  });

  test('should allow viewer to read employees', async () => {
    const res = await request(app)
      .get('/api/employees')
      .set('Authorization', `Bearer ${viewerToken}`);
    expect(res.status).toBe(200);
  });
});