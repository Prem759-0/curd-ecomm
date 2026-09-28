import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Product from './models/Product.js';

if (!process.env.SEED_PASSWORD) throw new Error('Set SEED_PASSWORD in .env first');
await mongoose.connect(process.env.MONGODB_URI);

const email = 'grower@greencart.dev';
const old = await User.findOne({ email });
if (old) {
  await Product.deleteMany({ createdBy: old._id });
  await old.deleteOne();
}
const user = await User.create({ name: 'Sunita Patil', email, password: await bcrypt.hash(process.env.SEED_PASSWORD, 12) });

const rows = [
  ['Alphonso mangoes, 1 dozen', 'Fruits', 899, 40, 'Ripened on the branch in Ratnagiri. Sweet, low fibre.', 'mango'],
  ['Drumsticks, 500 g', 'Vegetables', 60, 120, 'Tender pods, best in sambar and dal.', 'drumstick'],
  ['Kokum, 250 g', 'Pantry', 140, 35, 'Sun-dried rinds for sol kadhi and curries.', 'kokum'],
  ['Curry leaves, 1 bunch', 'Herbs', 15, 200, 'Cut this morning from the backyard bush.', 'curry-leaves'],
  ['Ash gourd, whole', 'Vegetables', 55, 30, 'Dense white flesh for petha and koot.', 'ash-gourd'],
  ['Raw turmeric, 250 g', 'Pantry', 70, 60, 'Fresh roots. Grate into pickles or milk.', 'turmeric'],
  ['Jamun, 500 g', 'Fruits', 120, 25, 'Deep purple and tart. Seasonal, sells out fast.', 'jamun'],
  ['Coriander, 1 bunch', 'Herbs', 12, 150, 'Roots on, so it keeps for days.', 'coriander'],
];
await Product.insertMany(rows.map(([name, category, price, stock, description, pic]) => ({ name, category, price, stock, description, image: `/products/${pic}.svg`, createdBy: user._id })));

console.log(`Seeded ${rows.length} products. Sign in as ${email} with your SEED_PASSWORD.`);
await mongoose.disconnect();
