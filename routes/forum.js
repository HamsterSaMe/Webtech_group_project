const express = require('express');
const router = express.Router();
const db = require('../database');

// ── GET /forum  — main listing ───────────────────────────────────────────────
router.get('/', (req, res) => {
    db.all(`SELECT f.*, u.full_name AS author_name,
                   (SELECT COUNT(*) FROM forum_messages m WHERE m.thread_id = f.id) AS msg_count
            FROM forum_threads f
            LEFT JOIN users u ON f.user_id = u.id
            ORDER BY f.created_at DESC`, [], (err, threads) => {
        res.render('pages/forum', { threads: threads || [] });
    });
});

// ── GET /forum/api/threads  — JSON list (MUST be before /:id) ───────────────
router.get('/api/threads', (req, res) => {
    db.all(`SELECT f.*, u.full_name AS author_name,
                   (SELECT COUNT(*) FROM forum_messages m WHERE m.thread_id = f.id) AS msg_count
            FROM forum_threads f
            LEFT JOIN users u ON f.user_id = u.id
            ORDER BY f.created_at DESC`, [], (err, threads) => {
        res.json(threads || []);
    });
});

// ── POST /forum/thread  — create thread ──────────────────────────────────────
router.post('/thread', (req, res) => {
    const { title, category, content, author_name } = req.body;
    if (!title || !category) return res.status(400).json({ error: 'Title and category required' });
    const userId = req.session && req.session.user ? req.session.user.id : null;
    db.run(
        `INSERT INTO forum_threads (user_id, title, content, category) VALUES (?, ?, ?, ?)`,
        [userId, title, content || '', category],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID, title, category, content: content||'', author_name: author_name || 'Anonymous', msg_count: 0, likes: 0 });
        }
    );
});

// ── POST /forum/like/:id  — like thread (MUST be before /:id) ───────────────
router.post('/like/:id', (req, res) => {
    db.run(`UPDATE forum_threads SET likes = likes + 1 WHERE id = ?`, [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        db.get(`SELECT likes FROM forum_threads WHERE id = ?`, [req.params.id], (err2, row) => {
            res.json({ likes: row ? row.likes : 0 });
        });
    });
});

// ── POST /forum/unlike/:id  — unlike thread (MUST be before /:id) ──────────
router.post('/unlike/:id', (req, res) => {
    db.run(`UPDATE forum_threads SET likes = MAX(0, likes - 1) WHERE id = ?`, [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        db.get(`SELECT likes FROM forum_threads WHERE id = ?`, [req.params.id], (err2, row) => {
            res.json({ likes: row ? row.likes : 0 });
        });
    });
});

// ── GET /forum/messages/:threadId  — poll messages (MUST be before /:id) ────
router.get('/messages/:threadId', (req, res) => {
    const since = req.query.since || 0;
    db.all(
        `SELECT * FROM forum_messages WHERE thread_id = ? AND id > ? ORDER BY created_at ASC`,
        [req.params.threadId, since],
        (err, msgs) => {
            if (err) return res.status(500).json({ error: err.message });
            if (parseInt(since) === 0) {
                db.run(`UPDATE forum_threads SET views = views + 1 WHERE id = ?`, [req.params.threadId]);
            }
            res.json(msgs || []);
        }
    );
});

// ── POST /forum/messages/:threadId  — post a message (MUST be before /:id) ──
router.post('/messages/:threadId', (req, res) => {
    const { author_name, content } = req.body;
    if (!content || !content.trim()) return res.status(400).json({ error: 'Empty message' });
    const name = (author_name || 'Anonymous').trim();
    db.run(
        `INSERT INTO forum_messages (thread_id, author_name, content) VALUES (?, ?, ?)`,
        [req.params.threadId, name, content.trim()],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            db.run(`UPDATE forum_threads SET replies_count = replies_count + 1 WHERE id = ?`, [req.params.threadId]);
            res.json({ id: this.lastID, thread_id: req.params.threadId, author_name: name, content: content.trim(), created_at: new Date().toISOString() });
        }
    );
});

// ── DELETE /forum/messages/:msgId  — delete own message (MUST be before /:id)
router.delete('/messages/:msgId', (req, res) => {
    const { author_name } = req.body;
    db.get(`SELECT * FROM forum_messages WHERE id = ?`, [req.params.msgId], (err, msg) => {
        if (!msg) return res.status(404).json({ error: 'Not found' });
        if (msg.author_name !== author_name) return res.status(403).json({ error: 'Not your message' });
        db.run(`DELETE FROM forum_messages WHERE id = ?`, [req.params.msgId], (err2) => {
            if (err2) return res.status(500).json({ error: err2.message });
            db.run(`UPDATE forum_threads SET replies_count = MAX(0, replies_count - 1) WHERE id = ?`, [msg.thread_id]);
            res.json({ ok: true });
        });
    });
});

// ── GET /forum/:id  — LAST: wildcard for individual thread page ──────────────
router.get('/:id', (req, res) => {
    db.get(`SELECT f.*, u.full_name AS author_name FROM forum_threads f
            LEFT JOIN users u ON f.user_id = u.id WHERE f.id = ?`, [req.params.id], (err, thread) => {
        if (thread) {
            res.render('pages/forum_detail', { thread, replies: [] });
        } else {
            res.status(404).send('Thread not found');
        }
    });
});

module.exports = router;
