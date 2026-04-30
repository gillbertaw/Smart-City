const bcrypt = require('bcryptjs');
const User = require('../models/User');

const DEFAULT_ADMIN_EMAIL = 'adminkrabby@gmail.com';

const seedDefaultAdmin = async () => {
  const existingAdmin = await User.findOne({
    where: { email: DEFAULT_ADMIN_EMAIL }
  });

  if (existingAdmin) {
    return;
  }

  await User.create({
    nama: 'Admin Smart City',
    email: DEFAULT_ADMIN_EMAIL,
    password: await bcrypt.hash('123admin', 10),
    kota: 'Medan',
    role: 'admin',
    security_question: 'Apa nama kota smart city ini?',
    security_answer: await bcrypt.hash('medan', 10),
  });

  console.log(`Admin default dibuat: ${DEFAULT_ADMIN_EMAIL}`);
};

module.exports = { seedDefaultAdmin };
