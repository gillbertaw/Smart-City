const fs = require('fs');
const path = require('path');
const User = require('../models/User');

const USERS_JSON_PATH = path.join(__dirname, '../data/registeredUsers.json');

const ensureStoreFile = () => {
  const dir = path.dirname(USERS_JSON_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(USERS_JSON_PATH)) {
    fs.writeFileSync(USERS_JSON_PATH, '[]\n');
  }
};

const readStoredUsers = () => {
  ensureStoreFile();
  const raw = fs.readFileSync(USERS_JSON_PATH, 'utf8').trim();
  if (!raw) return [];

  const users = JSON.parse(raw);
  return Array.isArray(users) ? users : [];
};

const writeStoredUsers = (users) => {
  ensureStoreFile();
  fs.writeFileSync(USERS_JSON_PATH, `${JSON.stringify(users, null, 2)}\n`);
};

const serializeUser = (user) => {
  const plain = typeof user.get === 'function' ? user.get({ plain: true }) : user;

  return {
    nama: plain.nama,
    email: plain.email,
    password: plain.password,
    kota: plain.kota || 'Medan',
    role: plain.role || 'warga',
    foto_profil: plain.foto_profil || null,
    security_question: plain.security_question,
    security_answer: plain.security_answer,
    created_at: plain.created_at || plain.createdAt || new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
};

const saveUserToJson = (user) => {
  const storedUsers = readStoredUsers();
  const jsonUser = serializeUser(user);
  const index = storedUsers.findIndex(
    (storedUser) => storedUser.email.toLowerCase() === jsonUser.email.toLowerCase()
  );

  if (index >= 0) {
    storedUsers[index] = { ...storedUsers[index], ...jsonUser };
  } else {
    storedUsers.push(jsonUser);
  }

  writeStoredUsers(storedUsers);
};

const seedUsersFromJson = async () => {
  const storedUsers = readStoredUsers();

  for (const storedUser of storedUsers) {
    if (!storedUser.email || !storedUser.password || !storedUser.nama) {
      continue;
    }

    const existingUser = await User.findOne({ where: { email: storedUser.email } });

    const userData = {
      nama: storedUser.nama,
      email: storedUser.email,
      password: storedUser.password,
      kota: storedUser.kota || 'Medan',
      role: storedUser.role || 'warga',
      foto_profil: storedUser.foto_profil || null,
      security_question: storedUser.security_question || 'Apa nama kota smart city ini?',
      security_answer: storedUser.security_answer
    };

    if (existingUser) {
      await existingUser.update(userData);
    } else {
      await User.create(userData);
    }
  }

  if (storedUsers.length > 0) {
    console.log(`${storedUsers.length} akun dari JSON disinkronkan ke database`);
  }
};

module.exports = { saveUserToJson, seedUsersFromJson };
