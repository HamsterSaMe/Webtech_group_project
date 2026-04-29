const express = require('express');
const router = express.Router();
const db = require('../database');

// Middleware to check if user is admin
function requireAdmin(req, res, next) {
    if (req.session && req.session.user && req.session.user.role === 'admin') {
        next();
    } else {
        res.status(403).send('Access Denied');
    }
}

router.use(requireAdmin);

router.get('/', (req, res) => {
    // Fetch courses, books, and lecturers for the dashboard
    db.all("SELECT * FROM courses ORDER BY id DESC", (err, courses) => {
        db.all("SELECT * FROM books ORDER BY id DESC", (err, books) => {
            db.all("SELECT * FROM users WHERE role = 'lecturer'", (err, lecturers) => {
                db.all("SELECT * FROM users WHERE role = 'student'", (err, students) => {
                    db.get("SELECT COUNT(*) AS count FROM users WHERE role = 'student'", (err, studentCountRow) => {
                        db.get("SELECT COUNT(*) AS count FROM users WHERE role = 'lecturer'", (err, lecturerCountRow) => {
                            res.render('pages/admin', { 
                                user: req.session.user, 
                                courses: courses || [], 
                                books: books || [], 
                                lecturers: lecturers || [],
                                students: students || [],
                                studentCount: studentCountRow ? studentCountRow.count : 0,
                                lecturerCount: lecturerCountRow ? lecturerCountRow.count : 0
                            });
                        });
                    });
                });
            });
        });
    });
});

// Admin Add Course
router.post('/add-course', (req, res) => {
    const { title, instructor, category, description, duration, image_url } = req.body;
    db.run(
        'INSERT INTO courses (title, instructor, category, description, duration, image_url, students_count, rating) VALUES (?, ?, ?, ?, ?, ?, 0, 0)',
        [title, instructor, category, description, duration, image_url || '/images/extracted/page4_img4.png'],
        (err) => {
            if (err) console.error(err);
            res.redirect('/admin');
        }
    );
});

// Admin Add Book
router.post('/add-book', (req, res) => {
    const { title, author, category, price, description, image_url } = req.body;
    db.run(
        'INSERT INTO books (title, author, category, price, description, image_url, reviews_count, rating) VALUES (?, ?, ?, ?, ?, ?, 0, 0)',
        [title, author, category, price, description, image_url || '/images/extracted/page1_img9.png'],
        (err) => {
            if (err) console.error(err);
            res.redirect('/admin');
        }
    );
});

// Admin Delete Item
router.post('/delete', (req, res) => {
    const { type, id } = req.body;
    if (type === 'course') {
        db.run('DELETE FROM courses WHERE id = ?', [id], () => res.redirect('/admin'));
    } else if (type === 'book') {
        db.run('DELETE FROM books WHERE id = ?', [id], () => res.redirect('/admin'));
    } else {
        res.redirect('/admin');
    }
});

// Admin Save Settings
router.post('/save-settings', (req, res) => {
    const { hero_title, hero_subtitle, contact_email, footer_desc } = req.body;
    
    const settings = [
        { key: 'hero_title', value: hero_title },
        { key: 'hero_subtitle', value: hero_subtitle },
        { key: 'contact_email', value: contact_email },
        { key: 'footer_desc', value: footer_desc }
    ];

    let completed = 0;
    settings.forEach(setting => {
        db.run('INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = ?', 
            [setting.key, setting.value, setting.value], 
            (err) => {
                completed++;
                if (completed === settings.length) {
                    res.redirect('/admin');
                }
            }
        );
    });
});

module.exports = router;
