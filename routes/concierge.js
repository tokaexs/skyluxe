const express = require('express');
const OpenAI = require('openai');
const PrivateJet = require('../models/PrivateJet');
const router = express.Router();

const openrouter = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': 'http://localhost:5000',
    'X-Title': 'Skyluxe AI Concierge'
  }
});

const User = require('../models/User');
const ConciergeRequest = require('../models/ConciergeRequest');
const requireAuth = require('../middleware/requireAuth');

// ============================================================
// AI CONCIERGE
// POST /api/concierge/ai
// ============================================================
router.post('/ai/search-jets', async (req, res) => {
  try {
    const {
      passengers,
      maxHourlyRate,
      type,
      amenities
    } = req.body;

    const filter = {};

    // Passenger capacity
    if (Number(passengers) > 0) {
      filter.capacity = { $gte: Number(passengers) };
    }

    // Maximum hourly budget
    if (Number(maxHourlyRate) > 0) {
      filter.hourlyRate = { $lte: Number(maxHourlyRate) };
    }

    // Jet type
    if (type && typeof type === 'string') {
      filter.type = {
        $regex: type.trim(),
        $options: 'i'
      };
    }

    // Amenities
    if (Array.isArray(amenities) && amenities.length > 0) {
      filter.amenities = {
        $all: amenities
          .filter(a => typeof a === 'string')
          .map(a => new RegExp(a.trim(), 'i'))
      };
    }

    const jets = await PrivateJet
      .find(filter)
      .sort({
        capacity: 1,
        hourlyRate: 1
      })
      .limit(10)
      .lean();

    res.json({
      success: true,
      count: jets.length,
      filters: {
        passengers: passengers || null,
        maxHourlyRate: maxHourlyRate || null,
        type: type || null,
        amenities: amenities || []
      },
      jets
    });

  } catch (error) {
    console.error('AI jet search error:', error);

    res.status(500).json({
      success: false,
      error: 'Unable to search private jets'
    });
  }
});
router.post('/ai', async (req, res) => {
  try {
    const { message, conversation = [] } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Message is required'
      });
    }

    if (!process.env.OPENROUTER_API_KEY) {
      console.error('OPENROUTER_API_KEY is not configured');

      return res.status(500).json({
        success: false,
        error: 'AI service is not configured'
      });
    }

    const safeConversation = Array.isArray(conversation)
      ? conversation
          .filter(
            item =>
              item &&
              (item.role === 'user' || item.role === 'assistant') &&
              typeof item.content === 'string'
          )
          .slice(-10)
      : [];

    const systemPrompt = `
You are Skyluxe AI Concierge, the premium AI travel assistant for Skyluxe.

Skyluxe is a luxury aviation and travel platform offering:

- Private jet charters
- Commercial flights
- Luxury travel planning
- Premium memberships
- Airport assistance
- Ground transportation
- Dining and entertainment
- Private chefs
- Private security
- Helicopter transfers
- Luxury destinations

PERSONALITY:

- Premium
- Professional
- Calm
- Helpful
- Concise
- Sophisticated
- Friendly

YOUR JOB:

Help Skyluxe users with:

1. Private jet recommendations
2. Commercial flight guidance
3. Destination planning
4. Membership information
5. Concierge services
6. Travel planning
7. General Skyluxe questions

IMPORTANT DATA RULES:

- Never invent real-time flight availability.
- Never invent aircraft availability.
- Never invent booking confirmations.
- Never invent prices.
- Never claim a payment was completed.
- Never claim a booking was completed unless the backend confirms it.
- Never pretend that you searched live flight data when you did not.
- Never pretend you have direct access to MongoDB.
- If a user asks for live availability, pricing, or booking, explain that Skyluxe's booking system needs to verify it.

At this stage, you are an AI assistant connected to Skyluxe's backend,
but you do not have direct database access.

RESPONSE STYLE:

Keep responses concise and premium.

Use clean formatting.

For travel recommendations, structure information clearly.

Never make up specific availability or prices.

Example:

Private Jet Recommendation

For 8 passengers, a long-range private jet would be suitable.

Possible aircraft categories:
- Gulfstream
- Bombardier Global
- Dassault Falcon

Actual aircraft availability and pricing must be confirmed
through Skyluxe's booking system.
`;

    const messages = [
      {
        role: 'system',
        content: systemPrompt
      },
      ...safeConversation,
      {
        role: 'user',
        content: message.trim()
      }
    ];

    const completion = await openrouter.chat.completions.create({
      model: 'nvidia/nemotron-3-ultra-550b-a55b:free',
      messages,
      temperature: 0.7,
      stream: false
    });

    const reply =
      completion.choices?.[0]?.message?.content ||
      'I apologize, but I was unable to process your request right now.';

    return res.json({
      success: true,
      reply,
      model:
        completion.model ||
        'nvidia/nemotron-3-ultra-550b-a55b:free'
    });

  } catch (error) {
    console.error('========================================');
    console.error('SKYLUXE AI ERROR');
    console.error('========================================');
    console.error(error);
    console.error('========================================');

    return res.status(500).json({
      success: false,
      error: 'Skyluxe AI is temporarily unavailable'
    });
  }
});

