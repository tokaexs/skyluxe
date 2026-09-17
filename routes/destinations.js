const express = require('express');
const router = express.Router();

const DESTINATIONS = [
  {
    id: "dest-1",
    city: "Dubai",
    airport_code: "DWC",
    country: "United Arab Emirates",
    region: "Middle East",
    description: "Ultra-luxury skyline, private yacht charters, and world-class hospitality.",
    image_url: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800",
    vip_lounge: "Al Maktoum FBO Royal Lounge",
    popular_jets: ["Gulfstream G650ER", "Bombardier Global 7500"]
  },
  {
    id: "dest-2",
    city: "London",
    airport_code: "FAB",
    country: "United Kingdom",
    region: "Europe",
    description: "Historic grandeur meets bespoke private aviation terminal at Farnborough.",
    image_url: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=800",
    vip_lounge: "Farnborough TAG Terminal",
    popular_jets: ["Dassault Falcon 8X", "Gulfstream G700"]
  },
  {
    id: "dest-3",
    city: "Mumbai",
    airport_code: "BOM",
    country: "India",
    region: "Asia",
    description: "Gateway of India executive VIP corridor with seamless chauffeur transfers.",
    image_url: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=800",
    vip_lounge: "Kalina General Aviation Terminal",
    popular_jets: ["Embraer Praetor 600", "Gulfstream G650ER"]
  },
  {
    id: "dest-4",
    city: "Nice",
    airport_code: "NCE",
    country: "France",
    region: "Europe",
    description: "Cote d'Azur helicopter transfers to Monaco and Mediterranean superyachts.",
    image_url: "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=800",
    vip_lounge: "Nice Cote d'Azur Signature Flight Support",
    popular_jets: ["Cessna Citation Longitude", "Bombardier Global 6000"]
  }
];

router.get('/', (req, res) => {
  const { region } = req.query;
  if (region) {
    const filtered = DESTINATIONS.filter(d => d.region.toLowerCase().includes(region.toLowerCase()));
    return res.json(filtered);
  }
  res.json(DESTINATIONS);
});

module.exports = router;
