const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const initSqlJs = require('sql.js');

const dbPath = path.resolve(__dirname, 'edulearning.db');
let db = null;
let SQL = null;

// Initialize SQL.js
async function initDB() {
    if (SQL === null) {
        SQL = await initSqlJs();
    }
    
    if (db === null) {
        // Load existing database or create new
        if (fs.existsSync(dbPath)) {
            const filebuffer = fs.readFileSync(dbPath);
            db = new SQL.Database(filebuffer);
            console.log('Connected to the SQLite database.');
        } else {
            db = new SQL.Database();
            console.log('Created new SQLite database.');
        }
        
        createSchema();
    }
    return db;
}

function saveDB() {
    if (db) {
        const data = db.export();
        const buffer = Buffer.from(data);
        fs.writeFileSync(dbPath, buffer);
    }
}

function createSchema() {
    if (!db) return;
    
    try {
        // Users Table
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            full_name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            phone TEXT,
            age INTEGER,
            role TEXT DEFAULT 'student',
            xp INTEGER DEFAULT 0,
            subscription_plan TEXT DEFAULT 'free',
            subscription_date DATETIME
        )`);

        // Courses Table
        db.run(`CREATE TABLE IF NOT EXISTS courses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            instructor TEXT,
            rating REAL,
            students_count INTEGER,
            duration TEXT,
            category TEXT,
            description TEXT,
            image_url TEXT,
            content TEXT
        )`);

        // Books Table
        db.run(`CREATE TABLE IF NOT EXISTS books (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            author TEXT,
            price REAL,
            category TEXT,
            rating REAL,
            reviews_count INTEGER,
            description TEXT,
            image_url TEXT
        )`);

        // Forum Threads Table
        db.run(`CREATE TABLE IF NOT EXISTS forum_threads (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            title TEXT NOT NULL,
            content TEXT,
            category TEXT,
            views INTEGER DEFAULT 0,
            replies_count INTEGER DEFAULT 0,
            likes INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )`);

        // Forum Messages Table
        db.run(`CREATE TABLE IF NOT EXISTS forum_messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            thread_id INTEGER NOT NULL,
            author_name TEXT NOT NULL,
            content TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(thread_id) REFERENCES forum_threads(id)
        )`);

        // Cart Table
        db.run(`CREATE TABLE IF NOT EXISTS cart (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            item_id INTEGER,
            item_type TEXT,
            quantity INTEGER DEFAULT 1,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )`);

        // Settings Table
        db.run(`CREATE TABLE IF NOT EXISTS settings (
            key TEXT UNIQUE,
            value TEXT
        )`);

        console.log('Database schema initialized.');
        
        // Seed data if needed
        const courseResult = db.exec('SELECT COUNT(*) AS count FROM courses');
        const courseCount = courseResult.length > 0 ? courseResult[0].values[0][0] : 0;
        
        if (courseCount === 0) {
            seedData();
        }
        
        // Ensure admin user exists
        bcrypt.hash('admin123', 10, (err, hash) => {
            try {
                db.run("INSERT OR IGNORE INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)",
                    ['System Admin', 'admin@edulearning.com', hash, 'admin']
                );
                saveDB();
            } catch (e) {
                // Ignore duplicate key errors
            }
        });
    } catch (e) {
        console.error('Error initializing database schema:', e.message);
    }
}

function seedData() {
    console.log('Seeding data...');
    
    try {
        // Seed Courses
        const courses = [
            ['Advanced UI Design Patterns', 'Jane Doe', 4.9, 13453, '16H', 'UI/UX', 'Learn advanced UI patterns.', '/images/extracted/page4_img4.png', null],
            ['Data Science Fundamentals', 'Prof. Michael Ross', 4.8, 12835, '20H', 'Science', 'Intro to data science.', '/images/extracted/page1_img6.jpeg', null],
            ['UI/UX Design Fundamentals', 'Prof. Michael Roberts', 4.9, 2168, '16H', 'UI/UX', 'Learn the principles of user interface.', '/images/extracted/page4_img1.png', null]
        ];
        
        courses.forEach(c => {
            db.run('INSERT INTO courses (title, instructor, rating, students_count, duration, category, description, image_url, content) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', c);
        });

        // Seed Books
        const books = [
            ['The Design of Everyday Things', 'Don Norman', 29.99, 'Design', 4.9, 230, 'A profound exploration into design.', '/images/extracted/page1_img9.png'],
            ['Refactoring UI', 'Adam Wathan', 34.99, 'Design', 4.8, 150, 'Learn to design better UIs.', '/images/extracted/page1_img11.png'],
            ['Atomic Habits', 'James Clear', 39.99, 'Self-help', 5.0, 500, 'Build good habits.', '/images/extracted/page1_img13.png']
        ];
        
        books.forEach(b => {
            db.run('INSERT INTO books (title, author, price, category, rating, reviews_count, description, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', b);
        });

        // Create dummy users
        bcrypt.hash('123456', 10, (err, hash) => {
            try {
                db.run("INSERT INTO users (full_name, email, password, phone, age, xp, role) VALUES (?, ?, ?, ?, ?, ?, ?)",
                    ['Alex Mercer', 'alex@student.edu.my', hash, '012-3456789', 25, 120, 'student']
                );
                saveDB();
            } catch (e) {
                // Ignore duplicates
            }
        });

        saveDB();
    } catch (e) {
        console.error('Error seeding data:', e.message);
    }
}

// Create a wrapper object that mimics sqlite3 API
const dbWrapper = {
    run: function(sql, params, callback) {
        try {
            if (!db) {
                if (typeof callback === 'function') {
                    callback(new Error('Database not initialized'));
                }
                return;
            }
            
            if (typeof params === 'function') {
                callback = params;
                params = [];
            }
            
            params = params || [];
            db.run(sql, params);
            saveDB();
            
            if (typeof callback === 'function') {
                callback(null);
            }
        } catch (e) {
            if (typeof callback === 'function') {
                callback(e);
            } else {
                console.error('Database error:', e);
            }
        }
    },
    
    get: function(sql, params, callback) {
        try {
            if (!db) {
                callback(new Error('Database not initialized'));
                return;
            }
            
            if (typeof params === 'function') {
                callback = params;
                params = [];
            }
            
            params = params || [];
            const result = db.exec(sql, params);
            
            if (result.length > 0 && result[0].values.length > 0) {
                const row = {};
                result[0].columns.forEach((col, i) => {
                    row[col] = result[0].values[0][i];
                });
                callback(null, row);
            } else {
                callback(null, undefined);
            }
        } catch (e) {
            callback(e);
        }
    },
    
    all: function(sql, params, callback) {
        try {
            if (!db) {
                callback(new Error('Database not initialized'));
                return;
            }
            
            if (typeof params === 'function') {
                callback = params;
                params = [];
            }
            
            params = params || [];
            const result = db.exec(sql, params);
            const rows = [];
            
            if (result.length > 0) {
                result[0].values.forEach(row => {
                    const obj = {};
                    result[0].columns.forEach((col, i) => {
                        obj[col] = row[i];
                    });
                    rows.push(obj);
                });
            }
            
            callback(null, rows);
        } catch (e) {
            callback(e);
        }
    },
    
    prepare: function(sql) {
        return {
            run: (params) => {
                try {
                    if (!db) return;
                    db.run(sql, params);
                    saveDB();
                } catch (e) {
                    console.error('Prepared statement error:', e);
                }
            },
            finalize: () => {}
        };
    },
    
    serialize: function(callback) {
        if (callback) {
            callback();
        }
    }
};

// Initialize and export
initDB().catch(e => {
    console.error('Failed to initialize database:', e);
    process.exit(1);
});

module.exports = dbWrapper;
