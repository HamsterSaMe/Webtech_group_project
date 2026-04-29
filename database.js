const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');

const dbPath = path.resolve(__dirname, 'edulearning.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to SQLite database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        initializeDB();
    }
});

function initializeDB() {
    db.serialize(() => {
        // Users Table
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            full_name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            phone TEXT,
            age INTEGER,
            role TEXT DEFAULT 'student',
            xp INTEGER DEFAULT 0
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
            image_url TEXT
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

        // Forum Messages Table (Live Chat)
        db.run(`CREATE TABLE IF NOT EXISTS forum_messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            thread_id INTEGER NOT NULL,
            author_name TEXT NOT NULL,
            content TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(thread_id) REFERENCES forum_threads(id)
        )`);
        db.run(`CREATE TABLE IF NOT EXISTS cart (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            item_id INTEGER,
            item_type TEXT, -- 'book' or 'course'
            quantity INTEGER DEFAULT 1,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )`);

        // ── Migrations: safely add columns that may not exist in older DBs ──
        db.run(`ALTER TABLE forum_threads ADD COLUMN content TEXT`, ()=>{});
        db.run(`ALTER TABLE forum_threads ADD COLUMN likes INTEGER DEFAULT 0`, ()=>{});
        db.run(`ALTER TABLE courses ADD COLUMN content TEXT`, ()=>{});
        
        db.run(`CREATE TABLE IF NOT EXISTS settings (
            key TEXT UNIQUE,
            value TEXT
        )`, ()=>{});

        console.log('Database schema initialized.');
        
        // Ensure admin user exists
        bcrypt.hash('admin123', 10, (err, hash) => {
            db.run("INSERT OR IGNORE INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)",
                ['System Admin', 'admin@edulearning.com', hash, 'admin']
            );
        });

        // Seed initial data if empty
        db.get("SELECT COUNT(*) AS count FROM courses", (err, row) => {
            if (row && row.count === 0) {
                seedData();
            }
        });
    });
}

function seedData() {
    console.log('Seeding data...');
    
    // Seed Courses
    const courses = [
        ['Advanced UI Design Patterns', 'Jane Doe', 4.9, 13453, '16H', 'UI/UX', 'Learn advanced UI patterns.', '/images/extracted/page4_img4.png'],
        ['Data Science Fundamentals', 'Prof. Michael Ross', 4.8, 12835, '20H', 'Science', 'Intro to data science.', '/images/extracted/page1_img6.jpeg'],
        ['UI/UX Design Fundamentals', 'Prof. Michael Roberts', 4.9, 2168, '16H', 'UI/UX', 'Learn the principles of user interface.', '/images/extracted/page4_img1.png']
    ];
    const courseStmt = db.prepare('INSERT INTO courses (title, instructor, rating, students_count, duration, category, description, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    courses.forEach(c => courseStmt.run(c));
    courseStmt.finalize();

    // Seed Books
    const books = [
        ['The Design of Everyday Things', 'Don Norman', 29.99, 'Design', 4.9, 230, 'A profound exploration into design.', '/images/extracted/page1_img9.png'],
        ['Refactoring UI', 'Adam Wathan', 34.99, 'Design', 4.8, 150, 'Learn to design better UIs.', '/images/extracted/page1_img11.png'],
        ['Atomic Habits', 'James Clear', 39.99, 'Self-help', 5.0, 500, 'Build good habits.', '/images/extracted/page1_img13.png']
    ];
    const bookStmt = db.prepare('INSERT INTO books (title, author, price, category, rating, reviews_count, description, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    books.forEach(b => bookStmt.run(b));
    bookStmt.finalize();
    
    // Create dummy users
    bcrypt.hash('123456', 10, (err, hash) => {
        db.run("INSERT INTO users (full_name, email, password, phone, age, xp, role) VALUES (?, ?, ?, ?, ?, ?, ?)",
            ['Alex Mercer', 'alex@student.edu.my', hash, '012-3456789', 25, 120, 'student']
        );
    });
    
    bcrypt.hash('admin123', 10, (err, hash) => {
        db.run("INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)",
            ['System Admin', 'admin@edulearning.com', hash, 'admin']
        );
    });
}

module.exports = db;
