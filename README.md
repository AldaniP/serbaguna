# Serbaguna

**Serbaguna** adalah portal/tools hub berbasis web untuk menyimpan dan menggunakan berbagai macam tools yang dibuat dengan Next.js.  
Website ini mendukung penambahan tools baru dengan mudah dan menggunakan **Supabase** untuk menyimpan data (misal Notes, Todo List) dengan user anonim saat ini.

---

## 🚀 Fitur

- Dashboard utama menampilkan daftar tools.
- Tools saat ini:
  - **Calculator** – Kalkulator sederhana.
  - **Notes** – Catatan yang disimpan ke Supabase (anon user).
  - **Todo List** – Daftar tugas yang dapat ditambah/hapus.
- Dark mode / light mode.
- Mudah menambahkan tool baru (1 folder per tool).
- Penyimpanan data menggunakan Supabase (anon key untuk sementara).

---

## 🧰 Tech Stack

- **Frontend:** Next.js (App Router), React, TailwindCSS  
- **Backend / Database:** Supabase (PostgreSQL)  
- **Deployment:** Vercel

---

## ⚙️ Persiapan Lokal

1. Clone repository:
```bash
git clone https://github.com/username/serbaguna.git
cd serbaguna
```

2. Install dependencies:
```bash
npm install
# atau
yarn install
```

3. Buat file `.env.local` di root project:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. Jalankan server development:
```bash
npm run dev
# atau
yarn dev
```
Buka [http://localhost:3000](http://localhost:3000)

---

## 🗂 Struktur Project

```
serbaguna/
├── app/
│   ├── layout.tsx         # Layout utama (navbar/sidebar)
│   ├── page.tsx           # Halaman beranda / dashboard tools
│   └── tools/             # Semua tools
│       ├── page.tsx       # Daftar semua tools
│       ├── calculator/
│       │   └── page.tsx
│       ├── notes/
│       │   └── page.tsx
│       └── todo-list/
│           └── page.tsx
├── components/            # Komponen global (Navbar, Sidebar, ToolCard)
├── lib/                   # Helper & Supabase client
│   └── supabaseClient.ts
├── public/                # File statis (favicon, images)
├── styles/                # TailwindCSS & global styles
├── .env.local             # Environment variables (Supabase URL & anon key)
├── package.json
└── tailwind.config.js
```

---

## 📝 Cara Menambah Tools Baru

1. Buat folder baru di `app/tools/` → misal `image-compressor`.
2. Tambahkan `page.tsx` untuk UI tool.
3. (Opsional) Buat folder `components/` & `utils.ts` jika tool cukup kompleks.
4. Daftarkan tool di `lib/toolsRegistry.ts` (nama, slug, icon, deskripsi).
5. Tool otomatis muncul di daftar dashboard `/tools`.

---

## 🔗 Referensi

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)

---

## 📜 Lisensi

MIT License

