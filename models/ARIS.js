const mongoose = require('mongoose');

// 1. Demand Forecast Schema
const DemandForecastSchema = new mongoose.Schema({
  route: { type: String, required: true, index: true }, // e.g. "BOM-DWC"
  date: { type: Date, required: true },
  demandIndex: { type: Number, min: 0, max: 100, required: true },
  confidenceLevel: { type: Number, min: 0, max: 100, required: true },
  forecast7d: { type: Number },
  forecast30d: { type: Number },
  forecast90d: { type: Number },
  forecast365d: { type: Number },
  seasonalFactors: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

// 2. Route Recommendation Schema
const RouteRecommendationSchema = new mongoose.Schema({
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  confidence: { type: Number, min: 0, max: 100, required: true },
  expectedLoadFactor: { type: Number, min: 0, max: 100, required: true },
  expectedRevenue: { type: Number, required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ['emerging', 'declining', 'high_growth', 'underutilized'], default: 'emerging' },
  createdAt: { type: Date, default: Date.now }
});

// 3. Customer Segment Schema
const CustomerSegmentSchema = new mongoose.Schema({
  segment: { type: String, required: true, index: true }, // e.g. "Luxury Traveler"
  upgradeProbability: { type: Number, min: 0, max: 100, required: true },
  membershipConversion: { type: Number, min: 0, max: 100, required: true },
  lifetimeValue: { type: Number, required: true },
  churnRisk: { type: Number, min: 0, max: 100, required: true },
  travelIntent: { type: String, required: true },
  recommendedActions: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

// 4. Pricing Insight Schema
const PricingInsightSchema = new mongoose.Schema({
  flightNumber: { type: String, required: true, index: true },
  currentPrice: { type: Number, required: true },
  recommendedPrice: { type: Number, required: true },
  revenueGain: { type: Number, required: true },
  elasticity: { type: String, enum: ['high', 'medium', 'low'], required: true },
  sensitivity: { type: Number, min: 0, max: 100, required: true },
  priceHistory: [{
    date: { type: Date, default: Date.now },
    price: { type: Number }
  }],
  createdAt: { type: Date, default: Date.now }
});

// 5. Fleet Analytic Schema
const FleetAnalyticSchema = new mongoose.Schema({
  aircraftModel: { type: String, required: true, index: true },
  currentHub: { type: String, required: true },
  recommendedHub: { type: String, required: true },
  usageHours: { type: Number, required: true },
  idleHours: { type: Number, required: true },
  maintenanceCycle: { type: Number, min: 0, max: 100, required: true },
  utilizationRate: { type: Number, min: 0, max: 100, required: true },
  expectedImprovement: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

// 6. Revenue Forecast Schema
const RevenueForecastSchema = new mongoose.Schema({
  month: { type: String, required: true, index: true }, // e.g. "2026-07"
  projectedRevenue: { type: Number, required: true },
  expectedGrowth: { type: Number, required: true },
  commercialRevenue: { type: Number, required: true },
  charterRevenue: { type: Number, required: true },
  membershipRevenue: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

// 7. Operational Alert Schema
const OperationalAlertSchema = new mongoose.Schema({
  airport: { type: String, required: true, index: true },
  delayMinutes: { type: Number, required: true },
  congestionLevel: { type: String, enum: ['low', 'medium', 'high'], required: true },
  recommendations: { type: String, required: true },
  impact: { type: Number, required: true }, // Expected delay reduction in percent
  createdAt: { type: Date, default: Date.now }
});

// 8. Loyalty Insight Schema
const LoyaltyInsightSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  redemptionLikelihood: { type: Number, min: 0, max: 100, required: true },
  campaignOffered: { type: String, required: true },
  couponRecommended: { type: String, required: true },
  membershipUpgradeLikelihood: { type: Number, min: 0, max: 100, required: true },
  createdAt: { type: Date, default: Date.now }
});

// 9. Travel Passport Analytic Schema
const TravelPassportAnalyticSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  profileType: { type: String, required: true }, // e.g. "Global Voyager"
  countriesVisitedCount: { type: Number, required: true },
  totalJetHours: { type: Number, required: true },
  milestonesUnlockedCount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

// 10. AI Recommendation Schema
const AIRecommendationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  destination: { type: String, required: true },
  hotels: [{
    name: { type: String },
    rating: { type: Number },
    price: { type: Number }
  }],
  transfers: [{
    type: { type: String },
    price: { type: Number }
  }],
  dining: [{
    name: { type: String },
    cuisine: { type: String }
  }],
  experiences: [{
    title: { type: String },
    price: { type: Number }
  }],
  createdAt: { type: Date, default: Date.now }
});

// 11. Model Metric Schema
const ModelMetricSchema = new mongoose.Schema({
  modelName: { type: String, required: true, index: true },
  accuracy: { type: Number, required: true },
  lastTrained: { type: Date, default: Date.now },
  loss: { type: Number, required: true },
  version: { type: String, required: true }
});

// 12. Inference Log Schema
const InferenceLogSchema = new mongoose.Schema({
  query: { type: String, required: true },
  inputData: { type: mongoose.Schema.Types.Mixed },
  prediction: { type: mongoose.Schema.Types.Mixed },
  latencyMs: { type: Number },
  timestamp: { type: Date, default: Date.now }
});

// 13. Executive Insight Schema
const ExecutiveInsightSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  value: { type: String, required: true },
  trend: { type: String, required: true }, // e.g. "+12% vs last month"
  createdAt: { type: Date, default: Date.now }
});

// 14. Flight Search Schema
const FlightSearchSchema = new mongoose.Schema({
  from: { type: String, required: true },
  to: { type: String, required: true },
  cabinClass: { type: String, required: true },
  passengers: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = {
  DemandForecast: mongoose.models.DemandForecast || mongoose.model('DemandForecast', DemandForecastSchema),
  RouteRecommendation: mongoose.models.RouteRecommendation || mongoose.model('RouteRecommendation', RouteRecommendationSchema),
  CustomerSegment: mongoose.models.CustomerSegment || mongoose.model('CustomerSegment', CustomerSegmentSchema),
  PricingInsight: mongoose.models.PricingInsight || mongoose.model('PricingInsight', PricingInsightSchema),
  FleetAnalytic: mongoose.models.FleetAnalytic || mongoose.model('FleetAnalytic', FleetAnalyticSchema),
  RevenueForecast: mongoose.models.RevenueForecast || mongoose.model('RevenueForecast', RevenueForecastSchema),
  OperationalAlert: mongoose.models.OperationalAlert || mongoose.model('OperationalAlert', OperationalAlertSchema),
  LoyaltyInsight: mongoose.models.LoyaltyInsight || mongoose.model('LoyaltyInsight', LoyaltyInsightSchema),
  TravelPassportAnalytic: mongoose.models.TravelPassportAnalytic || mongoose.model('TravelPassportAnalytic', TravelPassportAnalyticSchema),
  AIRecommendation: mongoose.models.AIRecommendation || mongoose.model('AIRecommendation', AIRecommendationSchema),
  ModelMetric: mongoose.models.ModelMetric || mongoose.model('ModelMetric', ModelMetricSchema),
  InferenceLog: mongoose.models.InferenceLog || mongoose.model('InferenceLog', InferenceLogSchema),
  ExecutiveInsight: mongoose.models.ExecutiveInsight || mongoose.model('ExecutiveInsight', ExecutiveInsightSchema),
  FlightSearch: mongoose.models.FlightSearch || mongoose.model('FlightSearch', FlightSearchSchema)
};
