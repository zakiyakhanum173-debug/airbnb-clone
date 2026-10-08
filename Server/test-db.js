require('dotenv').config();
const mongoose = require('mongoose');

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => { console.log('✅ MongoDB connected!'); process.exit(0); })
  .catch((err) => { console.error('❌ Failed:', err.message); process.exit(1); });