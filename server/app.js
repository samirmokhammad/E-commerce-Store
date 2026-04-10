const express = require('express');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');
require('dotenv').config();
const pool = require('./db');
const bcrypt = require('bcrypt');

const app = express();

function normalizeBaseUrl(rawValue, fallbackValue) {
  const value = (rawValue || fallbackValue).trim();
  const valueWithProtocol = /^https?:\/\//i.test(value)
    ? value
    : `https://${value}`;

  try {
    return new URL(valueWithProtocol).origin;
  } catch {
    return fallbackValue;
  }
}

const frontendUrl = normalizeBaseUrl(
  process.env.VITE_FRONTEND_URL,
  'http://localhost:5173',
);
const backendUrl = normalizeBaseUrl(
  process.env.VITE_BACKEND_URL,
  'http://localhost:5432',
);

const isProduction = process.env.NODE_ENV === 'production';

const corsOptions = {
  origin: frontendUrl,
  credentials: true,
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(express.json());
app.set('trust proxy', 1);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    proxy: isProduction,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
    },
  }),
);
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query('SELECT * FROM customer WHERE id = $1', [
      id,
    ]);
    done(null, result.rows[0]);
  } catch (error) {
    done(error, null);
  }
});

app.get('/api/user', ensureAuthenticated, async (req, res) => {
  const userId = req.user.id;

  try {
    const response = await pool.query(
      'SELECT id, username, email FROM customer WHERE id = $1',
      [userId],
    );
    if (response.rowCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(response.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/signup', async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  try {
    const existingUser = await pool.query(
      'SELECT id FROM customer WHERE email = $1',
      [email],
    );
    if (existingUser.rowCount > 0) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    const existingUsername = await pool.query(
      'SELECT id FROM customer WHERE username = $1',
      [username],
    );
    if (existingUsername.rowCount > 0) {
      return res.status(409).json({ message: 'Username already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const response = await pool.query(
      'INSERT INTO customer (username, password, email) VALUES ($1, $2, $3) RETURNING id',
      [username, hashedPassword, email],
    );

    req.login(response.rows[0], (err) => {
      if (err) {
        return res.status(500).json({ message: 'Login after signup failed' });
      }

      return res.status(201).json({ message: 'User created successfully' });
    });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.status(401).json({ message: 'Unauthorized user' });
}

module.exports = app;
