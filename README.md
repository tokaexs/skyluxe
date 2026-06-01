# SkyLuxe - Luxury Air Travel Platform

A premium flight booking platform offering luxury air travel services, private jets, and concierge services.

## Features

- Premium flight booking
- Private jet charters
- Luxury concierge services
- Membership tiers with exclusive benefits
- Secure authentication and authorization
- Real-time flight search and filtering
- Responsive design for all devices

## Prerequisites

- Node.js (>= 14.0.0)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/skyluxe.git
cd skyluxe
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```bash
PORT=3001
NODE_ENV=development
```

## Development

To run the application in development mode:

```bash
npm run dev
```

The application will be available at `http://localhost:3001`

## Production Deployment

1. Set environment variables:
   - `PORT`: The port number (default: 3001)
   - `NODE_ENV`: Set to 'production'

2. Build and start:
```bash
npm start
```

## Hosting Platforms

### Heroku

1. Install Heroku CLI
2. Login to Heroku:
```bash
heroku login
```

3. Create a new Heroku app:
```bash
heroku create skyluxe-app
```

4. Deploy:
```bash
git push heroku main
```

### Railway/Render/DigitalOcean App Platform

1. Connect your GitHub repository
2. Set environment variables in the platform dashboard
3. Deploy from the main branch

## Testing

Run tests:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

## Directory Structure

```
skyluxe/
├── public/          # Static files
├── routes/          # API routes
├── models/          # Database models
├── controllers/     # Route controllers
├── middleware/      # Custom middleware
├── tests/          # Test files
└── server.js       # Entry point
```

## API Documentation

### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - User login

### Flights
- GET /api/flights - Get available flights
- POST /api/flights/search - Search flights
- POST /api/flights/book - Book a flight

### Private Jets
- GET /api/private-jets - Get available jets
- POST /api/private-jets/charter - Request charter

### Membership
- GET /api/membership/tiers - Get membership tiers
- POST /api/membership/purchase - Purchase membership

### Concierge
- GET /api/concierge/services - Get available services
- POST /api/concierge/request - Submit service request

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the ISC License.

## Support

For support, email support@skyluxe.com or join our Slack channel. 