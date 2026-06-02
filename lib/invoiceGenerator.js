const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

/**
 * Generates a luxury-themed tax invoice PDF and saves it to the local filesystem.
 * Returns the relative file path to the generated PDF.
 */
function generateInvoicePDF(invoice, user) {
  return new Promise((resolve, reject) => {
    try {
      const invoicesDir = path.join(__dirname, '..', 'invoices');
      if (!fs.existsSync(invoicesDir)) {
        fs.mkdirSync(invoicesDir, { recursive: true });
      }

      const fileName = `${invoice.invoiceNumber}.pdf`;
      const filePath = path.join(invoicesDir, fileName);
      const relativePath = `/invoices/${fileName}`;

      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const writeStream = fs.createWriteStream(filePath);
      doc.pipe(writeStream);

      // --- LUXURY BRAND HEADER ---
      // Gold and dark styling
      doc.rect(0, 0, 595, 120).fill('#020202');
      doc.fillColor('#D4AF37').fontSize(26).font('Helvetica-Bold').text('S K Y L U X E', 50, 45);
      doc.fillColor('#FFFFFF').fontSize(10).font('Helvetica').text('Sovereign Flight Logistics & Concierge Services', 50, 75);

      doc.fillColor('#D4AF37').fontSize(14).font('Helvetica-Bold').text('TAX INVOICE', 400, 45, { align: 'right', width: 145 });
      doc.fillColor('#FFFFFF').fontSize(8).font('Helvetica').text(invoice.invoiceNumber, 400, 65, { align: 'right', width: 145 });
      doc.text(new Date(invoice.createdAt).toLocaleDateString(), 400, 77, { align: 'right', width: 145 });

      // Move down below header
      doc.y = 150;

      // --- CUSTOMER & VENDOR BLOCK ---
      doc.fillColor('#020202').fontSize(10).font('Helvetica-Bold').text('BILL TO:', 50, 150);
      doc.font('Helvetica').text(`${user.firstName} ${user.lastName}`, 50, 165);
      doc.text(user.email, 50, 180);
      if (user.phone) doc.text(user.phone, 50, 195);
      if (user.country) doc.text(user.country, 50, 210);

      doc.font('Helvetica-Bold').text('ISSUED BY:', 350, 150);
      doc.font('Helvetica').text('SkyLuxe Aviation Limited', 350, 165);
      doc.text('VIP Terminal 1, BOM Hub', 350, 180);
      doc.text('Mumbai, IND', 350, 195);
      doc.text('billing@skyluxe.com', 350, 210);

      // --- LINE ITEMS TABLE ---
      let startY = 260;
      doc.rect(50, startY, 495, 20).fill('#020202');
      doc.fillColor('#D4AF37').fontSize(9).font('Helvetica-Bold').text('Description', 60, startY + 6);
      doc.text('Qty', 350, startY + 6, { width: 40, align: 'center' });
      doc.text('Unit Price', 400, startY + 6, { width: 60, align: 'right' });
      doc.text('Total', 480, startY + 6, { width: 60, align: 'right' });

      // Draw rows
      let currentY = startY + 20;
      invoice.items.forEach((item, index) => {
        // Draw thin row borders
        doc.rect(50, currentY, 495, 25).stroke('#EEEEEE');
        doc.fillColor('#333333').fontSize(9).font('Helvetica').text(item.description, 60, currentY + 8);
        doc.text(item.quantity.toString(), 350, currentY + 8, { width: 40, align: 'center' });
        doc.text(`$${item.unitPrice.toLocaleString()}`, 400, currentY + 8, { width: 60, align: 'right' });
        doc.text(`$${(item.unitPrice * item.quantity).toLocaleString()}`, 480, currentY + 8, { width: 60, align: 'right' });
        currentY += 25;
      });

      // --- TAX & TOTALS SUMMARY ---
      currentY += 20;
      doc.rect(320, currentY, 225, 80).stroke('#D4AF37');

      doc.fillColor('#020202').fontSize(9).font('Helvetica').text('Subtotal:', 340, currentY + 15);
      const subtotal = invoice.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
      doc.font('Helvetica-Bold').text(`$${subtotal.toLocaleString()}`, 460, currentY + 15, { align: 'right', width: 70 });

      doc.font('Helvetica').text('VAT / Tax (18%):', 340, currentY + 35);
      doc.font('Helvetica-Bold').text(`$${invoice.taxAmount.toLocaleString()}`, 460, currentY + 35, { align: 'right', width: 70 });

      // Divider line
      doc.moveTo(340, currentY + 50).lineTo(530, currentY + 50).stroke('#EEEEEE');

      doc.fillColor('#020202').fontSize(11).font('Helvetica-Bold').text('Total Paid:', 340, currentY + 58);
      doc.fillColor('#D4AF37').text(`$${invoice.totalAmount.toLocaleString()}`, 460, currentY + 58, { align: 'right', width: 70 });

      // --- TERMS & AUDIT FOOTER ---
      doc.fillColor('#999999').fontSize(7).font('Helvetica-Oblique').text('This is a computer-generated tax invoice verified cryptographically via Razorpay. No physical signature is required.', 50, 500, { align: 'center', width: 495 });
      doc.text('For billing issues or refund requests, please contact conciergemanifest@skyluxe.com.', 50, 515, { align: 'center', width: 495 });

      doc.end();

      writeStream.on('finish', () => {
        resolve(relativePath);
      });
      writeStream.on('error', (err) => {
        reject(err);
      });
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = { generateInvoicePDF };
