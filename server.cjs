const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./fitnessapp.db');
const otps = {};

const AES_KEY = crypto.createHash('sha256').update('super_secret_key').digest(); // 32 bytes
const AES_IV = Buffer.alloc(16, 0); // 16 bytes IV (all zeros for demo)

// Create table if not exists
db.run(`CREATE TABLE IF NOT EXISTS profiles (
  phone TEXT PRIMARY KEY,
  id TEXT,
  username TEXT,
  email TEXT,
  password TEXT,
  fullName TEXT,
  gender TEXT,
  dob TEXT,
  height TEXT,
  weight TEXT,
  activityLevel TEXT,
  fitnessGoal TEXT,
  dietaryPreference TEXT,
  sleepHours TEXT,
  stressLevel TEXT,
  medicalConditions TEXT,
  address TEXT,
  city TEXT,
  country TEXT,
  photo TEXT
)`);

// Helper to hash passwords
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function encryptPhoto(photoBase64) {
  if (!photoBase64) return '';
  const cipher = crypto.createCipheriv('aes-256-cbc', AES_KEY, AES_IV);
  let encrypted = cipher.update(photoBase64, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return encrypted;
}

function decryptPhoto(encryptedPhoto) {
  if (!encryptedPhoto) return '';
  const decipher = crypto.createDecipheriv('aes-256-cbc', AES_KEY, AES_IV);
  let decrypted = decipher.update(encryptedPhoto, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

function encryptFullName(fullName) {
  if (!fullName) return '';
  const cipher = crypto.createCipheriv('aes-256-cbc', AES_KEY, AES_IV);
  let encrypted = cipher.update(fullName, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return encrypted;
}

function decryptFullName(encryptedFullName) {
  if (!encryptedFullName) return '';
  const decipher = crypto.createDecipheriv('aes-256-cbc', AES_KEY, AES_IV);
  let decrypted = decipher.update(encryptedFullName, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// Insert or update profile
app.post('/api/profile', (req, res) => {
  const p = req.body;
  if (p.password) p.password = hashPassword(p.password);
  if (p.photo) p.photo = encryptPhoto(p.photo);
  if (p.fullName) p.fullName = encryptFullName(p.fullName);
  console.log('Received profile data:', p);

  // Only check for unique phone number
  if (p.phone) {
    db.get('SELECT phone FROM profiles WHERE phone = ?', [p.phone], (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (row && row.phone !== p.phone) {
        return res.status(400).json({ error: 'Phone number already registered. Please log in.' });
      }
      continueProfile();
    });
  } else {
    continueProfile();
  }

  function continueProfile() {
    // If password is not provided, fetch the existing password
    if (!p.password) {
      db.get('SELECT password FROM profiles WHERE phone = ?', [p.phone], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        const passwordToUse = row && row.password ? row.password : '';
        saveProfile({ ...p, password: passwordToUse });
      });
    } else {
      saveProfile(p);
    }
  }

  function saveProfile(profile) {
    db.run(
      `INSERT OR REPLACE INTO profiles (
        phone, id, username, email, fullName, gender, dob, height, weight, activityLevel, fitnessGoal, dietaryPreference, sleepHours, stressLevel, medicalConditions, address, city, country, password, photo
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        profile.phone, profile.id, profile.username, profile.email, profile.fullName, profile.gender, profile.dob, profile.height, profile.weight, profile.activityLevel, profile.fitnessGoal,
        profile.dietaryPreference, profile.sleepHours, profile.stressLevel, profile.medicalConditions, profile.address, profile.city, profile.country, profile.password, profile.photo
      ],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
  }
});

// Get profile
app.get('/api/profile/:id', (req, res) => {
  db.get('SELECT * FROM profiles WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (row) {
      row.fullName = decryptFullName(row.fullName);
      row.photo = decryptPhoto(row.photo);
    }
    res.json(row);
  });
});

// Login endpoint: checks email and password
app.post('/api/login', (req, res) => {
  const { email, phone, password } = req.body;
  const identifier = email || phone;
  if (!identifier || !password) return res.status(400).json({ error: 'Missing fields' });
  const hashed = hashPassword(password);
  // First, check if user exists
  const userQuery = email ? 'SELECT * FROM profiles WHERE email = ?' : 'SELECT * FROM profiles WHERE phone = ?';
  db.get(userQuery, [identifier], (err, userRow) => {
    if (err) {
      console.error('[LOGIN ERROR]', err);
      return res.status(500).json({ error: err.message });
    }
    if (!userRow) {
      console.warn('[LOGIN FAILED] User not found for', identifier);
      return res.status(404).json({ error: 'User not found. Please sign up first.' });
    }
    // Now check password
    if (userRow.password !== hashed) {
      console.warn('[LOGIN FAILED] Invalid credentials for', identifier);
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    // Decrypt fullName and photo before sending
    userRow.fullName = decryptFullName(userRow.fullName);
    userRow.photo = decryptPhoto(userRow.photo);
    res.json({ success: true, user: userRow });
  });
});

// Send OTP endpoint
app.post('/api/send-otp', (req, res) => {
  const { email, phone } = req.body;
  const identifier = email || phone;
  if (!identifier) return res.status(400).json({ error: 'Email or phone required' });
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otps[identifier] = otp;
  // In production, send OTP via SMS/email. For demo, return in response.
  res.json({ success: true, otp });
});

// Verify OTP endpoint
app.post('/api/verify-otp', (req, res) => {
  const { email, phone, otp } = req.body;
  const identifier = email || phone;
  if (!identifier || !otp) return res.status(400).json({ error: 'Missing fields' });
  if (otps[identifier] === otp) {
    delete otps[identifier];
    res.json({ success: true });
  } else {
    res.status(401).json({ error: 'Invalid OTP' });
  }
});

// Add endpoints to get user by email or phone for login/signup check
app.get('/api/profile/email/:email', (req, res) => {
  db.get('SELECT * FROM profiles WHERE email = ?', [req.params.email], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row);
  });
});
app.get('/api/profile/phone/:phone', (req, res) => {
  db.get('SELECT * FROM profiles WHERE phone = ?', [req.params.phone], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row);
  });
});

// Add endpoint to check if username exists
app.get('/api/profile/username/:username', (req, res) => {
  db.get('SELECT id FROM profiles WHERE username = ?', [req.params.username], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ exists: !!row });
  });
});

// Start server
app.listen(4000, () => console.log('API running on http://localhost:4000'));