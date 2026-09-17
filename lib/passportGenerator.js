const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

/**
 * Generates a luxury-themed booklet-style VIP sovereign travel passport PDF.
 * A5 layout (420 x 595 points).
 */
function generatePassportPDF(user) {
  return new Promise((resolve, reject) => {
    try {
      const passportDir = path.join(__dirname, '..', 'invoices'); // Reuse invoices/cache folder
      if (!fs.existsSync(passportDir)) {
        fs.mkdirSync(passportDir, { recursive: true });
      }

      const fileName = `passport-${user._id}.pdf`;
      const filePath = path.join(passportDir, fileName);
      const relativePath = `/invoices/${fileName}`;

      // A5 dimensions: 420 x 595 points
      const doc = new PDFDocument({ size: 'A5', margin: 30 });
      const writeStream = fs.createWriteStream(filePath);
      doc.pipe(writeStream);

      // --- PAGE 1: PASSPORT COVER PAGE ---
      // Royal blue background
      doc.rect(0, 0, 420, 595).fill('#0B1D33');

      // Golden ornate double border
      doc.lineWidth(2);
      doc.rect(20, 20, 380, 555).strokeColor('#D4AF37').stroke();
      doc.lineWidth(0.5);
      doc.rect(24, 24, 372, 547).strokeColor('#D4AF37').stroke();

      // Top title
      doc.fillColor('#D4AF37').fontSize(22).font('Times-Bold').text('S K Y L U X E', 20, 80, { align: 'center', characterSpacing: 3 });
      doc.fontSize(8).font('Helvetica-Bold').fillColor('#FFFFFF').text('A V I A T I O N  S O V E R E I G N  N E T W O R K', 20, 110, { align: 'center', characterSpacing: 1 });

      // Draw standard luxury passport emblem (large gold circular compass/star/crest)
      doc.save();
      doc.strokeColor('#D4AF37').lineWidth(1.5);
      doc.circle(210, 290, 75).stroke();
      doc.circle(210, 290, 70).stroke();
      doc.circle(210, 290, 45).stroke();
      
      // Draw compass points
      doc.moveTo(210, 210).lineTo(210, 370).stroke();
      doc.moveTo(130, 290).lineTo(290, 290).stroke();
      doc.restore();

      doc.fillColor('#D4AF37').fontSize(28).font('Times-Bold').text('✦', 203, 276, { align: 'center' });

      // Bottom titles
      doc.fillColor('#D4AF37').fontSize(16).font('Times-Bold').text('SOVEREIGN PASSPORT', 20, 460, { align: 'center', characterSpacing: 2 });
      doc.fontSize(8).font('Helvetica-Bold').fillColor('#FFFFFF').text('OFFICIAL DUAL CITIZENSHIP FLIGHT DOCUMENT', 20, 490, { align: 'center', characterSpacing: 1 });

      // --- PAGE 2: PASSPORT BIO-DATA PAGE ---
      doc.addPage();
      
      // Page 2 Background (cream/parchment luxury pattern)
      doc.rect(0, 0, 420, 595).fill('#FCFBF7');
      doc.rect(20, 20, 380, 555).strokeColor('#EAD8B1').stroke();

      // Header
      doc.fillColor('#0B1D33').fontSize(12).font('Helvetica-Bold').text('SOVEREIGN FLIGHT OPERATIONS PASSPORT', 30, 35);
      doc.lineWidth(1).strokeColor('#EAD8B1').moveTo(30, 50).lineTo(390, 50).stroke();

      // Photo Frame Placeholder
      doc.rect(35, 70, 95, 125).fillColor('#F5F5F0').fill();
      doc.rect(35, 70, 95, 125).strokeColor('#EAD8B1').stroke();
      doc.fillColor('#9D8349').fontSize(8).font('Helvetica-Bold').text('MEMBER PHOTO', 35, 125, { align: 'center', width: 95 });
      doc.fontSize(12).text('✦', 35, 140, { align: 'center', width: 95 });

      // Bio Data Columns
      const bioX = 145;
      doc.fillColor('#444444').fontSize(7).font('Helvetica-Bold');
      
      doc.text('SURNAME / NOM', bioX, 70);
      doc.fillColor('#111111').fontSize(10).font('Helvetica-Bold').text(user.lastName.toUpperCase(), bioX, 80);

      doc.fillColor('#444444').fontSize(7).text('GIVEN NAMES / PRENOMS', bioX, 98);
      doc.fillColor('#111111').fontSize(10).text(user.firstName.toUpperCase(), bioX, 108);

      doc.fillColor('#444444').fontSize(7).text('NATIONALITY / NATIONALITE', bioX, 126);
      doc.fillColor('#111111').fontSize(9).text((user.country || 'UNITED STATES').toUpperCase(), bioX, 136);

      doc.fillColor('#444444').fontSize(7).text('PASSPORT NO. / NO. DU PASSEPORT', bioX, 154);
      doc.fillColor('#D4AF37').fontSize(9).text('SL-' + user._id.toString().slice(-6).toUpperCase(), bioX, 164);

      // Row 2 of bio data
      doc.fillColor('#444444').fontSize(7).text('DATE OF BIRTH', 35, 215);
      doc.fillColor('#111111').fontSize(9).text('22 SEP 1990', 35, 225);

      doc.fillColor('#444444').fontSize(7).text('SEX / SEXE', 135, 215);
      doc.fillColor('#111111').fontSize(9).text('M', 135, 225);

      doc.fillColor('#444444').fontSize(7).text('MEMBERSHIP TIER', 205, 215);
      doc.fillColor('#D4AF37').fontSize(9).text((user.membership || 'SILVER').toUpperCase().replace('_', ' '), 205, 225);

      doc.fillColor('#444444').fontSize(7).text('DATE OF EXPIRY', 305, 215);
      const expiryStr = user.membershipExpiry 
        ? new Date(user.membershipExpiry).toLocaleDateString()
        : 'N/A';
      doc.fillColor('#111111').fontSize(9).text(expiryStr, 305, 225);

      // Signature line
      doc.lineWidth(0.5).strokeColor('#CCCCCC').moveTo(35, 270).lineTo(200, 270).stroke();
      doc.fillColor('#888888').fontSize(6).font('Helvetica-Oblique').text('Holder Signature / Signature du Titulaire', 35, 275);
      
      // Stamp of authority
      doc.strokeColor('#D4AF37').lineWidth(1);
      doc.circle(300, 275, 22).stroke();
      doc.fillColor('#D4AF37').fontSize(5).font('Helvetica-Bold').text('SKYLUXE', 278, 268, { align: 'center', width: 44 });
      doc.text('APPROVED', 278, 276, { align: 'center', width: 44 });

      // Machine Readable Zone (MRZ)
      doc.lineWidth(1).strokeColor('#EAD8B1').moveTo(30, 315).lineTo(390, 315).stroke();
      const mrz1 = `P<SLX${user.lastName.toUpperCase()}<<${user.firstName.toUpperCase()}<<<<<<<<<<<<<<<<<<`.padEnd(44, '<');
      const mrz2 = `SL${user._id.toString().slice(-6).toUpperCase()}<<2USA9009221M2606060<<<<<<<<<<<<<<`.padEnd(44, '<');
      doc.fillColor('#333333').fontSize(9).font('Courier-Bold').text(mrz1, 30, 325, { characterSpacing: 1 });
      doc.text(mrz2, 30, 340, { characterSpacing: 1 });

      // --- PAGE 3: VISAS & IMMIGRATION STAMPS ---
      doc.addPage();
      
      // Page 3 Background
      doc.rect(0, 0, 420, 595).fill('#FCFBF7');
      doc.rect(20, 20, 380, 555).strokeColor('#EAD8B1').stroke();

      doc.fillColor('#0B1D33').fontSize(12).font('Helvetica-Bold').text('VISAS & ENTRY STAMPS', 30, 35);
      doc.lineWidth(1).strokeColor('#EAD8B1').moveTo(30, 50).lineTo(390, 50).stroke();

      const stamps = user.passportStats?.stamps || [];
      
      if (stamps.length === 0) {
        doc.fillColor('#888888').fontSize(10).font('Helvetica-Oblique').text('No stamps logged yet. Complete flights or upgrade your membership to earn luxury customs stamps.', 40, 150, { align: 'center', width: 340 });
      } else {
        // Draw stamps in a grid
        let stampY = 70;
        let stampX = 35;
        
        stamps.forEach((stamp, idx) => {
          if (idx > 0 && idx % 2 === 0) {
            stampX = 35;
            stampY += 130;
          } else if (idx > 0) {
            stampX = 215;
          }
          
          if (stampY + 110 > 550) return; // Limit to page 3 slots

          // Draw stamp design (dashed or solid colored box)
          let stampColor = '#D4AF37'; // Gold
          if (stamp.stampId === 'stamp_bom') stampColor = '#10B981'; // Emerald
          if (stamp.stampId === 'stamp_lhr') stampColor = '#06B6D4'; // Cyan

          doc.save();
          doc.translate(stampX, stampY);
          
          // Slight rotation to look realistic
          const rot = idx % 3 === 0 ? -3 : idx % 3 === 1 ? 4 : 1;
          doc.rotate(rot, { origin: [80, 50] });

          doc.lineWidth(1.5).strokeColor(stampColor).rect(0, 0, 160, 100).dash(4, { space: 2 }).stroke();
          
          doc.fillColor(stampColor);
          doc.fontSize(6).font('Helvetica-Bold').text(stamp.country.toUpperCase(), 10, 12, { align: 'center', width: 140 });
          doc.fontSize(10).font('Times-Bold').text(stamp.title, 10, 30, { align: 'center', width: 140 });
          
          doc.fontSize(8).font('Courier-Bold').text(new Date(stamp.date).toLocaleDateString(), 10, 60, { align: 'center', width: 140 });
          doc.fontSize(5).font('Helvetica').text('IMMIGRATION BOARD SECURITY APPROVED', 10, 80, { align: 'center', width: 140 });
          doc.restore();
        });
      }

      // --- PAGE 4: FLIGHT LOG STATISTICS & MILESTONES ---
      doc.addPage();
      
      // Page 4 Background
      doc.rect(0, 0, 420, 595).fill('#FCFBF7');
      doc.rect(20, 20, 380, 555).strokeColor('#EAD8B1').stroke();

      doc.fillColor('#0B1D33').fontSize(12).font('Helvetica-Bold').text('MILESTONES & TRAVEL STATS', 30, 35);
      doc.lineWidth(1).strokeColor('#EAD8B1').moveTo(30, 50).lineTo(390, 50).stroke();

      // Metrics Block
      doc.rect(30, 70, 360, 70).fillColor('#FAF8F0').fill();
      doc.rect(30, 70, 360, 70).strokeColor('#EAD8B1').stroke();

      doc.fillColor('#0B1D33').fontSize(14).font('Helvetica-Bold');
      doc.text(user.passportStats.countriesVisited?.length.toString() || '0', 55, 90);
      doc.fontSize(6).font('Helvetica-Bold').fillColor('#666666').text('COUNTRIES VISITED', 40, 115);

      doc.fillColor('#0B1D33').fontSize(14).text(user.passportStats.flightsTaken?.toString() || '0', 190, 90);
      doc.fontSize(6).fillColor('#666666').text('TOTAL FLIGHTS TAKEN', 170, 115);

      doc.fillColor('#0B1D33').fontSize(14).text((user.passportStats.privateJetHours || 0).toString() + 'h', 315, 90);
      doc.fontSize(6).fillColor('#666666').text('PRIVATE JET HOURS', 298, 115);

      // Achievements list
      doc.fillColor('#0B1D33').fontSize(10).font('Helvetica-Bold').text('ACTIVE Aviation Milestones:', 30, 165);
      
      let listY = 190;
      const achievements = user.achievements || [];
      const titlesMap = {
        'first_flight': 'First Flight: Completed inaugural takeoff',
        'first_international': 'Global Citizen: Logged international flight',
        '10_flights': 'Decathlon Jetsetter: Logged 10 flight segments',
        'dubai_explorer': 'Dubai Explorer: VIP flight to DWC Hub',
        'luxury_traveler': 'Luxury Traveler: Secured Maybach transfers',
        'jet_setter': 'Jet Setter: Logged 25+ private jet hours',
        'global_voyager': 'Global Voyager: Traveled to 3+ countries',
        'black_elite_veteran': 'Black Elite: Acquired Black Elite status'
      };

      Object.keys(titlesMap).forEach(key => {
        const isUnlocked = achievements.includes(key);
        doc.fillColor(isUnlocked ? '#D4AF37' : '#CCCCCC');
        doc.fontSize(10).text(isUnlocked ? '✦' : '✧', 35, listY);
        
        doc.fillColor(isUnlocked ? '#111111' : '#888888');
        doc.fontSize(8).font(isUnlocked ? 'Helvetica-Bold' : 'Helvetica').text(titlesMap[key], 55, listY + 1);
        listY += 22;
      });

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

module.exports = { generatePassportPDF };