// ============================================================
// EXISTING CONCIERGE ROUTES
// ============================================================

// Get all concierge requests for a user
router.get('/', async (req, res) => {
  try {
    const userId = req.query.user_id;

    if (!userId) {
      return res.status(400).json({
        message: 'User ID is required'
      });
    }

    const requests = await ConciergeRequest
      .find({ user: userId })
      .sort({ createdAt: -1 });

    res.json(requests);

  } catch (error) {
    console.error('Fetch concierge requests error:', error);

    res.status(500).json({
      message: 'Server error'
    });
  }
});

// Create a new concierge request
router.post('/', async (req, res) => {
  try {
    const userId = req.query.user_id;
    const { type, details } = req.body;

    if (!userId) {
      return res.status(400).json({
        message: 'User ID is required'
      });
    }

    if (!type || !details) {
      return res.status(400).json({
        message: 'Type and details are required'
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    const request = new ConciergeRequest({
      user: user._id,
      type,
      details,
      status: 'Pending'
    });

    await request.save();

    const { trackEvent } = require('../lib/analytics');

    await trackEvent(req, 'concierge_request', {
      type,
      details
    });

    res.status(201).json(request);

  } catch (error) {
    console.error('Create concierge request error:', error);

    res.status(500).json({
      message: 'Server error'
    });
  }
});

// ============================================================
// SERVICES
// ============================================================

const VALID_SERVICES = [
  'travel_planning',
  'hotel_accommodation',
  'dining_entertainment',
  'ground_transport',
  'airport_assistance',
  'private_chef',
  'private_security',
  'helicopter_transfer'
];

router.get('/services', (req, res) => {
  res.json([
    {
      name: 'Travel Planning',
      description: 'Need help planning a luxury vacation',
      price: 250
    },
    {
      name: 'Hotel Accommodation',
      description: 'Luxury hotel booking',
      price: 150
    },
    {
      name: 'Dining & Entertainment',
      description: 'Michelin restaurant bookings',
      price: 100
    }
  ]);
});

// ============================================================
// AUTHENTICATED CONCIERGE REQUEST
// ============================================================

router.post('/request', requireAuth, async (req, res) => {
  try {
    const userId =
      req.user.userId ||
      req.user.id ||
      req.user._id;

    const { service, details } = req.body;

    if (!service || !details) {
      return res.status(400).json({
        error: 'Service and details are required'
      });
    }

    if (!VALID_SERVICES.includes(service)) {
      return res.status(400).json({
        error: 'Invalid service'
      });
    }

    const request = new ConciergeRequest({
      user: userId,
      type: service,
      details,
      status: 'Pending'
    });

    await request.save();

    const { trackEvent } = require('../lib/analytics');

    await trackEvent(req, 'concierge_request', {
      type: service,
      details
    });

    res.status(201).json({
      requestId: request._id,
      status: 'pending',
      service
    });

  } catch (error) {
    console.error('Submit concierge request error:', error);

    res.status(500).json({
      error: 'Server error'
    });
  }
});

// ============================================================
// GET AUTHENTICATED CONCIERGE REQUESTS
// ============================================================

router.get('/requests', requireAuth, async (req, res) => {
  try {
    const userId =
      req.user.userId ||
      req.user.id ||
      req.user._id;

    const requests = await ConciergeRequest
      .find({ user: userId })
      .sort({ createdAt: -1 });

    res.json(
      requests.map(r => ({
        requestId: r._id,
        status: r.status.toLowerCase(),
        service: r.type
      }))
    );

  } catch (error) {
    console.error('Fetch concierge requests error:', error);

    res.status(500).json({
      error: 'Server error'
    });
  }
});

// ============================================================
// CANCEL CONCIERGE REQUEST
// ============================================================

router.post('/requests/:id/cancel', requireAuth, async (req, res) => {
  try {
    const userId =
      req.user.userId ||
      req.user.id ||
      req.user._id;

    const request = await ConciergeRequest.findOne({
      _id: req.params.id,
      user: userId
    });

    if (!request) {
      return res.status(404).json({
        error: 'Request not found'
      });
    }

    request.status = 'Cancelled';

    await request.save();

    const { trackEvent } = require('../lib/analytics');

    await trackEvent(req, 'cancel_concierge', {
      requestId: req.params.id
    });

    res.json({
      requestId: request._id,
      status: 'cancelled'
    });

  } catch (error) {
    console.error('Cancel concierge request error:', error);

    res.status(500).json({
      error: 'Server error'
    });
  }
});

// ============================================================
// EXPORT
// ============================================================

module.exports = router;
