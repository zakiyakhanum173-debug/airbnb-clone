require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const Listing = require('./src/models/Listing');

const img = (id) => `https://images.unsplash.com/${id}?w=800&q=80&auto=format&fit=crop`;

const data = [
  ['Beach Villa with Pool', 'Goa', 'villa', 6500, 6, 15.5439, 73.7553, 'photo-1507525428034-b723cf961d3e'],
  ['Cozy Studio near Baga', 'Goa', 'apartment', 2200, 2, 15.5524, 73.7517, 'photo-1502672260266-1c1ef2d93688'],
  ['Heritage Portuguese House', 'Goa', 'house', 4800, 5, 15.4909, 73.8278, 'photo-1505691938895-1758d7feb511'],
  ['Sea View Room', 'Goa', 'room', 1500, 2, 15.2993, 74.124, 'photo-1522708323590-d24dbb6b0267'],
  ['Luxury Apartment Bandra', 'Mumbai', 'apartment', 7500, 4, 19.0596, 72.8295, 'photo-1560448204-e02f11c3d0e2'],
  ['Sea Facing Flat Marine Drive', 'Mumbai', 'apartment', 5500, 3, 18.944, 72.8227, 'photo-1493809842364-78817add7ffb'],
  ['Budget Room Andheri', 'Mumbai', 'room', 1800, 2, 19.1136, 72.8697, 'photo-1540518614846-7eded433c457'],
  ['Modern Loft Indiranagar', 'Bengaluru', 'apartment', 4200, 3, 12.9719, 77.6412, 'photo-1556909114-f6e7ad7d3136'],
  ['Garden House Koramangala', 'Bengaluru', 'house', 5200, 6, 12.9352, 77.6245, 'photo-1568605114967-8130f3a36994'],
  ['Cozy Room HSR Layout', 'Bengaluru', 'room', 1400, 2, 12.9116, 77.6474, 'photo-1598928506311-c55ded91a20c'],
  ['Mountain Cabin Manali', 'Manali', 'cabin', 3800, 4, 32.2396, 77.1887, 'photo-1449158743715-0a90ebb6d2d8'],
  ['Snow View Cottage', 'Manali', 'cabin', 4500, 5, 32.2432, 77.1892, 'photo-1510798831971-661eb04b3739'],
  ['Riverside Villa Rishikesh', 'Rishikesh', 'villa', 5800, 8, 30.0869, 78.2676, 'photo-1564013799919-ab600027ffc6'],
  ['Yoga Retreat Room', 'Rishikesh', 'room', 1600, 2, 30.1, 78.29, 'photo-1512918728675-ed5a9ecdebfd'],
  ['Lake Palace View Suite', 'Udaipur', 'apartment', 6200, 3, 24.5764, 73.6827, 'photo-1571896349842-33c89424de2d'],
  ['Royal Haveli Stay', 'Udaipur', 'house', 8500, 8, 24.5854, 73.7125, 'photo-1566073771259-6a8506099945'],
  ['Houseboat Experience', 'Kochi', 'house', 5000, 4, 9.9312, 76.2673, 'photo-1520250497591-112f2f40a3f4'],
  ['Backwater Villa Alleppey', 'Kochi', 'villa', 7000, 6, 9.4981, 76.3388, 'photo-1582719508461-905c673771fd'],
  ['Tea Estate Cabin Munnar', 'Munnar', 'cabin', 3500, 4, 10.0889, 77.0595, 'photo-1518780664697-55e3ad937233'],
  ['City Center Flat Delhi', 'Delhi', 'apartment', 3900, 4, 28.6139, 77.209, 'photo-1522771739844-6a9f6d5f14af'],
  ['Farmhouse near Delhi', 'Delhi', 'villa', 9000, 10, 28.5355, 77.391, 'photo-1600585154340-be6161a56a0c'],
  ['Pink City Heritage Room', 'Jaipur', 'room', 2500, 2, 26.9124, 75.7873, 'photo-1590490360182-c33d57733427'],
];

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    let host = await User.findOne({ email: 'seedhost@test.com' });
    if (!host) {
      host = await User.create({
        name: 'Seed Host',
        email: 'seedhost@test.com',
        password: '123456',
        role: 'host',
      });
    }

    await Listing.deleteMany({ host: host._id });

    const docs = data.map(([title, city, type, price, guests, lat, lng, photo]) => ({
      title,
      description: `A lovely ${type} in ${city}. Perfect for a relaxing stay with all the basic amenities.`,
      pricePerNight: price,
      city,
      address: `${city} city area`,
      lat,
      lng,
      images: [img(photo)],
      maxGuests: guests,
      type,
      amenities: ['WiFi', 'AC', 'Kitchen'],
      host: host._id,
    }));

    await Listing.insertMany(docs);
    console.log(`✅ Seeded ${docs.length} listings`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
})();