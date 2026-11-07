const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET wajib diisi di .env');
}

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

// Set cookie httpOnly
function setAuthCookie(res, token) {
  res.cookie('archiva_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 hari
    path: '/',
  });
}

function clearAuthCookie(res) {
  res.clearCookie('archiva_token', { path: '/' });
}

module.exports = { signToken, verifyToken, setAuthCookie, clearAuthCookie };