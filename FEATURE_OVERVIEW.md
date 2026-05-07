# Student Premium Plan - User Flow & Feature Overview

## 🎯 User Journey Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    STUDENT USER JOURNEY                          │
└─────────────────────────────────────────────────────────────────┘

1. STUDENT PROFILE PAGE
   ├─ Name & Email displayed
   ├─ Stats: Total Courses, In Progress, Completed, Saved Items
   └─ TWO BUTTONS:
      ├─ [Edit Profile] (green #9CCC65)
      └─ [Upgrade to Premium] (orange #FF9900) ← NEW!

2. CLICK "UPGRADE TO PREMIUM"
   │
   └─► PLAN COMPARISON MODAL Opens
       ├─ Free Plan Card (Left)
       │  ├─ RM 0/month
       │  ├─ Features:
       │  │  ✓ Unlimited courses (read-only)
       │  │  ✓ Basic forum access
       │  │  ✓ Monthly newsletter
       │  │  ✗ Interactive quizzes
       │  │  ✗ Certificates
       │  │  ✗ Priority support
       │  └─ [Your Current Plan] button (disabled)
       │
       └─ Premium Plan Card (Right) [RECOMMENDED badge]
          ├─ RM 9.99/month
          ├─ Features:
          │  ✓ All Free features
          │  ✓ Interactive quizzes & exams
          │  ✓ Certificates
          │  ✓ 24/7 Priority support
          │  ✓ Ad-free experience
          │  ✓ Exclusive content
          │  ✓ Offline downloads
          └─ [Upgrade to Premium] button (orange)

3. CLICK "UPGRADE TO PREMIUM" (in modal)
   │
   └─► BILLING INFORMATION MODAL Opens
       ├─ [X] Close button (top right)
       ├─ Form Fields:
       │  ├─ Full Name (text input)
       │  ├─ Email (read-only, pre-filled)
       │  ├─ Phone Number (text input)
       │  ├─ Card Number (formatted: XXXX XXXX XXXX XXXX)
       │  ├─ Expiry Date (formatted: MM/YY)
       │  └─ CVV (3 digits)
       ├─ Info Box: "Secure billing - Your data is protected"
       ├─ Info Box: "RM 9.99/month, cancel anytime"
       └─ [Upgrade Button] (orange)

4. FILL & SUBMIT BILLING
   │
   └─► API CALL: POST /student/upgrade-plan
       ├─ Validates all fields
       ├─ Checks user not already premium
       ├─ Updates database:
       │  └─ subscription_plan = 'premium'
       │     subscription_date = current timestamp
       └─ Updates session

5. SUCCESS NOTIFICATION
   │
   ├─► Green checkmark animation
   ├─► "Upgrade Successful!"
   ├─► "Welcome to Premium! You now have access..."
   └─► Auto-dismisses after 3 seconds
       └─► PAGE RELOADS

6. AFTER UPGRADE - HEADER CHANGE
   │
   └─► Logo now shows:
       🎓 EDULEARNING 👑 PREMIUM
       (with golden gradient badge)

7. BACK TO PROFILE - BUTTON CHANGE
   │
   └─► [Premium] button (golden #FFD700, disabled)
       └─► User cannot click again

8. VERIFY ACROSS PAGES
   │
   └─► Premium badge persists on:
       ├─ Home page (/
       ├─ Courses page (/courses)
       ├─ Bookstore page (/bookstore)
       ├─ Forum page (/forum)
       └─ All other pages
```

---

## 🎨 Visual Component Layout

### Plan Modal (Desktop - 900px width)
```
┌──────────────────────────────────────────────────────────────┐
│ Select Your Plan                                          [X] │
├──────────────────────────────────────────────────────────────┤
│                                                                │
│ ┌─────────────────────┐          ┌──────────────────────────┐ │
│ │                     │          │  [RECOMMENDED]           │ │
│ │   Free Plan         │          │  Premium Plan            │ │
│ │                     │          │                          │ │
│ │   RM 0/month        │          │  RM 9.99/month           │ │
│ │                     │          │                          │ │
│ │ ✓ Courses (RO)      │          │ ✓ All Free features      │ │
│ │ ✓ Forum             │          │ ✓ Quizzes & Exams        │ │
│ │ ✓ Newsletter        │          │ ✓ Certificates           │ │
│ │ ✗ Quizzes           │          │ ✓ 24/7 Support           │ │
│ │ ✗ Certificates      │          │ ✓ Ad-free                │ │
│ │ ✗ Support           │          │ ✓ Exclusive content      │ │
│ │ ✗ Offline           │          │ ✓ Offline downloads      │ │
│ │                     │          │                          │ │
│ │ [Current Plan]      │          │ [Upgrade to Premium]     │ │
│ │   (disabled)        │          │   (clickable)            │ │
│ └─────────────────────┘          └──────────────────────────┘ │
│                                                                │
└──────────────────────────────────────────────────────────────┘
```

### Billing Modal
```
┌──────────────────────────────────────────┐
│ Billing Information                  [X] │
├──────────────────────────────────────────┤
│ 🔒 Secure billing information            │
├──────────────────────────────────────────┤
│                                          │
│ Full Name:                               │
│ [_________________________________]      │
│                                          │
│ Email Address:                           │
│ [user@example.com] (read-only)           │
│                                          │
│ Phone Number:                            │
│ [_________________________________]      │
│                                          │
│ Card Number:                             │
│ [____  ____  ____  ____]                 │
│                                          │
│ Expiry Date:    CVV:                     │
│ [__/__]         [___]                    │
│                                          │
│ ⓘ RM 9.99/month, cancel anytime          │
│                                          │
│ [Upgrade Button]                         │
│                                          │
└──────────────────────────────────────────┘
```

### Success Notification
```
┌─────────────────────────────────────────┐
│ ✓ Upgrade Successful!                   │
│ Welcome to Premium! You now have         │
│ access to all exclusive features.        │
└─────────────────────────────────────────┘
(appears for 3 seconds, then auto-dismisses)
```

### Header After Upgrade
```
Header (dark background #24201D)
─────────────────────────────────────────
🎓 EDULEARNING 👑 PREMIUM    Home | Courses | Bookstore | Forum
```

---

## 📱 Responsive Layouts

### Tablet (768px width) - Plan Modal
```
┌────────────────────────────────┐
│ Select Your Plan           [X] │
├────────────────────────────────┤
│                                │
│  ┌──────────────────────────┐  │
│  │   Free Plan              │  │
│  │   RM 0/month             │  │
│  │ ✓ Courses (RO)           │  │
│  │ ✓ Forum                  │  │
│  │ ✓ Newsletter             │  │
│  │ [Current Plan]           │  │
│  └──────────────────────────┘  │
│                                │
│  ┌──────────────────────────┐  │
│  │ [RECOMMENDED]            │  │
│  │   Premium Plan           │  │
│  │   RM 9.99/month          │  │
│  │ ✓ All Free features      │  │
│  │ ✓ Quizzes & Exams        │  │
│  │ [Upgrade to Premium]     │  │
│  └──────────────────────────┘  │
│                                │
└────────────────────────────────┘
```

### Mobile (480px) - Billing Form
```
┌──────────────────────────────┐
│ Billing Info             [X] │
├──────────────────────────────┤
│ 🔒 Secure billing            │
├──────────────────────────────┤
│                              │
│ Full Name:                   │
│ [___________________]        │
│                              │
│ Email:                       │
│ [user@example.com]           │
│                              │
│ Phone:                       │
│ [___________________]        │
│                              │
│ Card Number:                 │
│ [_____ _____ _____ _____]    │
│                              │
│ Expiry:  CVV:                │
│ [__/__]  [___]               │
│                              │
│ [Upgrade Button]             │
│                              │
└──────────────────────────────┘
(Full width, touch-friendly)
```

---

## 🔄 Database Schema

### Users Table Updates
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    full_name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    phone TEXT,
    age INTEGER,
    role TEXT DEFAULT 'student',
    xp INTEGER DEFAULT 0,
    subscription_plan TEXT DEFAULT 'free',      ← NEW
    subscription_date DATETIME                  ← NEW
);
```

---

## 🛂 Only for Students

### Who sees the button?
- ✅ Students (role = 'student')
- ❌ Lecturers (role = 'lecturer')
- ❌ Admins (role = 'admin')

### Button States
- **Not Premium:** Orange "Upgrade to Premium" button
- **Is Premium:** Golden "Premium" button (disabled, cannot click)

### Badge Shows
- ✅ Only when subscription_plan = 'premium'
- ❌ Never for free users
- ✅ Persists on all pages

---

## 🔐 Security Features

✓ Authentication required (/student route protected)
✓ User ownership verified (can only upgrade own account)
✓ Prevent duplicate upgrades (checks if already premium)
✓ Session updated immediately
✓ All inputs validated
✓ Error handling for database failures

---

## 💾 Data Persistence

When user upgrades:
```javascript
{
  subscription_plan: 'premium',
  subscription_date: '2024-05-07T10:30:00.000Z'
}
```

This data:
- Is stored in SQLite database
- Persists after logout/login
- Updates session immediately
- Affects header & button on all pages

---

## ✨ Smooth Animations

- Plan modal: Fade in with backdrop blur
- Billing modal: Slides in from center
- Success notification: Slide down from top
- Premium badge: Glows with golden shadow
- Form validation: Border color change on focus

---

Perfect! Your student premium plan feature is production-ready! 🚀
