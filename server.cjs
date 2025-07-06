const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(express.json({ limit: '5mb' }));
console.log('Express JSON body limit set to 5mb');
app.use(express.urlencoded({ limit: '5mb', extended: true }));

const db = new sqlite3.Database('./fitnessapp.db');
const otps = {};

// Helper function to generate a 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

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
  photo TEXT,
  role TEXT,
  specialty TEXT,
  assigned_trainer TEXT,
  onboarding_completed TEXT DEFAULT 'false'
)`);

// --- Diet Plan Table ---
db.run(`CREATE TABLE IF NOT EXISTS diet_plans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  week_start TEXT NOT NULL,
  plan_json TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  start_date TEXT,
  end_date TEXT,
  last_modified_by TEXT,
  last_modified_at TEXT
)`);

// --- Meals Table ---
db.run(`CREATE TABLE IF NOT EXISTS meals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- Breakfast, Lunch, Snack, Dinner
  calories INTEGER,
  protein INTEGER,
  carbs INTEGER,
  fat INTEGER,
  tags TEXT, -- comma-separated
  img TEXT
)`);

// --- Workouts Table ---
db.run(`CREATE TABLE IF NOT EXISTS workouts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  type TEXT, -- e.g., Strength, Cardio
  sets INTEGER,
  reps INTEGER,
  tags TEXT,
  muscle_group TEXT,
  goal TEXT,
  level TEXT,
  equipment TEXT,
  instructions TEXT,
  img TEXT
)`);

// --- Physio Routines Table ---
db.run(`CREATE TABLE IF NOT EXISTS physio_routines (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  reps INTEGER,
  tags TEXT
)`);

// --- Time Logs Table ---
db.run(`CREATE TABLE IF NOT EXISTS time_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  role TEXT,
  timestamp TEXT NOT NULL,
  type TEXT NOT NULL, -- 'in' or 'out'
  location TEXT
)`);

// Create user_workouts table if not exists
// user_id: phone of user, workout_id: id from workouts, assigned_by: trainer/expert phone, assigned_at: timestamp

const createUserWorkoutsTable = `CREATE TABLE IF NOT EXISTS user_workouts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  workout_id INTEGER NOT NULL,
  assigned_by TEXT NOT NULL,
  assigned_at TEXT NOT NULL
)`;
db.run(createUserWorkoutsTable);

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

// Helper: get week start (Monday) for a given date
function getWeekStart(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday
  d.setDate(diff);
  d.setHours(0,0,0,0);
  return d.toISOString().slice(0,10);
}

// Helper: get 15-day cycle start and end
function getPlanCycle(date = new Date()) {
  const d = new Date(date);
  d.setHours(0,0,0,0);
  const day = d.getDate();
  const cycleStart = new Date(d);
  cycleStart.setDate(day - ((day - 1) % 15));
  const cycleEnd = new Date(cycleStart);
  cycleEnd.setDate(cycleStart.getDate() + 14);
  return {
    start: cycleStart.toISOString().slice(0,10),
    end: cycleEnd.toISOString().slice(0,10)
  };
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
        phone, id, username, email, fullName, gender, dob, height, weight, activityLevel, fitnessGoal, dietaryPreference, sleepHours, stressLevel, medicalConditions, address, city, country, password, photo, role, specialty, assigned_trainer, onboarding_completed
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        profile.phone, profile.id, profile.username, profile.email, profile.fullName, profile.gender, profile.dob, profile.height, profile.weight, profile.activityLevel, profile.fitnessGoal,
        profile.dietaryPreference, profile.sleepHours, profile.stressLevel, profile.medicalConditions, profile.address, profile.city, profile.country, profile.password, profile.photo, profile.role, profile.specialty, profile.assigned_trainer || null, profile.onboarding_completed || 'false'
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
  let { phone, password } = req.body;
  console.log('[DEBUG] /api/login called with phone:', phone);
  console.log('[DEBUG] Password provided:', password ? 'Yes' : 'No');
  // Normalize phone: remove all non-digit characters
  if (typeof phone === 'string') {
    phone = phone.replace(/\D/g, '');
  }
  console.log('[DEBUG] Normalized phone:', phone);
  db.get('SELECT * FROM profiles WHERE phone = ?', [phone], (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) {
      console.log('[DEBUG] No user found for phone:', phone);
      return res.json({ success: false, error: 'User not found' });
    }
    console.log('[DEBUG] User found:', user.username, 'Role:', user.role);
    console.log('[DEBUG] Stored password hash:', user.password);
    console.log('[DEBUG] Input password hash:', hashPassword(password));
    if (user.password !== hashPassword(password)) return res.json({ success: false, error: 'Incorrect password' });
    // Decrypt photo and fullName if present
    if (user.photo) user.photo = decryptPhoto(user.photo);
    if (user.fullName) user.fullName = decryptFullName(user.fullName);
    // Set onboarding_completed to 'false' if not set (for backward compatibility)
    if (!user.onboarding_completed) user.onboarding_completed = 'false';
    console.log('[DEBUG] Login successful for user:', user.username, 'Role:', user.role);
    res.json({ success: true, user: { ...user, password: undefined } });
  });
});

// Send OTP endpoint
app.post('/api/send-otp', (req, res) => {
  const { email, phone } = req.body;
  console.log('[DEBUG] Send OTP request for:', email || phone, 'at', new Date().toISOString());
  const identifier = email || phone;
  if (!identifier) return res.status(400).json({ error: 'Email or phone required' });
  const otp = generateOTP();
  otps[identifier] = otp;
  console.log('[DEBUG] Generated OTP for', identifier, ':', otp, 'at', new Date().toISOString());
  // In production, send OTP via SMS/email. For demo, return in response.
  res.json({ success: true, otp });
});

// Verify OTP endpoint
app.post('/api/verify-otp', (req, res) => {
  const { email, phone, otp } = req.body;
  console.log('[DEBUG] Verify OTP request:', { email, phone, otp });
  const identifier = email || phone;
  if (!identifier || !otp) return res.status(400).json({ error: 'Missing fields' });
  console.log('[DEBUG] Stored OTP for', identifier, ':', otps[identifier]);
  if (otps[identifier] === otp) {
    delete otps[identifier];
    console.log('[DEBUG] OTP verified successfully for', identifier);
    res.json({ success: true });
  } else {
    console.log('[DEBUG] Invalid OTP for', identifier, 'Expected:', otps[identifier], 'Received:', otp);
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

// Update password endpoint with OTP for admin
app.post('/api/update-password', (req, res) => {
  const { phone, password, otp } = req.body;
  console.log('[DEBUG] Update password request for phone:', phone);
  console.log('[DEBUG] Password provided:', password ? 'Yes' : 'No');
  console.log('[DEBUG] OTP provided:', otp ? 'Yes' : 'No');
  
  if (!phone || !password) return res.status(400).json({ error: 'Missing phone or password' });
  
  db.get('SELECT * FROM profiles WHERE phone = ?', [phone], (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(404).json({ error: 'User not found' });
    console.log('[DEBUG] Found user for password reset:', user.username);
    
    // Check if OTP is required and valid
    if (user.role === 'admin') {
      // Admin always requires OTP
      if (!otp) {
        console.log('[DEBUG] Admin requires OTP but none provided');
        return res.status(401).json({ error: 'OTP required for admin password reset' });
      }
      
      console.log('[DEBUG] OTP provided:', otp, 'Stored OTP:', otps[phone]);
      if (otps[phone] !== otp) {
        console.log('[DEBUG] Invalid OTP for password reset');
        return res.status(401).json({ error: 'Invalid OTP' });
      }
      delete otps[phone];
      console.log('[DEBUG] OTP verified for password reset');
    } else if (otp) {
      // Non-admin with OTP provided - verify it
      console.log('[DEBUG] Non-admin with OTP provided:', otp, 'Stored OTP:', otps[phone]);
      if (otps[phone] !== otp) {
        console.log('[DEBUG] Invalid OTP for password reset');
        return res.status(401).json({ error: 'Invalid OTP' });
      }
      delete otps[phone];
      console.log('[DEBUG] OTP verified for password reset');
    }
    
    const hashed = hashPassword(password);
    console.log('[DEBUG] Updating password for user:', user.username);
    console.log('[DEBUG] New password hash:', hashed);
    db.run('UPDATE profiles SET password = ? WHERE phone = ?', [hashed, phone], function (err2) {
      if (err2) return res.status(500).json({ error: err2.message });
      if (this.changes === 0) return res.status(404).json({ error: 'User not found' });
      console.log('[DEBUG] Password updated successfully for user:', user.username);
      res.json({ success: true });
    });
  });
});

// TEST/DEV ONLY: Reset test user by phone
app.post('/api/reset-test-user', (req, res) => {
  const { phone } = req.body;
  db.run('DELETE FROM profiles WHERE phone = ?', [phone], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// TEST/DEV ONLY: Fix test user with phone 9999999999
app.post('/api/fix-test-user', (req, res) => {
  const testPhone = '9999999999';
  const testPassword = hashPassword('testuser');
  
  db.run('DELETE FROM profiles WHERE phone = ?', [testPhone], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    
    // Create a fresh test user with correct password
    db.run(
      `INSERT INTO profiles (phone, id, username, email, password, fullName, gender, dob, height, weight, activityLevel, fitnessGoal, dietaryPreference, sleepHours, stressLevel, medicalConditions, address, city, country, photo, role, specialty, assigned_trainer) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [testPhone, null, 'TestUser', null, testPassword, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
      function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, message: 'Test user fixed with phone: 9999999999, password: testuser' });
      }
    );
  });
});

