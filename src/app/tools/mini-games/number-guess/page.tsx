// app/mini-games/number-guess/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Moon, Sun, RotateCcw } from "lucide-react";
import { useTheme } from "next-themes";

export default function NumberGuessGame() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const [number, setNumber] = useState<number | null>(null);
  const [guess, setGuess] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setMounted(true);
    setNumber(Math.floor(Math.random() * 100) + 1);
  }, []);

  const handleGuess = () => {
    if (number === null) return;
    const g = parseInt(guess);
    if (isNaN(g)) {
      setMessage("⚠️ Masukkan angka valid!");
      return;
    }
    if (g === number) setMessage("🎉 Benar! Kamu menebak dengan tepat!");
    else if (g > number) setMessage("📈 Terlalu tinggi!");
    else setMessage("📉 Terlalu rendah!");
  };

  const handleRestart = () => {
    setNumber(Math.floor(Math.random() * 100) + 1);
    setGuess("");
    setMessage("");
  };

  if (!mounted) return null;

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link href="/tools/mini-games">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Tebak Angka</h1>
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

      {/* Game */}
      <p className="text-lg font-medium">Tebak angka antara 1–100</p>
      <input
        type="number"
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
        className="border w-full p-2 rounded"
        placeholder="Masukkan tebakanmu..."
      />
      <div className="flex gap-2">
        <Button onClick={handleGuess} className="bg-blue-500 text-white">
          Tebak
        </Button>
        <Button
          onClick={handleRestart}
          variant="secondary"
          className="bg-orange-500 text-white flex items-center gap-1"
        >
          <RotateCcw className="h-4 w-4" /> Mulai Ulang
        </Button>
        <Link href="/tools/mini-games">
          <Button variant="secondary" className="bg-gray-500 text-white">
            Kembali
          </Button>
        </Link>
      </div>
      {message && (
        <p
          className={`mt-2 font-semibold ${
            message.includes("Benar")
              ? "text-green-600"
              : message.includes("tinggi")
              ? "text-red-600"
              : message.includes("rendah")
              ? "text-yellow-600"
              : "text-gray-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
