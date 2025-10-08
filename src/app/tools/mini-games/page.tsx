"use client";
import Link from "next/link";
import { Sun, Moon, ArrowLeft, Gamepad2, MousePointerClick, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

export default function MiniGameHub() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const games = [
    {
      title: "Tebak Angka",
      href: "/tools/mini-games/number-guess",
      color: "from-blue-500 to-indigo-500",
      icon: <Gamepad2 className="h-6 w-6" />,
    },
    {
      title: "Quiz Cepat",
      href: "/tools/mini-games/quick-quiz",
      color: "from-green-500 to-emerald-500",
      icon: <HelpCircle className="h-6 w-6" />,
    },
    {
      title: "Klik Cepat",
      href: "/tools/mini-games/click-speed",
      color: "from-purple-500 to-pink-500",
      icon: <MousePointerClick className="h-6 w-6" />,
    },
    {
      title: "Snake",
      href: "/tools/mini-games/snake",
      color: "from-purple-500 to-pink-500",
      icon: <MousePointerClick className="h-6 w-6" />,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-extrabold tracking-tight">🎮 Mini Game Hub</h1>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </Button>
      </div>

      {/* Games List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {games.map((game) => (
          <Link key={game.title} href={game.href}>
            <div
              className={`rounded-2xl p-6 text-white shadow-md bg-gradient-to-r ${game.color} 
                          flex items-center justify-between cursor-pointer transition-transform hover:scale-105`}
            >
              <div>
                <h2 className="text-xl font-semibold">{game.title}</h2>
                <p className="text-sm opacity-80">Klik untuk bermain</p>
              </div>
              {game.icon}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
