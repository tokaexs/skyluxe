const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const Invoice = require('../models/Invoice');

// Download invoice PDF
router.get('/:id/download', async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    const filePath = path.join(__dirname, '..', 'invoices', `${invoice.invoiceNumber}.pdf`);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'Invoice file has not been built yet' });
    }

    res.download(filePath, `${invoice.invoiceNumber}.pdf`);
  } catch (error) {
    console.error('Invoice download error:', error);
    res.status(500).json({ message: 'Server error serving PDF file' });
  }
});

module.exports = router;
