const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../database');

router.get('/login', (req, res) => {
    res.render('pages/login');
});

router.post('/login', (req, res) => {
    const { email, password, login_role } = req.body;
    db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
        if (err || !user) return res.render('pages/login', { error: 'Invalid email or password' });
        
        // Ensure user is logging into the correct portal (Admin bypasses this)
        if (user.role !== 'admin' && user.role !== login_role) {
            return res.render('pages/login', { error: `Account is registered as a ${user.role}, please select the correct login type.` });
        }
        
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (isMatch) {
                req.session.user = user;
                res.redirect('/');
            } else {
                res.render('pages/login', { error: 'Invalid email or password' });
            }
        });
    });
});

router.get('/register', (req, res) => {
    res.render('pages/register');
});

router.post('/register', (req, res) => {
    const { full_name, phone, email, password, confirm_password, role } = req.body;
    if (password !== confirm_password) {
        return res.render('pages/register', { error: 'Passwords do not match' });
    }

    bcrypt.hash(password, 10, (err, hash) => {
        db.run("INSERT INTO users (full_name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)",
            [full_name, email, hash, phone, role || 'student'], function(err) {
                if (err) return res.render('pages/register', { error: 'Email already exists' });
                res.redirect('/auth/login');
            });
    });
});

router.post('/reset-password', (req, res) => {
    const { email, new_password } = req.body;
    db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
        if (err || !user) {
            return res.render('pages/login', { error: 'Account with that email not found.' });
        }
        bcrypt.hash(new_password, 10, (err, hash) => {
            db.run("UPDATE users SET password = ? WHERE email = ?", [hash, email], (err) => {
                res.render('pages/login', { error: 'Password reset successfully. You can now log in.' });
            });
        });
    });
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;
