const express = require('express');
const router = express.Router();
const Airline = require('../models/Airline');

// Get all airlines (Admin listing)
router.get('/', async (req, res) => {
  try {
    const airlines = await Airline.find().sort({ airlineName: 1 });
    res.json(airlines);
  } catch (error) {
    console.error('Fetch admin airlines error:', error);
    res.status(500).json({ message: 'Server error fetching airlines' });
  }
});

// Create new airline
router.post('/', async (req, res) => {
  try {
    const {
      airlineCode,
      airlineName,
      iataCode,
      icaoCode,
      logoUrl,
      brandColor,
      country,
      website,
      alliance
    } = req.body;

    if (!airlineCode || !airlineName || !iataCode || !icaoCode || !country) {
      return res.status(400).json({ message: 'Required fields: code, name, IATA, ICAO, and country' });
    }

    const existing = await Airline.findOne({
      $or: [{ airlineCode: airlineCode.toUpperCase() }, { iataCode: iataCode.toUpperCase() }]
    });

    if (existing) {
      return res.status(400).json({ message: 'Airline with this code or IATA already exists' });
    }

    const airline = new Airline({
      airlineCode: airlineCode.toUpperCase(),
      airlineName,
      iataCode: iataCode.toUpperCase(),
      icaoCode: icaoCode.toUpperCase(),
      logoUrl,
      brandColor: brandColor || '#D4AF37',
      country,
      website,
      alliance: alliance || 'None'
    });

    await airline.save();
    res.status(201).json(airline);
  } catch (error) {
    console.error('Create airline error:', error);
    res.status(500).json({ message: 'Server error creating airline' });
  }
});

// Update airline details
router.patch('/:id', async (req, res) => {
  try {
    const {
      airlineName,
      logoUrl,
      brandColor,
      country,
      website,
      alliance,
      isActive
    } = req.body;

    const airline = await Airline.findById(req.params.id);
    if (!airline) {
      return res.status(404).json({ message: 'Airline not found' });
    }

    if (airlineName) airline.airlineName = airlineName;
    if (logoUrl !== undefined) airline.logoUrl = logoUrl;
    if (brandColor) airline.brandColor = brandColor;
    if (country) airline.country = country;
    if (website !== undefined) airline.website = website;
    if (alliance !== undefined) airline.alliance = alliance;
    if (isActive !== undefined) airline.isActive = isActive;

    await airline.save();
    res.json(airline);
  } catch (error) {
    console.error('Update airline error:', error);
    res.status(500).json({ message: 'Server error updating airline' });
  }
});

// Toggle airline active state (Delete route alternative)
router.delete('/:id', async (req, res) => {
  try {
    const airline = await Airline.findById(req.params.id);
    if (!airline) {
      return res.status(404).json({ message: 'Airline not found' });
    }

    airline.isActive = !airline.isActive;
    await airline.save();

    res.json({ message: `Airline active state toggled to ${airline.isActive}`, airline });
  } catch (error) {
    console.error('Delete airline error:', error);
    res.status(500).json({ message: 'Server error deleting airline' });
  }
});

module.exports = router;
