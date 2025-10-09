# 📌 Project Title: Serbaguna

## 📖 Description
Serbaguna adalah aplikasi berbasis web yang menyediakan berbagai utilitas harian dalam satu platform. Aplikasi ini dirancang untuk mempermudah pengguna dalam mengakses beragam tools seperti **Calculator, Notes, To-Do List, Converter**, dan lainnya.  
Tujuan utama proyek ini adalah menyediakan platform **multifungsi**, ringan, dan mudah digunakan tanpa harus berpindah aplikasi.  

---


# � Serbaguna

Serbaguna adalah sebuah web app multifungsi yang mengumpulkan berbagai utilitas kecil (tools & mini-games) dalam satu tempat. Aplikasi ini dibangun dengan Next.js (App Router) dan ditujukan sebagai playground untuk alat produktivitas kecil dan game ringan.

---

## ✨ Fitur (terbaru)
Daftar tools dan mini-games yang saat ini tersedia di proyek ini:

- Tools utama:
  - `Calculator` — kalkulator dasar (src/app/tools/calculator/page.tsx)
  - `Converter` — konversi satuan (src/app/tools/converter/page.tsx)
  - `Notes` — penyimpanan catatan (src/app/tools/notes/page.tsx)
  - `Todolist` — daftar tugas interaktif dengan item yang dapat di-sort (src/app/tools/todolist/page.tsx, sortable-item.tsx)
  - `Summarize` — antarmuka untuk merangkum teks (src/app/tools/summarize/page.tsx)

- Mini-games (di folder `src/app/tools/mini-games`):
  - `Click Speed` — uji kecepatan klik (click-speed/page.tsx)
  - `Number Guess` — permainan tebak angka (number-guess/page.tsx)
  - `Quick Quiz` — kuis singkat (quick-quiz/page.tsx)
  - `Snake` — game snake sederhana (snake/page.tsx)

- API routes (serverless):
  - `src/app/api/quiz/route.ts` — endpoint quiz
  - `src/app/api/summarize/route.ts` — endpoint ringkasan otomatis

---

## 🛠️ Teknologi

- Frontend: Next.js (App Router)
- Styling / UI: Tailwind CSS, shadcn/ui
- Icon: lucide-react
- Backend ringan / DB: Supabase
- Deployment: Vercel

---

## 🚀 Menjalankan proyek secara lokal

1. Clone repository dan masuk ke folder proyek:

```bash
git clone https://github.com/AldaniP/serbaguna.git
cd serbaguna
```

2. Install dependensi:

```bash
npm install
```

3. (Opsional) Konfigurasi Supabase

Jika Anda ingin menggunakan fitur yang membutuhkan Supabase (mis. Notes), buat project di https://supabase.com lalu tambahkan variabel berikut ke file `.env.local` di root proyek:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
REPLICATE_API_TOKEN=your-replicate-api
```

4. Jalankan server development:

```bash
npm run dev
```

5. Buka aplikasi di browser:

http://localhost:3000

---

## 🤖 AI Support Explanation
Dalam pengembangan proyek ini digunakan **IBM Granite** sebagai pendukung berbasis AI.  
Peran IBM Granite antara lain:  
- Membantu menyusun struktur kode (React + Next.js).  
- Menyediakan solusi dan penjelasan atas error yang terjadi.
- Membantu dokumentasi.  

**Dampak nyata:** penggunaan IBM Granite mempercepat proses pengembangan, mengurangi error, serta mempermudah debugging dan dokumentasi.  
