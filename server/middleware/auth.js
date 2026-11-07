const { verifyToken } = require('../utils/jwt');

function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.archiva_token;
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: no token' });
    }
    const payload = verifyToken(token);
    req.user = { id: payload.sub, email: payload.email, name: payload.name };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: invalid token' });
  }
}

module.exports = { requireAuth };