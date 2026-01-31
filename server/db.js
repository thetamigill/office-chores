const Database = require('better-sqlite3');
const path = require('path');

const dbPath = process.env.DATABASE_PATH || path.join(__dirname, 'chores.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS members (
    id    INTEGER PRIMARY KEY AUTOINCREMENT,
    name  TEXT NOT NULL UNIQUE
  );

  CREATE TABLE IF NOT EXISTS tasks (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    title           TEXT NOT NULL,
    description     TEXT DEFAULT '',
    due_date        TEXT NOT NULL,
    assigned_to     INTEGER REFERENCES members(id) ON DELETE SET NULL,
    status          TEXT NOT NULL DEFAULT 'todo'
                    CHECK(status IN ('todo', 'in_progress', 'done')),
    recurrence      TEXT DEFAULT NULL
                    CHECK(recurrence IN (NULL, 'daily', 'weekly', 'biweekly', 'monthly')),
    created_at      TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS recurrence_overrides (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    task_id         INTEGER NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    occurrence_date TEXT NOT NULL,
    status          TEXT NOT NULL DEFAULT 'todo'
                    CHECK(status IN ('todo', 'in_progress', 'done')),
    UNIQUE(task_id, occurrence_date)
  );
`);

module.exports = db;
