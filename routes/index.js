const express = require('express');
const router = express.Router();
const db = require('../database');

router.get('/', (req, res) => {
    // Fetch some courses and books for the homepage
    db.all("SELECT * FROM courses LIMIT 3", [], (err, courses) => {
        db.all("SELECT * FROM books LIMIT 3", [], (err, books) => {
            res.render('pages/index', { courses: courses || [], books: books || [] });
        });
    });
});

router.get('/profile', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/auth/login');
    }
    db.all("SELECT * FROM courses", [], (err, courses) => {
        db.all("SELECT * FROM books", [], (err, books) => {
            res.render('pages/profile', { 
                user: req.session.user, 
                courses: courses || [], 
                books: books || [] 
            });
        });
    });
});

router.post('/profile/edit', (req, res) => {
    if (!req.session.user) return res.redirect('/auth/login');
    
    const { full_name, email, phone, age } = req.body;
    const userId = req.session.user.id;

    db.get("SELECT id FROM users WHERE email = ? AND id != ?", [email, userId], (err, row) => {
        if (row) {
            return res.redirect('/profile?error=email_taken');
        }
        
        db.run("UPDATE users SET full_name = ?, email = ?, phone = ?, age = ? WHERE id = ?", 
            [full_name, email, phone, age, userId], 
            function(err) {
                if (err) return res.redirect('/profile?error=update_failed');
                
                req.session.user.full_name = full_name;
                req.session.user.email = email;
                req.session.user.phone = phone;
                req.session.user.age = age;
                
                res.redirect('/profile?success=1');
            }
        );
    });
});

module.exports = router;
