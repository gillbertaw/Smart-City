# Smart City Medan

Website Smart City berbasis localhost untuk tugas kuliah.

## Tech Stack
- **Frontend**: React.js (Vite) — port 3000
- **Backend**: Node.js + Express.js — port 5000
- **ORM**: Sequelize (MySQL) + Mongoose (MongoDB)
- **Database**: MySQL (via XAMPP) + MongoDB

---

## Cara Setup & Menjalankan

### 1. Persiapan
- Install [Node.js](https://nodejs.org) (minimal v18)
- Install [XAMPP](https://www.apachefriends.org) — jalankan MySQL-nya saja
- Install [MongoDB Community Server](https://www.mongodb.com/try/download/community)

### 2. Buat Database MySQL
Buka phpMyAdmin (http://localhost/phpmyadmin) lalu buat database baru:
```sql
CREATE DATABASE smartcity_medan;
```

### 3. Setup Backend
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```
Backend berjalan di: http://localhost:5000

### 4. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend berjalan di: http://localhost:3000

---

## Mode Demo (1 Port)
Jalankan perintah ini saat mau demo ke dosen:
```bash
# Di folder frontend
npm run build

# Di folder backend, ubah .env:
# NODE_ENV=production

# Lalu jalankan backend saja
npm run dev
```
Buka browser: http://localhost:5000

---

## Struktur Folder
```
smart-city/
├── backend/
│   ├── src/
│   │   ├── config/       → mysql.js, mongodb.js, upload.js
│   │   ├── controllers/  → logic handler per fitur
│   │   ├── middleware/   → auth.js (JWT)
│   │   ├── models/       → Sequelize models (MySQL) + Log.js (MongoDB)
│   │   ├── routes/       → endpoint API
│   │   └── server.js     → entry point
│   ├── uploads/          → file upload disimpan di sini
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── src/
    │   ├── assets/
    │   ├── components/   → komponen reusable
    │   ├── context/      → AuthContext.jsx
    │   ├── pages/        → halaman-halaman website
    │   ├── utils/        → api.js (axios instance)
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css     → design system global
    ├── index.html
    ├── vite.config.js
    └── package.json
```
