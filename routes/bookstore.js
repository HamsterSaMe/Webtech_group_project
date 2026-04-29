const express = require('express');
const router = express.Router();
const db = require('../database');

router.get('/', (req, res) => {
    db.all("SELECT * FROM books", [], (err, books) => {
        res.render('pages/bookstore', { books: books || [] });
    });
});

router.get('/book/:id', (req, res) => {
    db.get("SELECT * FROM books WHERE id = ?", [req.params.id], (err, book) => {
        if (book) {
            res.render('pages/book_detail', { book });
        } else {
            res.status(404).send('Book not found');
        }
    });
});

// Cart — no login required, cart lives in localStorage
router.get('/cart', (req, res) => {
    res.render('pages/cart', { user: req.session.user || null });
});

// Checkout — no login required (guest can checkout)
router.get('/checkout', (req, res) => {
    res.render('pages/checkout', { user: req.session.user || null });
});

// Order Confirmation page
router.get('/order-confirmation', (req, res) => {
    res.render('pages/order_confirmation', { user: req.session.user || null });
});

module.exports = router;

