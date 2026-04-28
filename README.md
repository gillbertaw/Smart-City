# Smart City Medan

Project Smart City berbasis web untuk tugas Pengembangan Perangkat Lunak Tangkas. Aplikasi ini memuat dashboard kota, monitoring layanan publik, voting kebijakan, forum warga, pengaduan, panel admin, dan log aktivitas.

## Tech Stack

- Frontend: React Vite
- Backend: Express.js
- Database relasional: MySQL via Sequelize
- Database log: MongoDB via Mongoose
- Peta: React Leaflet + OpenStreetMap
- Chart: Recharts
- Upload foto: Multer
- Auth: JWT

## Fitur Utama

- Autentikasi login, register, forgot password, dan guest mode
- Dashboard kota
- Peta fasilitas publik
- Kualitas udara
- Status lalu lintas
- Informasi transportasi umum
- Monitor energi, sampah, banjir, air bersih, energi terbarukan
- Voting dan forum kebijakan
- Pengaduan warga dan survei kepuasan
- Papan pengumuman resmi kota
- Info rumah sakit, CCTV, alert bencana, statistik kesehatan
- Direktori pendidikan, lowongan kerja lokal, dan data UMKM
- Panel admin untuk kelola data, moderasi laporan, alert, kebijakan, pengumuman, dan log aktivitas

## Cara Menjalankan

### 1. Persiapan

Install dependency utama:

- Node.js LTS
- XAMPP atau MySQL server
- MongoDB Community Server

### 2. Setup MySQL

Buat database:

```sql
CREATE DATABASE smartcity_medan;
```

### 3. Setup MongoDB

Jika folder data default belum tersedia, jalankan MongoDB dengan dbpath lokal:

```bash
mkdir -p ~/mongodb-data
mongod --dbpath ~/mongodb-data
```

Biarkan terminal MongoDB tetap terbuka.

### 4. Setup Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Default backend berjalan di:

```text
http://localhost:5000
```

Jika port 5000 bentrok, ubah `PORT` di `backend/.env`, lalu sesuaikan proxy di `frontend/vite.config.js`.

### 5. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend berjalan di:

```text
http://localhost:3000
```

## Mode Demo Satu Port

Build frontend:

```bash
cd frontend
npm run build
```

Jalankan backend mode production:

```bash
cd ../backend
npm run demo
```

Buka:

```text
http://localhost:5000
```

## Struktur Folder

```text
smartcity-bagian2/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── seeders/
│   │   └── server.js
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   ├── utils/
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    ├── vite.config.js
    └── package.json
```

## Tim Pengembang

- William Wiryawan (241110007)
- Gillbert Allison Wijaya (241110385)
- Dicky Sasqia (241111078)
- Deidrich Zhu (241111422)
