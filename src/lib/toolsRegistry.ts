export type Tool = {
  name: string;
  slug: string;        // nama folder di app/tools/
  description: string;
  icon?: string;       // nama icon jika pakai library icon
};

export const toolsRegistry: Tool[] = [
  {
    name: "Calculator",
    slug: "calculator",
    description: "Hitung angka dengan mudah",
    icon: "Calculator",
  },
  {
    name: "Notes",
    slug: "notes",
    description: "Catatan yang bisa disimpan ke Supabase",
    icon: "FileText",
  },
  {
    name: "Todo List",
    slug: "todolist",
    description: "Daftar tugas harian yang bisa ditandai selesai",
    icon: "CheckSquare",
  },
  {
    name: "Converter",
    slug: "converter",
    description: "Untuk convert panjang, suhu",
    icon: "CheckSquare",
  },
];
