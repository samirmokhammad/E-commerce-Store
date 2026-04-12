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
  'http://localhost:4000',
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

    return res.json(response.rows[0]);
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
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

app.post('/api/login', async (req, res) => {
  const { login, password } = req.body;

  if (!password || !login) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  try {
    const response = await pool.query(
      'SELECT * FROM customer WHERE email = $1 OR username = $1',
      [login],
    );

    if (response.rowCount === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const user = response.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Login failed' });
      }
      return res.json({ message: 'Logged in successfully' });
    });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.put('/api/user', ensureAuthenticated, async (req, res) => {
  const userId = req.user.id;
  const { username, email } = req.body;

  if (!username || !email) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  try {
    const existingUser = await pool.query(
      'SELECT id FROM customer WHERE (email = $1 OR username = $2) AND id != $3',
      [email, username, userId],
    );
    if (existingUser.rowCount > 0) {
      return res
        .status(409)
        .json({ message: 'Email or username already in use' });
    }
    const response = await pool.query(
      'UPDATE customer SET username = $1, email = $2 WHERE id = $3 RETURNING id, username, email',
      [username, email, userId],
    );
    return res.json(response.rows[0]);
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.put('/api/user/password', ensureAuthenticated, async (req, res) => {
  const userId = req.user.id;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  try {
    const oldPassword = await pool.query(
      'SELECT password FROM customer WHERE id = $1',
      [userId],
    );

    if (oldPassword.rowCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = oldPassword.rows[0];
    const passwordMatch = await bcrypt.compare(currentPassword, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const response = await pool.query(
      'UPDATE customer SET password = $1 WHERE id = $2 RETURNING id, username, email',
      [hashedPassword, userId],
    );
    return res.json(response.rows[0]);
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/logout', (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);
    return res.sendStatus(204);
  });
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.status(401).json({ message: 'Unauthorized user' });
}

module.exports = app;
