"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
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
} from "lucide-react";

import { supabase } from "@/lib/supabaseClient";
import { useEffect } from "react";


type Category = {
  id: string;
  name: string;
};

type Note = {
  id: string;
  title: string;
  content: string;
  pinned: boolean;
  categoryId: string | null;
  color: string;
};

export default function NotesPage() {
  const { theme, setTheme } = useTheme();

  const [categories, setCategories] = useState<Category[]>([
    { id: "1", name: "Pribadi" },
    { id: "2", name: "Kerja" },
  ]);

  const [notes, setNotes] = useState<Note[]>([]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [noteColor, setNoteColor] = useState("#60a5fa");
  const [newCategoryName, setNewCategoryName] = useState("");

  const [editNoteId, setEditNoteId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
  const fetchData = async () => {
    const { data: categoriesData } = await supabase.from("categories").select("*");
    const { data: notesData } = await supabase.from("notes").select("*");

    if (categoriesData) setCategories(categoriesData);
    if (notesData) setNotes(notesData);
  };
  fetchData();
}, []);


  // Tambah / Edit note
  const handleSaveNote = async () => {
  if (title.trim() === "" && content.trim() === "") return;

  if (editNoteId) {
    // Update ke supabase
    await supabase
      .from("notes")
      .update({
        title,
        content,
        category_id: selectedCategory,
        color: noteColor,
      })
      .eq("id", editNoteId);

    setNotes((prev) =>
      prev.map((n) =>
        n.id === editNoteId
          ? { ...n, title, content, categoryId: selectedCategory, color: noteColor }
          : n
      )
    );
  } else {
    // Insert ke supabase
    const { data, error } = await supabase
      .from("notes")
      .insert([
        {
          title,
          content,
          pinned: false,
          category_id: selectedCategory,
          color: noteColor,
        },
      ])
      .select()
      .single();

    if (data) {
      setNotes([data as Note, ...notes]);
    }
  }

  resetForm();
  setIsDialogOpen(false);
};


  const handleDeleteNote = async (id: string) => {
  await supabase.from("notes").delete().eq("id", id);
  setNotes((prev) => prev.filter((n) => n.id !== id));
};


  const togglePin = (id: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n))
    );
  };

  const handleAddCategory = async () => {
  if (newCategoryName.trim() === "") return;

  const { data } = await supabase
    .from("categories")
    .insert([{ name: newCategoryName }])
    .select()
    .single();

  if (data) {
    setCategories([...categories, data as Category]);
    setSelectedCategory(data.id);
  }

  setNewCategoryName("");
};


  const resetForm = () => {
    setTitle("");
    setContent("");
    setSelectedCategory(null);
    setNoteColor("#60a5fa");
    setEditNoteId(null);
    setNewCategoryName("");
  };

  // Kelompokkan notes per kategori
  const groupedNotes: { [key: string]: Note[] } = {};
  notes.forEach((note) => {
    const key = note.categoryId || "uncategorized";
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
      <div className="mb-6">
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
              <h2 className="text-lg font-semibold mb-3">{category.name}</h2>
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
                      setSelectedCategory(note.categoryId);
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
                              togglePin(note.id);
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
                              setSelectedCategory(note.categoryId);
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
            </div>
            {/* Pilih warna catatan */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Warna catatan</label>
              <div className="flex gap-2 flex-wrap">
                {["#f87171", "#60a5fa", "#34d399", "#facc15", "#a78bfa", "#9ca3af"].map(
                  (color) => (
                    <button
                      key={color}
                      onClick={() => setNoteColor(color)}
                      className={`h-8 w-8 rounded-full border-2 ${
                        noteColor === color ? "ring-2 ring-offset-2" : ""
                      }`}
                      style={{ backgroundColor: color }}
                      type="button"
                    />
                  )
                )}
                <input
                  type="color"
                  value={noteColor}
                  onChange={(e) => setNoteColor(e.target.value)}
                  className="h-8 w-12 cursor-pointer rounded border"
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
