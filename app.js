const express = require('express');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');

const db = require('./database'); // Initialize SQLite Database

const app = express();
const PORT = process.env.PORT || 3000;

// Setup View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// Setup Static Files
app.use(express.static(path.join(__dirname, 'public')));

// Setup Body Parser and Sessions
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
    secret: 'edulearning_secret',
    resave: false,
    saveUninitialized: false
}));

// Pass user and current path to all views
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.currentPath = req.path;
    res.locals.siteSettings = {}; // default
    
    // Fetch settings
    db.all("SELECT * FROM settings", (err, rows) => {
        if (!err && rows) {
            rows.forEach(r => {
                res.locals.siteSettings[r.key] = r.value;
            });
        }
        next();
    });
});

// Routes
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');
const coursesRoutes = require('./routes/courses');
const bookstoreRoutes = require('./routes/bookstore');
const forumRoutes = require('./routes/forum');
const adminRoutes = require('./routes/admin');

app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/courses', coursesRoutes);
app.use('/bookstore', bookstoreRoutes);
app.use('/forum', forumRoutes);
app.use('/admin', adminRoutes);

// Dedicated Download Route to force correct filename
app.get('/download/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'public', 'downloads', filename);
    res.download(filePath, filename, (err) => {
        if (err) {
            console.error('Download error:', err);
            res.status(404).send('File not found');
        }
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`EduLearning Server running on http://localhost:${PORT}`);
});