// GET /api/diet-plan
app.get('/api/diet-plan', (req, res) => {
  const userId = req.query.phone;
  if (!userId) return res.status(400).json({ error: 'Missing user id (phone)' });
  const weekStart = getWeekStart();
  db.get('SELECT * FROM diet_plans WHERE user_id = ? AND week_start = ?', [userId, weekStart], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (row) {
      return res.json({ plan: JSON.parse(row.plan_json), weekStart });
    }
    // If no plan, generate a mock plan based on user preferences
    db.get('SELECT * FROM profiles WHERE phone = ?', [userId], (err2, userProfile) => {
      if (err2) return res.status(500).json({ error: err2.message });
      // Example user preferences
      const dietary = (userProfile?.dietaryPreference || '').toLowerCase();
      const allergies = (userProfile?.allergies || '').toLowerCase();
      // Mock meal database
      const allMeals = [
        { name: 'Oatmeal & Berries', type: 'Breakfast', calories: 320, tags: ['veg', 'vegan', 'nut-free'], img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80', protein: 10, carbs: 55, fat: 6 },
        { name: 'Grilled Chicken Salad', type: 'Lunch', calories: 420, tags: ['non-veg', 'nut-free'], img: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80', protein: 35, carbs: 30, fat: 12 },
        { name: 'Greek Yogurt & Nuts', type: 'Snack', calories: 180, tags: ['veg', 'contains-nuts'], img: 'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80', protein: 12, carbs: 15, fat: 7 },
        { name: 'Salmon & Quinoa', type: 'Dinner', calories: 500, tags: ['non-veg', 'nut-free'], img: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80', protein: 38, carbs: 40, fat: 18 },
        { name: 'Vegan Buddha Bowl', type: 'Lunch', calories: 400, tags: ['veg', 'vegan', 'nut-free'], img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80', protein: 15, carbs: 60, fat: 10 },
        { name: 'Paneer Stir Fry', type: 'Dinner', calories: 450, tags: ['veg', 'nut-free'], img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80', protein: 20, carbs: 30, fat: 18 },
        { name: 'Fruit Salad', type: 'Snack', calories: 120, tags: ['veg', 'vegan', 'nut-free'], img: 'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80', protein: 2, carbs: 28, fat: 1 },
        { name: 'Egg White Omelette', type: 'Breakfast', calories: 200, tags: ['non-veg', 'nut-free'], img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80', protein: 18, carbs: 2, fat: 6 },
      ];
      // Filter meals by dietary preference
      let allowedTags = [];
      if (dietary.includes('vegan')) allowedTags = ['vegan'];
      else if (dietary.includes('veg')) allowedTags = ['veg', 'vegan'];
      else allowedTags = ['veg', 'vegan', 'non-veg'];
      let filteredMeals = allMeals.filter(m => m.tags.some(t => allowedTags.includes(t)));
      // Filter out allergies
      if (allergies.includes('nut')) filteredMeals = filteredMeals.filter(m => !m.tags.includes('contains-nuts'));
      // Build a weekly plan
      const mealTypes = ['Breakfast', 'Lunch', 'Snack', 'Dinner'];
      const mockPlan = Array.from({ length: 7 }).map((_, i) => ({
        day: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i],
        meals: mealTypes.map(type => {
          // Pick a random meal of this type
          const options = filteredMeals.filter(m => m.type === type);
          return options.length > 0 ? options[Math.floor(Math.random() * options.length)] : null;
        }).filter(Boolean),
      }));
      db.run('INSERT INTO diet_plans (user_id, week_start, plan_json, updated_at) VALUES (?, ?, ?, ?)',
        [userId, weekStart, JSON.stringify(mockPlan), new Date().toISOString()],
        function(err3) {
          if (err3) return res.status(500).json({ error: err3.message });
          res.json({ plan: mockPlan, weekStart });
        }
      );
    });
  });
});

// POST /api/diet-plan
app.post('/api/diet-plan', (req, res) => {
  const { phone, plan } = req.body;
  if (!phone || !plan) return res.status(400).json({ error: 'Missing phone or plan' });
  const weekStart = getWeekStart();
  db.run('REPLACE INTO diet_plans (user_id, week_start, plan_json, updated_at) VALUES (?, ?, ?, ?)',
    [phone, weekStart, JSON.stringify(plan), new Date().toISOString()],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

// GET /api/plan
app.get('/api/plan', (req, res) => {
  const userId = req.query.phone;
  if (!userId) return res.status(400).json({ error: 'Missing user id (phone)' });
  const { start, end } = getPlanCycle();
  db.get('SELECT * FROM diet_plans WHERE user_id = ? AND start_date = ? AND end_date = ?', [userId, start, end], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (row) {
      return res.json({ plan: JSON.parse(row.plan_json), start, end, last_modified_at: row.last_modified_at });
    }
    // If no plan, generate a new one (reuse previous logic, but for 15 days)
    db.get('SELECT * FROM profiles WHERE phone = ?', [userId], (err2, userProfile) => {
      if (err2) return res.status(500).json({ error: err2.message });
      // ... (reuse meal filtering logic from previous code) ...
      // For brevity, use a simple mock plan for 15 days
      const mealTypes = ['Breakfast', 'Lunch', 'Snack', 'Dinner'];
      const mockPlan = Array.from({ length: 15 }).map((_, i) => ({
        day: i+1,
        meals: mealTypes.map(type => ({
          type,
          name: `${type} Example`,
          calories: 300 + i*10,
          protein: 10 + i,
          carbs: 40 + i*2,
          fat: 8 + i,
          expertNote: '',
          done: false
        })),
        workouts: [
          { name: 'Push-ups', sets: 3, reps: 15, done: false, expertNote: '' },
          { name: 'Squats', sets: 3, reps: 20, done: false, expertNote: '' }
        ],
        physio: [
          { name: 'Shoulder Mobility', reps: 10, done: false, expertNote: '' }
        ],
        comments: []
      }));
      db.run('INSERT INTO diet_plans (user_id, week_start, plan_json, updated_at, start_date, end_date, last_modified_by, last_modified_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [userId, start, JSON.stringify(mockPlan), new Date().toISOString(), start, end, '', new Date().toISOString()],
        function(err3) {
          if (err3) return res.status(500).json({ error: err3.message });
          res.json({ plan: mockPlan, start, end, last_modified_at: new Date().toISOString() });
        }
      );
    });
  });
});

// POST /api/plan
app.post('/api/plan', (req, res) => {
  const { phone, plan, expert, section, note } = req.body;
  if (!phone || !plan) return res.status(400).json({ error: 'Missing phone or plan' });
  const { start, end } = getPlanCycle();
  db.get('SELECT * FROM diet_plans WHERE user_id = ? AND start_date = ? AND end_date = ?', [phone, start, end], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    let updatedPlan = plan;
    // Optionally, add edit history or expert notes here
    if (expert && section && note) {
      // Attach expert note to the right section
      if (section === 'meals') updatedPlan[0].meals[0].expertNote = note; // Example: update first meal's note
      if (section === 'workouts') updatedPlan[0].workouts[0].expertNote = note;
      if (section === 'physio') updatedPlan[0].physio[0].expertNote = note;
    }
    db.run('REPLACE INTO diet_plans (user_id, week_start, plan_json, updated_at, start_date, end_date, last_modified_by, last_modified_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [phone, start, JSON.stringify(updatedPlan), new Date().toISOString(), start, end, expert || '', new Date().toISOString()],
      function(err2) {
        if (err2) return res.status(500).json({ error: err2.message });
        res.json({ success: true, last_modified_at: new Date().toISOString() });
      }
    );
  });
});

// --- API: Get available meals, workouts, physio routines for dropdowns ---
app.get('/api/plan-options', (req, res) => {
  const { type } = req.query;
  if (!type) return res.status(400).json({ error: 'Missing type' });
  let table = '';
  if (type === 'meal') table = 'meals';
  else if (type === 'workout') table = 'workouts';
  else if (type === 'physio') table = 'physio_routines';
  else return res.status(400).json({ error: 'Invalid type' });
  db.all(`SELECT * FROM ${table}`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// --- API: Get users needing plans (for experts) ---
app.get('/api/experts/users', (req, res) => {
  // For demo: return all users (could filter by onboarding status or missing plan)
  db.all('SELECT phone, id, username, fullName, gender, dob, height, weight, activityLevel, fitnessGoal, dietaryPreference, sleepHours, stressLevel, medicalConditions FROM profiles', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// --- API: Get onboarding data for a user ---
app.get('/api/experts/user/:phone', (req, res) => {
  db.get('SELECT * FROM profiles WHERE phone = ?', [req.params.phone], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row);
  });
});

// Seed workouts if table is empty
function seedWorkouts() {
  db.get('SELECT COUNT(*) as count FROM workouts', (err, row) => {
    const count = row && row.count ? row.count : 0;
    if (count === 0) {
      const workouts = [
        {
          name: 'Push-ups', type: 'Strength', sets: 3, reps: 15, tags: 'bodyweight,upper', muscle_group: 'Chest,Triceps,Shoulders', goal: 'Strength,Endurance', level: 'Beginner', equipment: 'None', instructions: 'Keep your body straight, lower until elbows are 90°, push back up.', img: 'https://images.unsplash.com/photo-1517960413843-0aee8e2d471c?auto=format&fit=crop&w=400&q=80'
        },
        {
          name: 'Squats', type: 'Strength', sets: 3, reps: 20, tags: 'bodyweight,lower', muscle_group: 'Quads,Glutes,Hamstrings', goal: 'Strength,Hypertrophy', level: 'Beginner', equipment: 'None', instructions: 'Feet shoulder-width, back straight, lower hips until thighs are parallel, return.', img: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80'
        },
        {
          name: 'Bench Press', type: 'Strength', sets: 4, reps: 10, tags: 'barbell,upper', muscle_group: 'Chest,Triceps,Shoulders', goal: 'Strength,Hypertrophy', level: 'Intermediate', equipment: 'Barbell,Bench', instructions: 'Lower bar to mid-chest, elbows at 75°, press up to full extension.', img: 'https://images.unsplash.com/photo-1517960413843-0aee8e2d471c?auto=format&fit=crop&w=400&q=80'
        },
        {
          name: 'Deadlift', type: 'Strength', sets: 4, reps: 8, tags: 'barbell,fullbody', muscle_group: 'Back,Glutes,Hamstrings', goal: 'Strength,Hypertrophy', level: 'Intermediate', equipment: 'Barbell', instructions: 'Keep back flat, lift bar by extending hips and knees, stand tall.', img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80'
        },
        {
          name: 'Plank', type: 'Core', sets: 3, reps: 60, tags: 'bodyweight,core', muscle_group: 'Core', goal: 'Endurance', level: 'Beginner', equipment: 'None', instructions: 'Hold body in straight line, elbows under shoulders, engage core.', img: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=400&q=80'
        },
        {
          name: 'Pull-ups', type: 'Strength', sets: 3, reps: 8, tags: 'bodyweight,upper', muscle_group: 'Back,Biceps', goal: 'Strength', level: 'Intermediate', equipment: 'Pull-up Bar', instructions: 'Hang from bar, pull chin above bar, lower with control.', img: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80'
        },
        {
          name: 'Lunges', type: 'Strength', sets: 3, reps: 12, tags: 'bodyweight,lower', muscle_group: 'Quads,Glutes,Hamstrings', goal: 'Strength,Hypertrophy', level: 'Beginner', equipment: 'None', instructions: 'Step forward, lower until both knees 90°, push back to start.', img: 'https://images.unsplash.com/photo-1517960413843-0aee8e2d471c?auto=format&fit=crop&w=400&q=80'
        },
        {
          name: 'Shoulder Press', type: 'Strength', sets: 3, reps: 10, tags: 'dumbbell,upper', muscle_group: 'Shoulders,Triceps', goal: 'Strength,Hypertrophy', level: 'Intermediate', equipment: 'Dumbbells', instructions: 'Press dumbbells overhead, arms fully extended, lower with control.', img: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=400&q=80'
        },
        {
          name: 'Bicep Curl', type: 'Strength', sets: 3, reps: 12, tags: 'dumbbell,upper', muscle_group: 'Biceps', goal: 'Hypertrophy', level: 'Beginner', equipment: 'Dumbbells', instructions: 'Curl dumbbells to shoulders, keep elbows stationary, lower slowly.', img: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80'
        },
        {
          name: 'Tricep Dips', type: 'Strength', sets: 3, reps: 10, tags: 'bodyweight,upper', muscle_group: 'Triceps,Chest', goal: 'Strength', level: 'Intermediate', equipment: 'Parallel Bars,Bench', instructions: 'Lower body by bending elbows, press back up to full extension.', img: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80'
        }
      ];
      workouts.forEach(w => {
        db.run(`INSERT INTO workouts (name, type, sets, reps, tags, muscle_group, goal, level, equipment, instructions, img) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [w.name, w.type, w.sets, w.reps, w.tags, w.muscle_group, w.goal, w.level, w.equipment, w.instructions, w.img]);
      });
    }
  });
}
seedWorkouts();

// Seed experts and admin if not present
function seedExpertsAndAdmin() {
  const experts = [
    { phone: '1000000000', username: 'admin', email: 'admin@heal.com', password: hashPassword('admin123'), role: 'admin', specialty: '', photo: 'https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff' },
  ];
  experts.forEach(e => {
    db.run(
      `INSERT OR IGNORE INTO profiles (phone, id, username, email, password, fullName, gender, dob, height, weight, activityLevel, fitnessGoal, dietaryPreference, sleepHours, stressLevel, medicalConditions, address, city, country, photo, role, specialty, assigned_trainer) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [e.phone, null, e.username, e.email, e.password, null, null, null, null, null, null, null, null, null, null, null, null, null, null, e.photo, e.role, e.specialty, null]
    );
  });
}
seedExpertsAndAdmin();

// Admin endpoint: create expert
app.post('/api/admin/create-expert', (req, res) => {
  const { phone, username, email, password, specialty } = req.body;
  if (!phone || !username || !email || !password || !specialty) return res.status(400).json({ error: 'Missing fields' });
  db.run(
    `INSERT INTO profiles (phone, id, username, email, password, fullName, gender, dob, height, weight, activityLevel, fitnessGoal, dietaryPreference, sleepHours, stressLevel, medicalConditions, address, city, country, photo, role, specialty, assigned_trainer) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [phone, null, username, email, hashPassword(password), null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 'expert', specialty, null],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

// Admin endpoint: list all users/experts
app.get('/api/admin/users', (req, res) => {
  db.all('SELECT phone, username, email, role, specialty, assigned_trainer FROM profiles', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Admin endpoint: create user
app.post('/api/admin/create-user', (req, res) => {
  const { phone, username, email, password, role, specialty, photo } = req.body;
  console.log('[DEBUG] /api/admin/create-user body:', req.body);
  if (!phone || !username || !email || !password) return res.status(400).json({ error: 'Missing fields' });
  // Accept 'client' and 'customer' as valid roles
  const validRoles = ['user', 'expert', 'trainer', 'frontdesk', 'housekeeping', 'admin', 'client', 'customer'];
  const userRole = validRoles.includes((role || '').toLowerCase()) ? role.toLowerCase() : 'user';
  const userSpecialty = specialty || '';
  db.run(
    `INSERT INTO profiles (phone, id, username, email, password, fullName, gender, dob, height, weight, activityLevel, fitnessGoal, dietaryPreference, sleepHours, stressLevel, medicalConditions, address, city, country, photo, role, specialty, assigned_trainer, onboarding_completed) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [phone, null, username, email, hashPassword(password), null, null, null, null, null, null, null, null, null, null, null, null, null, null, photo || null, userRole, userSpecialty, null, 'true'],
    function(err) {
      if (err) {
        console.log('[DEBUG] DB error in /api/admin/create-user:', err);
        return res.status(500).json({ error: err.message });
      }
      res.json({ success: true });
    }
  );
});

// Admin endpoint: payments (mock)
app.get('/api/admin/payments', (req, res) => {
  res.json([
    { id: 1, user: '1000000004', amount: 99, status: 'Completed', date: '2025-07-01', method: 'Card' },
    { id: 2, user: '1000000005', amount: 49, status: 'Pending', date: '2025-07-02', method: 'UPI' },
    { id: 3, user: '1000000006', amount: 199, status: 'Completed', date: '2025-07-03', method: 'Card' }
  ]);
});

// Admin endpoint: facilities (mock)
app.get('/api/admin/facilities', (req, res) => {
  res.json({
    housekeeping: 'Good',
    washrooms: 'Clean',
    equipment: 'All functional',
    lastChecked: '2025-07-01 10:00',
    issues: [
      { area: 'Locker Room', status: 'Clean', lastCleaned: '2025-07-01 09:00' },
      { area: 'Washroom 1', status: 'Clean', lastCleaned: '2025-07-01 08:30' },
      { area: 'Gym Floor', status: 'Good', lastCleaned: '2025-07-01 07:45' }
    ]
  });
});

// Record a time in/out event
app.post('/api/entry', (req, res) => {
  const { user_id, role, type, location } = req.body;
  if (!user_id || !role || !type) return res.status(400).json({ error: 'Missing fields' });
  const timestamp = new Date().toISOString();
  db.run(
    'INSERT INTO time_logs (user_id, role, timestamp, type, location) VALUES (?, ?, ?, ?, ?)',
    [user_id, role, timestamp, type, location || null],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, id: this.lastID, timestamp });
    }
  );
});

// Get current clock-in status for a user (last event for today)
app.get('/api/entry/status', (req, res) => {
  const { user_id } = req.query;
  if (!user_id) return res.status(400).json({ error: 'Missing user_id' });
  const today = new Date().toISOString().slice(0, 10);
  db.get(
    `SELECT * FROM time_logs WHERE user_id = ? AND timestamp LIKE ? ORDER BY timestamp DESC LIMIT 1`,
    [user_id, today + '%'],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(row || {});
    }
  );
});

// Get all time logs (admin/staff view)
app.get('/api/entry/logs', (req, res) => {
  const { role, user_id, date } = req.query;
  let query = 'SELECT * FROM time_logs WHERE 1=1';
  const params = [];
  if (role) { query += ' AND role = ?'; params.push(role); }
  if (user_id) { query += ' AND user_id = ?'; params.push(user_id); }
  if (date) { query += ' AND timestamp LIKE ?'; params.push(date + '%'); }
  query += ' ORDER BY timestamp DESC';
  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Admin endpoint: delete user by phone
app.post('/api/admin/delete-user', (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ success: false, error: 'Phone is required' });
  db.run('DELETE FROM profiles WHERE phone = ?', [phone], function(err) {
    if (err) return res.status(500).json({ success: false, error: err.message });
    if (this.changes > 0) {
      res.json({ success: true });
    } else {
      res.json({ success: false, error: 'User not found' });
    }
  });
});

// Admin endpoint: update user details
app.post('/api/admin/update-user', (req, res) => {
  const { oldPhone, phone, username, email, role, specialty } = req.body;
  if (!oldPhone || !phone || !username || !email || !role) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }
  db.run(
    `UPDATE profiles SET phone = ?, username = ?, email = ?, role = ?, specialty = ? WHERE phone = ?`,
    [phone, username, email, role, specialty, oldPhone],
    function(err) {
      if (err) return res.status(500).json({ success: false, error: err.message });
      if (this.changes > 0) {
        res.json({ success: true });
      } else {
        res.json({ success: false, error: 'User not found or no changes made' });
      }
    }
  );
});

// Endpoint to assign a trainer to a user
app.post('/api/admin/assign-trainer', (req, res) => {
  let { userPhone, trainerPhone } = req.body;
  if (!userPhone || !trainerPhone) return res.status(400).json({ success: false, error: 'Missing userPhone or trainerPhone' });
  // Normalize both phone numbers
  if (typeof userPhone === 'string') {
    userPhone = userPhone.replace(/\D/g, '');
  }
  if (typeof trainerPhone === 'string') {
    trainerPhone = trainerPhone.replace(/\D/g, '');
  }
  db.run('UPDATE profiles SET assigned_trainer = ? WHERE phone = ?', [trainerPhone, userPhone], function(err) {
    if (err) return res.status(500).json({ success: false, error: err.message });
    if (this.changes > 0) {
      res.json({ success: true });
    } else {
      res.json({ success: false, error: 'User not found' });
    }
  });
});

// Mark onboarding as completed
app.post('/api/complete-onboarding', (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: 'Phone is required' });
  
  db.run('UPDATE profiles SET onboarding_completed = ? WHERE phone = ?', ['true', phone], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes > 0) {
      res.json({ success: true });
    } else {
      res.json({ success: false, error: 'User not found' });
    }
  });
});

// --- API: Workouts CRUD ---
// Get all workouts
app.get('/api/workouts', (req, res) => {
  db.all('SELECT * FROM workouts', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ workouts: rows });
  });
});

