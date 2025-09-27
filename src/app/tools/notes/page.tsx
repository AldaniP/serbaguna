"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Sun,
  Moon,
  Pin,
  PinOff,
  Edit,
  Trash,
  ArrowLeft,
  Plus,
  X,
} from "lucide-react";

type Category = {
  id: string;
  name: string;
};

type Note = {
  id: string;
  title: string;
  content: string;
  pinned: boolean;
  category_id: string | null;
  color: string;
};

export default function NotesPage() {
  const { theme, setTheme } = useTheme();

  const [categories, setCategories] = useState<Category[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [noteColor, setNoteColor] = useState("#60a5fa");
  const [newCategoryName, setNewCategoryName] = useState("");

  const [editNoteId, setEditNoteId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // preset warna
  const [colorPresets, setColorPresets] = useState<string[]>([
    "#f87171",
    "#60a5fa",
    "#34d399",
    "#facc15",
    "#a78bfa",
    "#9ca3af",
  ]);


  // Fetch categories & notes
  useEffect(() => {
    const fetchData = async () => {
      const { data: cats } = await supabase.from("categories").select("*");
      setCategories(cats || []);

      const { data: nts } = await supabase.from("notes").select("*");
      setNotes(nts || []);
    };
    fetchData();
  }, []);

  // Tambah / Edit note
  const handleSaveNote = async () => {
    if (title.trim() === "" && content.trim() === "") return;

    if (editNoteId) {
      await supabase
        .from("notes")
        .update({
          title,
          content,
          category_id: selectedCategory,
          color: noteColor,
        })
        .eq("id", editNoteId);
    } else {
      await supabase.from("notes").insert([
        {
          title,
          content,
          pinned: false,
          category_id: selectedCategory,
          color: noteColor,
        },
      ]);
    }

    refreshNotes();
    resetForm();
    setIsDialogOpen(false);
  };

  const handleDeleteNote = async (id: string) => {
    await supabase.from("notes").delete().eq("id", id);
    refreshNotes();
  };

  const togglePin = async (id: string, pinned: boolean) => {
    await supabase.from("notes").update({ pinned: !pinned }).eq("id", id);
    refreshNotes();
  };

  const handleAddCategory = async () => {
    if (newCategoryName.trim() === "") return;
    const { data } = await supabase
      .from("categories")
      .insert([{ name: newCategoryName }])
      .select()
      .single();

    if (data) {
      setCategories([...categories, data]);
      setSelectedCategory(data.id);
      setNewCategoryName("");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    // cek kalau kategori masih dipakai
    const used = notes.some((n) => n.category_id === id);
    if (used) {
      alert("Kategori masih dipakai di catatan, tidak bisa dihapus!");
      return;
    }

    await supabase.from("categories").delete().eq("id", id);
    setCategories(categories.filter((c) => c.id !== id));
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setSelectedCategory(null);
    setNoteColor("#60a5fa");
    setEditNoteId(null);
    setNewCategoryName("");
  };

  const refreshNotes = async () => {
    const { data } = await supabase.from("notes").select("*");
    setNotes(data || []);
  };

  // Kelompokkan notes per kategori
  const groupedNotes: { [key: string]: Note[] } = {};
  notes.forEach((note) => {
    const key = note.category_id || "uncategorized";
    if (!groupedNotes[key]) groupedNotes[key] = [];
    groupedNotes[key].push(note);
  });

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link href="/">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Notes</h1>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </Button>
      </div>

      {/* Tombol Tambah */}
      <div className="mb-6 flex gap-4">
        <Button
          onClick={() => {
            resetForm();
            setIsDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Tambah Catatan
        </Button>
      </div>

      {/* Daftar Notes per kategori */}
      <div className="space-y-8">
        {Object.keys(groupedNotes).map((catId) => {
          const category =
            categories.find((c) => c.id === catId) || {
              id: "uncategorized",
              name: "Tanpa Kategori",
            };

          const pinnedNotes = groupedNotes[catId].filter((n) => n.pinned);
          const otherNotes = groupedNotes[catId].filter((n) => !n.pinned);

          return (
            <div key={catId}>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">{category.name}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...pinnedNotes, ...otherNotes].map((note) => (
                  <Card
                    key={note.id}
                    className="relative flex flex-col cursor-pointer"
                    style={{ borderLeft: `6px solid ${note.color}` }}
                    onClick={() => {
                      setEditNoteId(note.id);
                      setTitle(note.title);
                      setContent(note.content);
                      setSelectedCategory(note.category_id);
                      setNoteColor(note.color);
                      setIsDialogOpen(true);
                    }}
                  >
                    <CardContent className="p-4 flex flex-col flex-1">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold">{note.title}</h3>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              togglePin(note.id, note.pinned);
                            }}
                          >
                            {note.pinned ? (
                              <PinOff className="h-4 w-4" />
                            ) : (
                              <Pin className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditNoteId(note.id);
                              setTitle(note.title);
                              setContent(note.content);
                              setSelectedCategory(note.category_id);
                              setNoteColor(note.color);
                              setIsDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteNote(note.id);
                            }}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground flex-1 overflow-y-auto max-h-32">
                        {note.content}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Dialog Form Note */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editNoteId ? "Edit Catatan" : "Catatan Baru"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              placeholder="Judul"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Textarea
              placeholder="Isi catatan..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="h-40"
            />
            {/* Pilih kategori + Tambah kategori */}
            <div className="flex gap-2 items-center">
              <Select
                value={selectedCategory || ""}
                onValueChange={(val) => setSelectedCategory(val)}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                placeholder="Kategori baru"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="w-40"
              />
              <Button type="button" onClick={handleAddCategory}>
                +
              </Button>

              {/* Hapus kategori */}
              {selectedCategory && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => handleDeleteCategory(selectedCategory)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Pilih warna catatan */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Warna catatan</label>
              <div className="flex gap-2 flex-wrap">
                {colorPresets.map((color) => (
                  <div key={color} className="relative">
                    <button
                      onClick={() => setNoteColor(color)}
                      className={`h-8 w-8 rounded-full border-2 ${
                        noteColor === color ? "ring-2 ring-offset-2" : ""
                      }`}
                      style={{ backgroundColor: color }}
                      type="button"
                    />
                    <button
                      onClick={() =>
                        setColorPresets(colorPresets.filter((c) => c !== color))
                      }
                      className="absolute -top-1 -right-1 bg-white dark:bg-black rounded-full p-0.5"
                      type="button"
                    >
                      <X className="h-3 w-3 text-red-500" />
                    </button>
                  </div>
                ))}
                <input
                  type="color"
                  value={noteColor}
                  onChange={(e) => setNoteColor(e.target.value)}
                  className="h-8 w-12 cursor-pointer rounded border"
                  onBlur={() => {
                    if (!colorPresets.includes(noteColor)) {
                      setColorPresets([...colorPresets, noteColor]);
                    }
                  }}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveNote}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
