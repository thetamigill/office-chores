const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/', (req, res) => {
  const members = db.prepare('SELECT * FROM members ORDER BY name').all();
  res.json(members);
});

router.post('/', (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Name is required' });
  }
  try {
    const result = db.prepare('INSERT INTO members (name) VALUES (?)').run(name.trim());
    res.status(201).json({ id: result.lastInsertRowid, name: name.trim() });
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(409).json({ error: 'Member already exists' });
    }
    throw err;
  }
});

router.delete('/:id', (req, res) => {
  const result = db.prepare('DELETE FROM members WHERE id = ?').run(req.params.id);
  if (result.changes === 0) {
    return res.status(404).json({ error: 'Member not found' });
  }
  res.json({ ok: true });
});

module.exports = router;
