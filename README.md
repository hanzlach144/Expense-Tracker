# 💰 Expense Tracker (Full-Stack)

A modern full-stack Expense Tracker web application built with **Node.js, Express.js, MySQL, HTML, CSS, and JavaScript**.

Users can securely register, log in, manage their expenses, track budgets, visualize spending through charts, and export reports as PDF.

---

## 🚀 Features

### 🔐 Authentication
- User Registration
- User Login
- JWT Authentication
- Protected API Routes
- Secure Password Hashing (bcrypt)

### 💸 Expense Management
- Add Expenses
- Edit Expenses
- Delete Expenses
- Category Selection
- Date Selection
- Budget Management

### 📊 Analytics
- Expense Summary
- Remaining Budget
- Highest Expense
- Average Expense
- Total Transactions
- Top Spending Category

### 📈 Charts
- Pie Chart (Category Distribution)
- Bar Chart (Expense Comparison)
- Chart.js Integration

### 🔍 Filters
- Search Expenses
- Category Filter
- Month Filter
- Sort by Date
- Sort by Amount

### 📄 Extras
- PDF Export
- Dark Mode
- Responsive Design

---

# 🛠 Tech Stack

## Frontend
- HTML5
- CSS3
- JavaScript (ES6)
- Chart.js
- jsPDF

## Backend
- Node.js
- Express.js

## Database
- MySQL

## Authentication
- JWT (JSON Web Token)
- bcrypt

---

# 📁 Project Structure

```
Expense-Tracker/
│
├── client/
│   ├── css/
│   ├── js/
│   ├── images/
│   ├── index.html
│   ├── login.html
│   └── register.html
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── .env
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/hanzlach144/Expense-Tracker.git
```

## Install Backend Dependencies

```bash
cd server
npm install
```

## Create Environment Variables

Create a `.env` file inside the `server` folder.

```env
PORT=3000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=expense_tracker

JWT_SECRET=your_secret_key
```

## Start Server

```bash
npm start
```

---

# 🌐 Live Demo

### Frontend

https://hanzlach144.github.io/Expense-Tracker/

### Backend

Coming Soon (Render)

---

# 📌 Future Improvements

- Email Verification
- Forgot Password
- User Profile
- Monthly Reports
- CSV Export
- Expense Images
- Income Tracking
- Savings Goals

---

# 👨‍💻 Developer

**Hanzla Muzaffar**

BS Computer Science Student  

GitHub:
https://github.com/hanzlach144
