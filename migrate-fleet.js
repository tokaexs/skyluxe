const fs = require('fs');
const path = require('path');
const vm = require('vm');
const mongoose = require('mongoose');
require('dotenv').config();

const PrivateJet = require('./models/PrivateJet');

const fleetPath = path.join(
  __dirname,
  'frontend/src/app/fleet/page.tsx'
);

const source = fs.readFileSync(fleetPath, 'utf8');

// Extract the privateJets array from the TSX source.
const match = source.match(
  /const privateJets: JetItem\[\]\s*=\s*(\[[\s\S]*?\]);\s*\n\s*const availableAirports/
);

if (!match) {
  throw new Error('Could not locate privateJets array in fleet/page.tsx');
}

let raw = match[1];

// Convert the small TS/JS syntax differences into evaluable JS.
raw = raw
  .replace(/:\s*"[^"]+"/g, (m) => m)
  .replace(/:\s*number/g, '')
  .replace(/:\s*string/g, '');

const privateJets = vm.runInNewContext(`(${raw})`);

const jets = privateJets.map((jet) => ({
  name: jet.name,
  type: jet.class,
  capacity: jet.passengers,
  range: Number(String(jet.range).replace(/[^\d.]/g, '')),
  speed: Number(String(jet.speed).replace(/[^\d.]/g, '')),
  amenities: jet.amenities,
  hourlyRate: jet.hourlyRate,
  image: jet.image,
  description: jet.description
}));

async function migrate() {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI ||
      'mongodb://localhost:27017/skyluxe'
    );

    console.log('MongoDB connected');

    for (const jet of jets) {
      await PrivateJet.findOneAndUpdate(
        { name: jet.name },
        jet,
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true
        }
      );

      console.log(`✓ ${jet.name}`);
    }

    console.log(`\n✅ Migrated ${jets.length} fleet aircraft`);

    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Migration failed:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

migrate();
