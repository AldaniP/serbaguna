"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableItem from "./sortable-item";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Moon, Sun } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

type Todo = { id: string; text: string; completed: boolean; position?: number };

export default function TodoListPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const { theme, setTheme } = useTheme();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  useEffect(() => {
    const fetchTodos = async () => {
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .order("position", { ascending: true });

      if (error) console.error(error);
      else if (data) setTodos(data);
    };

    fetchTodos();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("serbaguna_todos", JSON.stringify(todos));
    } catch (e) {
      console.error("failed save todos", e);
    }
  }, [todos]);

  const addTodo = async () => {
    if (!newTodo.trim()) return;

    const { data, error } = await supabase
      .from("todos")
      .insert([{ text: newTodo.trim(), completed: false }])
      .select()
      .single();

    if (error) console.error(error);
    else if (data) setTodos((prev) => [data, ...prev]);

    setNewTodo("");
  };

  const toggleTodo = async (id: string, checked?: boolean) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    const newVal = typeof checked === "boolean" ? checked : !todo.completed;

    const { error } = await supabase
      .from("todos")
      .update({ completed: newVal })
      .eq("id", id);

    if (error) console.error(error);
    else {
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: newVal } : t))
      );
    }
  };

  const deleteTodo = async (id: string) => {
    const { error } = await supabase.from("todos").delete().eq("id", id);
    if (error) console.error(error);
    else setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setTodos((prev) => {
      const oldIndex = prev.findIndex((p) => p.id === String(active.id));
      const newIndex = prev.findIndex((p) => p.id === String(over.id));
      if (oldIndex === -1 || newIndex === -1) return prev;

      const newTodos = arrayMove(prev, oldIndex, newIndex);

      // update posisi ke supabase
      newTodos.forEach(async (t, i) => {
        await supabase.from("todos").update({ position: i }).eq("id", t.id);
      });

      return newTodos;
    });
  };

  return (
    <div className="flex flex-col items-center p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 w-full max-w-lg">
        <Link href="/">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">To-Do List</h1>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "light" ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </Button>
      </div>

      <Card className="w-full max-w-lg shadow-lg">
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Input
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Tambahkan todo baru..."
              onKeyDown={(e) => e.key === "Enter" && addTodo()}
            />
            <Button onClick={addTodo}>Tambah</Button>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={todos.map((t) => t.id)}
              strategy={verticalListSortingStrategy}
            >
              <ul className="space-y-2">
                {todos.map((todo) => (
                  <SortableItem
                    key={todo.id}
                    todo={todo}
                    toggleTodo={toggleTodo}
                    deleteTodo={deleteTodo}
                  />
                ))}
              </ul>
            </SortableContext>
          </DndContext>
        </CardContent>
      </Card>
    </div>
  );
}
