const express = require('express');
const router = express.Router();
const db = require('../database');
const multer = require('multer');
const path = require('path');

// Setup multer to save uploaded files to public/downloads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/downloads'));
    },
    filename: (req, file, cb) => {
        // Keep original filename (sanitize it slightly)
        const safeName = file.originalname.replace(/[^a-zA-Z0-9._\-\(\) ]/g, '_');
        cb(null, safeName);
    }
});
const upload = multer({ storage });

router.get('/', (req, res) => {
    db.all("SELECT * FROM courses", [], (err, courses) => {
        const featuredCourse = courses && courses.length > 0 
            ? courses.filter(c => c.title !== 'Introduction to Machine Learning').reduce((prev, current) => (prev.rating > current.rating) ? prev : current) 
            : null;
        res.render('pages/courses', { courses: courses || [], featuredCourse });
    });
});

router.get('/manage/:id', (req, res) => {
    if (!req.session.user || req.session.user.role !== 'lecturer') {
        return res.redirect('/profile');
    }
    db.get("SELECT * FROM courses WHERE id = ?", [req.params.id], (err, course) => {
        // FYP DEMO: Bypassing the strict 'instructor === user.full_name' check so any lecturer can demo the management page
        if (course) {
            res.render('pages/manage_course', { course, user: req.session.user });
        } else {
            res.status(404).send('Course not found or unauthorized');
        }
    });
});

router.post('/manage/:id/save', (req, res) => {
    if (!req.session.user || req.session.user.role !== 'lecturer') {
        return res.status(403).json({ error: 'Unauthorized' });
    }
    const { content } = req.body;
    db.run("UPDATE courses SET content = ? WHERE id = ?", [JSON.stringify(content), req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

router.get('/:id', (req, res) => {
    db.get("SELECT * FROM courses WHERE id = ?", [req.params.id], (err, course) => {
        if (course) {
            res.render('pages/course_detail', { course });
        } else {
            res.status(404).send('Course not found');
        }
    });
});

// File upload for course notes
router.post('/manage/:id/upload-file', (req, res, next) => {
    if (!req.session.user || req.session.user.role !== 'lecturer') {
        return res.status(403).json({ error: 'Unauthorized' });
    }
    next();
}, upload.single('notesFile'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file received' });
    }
    res.json({ success: true, filename: req.file.filename });
});

module.exports = router;
