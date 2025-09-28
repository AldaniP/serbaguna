export type Tool = {
  name: string;
  slug: string;        // nama folder di app/tools/
  description: string;
  icon?: string;       // nama icon jika pakai library icon
  comingSoon: boolean;
};

export const toolsRegistry: Tool[] = [
  {
    name: "Calculator",
    slug: "calculator",
    description: "Hitung angka dengan mudah",
    icon: "Calculator",
    comingSoon: false,
  },
  {
    name: "Notes",
    slug: "notes",
    description: "Catatan yang bisa disimpan ke Supabase",
    icon: "FileText",
    comingSoon: false,
  },
  {
    name: "Todo List",
    slug: "todolist",
    description: "Daftar tugas harian yang bisa ditandai selesai",
    icon: "CheckSquare",
    comingSoon: false,
  },
  {
    name: "Converter",
    slug: "converter",
    description: "Untuk convert panjang, suhu",
    icon: "CheckSquare",
    comingSoon: false,
  },
  {
    name: "Summarize",
    slug: "summarize",
    description: "Untuk merangkum teks panjang",
    icon: "CheckSquare",
    comingSoon: false,
  },
  {
    name: "Mini Games",
    slug: "mini-games",
    description: "Untuk main game sederhana",
    icon: "CheckSquare",
    comingSoon: false,
  },
];
