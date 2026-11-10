const express = require('express');
const crypto = require('crypto');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
const now = () => new Date().toISOString();
const uuid = () => crypto.randomUUID();

// Semua route notes wajib login
router.use(requireAuth);

// ============= GET ALL NOTES =============
router.get('/', (req, res) => {
  // Secara default, ambil yang tidak dihapus (is_deleted = 0)
  const { deleted } = req.query;
  const isDeleted = deleted === 'true' ? 1 : 0;

  const notes = db.prepare(`
    SELECT * FROM notes 
    WHERE user_id = ? AND is_deleted = ?
    ORDER BY is_pinned DESC, updated_at DESC
  `).all(req.user.id, isDeleted);

  // Parse JSON content & ubah integer 0/1 jadi boolean
  const parsedNotes = notes.map(n => ({
    ...n,
    content: JSON.parse(n.content),
    isFavorite: Boolean(n.is_favorite),
    isPinned: Boolean(n.is_pinned),
    isDeleted: Boolean(n.is_deleted),
  }));

  res.json(parsedNotes);
});

// ============= GET SINGLE NOTE =============
router.get('/:id', (req, res) => {
  const note = db.prepare('SELECT * FROM notes WHERE id = ? AND user_id = ?')
    .get(req.params.id, req.user.id);

  if (!note) {
    return res.status(404).json({ error: 'Note tidak ditemukan' });
  }

  res.json({
    ...note,
    content: JSON.parse(note.content),
    isFavorite: Boolean(note.is_favorite),
    isPinned: Boolean(note.is_pinned),
    isDeleted: Boolean(note.is_deleted),
  });
});

// ============= CREATE NOTE =============
router.post('/', (req, res) => {
  try {
    const { title, templateType, content } = req.body;
    
    if (!title || !templateType || !content) {
      return res.status(400).json({ error: 'Data tidak lengkap' });
    }

    const id = uuid();
    const ts = now();

    db.prepare(`
      INSERT INTO notes (id, user_id, title, template_type, content, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, req.user.id, title, templateType, JSON.stringify(content), ts, ts);

    const newNote = db.prepare('SELECT * FROM notes WHERE id = ?').get(id);
    
    res.status(201).json({
      ...newNote,
      content: JSON.parse(newNote.content),
      isFavorite: false,
      isPinned: false,
      isDeleted: false,
    });
  } catch (err) {
    console.error('[CREATE NOTE]', err);
    res.status(500).json({ error: 'Gagal membuat catatan' });
  }
});

// ============= UPDATE NOTE =============
router.put('/:id', (req, res) => {
  try {
    const { title, content, isFavorite, isPinned, isDeleted } = req.body;
    const note = db.prepare('SELECT * FROM notes WHERE id = ? AND user_id = ?')
      .get(req.params.id, req.user.id);

    if (!note) return res.status(404).json({ error: 'Note tidak ditemukan' });

    // Gunakan nilai lama jika tidak dikirim
    const newTitle = title !== undefined ? title : note.title;
    const newContent = content !== undefined ? JSON.stringify(content) : note.content;
    const newFav = isFavorite !== undefined ? (isFavorite ? 1 : 0) : note.is_favorite;
    const newPin = isPinned !== undefined ? (isPinned ? 1 : 0) : note.is_pinned;
    const newDel = isDeleted !== undefined ? (isDeleted ? 1 : 0) : note.is_deleted;
    
    db.prepare(`
      UPDATE notes 
      SET title = ?, content = ?, is_favorite = ?, is_pinned = ?, is_deleted = ?, updated_at = ?
      WHERE id = ?
    `).run(newTitle, newContent, newFav, newPin, newDel, now(), note.id);

    res.json({ ok: true });
  } catch (err) {
    console.error('[UPDATE NOTE]', err);
    res.status(500).json({ error: 'Gagal update catatan' });
  }
});

// ============= DELETE NOTE (Soft Delete) =============
router.delete('/:id', (req, res) => {
  try {
    const note = db.prepare('SELECT * FROM notes WHERE id = ? AND user_id = ?')
      .get(req.params.id, req.user.id);

    if (!note) return res.status(404).json({ error: 'Note tidak ditemukan' });

    // Soft delete (masuk ke Trash)
    db.prepare('UPDATE notes SET is_deleted = 1, updated_at = ? WHERE id = ?')
      .run(now(), note.id);

    res.json({ ok: true, message: 'Catatan dipindahkan ke Trash' });
  } catch (err) {
    console.error('[DELETE NOTE]', err);
    res.status(500).json({ error: 'Gagal menghapus catatan' });
  }
});

// ============= DUPLICATE NOTE =============
router.post('/:id/duplicate', (req, res) => {
  try {
    const note = db.prepare('SELECT * FROM notes WHERE id = ? AND user_id = ?')
      .get(req.params.id, req.user.id);

    if (!note) return res.status(404).json({ error: 'Note tidak ditemukan' });

    const newId = uuid();
    const ts = now();

    db.prepare(`
      INSERT INTO notes (id, user_id, title, template_type, content, is_favorite, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(newId, note.user_id, `${note.title} (Copy)`, note.template_type, note.content, 0, ts, ts);

    res.json({ ok: true, id: newId });
  } catch (err) {
    console.error('[DUPLICATE NOTE]', err);
    res.status(500).json({ error: 'Gagal menduplikasi catatan' });
  }
});

module.exports = router;