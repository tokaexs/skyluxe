const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const Flight = require('../models/Flight');
const Fleet = require('../models/Fleet');
const Booking = require('../models/Booking');
const PDFDocument = require('pdfkit');


// Get all commercial bookings for a user
router.get('/', async (req, res) => {
  try {
    const userId = req.query.user_id;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const bookings = await Booking.find({ user: userId, type: 'commercial' })
      .populate({ path: 'flight', populate: { path: 'airline' } })
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error('Fetch bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all charter bookings for a user
router.get('/charters', async (req, res) => {
  try {
    const userId = req.query.user_id;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const bookings = await Booking.find({ user: userId, type: 'private' })
      .populate('aircraft')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error('Fetch charter bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Book commercial flight
router.post('/', async (req, res) => {
  try {
    const userId = req.query.user_id;
    const { flight_id, total_amount, seat_number, passengers } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    if (!flight_id) {
      return res.status(400).json({ message: 'Flight ID is required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let flight = null;
    if (flight_id && mongoose.Types.ObjectId.isValid(flight_id) && flight_id !== '00000000-0000-0000-0000-000000000000') {
      flight = await Flight.findById(flight_id);
    }
    
    // If no flight found, grab the first scheduled flight as fallback
    if (!flight) {
      flight = await Flight.findOne();
    }

    if (!flight) {
      return res.status(404).json({ message: 'No flight scheduled found in database' });
    }

    const cost = Number(total_amount) || flight.price?.first || flight.price?.business || 1200;

    // Check FBO Wallet balance
    const userBalance = user.wallet?.balance || 0;
    if (userBalance < cost) {
      return res.status(400).json({ message: `Insufficient FBO wallet funds. Required: $${cost}, Balance: $${userBalance}` });
    }

    // Deduct wallet funds
    user.wallet.balance = userBalance - cost;

    // Append wallet transaction log
    const transactionId = `TX-${Date.now().toString().slice(-4)}${Math.floor(1000 + Math.random() * 9000)}`;
    user.wallet.transactions.push({
      id: transactionId,
      title: `Commercial Booking: ${flight.departure?.city || 'BOM'} - ${flight.arrival?.city || 'DWC'}`,
      amount: cost,
      type: 'debit',
      date: new Date()
    });

    // Credit loyalty points (10% of cost or minimum 500)
    const pointsAwarded = Math.max(500, Math.floor(cost * 0.1));
    user.coins = (user.coins || 0) + pointsAwarded;

    // Default passenger if none provided
    const passengerList = (passengers && passengers.length > 0) ? passengers : [{
      firstName: user.firstName,
      lastName: user.lastName,
      age: 35,
      passportNumber: 'US892347234',
      nationality: 'United States'
    }];

    // Create Booking
    const booking = new Booking({
      user: user._id,
      type: 'commercial',
      flight: flight._id,
      passengers: passengerList,
      class: 'business',
      seats: [seat_number || '2B'],
      totalPrice: cost,
      status: 'Confirmed',
      paymentStatus: 'paid',
      paymentMethod: 'wallet',
      boardingPass: {
        qrCode: `SKYL-COMM-${transactionId}`,
        gate: 'B3',
        terminal: 'Terminal 3',
        boardingTime: '08:15'
      }
    });

    await booking.save();
    await user.save();

    // Decrement seat from flight if possible
    if (flight.availableSeats && flight.availableSeats.business > 0) {
      flight.availableSeats.business -= 1;
      await flight.save();
    }

    res.status(201).json(booking);
  } catch (error) {
    console.error('Book commercial flight error:', error);
    res.status(500).json({ message: 'Server error during booking' });
  }
});

// Book private jet charter
router.post('/charter', async (req, res) => {
  try {
    const userId = req.query.user_id;
    const { aircraft_id, legs, catering, chauffeur, security, price } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let jet = null;
    if (aircraft_id && mongoose.Types.ObjectId.isValid(aircraft_id) && aircraft_id !== '00000000-0000-0000-0000-000000000000') {
      jet = await Fleet.findById(aircraft_id);
    }
    
    if (!jet) {
      jet = await Fleet.findOne();
    }

    if (!jet) {
      return res.status(404).json({ message: 'No aircraft fleet found in database' });
    }

    const cost = Number(price) || jet.hourlyRate * 3.5 || 51500;

    // Check balance
    const userBalance = user.wallet?.balance || 0;
    if (userBalance < cost) {
      return res.status(400).json({ message: `Insufficient FBO wallet funds. Required: $${cost}, Balance: $${userBalance}` });
    }

    // Deduct balance
    user.wallet.balance = userBalance - cost;

    // Append wallet transaction log
    const transactionId = `TX-${Date.now().toString().slice(-4)}${Math.floor(1000 + Math.random() * 9000)}`;
    const routeTitle = legs && legs.length > 0 ? `${legs[0].from} - ${legs[legs.length - 1].to}` : 'BOM - DWC';
    user.wallet.transactions.push({
      id: transactionId,
      title: `Aircraft Charter: ${routeTitle}`,
      amount: cost,
      type: 'debit',
      date: new Date()
    });

    // Credit loyalty points (10% of cost or minimum 2000)
    const pointsAwarded = Math.max(2000, Math.floor(cost * 0.1));
    user.coins = (user.coins || 0) + pointsAwarded;

    const defaultLegs = (legs && legs.length > 0) ? legs : [{
      from: 'BOM',
      to: 'DWC',
      date: new Date().toISOString().split('T')[0],
      passengers: 4
    }];

    // Create Booking
    const booking = new Booking({
      user: user._id,
      type: 'private',
      aircraft: jet._id,
      aircraftModel: jet.model,
      passengers: [{
        firstName: user.firstName,
        lastName: user.lastName,
        age: 35,
        passportNumber: 'US892347234',
        nationality: 'United States'
      }],
      class: 'private',
      totalPrice: cost,
      status: 'Confirmed',
      paymentStatus: 'paid',
      paymentMethod: 'wallet',
      legs: defaultLegs,
      catering: catering || 'Michelin-Grade Fine Dining',
      chauffeur: chauffeur || 'Maybach S-Class Chauffeur',
      security: security || 'Standard Terminal Security',
      boardingPass: {
        qrCode: `SKYL-CHAR-${transactionId}`,
        gate: 'V1',
        terminal: 'VIP Terminal 1',
        boardingTime: '08:30'
      }
    });

    await booking.save();
    await user.save();

    res.status(201).json(booking);
  } catch (error) {
    console.error('Book charter flight error:', error);
    res.status(500).json({ message: 'Server error during charter booking' });
  }
});

// Get a single booking by ID
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate({
        path: 'flight',
        populate: {
          path: 'airline'
        }
      })
      .populate('aircraft');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    console.error('Fetch booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Barcode drawing helper for pdfkit
function drawBarcode(doc, x, y, width, height) {
  doc.save();
  doc.rect(x, y, width, height).fillColor('#ffffff').fill();
  doc.fillColor('#000000');
  let currentX = x + 10;
  const endX = x + width - 10;
  while (currentX < endX) {
    const lineWidth = Math.random() > 0.4 ? (Math.random() > 0.5 ? 2 : 1) : 3;
    const spacing = Math.random() > 0.3 ? 2 : 4;
    doc.rect(currentX, y + 5, lineWidth, height - 10).fill();
    currentX += lineWidth + spacing;
  }
  doc.restore();
}

// QR Code drawing helper for pdfkit
function drawQRCode(doc, x, y, size) {
  doc.save();
  doc.rect(x, y, size, size).fillColor('#ffffff').fill();
  doc.fillColor('#000000');
  
  const scale = size / 21;
  
  const drawFinder = (px, py) => {
    doc.rect(px, py, 7 * scale, 7 * scale).fill();
    doc.rect(px + scale, py + scale, 5 * scale, 5 * scale).fillColor('#ffffff').fill();
    doc.rect(px + 2 * scale, py + 2 * scale, 3 * scale, 3 * scale).fillColor('#000000').fill();
  };
  
  drawFinder(x, y);
  drawFinder(x + size - 7 * scale, y);
  drawFinder(x, y + size - 7 * scale);
  
  for (let r = 0; r < 21; r++) {
    for (let c = 0; c < 21; c++) {
      if ((r < 8 && c < 8) || (r < 8 && c > 12) || (r > 12 && c < 8)) continue;
      if (((r * 3 + c * 7) % 5 === 0) || ((r + c) % 3 === 0)) {
        doc.rect(x + c * scale, y + r * scale, scale, scale).fill();
      }
    }
  }
  doc.restore();
}

// Download Boarding Pass PDF
router.get('/:id/boarding-pass/download', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate({
        path: 'flight',
        populate: {
          path: 'airline'
        }
      })
      .populate('aircraft');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=boarding-pass-${booking.bookingReference}.pdf`);

    const doc = new PDFDocument({ size: 'A4', margin: 40 });
    doc.pipe(res);

    // Get airline information and colors
    const isCommercial = booking.type === 'commercial';
    const airline = isCommercial ? booking.flight?.airline : null;
    const airlineName = airline ? airline.airlineName : 'SkyLuxe Private';
    const brandColor = airline ? (airline.brandColor || '#D4AF37') : '#D4AF37';
    const iataCode = airline ? (airline.iataCode || 'SL') : 'SL';
    const flightNo = isCommercial ? (booking.flight?.flightNumber || 'SL-COMM') : 'SL-PVT';
    const aircraft = isCommercial ? (booking.flight?.aircraft || 'Airbus A350') : (booking.aircraftModel || booking.aircraft?.model || 'Gulfstream G700');
    
    // Origin / Destination
    const fromCode = isCommercial ? (booking.flight?.departure?.airport || 'BOM') : (booking.legs?.[0]?.from || 'BOM');
    const toCode = isCommercial ? (booking.flight?.arrival?.airport || 'DWC') : (booking.legs?.[booking.legs.length - 1]?.to || 'DWC');
    const fromCity = isCommercial ? (booking.flight?.departure?.city || 'Mumbai') : 'Mumbai';
    const toCity = isCommercial ? (booking.flight?.arrival?.city || 'Dubai Al Maktoum') : 'Dubai';
    const flightDate = isCommercial ? new Date(booking.flight?.departure?.time).toDateString() : (booking.legs?.[0]?.date || new Date().toDateString());
    const flightTime = isCommercial ? new Date(booking.flight?.departure?.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '09:00';
    
    const passenger = booking.passengers?.[0] || { firstName: 'Eashan', lastName: 'Sterling', passportNumber: 'N/A' };
    const passengerName = `${passenger.firstName} ${passenger.lastName}`.toUpperCase();
    const seat = booking.seats?.[0] || '1A';
    const gate = booking.boardingPass?.gate || 'B3';
    const terminal = booking.boardingPass?.terminal || 'Terminal 3';
    const boardingTime = booking.boardingPass?.boardingTime || '08:15';
    const pnr = booking.bookingReference;
    const fareClass = booking.class ? booking.class.toUpperCase() : 'FIRST CLASS';
    const boardingGroup = fareClass.includes('FIRST') ? 'GROUP A' : fareClass.includes('BUSINESS') ? 'GROUP B' : 'GROUP C';

    // SkyLuxe Header
    doc.fillColor('#020202');
    doc.rect(0, 0, 595, 80).fill();
    
    doc.fillColor('#D4AF37');
    doc.fontSize(22).font('Times-Bold').text('S K Y L U X E', 40, 25, { characterSpacing: 2 });
    doc.fontSize(8).font('Helvetica-Bold').fillColor('#FFFFFF').text('AV I AT I O N  P R I VAT E  C O N C I E R G E', 40, 50, { characterSpacing: 1 });
    
    doc.fontSize(10).font('Helvetica-Bold').fillColor('#D4AF37').text('BOARDING PASS / FLIGHT DOCUMENT', 400, 35, { align: 'right' });
    
    // --- BOARDING PASS CONTAINER ---
    const passY = 110;
    const passWidth = 515;
    const passHeight = 220;
    
    // Draw Border and Header of the Boarding Pass
    doc.lineWidth(1);
    doc.rect(40, passY, passWidth, passHeight).strokeColor('#E0E0E0').stroke();
    
    // Fill Header of the Boarding Pass with the airline's brand color
    doc.rect(40, passY, passWidth, 40).fillColor(brandColor).fill();
    
    // Write Airline Name inside Boarding Pass Header
    doc.fillColor('#FFFFFF').fontSize(14).font('Helvetica-Bold').text(airlineName.toUpperCase(), 55, passY + 14);
    
    // Write Flight Reference / PNR inside Boarding Pass Header (right side)
    doc.fillColor('#FFFFFF').fontSize(11).font('Helvetica').text(`PNR / BOOKING REF: ${pnr}`, 380, passY + 15, { align: 'right', width: 160 });
    
    // Left Main Ticket Section details
    doc.fillColor('#333333');
    doc.fontSize(8).font('Helvetica-Bold').text('PASSENGER NAME', 55, passY + 55);
    doc.fontSize(12).font('Helvetica-Bold').fillColor('#111111').text(passengerName, 55, passY + 68);
    
    doc.fillColor('#333333');
    doc.fontSize(8).font('Helvetica-Bold').text('FLIGHT', 55, passY + 95);
    doc.fontSize(11).font('Helvetica-Bold').fillColor('#111111').text(flightNo, 55, passY + 108);
    
    doc.fillColor('#333333');
    doc.fontSize(8).font('Helvetica-Bold').text('CLASS', 145, passY + 95);
    doc.fontSize(11).font('Helvetica-Bold').fillColor(brandColor).text(fareClass, 145, passY + 108);
    
    doc.fillColor('#333333');
    doc.fontSize(8).font('Helvetica-Bold').text('DATE', 55, passY + 135);
    doc.fontSize(10).font('Helvetica-Bold').fillColor('#111111').text(flightDate, 55, passY + 148);
    
    doc.fillColor('#333333');
    doc.fontSize(8).font('Helvetica-Bold').text('BOARDING TIME', 185, passY + 135);
    doc.fontSize(10).font('Helvetica-Bold').fillColor('#111111').text(boardingTime, 185, passY + 148);
    
    // Origin & Destination graphics
    doc.fontSize(22).font('Helvetica-Bold').fillColor('#111111').text(fromCode, 270, passY + 55);
    doc.fontSize(22).font('Helvetica-Bold').fillColor('#111111').text(toCode, 375, passY + 55);
    doc.fontSize(8).font('Helvetica').fillColor('#666666').text(fromCity, 270, passY + 80, { width: 80 });
    doc.fontSize(8).font('Helvetica').fillColor('#666666').text(toCity, 375, passY + 80, { width: 80 });
    
    // Draw a small airplane symbol or arrow in between
    doc.strokeColor('#D4AF37').lineWidth(1.5).moveTo(325, passY + 68).lineTo(365, passY + 68).stroke();
    doc.moveTo(360, passY + 65).lineTo(365, passY + 68).lineTo(360, passY + 71).fillColor('#D4AF37').fill();
    
    // Boarding details bottom
    doc.fillColor('#333333');
    doc.fontSize(8).font('Helvetica-Bold').text('GATE', 270, passY + 105);
    doc.fontSize(12).font('Helvetica-Bold').fillColor('#111111').text(gate, 270, passY + 118);
    
    doc.fillColor('#333333');
    doc.fontSize(8).font('Helvetica-Bold').text('TERMINAL', 320, passY + 105);
    doc.fontSize(12).font('Helvetica-Bold').fillColor('#111111').text(terminal, 320, passY + 118);
    
    doc.fillColor('#333333');
    doc.fontSize(8).font('Helvetica-Bold').text('SEAT', 390, passY + 105);
    doc.fontSize(12).font('Helvetica-Bold').fillColor('#111111').text(seat, 390, passY + 118);
    
    // Draw QR Code in the main ticket
    drawQRCode(doc, 455, passY + 55, 80);
    doc.fontSize(7).font('Helvetica').fillColor('#666666').text('SCAN GATE REGISTRY', 455, passY + 142, { align: 'center', width: 80 });

    // Tear-off divider line (vertical dashed line)
    doc.save();
    doc.strokeColor('#CCCCCC').lineWidth(1).dash(4, { space: 4 }).moveTo(445, passY + 40).lineTo(445, passY + 220).stroke();
    doc.restore();

    // Draw Barcode at the bottom of boarding pass
    drawBarcode(doc, 55, passY + 180, 240, 30);
    doc.fontSize(8).font('Courier').fillColor('#333333').text(`*${pnr}*`, 55, passY + 212, { width: 240, align: 'center' });

    // Print Boarding Group
    doc.rect(310, passY + 175, 120, 35).fillColor('#F5F5F5').fill();
    doc.fillColor('#333333').fontSize(7).font('Helvetica-Bold').text('BOARDING GROUP', 315, passY + 180);
    doc.fillColor('#111111').fontSize(11).font('Helvetica-Bold').text(boardingGroup, 315, passY + 192);

    // --- SECOND HALF: BOOKING DETAILS & RULES ---
    const detailY = 365;
    
    doc.fontSize(12).font('Helvetica-Bold').fillColor('#D4AF37').text('FLIGHT INVOICE & CONCIERGE INFORMATION', 40, detailY);
    doc.strokeColor('#D4AF37').lineWidth(1.5).moveTo(40, detailY + 18).lineTo(555, detailY + 18).stroke();
    
    doc.fillColor('#333333').fontSize(9).font('Helvetica-Bold').text('Aircraft Type:', 40, detailY + 30);
    doc.fillColor('#111111').font('Helvetica').text(aircraft, 140, detailY + 30);
    
    doc.fillColor('#333333').fontSize(9).font('Helvetica-Bold').text('Baggage Allowance:', 40, detailY + 50);
    doc.fillColor('#111111').font('Helvetica').text(isCommercial ? 'Checked: 2x 32kg, Cabin: 1x 15kg' : 'Varies by configuration (unlimited capacity)', 140, detailY + 50);
    
    doc.fillColor('#333333').fontSize(9).font('Helvetica-Bold').text('Catering Selection:', 40, detailY + 70);
    doc.fillColor('#111111').font('Helvetica').text(booking.catering || 'Michelin-Grade Dining', 140, detailY + 70);
    
    doc.fillColor('#333333').fontSize(9).font('Helvetica-Bold').text('Chauffeur Service:', 40, detailY + 90);
    doc.fillColor('#111111').font('Helvetica').text(booking.chauffeur || 'Maybach S-Class Pre-arranged', 140, detailY + 90);
    
    doc.fillColor('#333333').fontSize(9).font('Helvetica-Bold').text('Payment Method:', 40, detailY + 110);
    doc.fillColor('#111111').font('Helvetica').text(booking.paymentMethod === 'wallet' ? 'FBO Wallet Balance' : 'Razorpay Settlement Gateway', 140, detailY + 110);

    // Right column in details
    doc.fillColor('#333333').fontSize(9).font('Helvetica-Bold').text('Passport Number:', 320, detailY + 30);
    doc.fillColor('#111111').font('Helvetica').text(passenger.passportNumber || 'N/A', 420, detailY + 30);

    doc.fillColor('#333333').fontSize(9).font('Helvetica-Bold').text('Nationality:', 320, detailY + 50);
    doc.fillColor('#111111').font('Helvetica').text(passenger.nationality || 'N/A', 420, detailY + 50);

    doc.fillColor('#333333').fontSize(9).font('Helvetica-Bold').text('Booking Status:', 320, detailY + 70);
    doc.fillColor('#008000').font('Helvetica-Bold').text(booking.status.toUpperCase(), 420, detailY + 70);

    doc.fillColor('#333333').fontSize(9).font('Helvetica-Bold').text('Amount Billed:', 320, detailY + 90);
    doc.fillColor('#111111').font('Helvetica-Bold').text(`$${booking.totalPrice.toLocaleString()} USD`, 420, detailY + 90);

    doc.fillColor('#333333').fontSize(9).font('Helvetica-Bold').text('Settled On:', 320, detailY + 110);
    doc.fillColor('#111111').font('Helvetica').text(new Date(booking.createdAt).toLocaleString(), 420, detailY + 110);

    // --- TERMS AND CONDITIONS ---
    const termsY = 515;
    doc.fontSize(10).font('Helvetica-Bold').fillColor('#D4AF37').text('TERMS OF CARRIAGE & SECURITY COMPLIANCE', 40, termsY);
    doc.strokeColor('#CCCCCC').lineWidth(0.5).moveTo(40, termsY + 14).lineTo(555, termsY + 14).stroke();
    
    doc.fontSize(7).font('Helvetica').fillColor('#666666').text(
      '1. Boarding gate closes exactly 20 minutes prior to scheduled departure. Late arrivals will not be accommodated.\n' +
      '2. All passengers must present valid government-issued photographic identification or passport matching this boarding pass.\n' +
      '3. Carriage of hazardous materials (aerosols, lithium batteries, flammable liquids) is strictly prohibited. Inspections will be enforced.\n' +
      '4. Baggage size and weight limitations are subject to SkyLuxe premium allowances. Excess weights will incur handling surcharges.\n' +
      '5. Under global aviation security regulations, this ticket is non-transferable and subject to immediate cancellation if falsified.\n' +
      '6. Private jet charters require security clearances at the FBO Terminal at least 30 minutes before wheels-up authorization.',
      40, termsY + 25, { width: 515, lineGap: 3 }
    );

    // Stamp / Footer
    doc.rect(40, 680, 515, 40).fillColor('#FAF6E9').fill();
    doc.fillColor('#D4AF37').fontSize(8).font('Helvetica-Bold').text(
      'OFFICIALLY COMPLIANT WITH REGULATORY CIVIL AVIATION AUTHORITY GUIDELINES', 
      40, 692, { align: 'center', width: 515 }
    );
    doc.fontSize(7).font('Helvetica').fillColor('#9D8349').text(
      `Generated on ${new Date().toUTCString()} | System Reference ID: ${booking._id}`,
      40, 705, { align: 'center', width: 515 }
    );

    doc.end();
  } catch (error) {
    console.error('PDF Boarding Pass generation error:', error);
    res.status(500).json({ message: 'Server error generating boarding pass PDF' });
  }
});

// Cancel a booking and process FBO wallet refunds
router.post('/:id/cancel', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('flight')
      .populate('aircraft');
      
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    if (booking.status === 'Cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }
    
    const user = await User.findById(booking.user);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if cancellation is allowed (> 24 hours prior to departure)
    let departureDate = null;
    if (booking.type === 'commercial' && booking.flight) {
      departureDate = new Date(booking.flight.departure_time || booking.createdAt);
    } else if (booking.type === 'private' && booking.legs && booking.legs.length > 0) {
      departureDate = new Date(booking.legs[0].date);
    } else {
      departureDate = new Date(booking.createdAt);
    }
    
    const timeDiff = departureDate.getTime() - Date.now();
    const hoursDiff = timeDiff / (1000 * 3600);
    
    let refundAmount = 0;
    let cancellationFee = 0;
    const isRefundable = hoursDiff >= 24;
    
    if (isRefundable) {
      const tier = (user.membership || 'none').toLowerCase();
      if (booking.type === 'commercial') {
        if (tier === 'black elite' || tier === 'black_elite') cancellationFee = 0;
        else if (tier === 'executive') cancellationFee = 50;
        else cancellationFee = 100;
      } else { // private charter
        if (tier === 'black elite' || tier === 'black_elite') cancellationFee = 0;
        else if (tier === 'executive') cancellationFee = 250;
        else cancellationFee = 500;
      }
      
      refundAmount = Math.max(0, booking.totalPrice - cancellationFee);
    }
    
    // Update booking status
    booking.status = 'Cancelled';
    booking.paymentStatus = isRefundable && refundAmount > 0 ? 'refunded' : 'paid';
    
    // If refunded, add to user wallet
    if (refundAmount > 0) {
      user.wallet.balance = (user.wallet.balance || 0) + refundAmount;
      
      const transactionId = `TX-${Date.now().toString().slice(-4)}${Math.floor(1000 + Math.random() * 9000)}`;
      user.wallet.transactions.push({
        id: transactionId,
        title: `Refund: Cancelled ${booking.type === 'commercial' ? 'Commercial Booking' : 'Private Charter'} (${booking.bookingReference})`,
        amount: refundAmount,
        type: 'credit',
        date: new Date()
      });
    }
    
    await booking.save();
    await user.save();
    
    // Create notification
    const Notification = require('../models/Notification');
    const notification = new Notification({
      user: user._id,
      title: 'Booking Cancelled',
      message: `Your booking ${booking.bookingReference} has been successfully cancelled. ${refundAmount > 0 ? `A refund of $${refundAmount.toLocaleString()} has been credited to your wallet.` : 'This cancellation was non-refundable.'}`,
      type: 'wallet',
      unread: true
    });
    await notification.save();
    
    res.json({
      message: 'Booking cancelled successfully',
      booking,
      refundAmount,
      cancellationFee
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ message: 'Server error during cancellation' });
  }
});

module.exports = router;
