"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { SpeedInsights } from "@vercel/speed-insights/next";
import { toolsRegistry } from '@/lib/toolsRegistry';
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
const { theme, setTheme } = useTheme();
const [mounted, setMounted] = useState(false);
const [pinned, setPinned] = useState<string[]>([]);

useEffect(() => {
setMounted(true);
const saved = localStorage.getItem("pinnedTools");
if (saved) setPinned(JSON.parse(saved));
}, []);

useEffect(() => {
if (mounted) localStorage.setItem("pinnedTools", JSON.stringify(pinned));
}, [pinned, mounted]);

const togglePin = (toolName: string) => {
setPinned(prev => prev.includes(toolName) ? prev.filter(t => t !== toolName) : [...prev, toolName]);
};

const pinnedTools = toolsRegistry.filter(t => pinned.includes(t.name));
const otherTools = toolsRegistry.filter(t => !pinned.includes(t.name));

return ( <main className="min-h-screen flex flex-col items-center bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6">
{/* Header */} <header className="w-full flex justify-between items-center max-w-4xl mb-10"> <h1 className="text-3xl font-bold">Serbaguna</h1>
{mounted && (
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
)} </header>

  {/* Pinned Tools */}
  {mounted && pinnedTools.length > 0 && (
    <section className="w-full max-w-4xl mb-10">
      <h2 className="text-xl font-semibold mb-4">📌 Pinned Tools</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {pinnedTools.map(tool => (
          <div key={tool.slug} className="relative p-6 rounded-2xl shadow-md bg-white dark:bg-gray-800 hover:shadow-lg transition-all border border-gray-200 dark:border-gray-700">
            <Link href={tool.comingSoon || tool.maintenance ? "#" : `/tools/${tool.slug}`} className={tool.comingSoon || tool.maintenance ? "cursor-not-allowed opacity-50" : ""} title={tool.comingSoon ? "Coming Soon" : tool.maintenance ? "Maintenance" : ""}>
              <h3 className="text-lg font-semibold">{tool.name}</h3>
              <p className="text-sm opacity-70 mt-1">{tool.description}</p>
            </Link>
            {tool.comingSoon && (
              <span className="absolute top-2 right-2 bg-yellow-400 text-black text-xs px-2 py-1 rounded-lg z-10">
                Coming Soon
              </span>
            )}
            {tool.maintenance && (
              <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-lg z-10">
                Maintenance
              </span>
            )}
            <button
              onClick={() => togglePin(tool.name)}
              className="absolute bottom-2 right-2 text-yellow-500"
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
    <h2 className="text-xl font-semibold mb-4">Semua Tools</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {otherTools.map(tool => (
        <div key={tool.slug} className="relative p-6 rounded-2xl shadow-md bg-white dark:bg-gray-800 hover:shadow-lg transition-all border border-gray-200 dark:border-gray-700">
          <Link href={tool.comingSoon || tool.maintenance ? "#" : `/tools/${tool.slug}`} className={tool.comingSoon || tool.maintenance ? "cursor-not-allowed opacity-50" : ""} title={tool.comingSoon ? "Coming Soon" : tool.maintenance ? "Maintenance" : ""}>
            <h3 className="text-lg font-semibold">{tool.name}</h3>
            <p className="text-sm opacity-70 mt-1">{tool.description}</p>
          </Link>
          {tool.comingSoon && (
            <span className="absolute top-2 right-2 bg-yellow-400 text-black text-xs px-2 py-1 rounded-lg z-10">
              Coming Soon
            </span>
          )}
          {tool.maintenance && (
            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-lg z-10">
              Maintenance
            </span>
          )}
          {mounted && (
            <button
              onClick={() => togglePin(tool.name)}
              className="absolute bottom-2 right-2 text-gray-400 hover:text-yellow-500"
            >
              ☆
            </button>
          )}
        </div>
      ))}
    </div>
  </section>
  <SpeedInsights />
</main>

);
}
