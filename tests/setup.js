require('dotenv').config({ path: '.env.test' });

// Mock environment variables for testing
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_jwt_secret';
process.env.MONGODB_URI = 'mongodb://localhost:27017/skyluxe_test';

// Increase timeout for all tests
jest.setTimeout(10000);

// Global beforeAll hook
beforeAll(async () => {
  // Add any global setup here
  // For example, connect to test database
});

// Global afterAll hook
afterAll(async () => {
  // Add any global cleanup here
  // For example, close database connection
});

// Global beforeEach hook
beforeEach(async () => {
  // Reset any mocks or test data before each test
  jest.clearAllMocks();
});

// Mock console.error to fail tests
const originalError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === 'string' &&
    args[0].includes('Warning: ReactDOM.render is no longer supported')
  ) {
    return;
  }
  originalError.call(console, ...args);
}; 