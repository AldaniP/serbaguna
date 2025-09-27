"use client";
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { GripVertical, Trash2 } from "lucide-react";

type Todo = { id: string; text: string; completed: boolean };

export default function SortableItem({
  todo,
  toggleTodo,
  deleteTodo,
}: {
  todo: Todo;
  toggleTodo: (id: string, checked?: boolean) => void;
  deleteTodo: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: todo.id,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between p-2 rounded-md border bg-background"
    >
      <div className="flex items-center gap-2">
        {/* HANYA handle (ikon) yang menerima listeners/attributes.
            Jadi checkbox & text tetap bisa di-interact. */}
        <div
          {...attributes}
          {...listeners}
          className="p-2 rounded-md cursor-grab hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="drag-handle"
        >
          <GripVertical className="h-5 w-5" />
        </div>

        <Checkbox
          checked={todo.completed}
          onCheckedChange={(v) => toggleTodo(todo.id, v === true)}
        />

        <span className={`${todo.completed ? "line-through text-gray-500" : ""}`}>
          {todo.text}
        </span>
      </div>

      <Button size="icon" variant="ghost" onClick={() => deleteTodo(todo.id)}>
        <Trash2 className="h-5 w-5 text-red-500" />
      </Button>
    </li>
  );
}
