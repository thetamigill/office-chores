const express = require('express');
const db = require('../db');
const { expandRecurrence } = require('../lib/recurrence');

const router = express.Router();

router.get('/', (req, res) => {
  const { from, to, status } = req.query;

  let tasks;
  if (status) {
    tasks = db.prepare(`
      SELECT t.*, m.name as assigned_to_name
      FROM tasks t
      LEFT JOIN members m ON t.assigned_to = m.id
      WHERE t.status = ?
      ORDER BY t.due_date
    `).all(status);
  } else {
    tasks = db.prepare(`
      SELECT t.*, m.name as assigned_to_name
      FROM tasks t
      LEFT JOIN members m ON t.assigned_to = m.id
      ORDER BY t.due_date
    `).all();
  }

  if (!from || !to) {
    return res.json(tasks);
  }

  // Expand recurring tasks within the date range
  const expanded = [];
  for (const task of tasks) {
    if (task.recurrence) {
      const dates = expandRecurrence(task.due_date, task.recurrence, from, to);
      const overrides = db.prepare(
        'SELECT occurrence_date, status FROM recurrence_overrides WHERE task_id = ?'
      ).all(task.id);
      const overrideMap = Object.fromEntries(overrides.map(o => [o.occurrence_date, o.status]));

      for (const date of dates) {
        expanded.push({
          ...task,
          due_date: date,
          status: overrideMap[date] || task.status,
          is_recurring_instance: true,
          original_due_date: task.due_date,
        });
      }
    } else {
      if (task.due_date >= from && task.due_date <= to) {
        expanded.push({ ...task, is_recurring_instance: false });
      }
    }
  }

  res.json(expanded);
});

router.post('/', (req, res) => {
  const { title, description, due_date, assigned_to, status, recurrence } = req.body;
  if (!title || !due_date) {
    return res.status(400).json({ error: 'Title and due_date are required' });
  }
  const result = db.prepare(`
    INSERT INTO tasks (title, description, due_date, assigned_to, status, recurrence)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    title,
    description || '',
    due_date,
    assigned_to || null,
    status || 'todo',
    recurrence || null
  );
  const task = db.prepare(`
    SELECT t.*, m.name as assigned_to_name
    FROM tasks t
    LEFT JOIN members m ON t.assigned_to = m.id
    WHERE t.id = ?
  `).get(result.lastInsertRowid);
  res.status(201).json(task);
});

router.put('/:id', (req, res) => {
  const { title, description, due_date, assigned_to, status, recurrence } = req.body;
  const existing = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Task not found' });
  }
  db.prepare(`
    UPDATE tasks SET title = ?, description = ?, due_date = ?, assigned_to = ?, status = ?, recurrence = ?
    WHERE id = ?
  `).run(
    title ?? existing.title,
    description ?? existing.description,
    due_date ?? existing.due_date,
    assigned_to !== undefined ? (assigned_to || null) : existing.assigned_to,
    status ?? existing.status,
    recurrence !== undefined ? (recurrence || null) : existing.recurrence,
    req.params.id
  );
  const task = db.prepare(`
    SELECT t.*, m.name as assigned_to_name
    FROM tasks t
    LEFT JOIN members m ON t.assigned_to = m.id
    WHERE t.id = ?
  `).get(req.params.id);
  res.json(task);
});

router.delete('/:id', (req, res) => {
  const result = db.prepare('DELETE FROM tasks WHERE id = ?').run(req.params.id);
  if (result.changes === 0) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.json({ ok: true });
});

router.patch('/:id/status', (req, res) => {
  const { status } = req.body;
  if (!['todo', 'in_progress', 'done'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  const result = db.prepare('UPDATE tasks SET status = ? WHERE id = ?').run(status, req.params.id);
  if (result.changes === 0) {
    return res.status(404).json({ error: 'Task not found' });
  }
  const task = db.prepare(`
    SELECT t.*, m.name as assigned_to_name
    FROM tasks t
    LEFT JOIN members m ON t.assigned_to = m.id
    WHERE t.id = ?
  `).get(req.params.id);
  res.json(task);
});

router.patch('/:id/occurrences/:date', (req, res) => {
  const { status } = req.body;
  if (!['todo', 'in_progress', 'done'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  db.prepare(`
    INSERT INTO recurrence_overrides (task_id, occurrence_date, status)
    VALUES (?, ?, ?)
    ON CONFLICT(task_id, occurrence_date) DO UPDATE SET status = excluded.status
  `).run(req.params.id, req.params.date, status);
  res.json({ task_id: Number(req.params.id), occurrence_date: req.params.date, status });
});

module.exports = router;
