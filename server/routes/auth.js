const express = require('express');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const db = require('../db');
const { signToken, setAuthCookie, clearAuthCookie } = require('../utils/jwt');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
const now = () => new Date().toISOString();
const uuid = () => crypto.randomUUID();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ============= REGISTER =============
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, password wajib diisi' });
    }
    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ error: 'Format email tidak valid' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password minimal 6 karakter' });
    }

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      return res.status(409).json({ error: 'Email sudah terdaftar' });
    }

    const id = uuid();
    const passwordHash = await bcrypt.hash(password, 10);
    const ts = now();

    db.prepare(`
      INSERT INTO users (id, name, email, password_hash, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, name, email, passwordHash, ts, ts);

    const token = signToken({ sub: id, email, name });
    setAuthCookie(res, token);

    res.status(201).json({
      user: { id, name, email, createdAt: ts },
      token,
    });
  } catch (err) {
    console.error('[REGISTER]', err);
    res.status(500).json({ error: 'Gagal mendaftar' });
  }
});

// ============= LOGIN =============
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ error: 'Email dan password wajib diisi' });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      return res.status(401).json({ error: 'Email atau password salah' });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Email atau password salah' });
    }

    const token = signToken({ sub: user.id, email: user.email, name: user.name });
    setAuthCookie(res, token);

    res.json({
      user: { id: user.id, name: user.name, email: user.email, createdAt: user.created_at },
      token,
    });
  } catch (err) {
    console.error('[LOGIN]', err);
    res.status(500).json({ error: 'Gagal login' });
  }
});

// ============= LOGOUT =============
router.post('/logout', (req, res) => {
  clearAuthCookie(res);
  res.json({ ok: true });
});

// ============= GET CURRENT USER =============
router.get('/me', requireAuth, (req, res) => {
  const user = db.prepare(
    'SELECT id, name, email, avatar_url, created_at FROM users WHERE id = ?'
  ).get(req.user.id);

  if (!user) {
    return res.status(404).json({ error: 'User tidak ditemukan' });
  }

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatar_url,
    createdAt: user.created_at,
  });
});

// ============= FORGOT PASSWORD =============
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ error: 'Email wajib diisi' });

    const user = db.prepare('SELECT id FROM users WHERE email = ?').get(email);

    // Selalu balas sukses agar tidak bocor apakah email terdaftar
    if (!user) {
      return res.json({ ok: true, message: 'Jika email terdaftar, link reset akan dikirim.' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 jam

    // Hapus token lama milik user ini
    db.prepare('DELETE FROM password_resets WHERE user_id = ?').run(user.id);

    db.prepare(`
      INSERT INTO password_resets (id, user_id, token, expires_at, used, created_at)
      VALUES (?, ?, ?, ?, 0, ?)
    `).run(uuid(), user.id, token, expiresAt, now());

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;

    // DEV: log link ke console (nanti ganti email service)
    console.log('\n[FORGOT PASSWORD] Reset link:');
    console.log(resetUrl);
    console.log('');

    res.json({
      ok: true,
      message: 'Jika email terdaftar, link reset akan dikirim.',
      // DEV only:
      resetUrl: process.env.NODE_ENV !== 'production' ? resetUrl : undefined,
    });
  } catch (err) {
    console.error('[FORGOT PASSWORD]', err);
    res.status(500).json({ error: 'Gagal memproses permintaan' });
  }
});

// ============= VERIFY RESET TOKEN =============
router.get('/reset-password/:token', (req, res) => {
  const { token } = req.params;
  const row = db.prepare(`
    SELECT * FROM password_resets
    WHERE token = ? AND used = 0 AND expires_at > ?
  `).get(token, now());

  if (!row) {
    return res.status(400).json({ error: 'Token tidak valid atau sudah kedaluwarsa' });
  }
  res.json({ ok: true, valid: true });
});

// ============= RESET PASSWORD =============
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body || {};

    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password minimal 6 karakter' });
    }

    const row = db.prepare(`
      SELECT * FROM password_resets
      WHERE token = ? AND used = 0 AND expires_at > ?
    `).get(token, now());

    if (!row) {
      return res.status(400).json({ error: 'Token tidak valid atau sudah kedaluwarsa' });
    }

    const hash = await bcrypt.hash(password, 10);
    const ts = now();

    db.prepare('UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?')
      .run(hash, ts, row.user_id);
    db.prepare('UPDATE password_resets SET used = 1 WHERE id = ?').run(row.id);

    res.json({ ok: true, message: 'Password berhasil diubah' });
  } catch (err) {
    console.error('[RESET PASSWORD]', err);
    res.status(500).json({ error: 'Gagal mengubah password' });
  }
});

// ============= CHANGE PASSWORD (logged in) =============
router.post('/change-password', requireAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body || {};

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Semua field wajib diisi' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password baru minimal 6 karakter' });
    }

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
    const match = await bcrypt.compare(currentPassword, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Password lama salah' });
    }

    const hash = await bcrypt.hash(newPassword, 10);
    db.prepare('UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?')
      .run(hash, now(), user.id);

    res.json({ ok: true, message: 'Password berhasil diubah' });
  } catch (err) {
    console.error('[CHANGE PASSWORD]', err);
    res.status(500).json({ error: 'Gagal mengubah password' });
  }
});

module.exports = router;