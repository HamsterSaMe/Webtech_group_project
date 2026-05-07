const express = require('express');
const router = express.Router();
const db = require('../database');

// Middleware to ensure user is logged in
const requireAuth = (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
};

// POST: Upgrade to Premium Plan
router.post('/upgrade-plan', requireAuth, (req, res) => {
    const userId = req.session.user.id;
    const { name, phone, card, expiry, cvv } = req.body;
    
    // Validate inputs
    if (!name || !phone || !card || !expiry || !cvv) {
        return res.status(400).json({ error: 'Missing billing information' });
    }
    
    // Check if user is already premium
    db.get("SELECT subscription_plan FROM users WHERE id = ?", [userId], (err, user) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        
        if (user && user.subscription_plan === 'premium') {
            return res.status(400).json({ error: 'User is already premium' });
        }
        
        // Update user subscription
        const subscriptionDate = new Date().toISOString();
        db.run(
            "UPDATE users SET subscription_plan = ?, subscription_date = ? WHERE id = ?",
            ['premium', subscriptionDate, userId],
            function(err) {
                if (err) {
                    console.error('Update error:', err);
                    return res.status(500).json({ error: 'Failed to upgrade subscription' });
                }
                
                // Update session user object
                req.session.user.subscription_plan = 'premium';
                req.session.user.subscription_date = subscriptionDate;

                // Return success
                res.json({ 
                    success: true, 
                    message: 'Upgraded to premium successfully',
                    subscription_plan: 'premium',
                    subscription_date: subscriptionDate
                });
            }
        );
    });
});

// Simple health check for the student routes
router.get('/ping', (req, res) => {
    res.json({ ok: true, route: '/student/ping' });
});

// POST: Cancel Subscription
router.post('/cancel-subscription', requireAuth, (req, res) => {
    const userId = req.session.user.id;
    console.log(`[student] Cancel subscription request for userId=${userId}`);

    // Check current subscription
    db.get("SELECT subscription_plan FROM users WHERE id = ?", [userId], (err, row) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (!row || row.subscription_plan !== 'premium') {
            return res.status(400).json({ error: 'User is not on a premium plan' });
        }

        // Update to free
        db.run("UPDATE users SET subscription_plan = ?, subscription_date = NULL WHERE id = ?", ['free', userId], function(err) {
            if (err) {
                console.error('Update error:', err);
                return res.status(500).json({ error: 'Failed to cancel subscription' });
            }

            // Update session
            req.session.user.subscription_plan = 'free';
            req.session.user.subscription_date = null;

            res.json({ success: true, message: 'Subscription cancelled' });
        });
    });
});

module.exports = router;
