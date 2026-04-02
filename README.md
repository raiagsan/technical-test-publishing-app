# Publishing App - Technical Test

Proyek ini adalah sistem manajemen katalog buku (Books, Authors, Publishers) yang dibangun menggunakan arsitektur Fullstack.

**Project Status: Work in Progress**

> Proyek ini dikembangkan dalam kurun waktu yang intensif sebagai bagian dari technical test. Fokus utama pengerjaan adalah pada pembangunan fondasi arsitektur yang bersih, scalable, dan mengikuti best practices. Saat ini aplikasi telah mencapai tahap integrasi struktur dasar, namun masih terdapat kendala fungsional pada proses autentikasi (login) yang sedang dalam tahap debugging.

---

## Project Structure & Tech Stack

Proyek ini dibagi menjadi dua bagian utama:

### 1. Backend (`/backend`)

- Tech Stack: Node.js, Express.js, Prisma ORM, PostgreSQL.
- Features: JWT Authentication, CRUD API, Swagger UI Documentation.
- Documentation: Tersedia di `http://localhost:5000/api-docs` (setelah server jalan).

### 2. Frontend (`/frontend`)

- Tech Stack: Next.js 14 (App Router), Tailwind CSS, Context API.
- Features: UI Management untuk Author, Publisher, dan Books dengan integrasi Axios.

---

## 🚀 Quick Start

### Prerequisites

Pastikan Anda sudah menginstal Node.js dan memiliki akses ke database PostgreSQL.

### Step 1: Setup Backend

1. `cd backend`
2. `npm install`
3. `cp .env.example .env` (Sesuaikan `DATABASE_URL`)
4. `npx prisma migrate dev`
5. `npx prisma db seed`
6. `npm run dev`

### Step 2: Setup Frontend

1. `cd frontend`
2. `npm install`
3. `cp .env.example .env.local`
4. `npm run dev`

---

## 📝 Catatan Adaptasi & Tantangan

Dalam pengerjaan ini, saya menggunakan beberapa tech stack yang berbeda dari core stack harian saya. Tantangan ini memberikan pengalaman belajar yang luar biasa dalam waktu singkat, terutama dalam memahami:

- Implementasi Prisma ORM untuk relasi database yang kompleks.
- Pengaturan Alias Path dan Hydration pada Next.js App Router.
- Sinkronisasi State Management menggunakan Context API di sisi Client.

Meskipun terdapat kendala teknis pada tahap akhir integrasi login, saya telah memastikan struktur kode tetap modular dan mudah untuk dikembangkan lebih lanjut. Jika diberikan kesempatan, maka saya akan melanjutkan program ini hingga semua fiturnya dapat berjalan sesuai dengan requirement yang ditentukan.

Terima kasih atas kesempatan yang diberikan pada technical test ini. Saya mohon maaf apabila terdapat kesalahan dan ke-tidak sempurnaan program ini.
