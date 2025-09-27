"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const allTools = [
  { name: "Calculator", path: "/tools/calculator" },
  { name: "Notes", path: "/tools/notes" },
  { name: "To-Do List", path: "/tools/todolist" },
];

export default function HomePage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [pinned, setPinned] = useState<string[]>([]);

  // Mark as mounted (biar hydration match)
  useEffect(() => {
    setMounted(true);

    const saved = localStorage.getItem("pinnedTools");
    if (saved) {
      setPinned(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("pinnedTools", JSON.stringify(pinned));
    }
  }, [pinned, mounted]);

  const togglePin = (toolName: string) => {
    setPinned((prev) =>
      prev.includes(toolName)
        ? prev.filter((t) => t !== toolName)
        : [...prev, toolName]
    );
  };

  const pinnedTools = allTools.filter((t) => pinned.includes(t.name));
  const otherTools = allTools.filter((t) => !pinned.includes(t.name));

  return (
    <main className="min-h-screen flex flex-col items-center bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6">
      {/* Header */}
      <header className="w-full flex justify-between items-center max-w-4xl mb-10">
        <h1 className="text-3xl font-bold">🔧 Serbaguna</h1>

        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-sm"
          >
            {theme === "dark" ? "🌞 Light" : "🌙 Dark"}
          </button>
        )}
      </header>

      {/* Pinned Tools */}
      {mounted && pinnedTools.length > 0 && (
        <section className="w-full max-w-4xl mb-10">
          <h2 className="text-xl font-semibold mb-4">📌 Pinned Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pinnedTools.map((tool) => (
              <div
                key={tool.path}
                className="p-6 rounded-2xl shadow-md bg-white dark:bg-gray-800 hover:shadow-lg transition-all border border-gray-200 dark:border-gray-700 relative"
              >
                <Link href={tool.path}>
                  <h3 className="text-lg font-semibold">{tool.name}</h3>
                  <p className="text-sm opacity-70 mt-1">
                    Klik untuk membuka {tool.name}
                  </p>
                </Link>
                <button
                  onClick={() => togglePin(tool.name)}
                  className="absolute top-2 right-2 text-yellow-500"
                >
                  ★
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* All Tools */}
      <section className="w-full max-w-4xl">
        <h2 className="text-xl font-semibold mb-4">🧰 Semua Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {otherTools.map((tool) => (
            <div
              key={tool.path}
              className="p-6 rounded-2xl shadow-md bg-white dark:bg-gray-800 hover:shadow-lg transition-all border border-gray-200 dark:border-gray-700 relative"
            >
              <Link href={tool.path}>
                <h3 className="text-lg font-semibold">{tool.name}</h3>
                <p className="text-sm opacity-70 mt-1">
                  Klik untuk membuka {tool.name}
                </p>
              </Link>
              {mounted && (
                <button
                  onClick={() => togglePin(tool.name)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-yellow-500"
                >
                  ☆
                </button>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
