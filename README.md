# 📌 Project Title: Serbaguna

## 📖 Description
Serbaguna adalah aplikasi berbasis web yang menyediakan berbagai utilitas harian dalam satu platform. Aplikasi ini dirancang untuk mempermudah pengguna dalam mengakses beragam tools seperti **Calculator, Notes, To-Do List, Converter**, dan lainnya.  
Tujuan utama proyek ini adalah menyediakan platform **multifungsi**, ringan, dan mudah digunakan tanpa harus berpindah aplikasi.  

---

## 🛠 Technologies Used
- **Frontend Framework:** Next.js (App Router)  
- **UI Components:** Tailwind CSS, shadcn/ui  
- **Icons:** lucide-react  
- **State Management:** React Hooks (`useState`, `useEffect`)  
- **Authentication & Database:** Supabase  
- **Deployment:** Vercel  

**Alasan Pemilihan Teknologi:**  
Next.js dipilih karena mendukung **SSR dan SSG** yang membuat aplikasi lebih cepat. Tailwind CSS dipilih karena efisiensi styling. Supabase dipakai sebagai backend karena menyediakan **database, autentikasi, dan hosting** yang mudah diintegrasikan.  

---

## ✨ Features
- 🔢 **Calculator**: Perhitungan dasar dengan antarmuka sederhana.  
- 📝 **Notes**: Menyimpan catatan dengan kategori, dukungan Supabase untuk penyimpanan.  
- ✅ **To-Do List**: Membuat daftar tugas, menandai selesai, dan menghapus.  
- 🔄 **Converter**: Konversi satuan dan perbedaan tanggal (tahun, bulan, hari).  

---

## ⚙️ Setup Instructions
1. Clone repository:
   ```bash
   git clone https://github.com/username/serbaguna-tools.git
   cd serbaguna-tools
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Setup Supabase:
   - Buat project di [Supabase](https://supabase.com/).  
   - Copy **API Keys** ke file `.env.local`.  
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
4. Jalankan server:
   ```bash
   npm run dev
   ```
5. Buka di browser:
   ```
   http://localhost:3000
   ```

---

## 🤖 AI Support Explanation
Dalam pengembangan proyek ini digunakan **IBM Granite** sebagai pendukung berbasis AI.  
Peran IBM Granite antara lain:  
- Membantu menyusun struktur kode (React + Next.js).  
- Menyediakan solusi dan penjelasan atas error yang terjadi.
- Membantu dokumentasi.  

**Dampak nyata:** penggunaan IBM Granite mempercepat proses pengembangan, mengurangi error, serta mempermudah debugging dan dokumentasi.  
