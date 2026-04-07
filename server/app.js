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
    process.env.FRONTEND_URL || process.env.VITE_FRONTEND_URL,
    // 'https://event-calendar-test-eight.vercel.app',
    'http://localhost:5173',
);
const backendUrl = normalizeBaseUrl(
    process.env.BACKEND_URL || process.env.VITE_BACKEND_URL,
    // 'https://eventcalendartest.onrender.com',
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
        const result = await pool.query(
            'SELECT * FROM customer WHERE id = $1',
            [id],
        );
        done(null, result.rows[0]);
    } catch (error) {
        done(error, null);
    }
});

module.exports = app;