// Add a new workout
app.post('/api/workouts', (req, res) => {
  const w = req.body;
  db.run(
    `INSERT INTO workouts (name, type, sets, reps, tags, muscle_group, goal, level, equipment, instructions, img) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [w.name, w.type, w.sets, w.reps, w.tags || '', w.muscle_group, w.goal, w.level, w.equipment, w.instructions, w.img || ''],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, id: this.lastID });
    }
  );
});

// Update a workout
app.put('/api/workouts/:id', (req, res) => {
  const w = req.body;
  db.run(
    `UPDATE workouts SET name=?, type=?, sets=?, reps=?, tags=?, muscle_group=?, goal=?, level=?, equipment=?, instructions=?, img=? WHERE id=?`,
    [w.name, w.type, w.sets, w.reps, w.tags || '', w.muscle_group, w.goal, w.level, w.equipment, w.instructions, w.img || '', req.params.id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

// Delete a workout
app.delete('/api/workouts/:id', (req, res) => {
  db.run('DELETE FROM workouts WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// Endpoint: Get users assigned to a specific trainer
app.get('/api/trainer/assigned-users', (req, res) => {
  const { trainerPhone } = req.query;
  console.log('[DEBUG] /api/trainer/assigned-users called with trainerPhone:', trainerPhone);
  if (!trainerPhone) return res.status(400).json({ error: 'Missing trainerPhone' });
  // Normalize trainer phone to match the format stored in assigned_trainer field
  let normalizedTrainerPhone = trainerPhone;
  if (typeof normalizedTrainerPhone === 'string') {
    normalizedTrainerPhone = normalizedTrainerPhone.replace(/\D/g, '');
  }
  console.log('[DEBUG] Normalized trainerPhone:', normalizedTrainerPhone);
  db.all(
    `SELECT phone, username, email, fullName, gender, dob, height, weight, activityLevel, fitnessGoal, dietaryPreference, sleepHours, stressLevel, medicalConditions, photo, onboarding_completed FROM profiles WHERE assigned_trainer = ?`,
    [normalizedTrainerPhone],
    (err, rows) => {
      if (err) {
        console.error('[ERROR] /api/trainer/assigned-users SQL error:', err);
        return res.status(500).json({ error: err.message });
      }
      res.json({ users: rows });
    }
  );
});

// Endpoint: Assign a workout to a user
app.post('/api/trainer/assign-workout', (req, res) => {
  const { user_id, workout_id, assigned_by } = req.body;
  if (!user_id || !workout_id || !assigned_by) return res.status(400).json({ error: 'Missing fields' });
  db.run(
    'INSERT INTO user_workouts (user_id, workout_id, assigned_by, assigned_at) VALUES (?, ?, ?, ?)',
    [user_id, workout_id, assigned_by, new Date().toISOString()],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, id: this.lastID });
    }
  );
});

// Endpoint: Assign a workout to multiple users (bulk assignment)
app.post('/api/trainer/assign-workout-bulk', (req, res) => {
  const { user_ids, workout_id, assigned_by } = req.body;
  if (!user_ids || !Array.isArray(user_ids) || user_ids.length === 0 || !workout_id || !assigned_by) {
    return res.status(400).json({ error: 'Missing or invalid fields' });
  }
  
  const timestamp = new Date().toISOString();
  const assignments = user_ids.map(user_id => [user_id, workout_id, assigned_by, timestamp]);
  
  db.serialize(() => {
    const stmt = db.prepare('INSERT INTO user_workouts (user_id, workout_id, assigned_by, assigned_at) VALUES (?, ?, ?, ?)');
    
    assignments.forEach(assignment => {
      stmt.run(assignment);
    });
    
    stmt.finalize((err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, assigned_count: user_ids.length });
    });
  });
});

// Endpoint: Get all workouts assigned to a user
app.get('/api/trainer/user-workouts', (req, res) => {
  const { user_id } = req.query;
  if (!user_id) return res.status(400).json({ error: 'Missing user_id' });
  db.all(
    `SELECT uw.id, uw.workout_id, w.name, w.type, w.sets, w.reps, w.muscle_group, w.goal, w.level, w.equipment, w.instructions, w.img, uw.assigned_by, uw.assigned_at
     FROM user_workouts uw
     JOIN workouts w ON uw.workout_id = w.id
     WHERE uw.user_id = ?
     ORDER BY uw.assigned_at DESC`,
    [user_id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ workouts: rows });
    }
  );
});

// Start server
app.listen(4000, () => console.log('API running on http://localhost:4000'));