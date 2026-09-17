const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

/**
 * Generates a luxury credit-card sized VIP membership card PDF.
 * A6 card format or standard custom [486, 306] points.
 */
function generateMembershipCardPDF(user) {
  return new Promise((resolve, reject) => {
    try {
      const cardsDir = path.join(__dirname, '..', 'invoices'); // Reuse invoices/cache folder
      if (!fs.existsSync(cardsDir)) {
        fs.mkdirSync(cardsDir, { recursive: true });
      }

      const fileName = `membercard-${user._id}.pdf`;
      const filePath = path.join(cardsDir, fileName);
      const relativePath = `/invoices/${fileName}`;

      // Card Dimensions: 486 x 306 (standard 1.58:1 aspect ratio CR80 high-res card)
      const doc = new PDFDocument({ size: [486, 306], margin: 25 });
      const writeStream = fs.createWriteStream(filePath);
      doc.pipe(writeStream);

      const tier = (user.membership || 'silver').toLowerCase().replace(' ', '_');
      
      // Define styles based on Membership Tier
      let bgColors, textColor, accentColor, glowColor, tierName;
      if (tier === 'black_elite') {
        bgColors = ['#0A0A0A', '#1C1C1C', '#020202']; // Dark Matte Titanium
        textColor = '#FFFFFF';
        accentColor = '#D4AF37'; // Pure Gold
        glowColor = 'rgba(212, 175, 55, 0.4)';
        tierName = 'BLACK ELITE MEMBER';
      } else if (tier === 'executive') {
        bgColors = ['#7D6B58', '#E6C280', '#9D8349']; // Champagne Gold
        textColor = '#0F0E0D';
        accentColor = '#FFFFFF';
        glowColor = 'rgba(255, 255, 255, 0.3)';
        tierName = 'EXECUTIVE CLUB MEMBER';
      } else {
        bgColors = ['#E2E8F0', '#CBD5E1', '#94A3B8']; // Brushed Silver
        textColor = '#0F172A';
        accentColor = '#334155';
        glowColor = 'rgba(226, 232, 240, 0.5)';
        tierName = 'SILVER CLUB MEMBER';
      }

      // Draw background gradient / panels
      doc.rect(0, 0, 486, 306).fill(bgColors[0]);
      
      // Shimmer reflection effect
      doc.rect(0, 0, 486, 120).fillColor(bgColors[1]).fillOpacity(0.15).fill();
      doc.fillOpacity(1); // Restore opacity

      // Draw elegant gold border around the card
      doc.lineWidth(1.5);
      doc.rect(15, 15, 456, 276).strokeColor(accentColor).stroke();

      // Top brand header
      doc.fillColor(accentColor).fontSize(16).font('Times-Bold').text('S K Y L U X E', 35, 35, { characterSpacing: 2 });
      doc.fillColor(textColor).fontSize(6).font('Helvetica-Bold').text('AV I AT I O N  S O V E R E I G N  C L U B', 35, 55, { characterSpacing: 1 });

      // Hologram placeholder on top right
      doc.lineWidth(1);
      doc.rect(390, 35, 50, 40).strokeColor(accentColor).stroke();
      doc.fillColor(accentColor).fontSize(6).font('Helvetica-Bold').text('SECURE', 390, 50, { align: 'center', width: 50 });
      doc.text('PASS', 390, 60, { align: 'center', width: 50 });

      // Star Icon or logo emblem
      doc.strokeColor(accentColor).lineWidth(1);
      doc.circle(243, 130, 25).stroke();
      doc.fillColor(accentColor).fontSize(14).font('Times-Bold').text('✦', 238, 122);

      // Card Information Block
      doc.fillColor(textColor);
      doc.fontSize(8).font('Helvetica-Bold').text('CARDHOLDER NAME', 35, 195);
      const name = `${user.firstName} ${user.lastName}`.toUpperCase();
      doc.fontSize(14).font('Helvetica-Bold').fillColor(accentColor).text(name, 35, 208);

      // Footer Meta
      doc.fillColor(textColor);
      doc.fontSize(7).font('Helvetica').text('MEMBER ID', 35, 240);
      const memberId = `SL-${(user._id || 'guest').toString().slice(-6).toUpperCase()}`;
      doc.fontSize(9).font('Courier-Bold').text(memberId, 35, 250);

      doc.fontSize(7).font('Helvetica').text('EXPIRES END', 140, 240);
      const expiryStr = user.membershipExpiry 
        ? new Date(user.membershipExpiry).toLocaleDateString('en-US', { month: '2-digit', year: '2-digit' }) 
        : '12/29';
      doc.fontSize(9).font('Courier-Bold').text(expiryStr, 140, 250);

      // Card Tier stamp right aligned
      doc.fillColor(accentColor).fontSize(11).font('Helvetica-Bold').text(tierName, 240, 248, { align: 'right', width: 200 });

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

module.exports = { generateMembershipCardPDF };
