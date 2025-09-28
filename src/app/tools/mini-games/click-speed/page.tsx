"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function ClickSpeedGame() {
  const [timeLeft, setTimeLeft] = useState(5); // durasi game
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // hitung mundur
  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setIsPlaying(false);
    }
  }, [isPlaying, timeLeft]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(5);
    setIsPlaying(true);
  };

  const handleClick = () => {
    if (isPlaying) {
      setScore(score + 1);
    }
  };

  return (
    <div className="p-6 space-y-6 flex flex-col items-center justify-center">
      {/* Header */}
      <div className="flex items-center justify-between w-full max-w-md">
        <Link href="/tools/mini-games">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">⚡ Klik Cepat</h1>
        <div className="w-10" /> {/* biar header balance */}
      </div>

      {/* Info */}
      <div className="text-center space-y-2">
        <p className="text-lg">Klik sebanyak mungkin dalam <b>5 detik</b>!</p>
        <p className="text-2xl font-semibold">
          Waktu: <span className="text-blue-500">{timeLeft}</span> detik
        </p>
        <p className="text-xl">
          Skor: <span className="font-bold text-green-500">{score}</span>
        </p>
      </div>

      {/* Area klik */}
      <button
        onClick={handleClick}
        disabled={!isPlaying}
        className={`w-40 h-40 rounded-full text-white text-xl font-bold transition-transform 
          ${isPlaying ? "bg-pink-500 hover:scale-110" : "bg-gray-400 cursor-not-allowed"}`}
      >
        Klik!
      </button>

      {/* Kontrol */}
      <div>
        {!isPlaying && timeLeft === 0 && (
          <p className="text-lg font-medium">⏱️ Waktu habis! Skor akhir: {score}</p>
        )}
        {!isPlaying && (
          <Button onClick={startGame} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg">
            {timeLeft === 0 ? "Main Lagi" : "Mulai"}
          </Button>
        )}
      </div>
    </div>
  );
}
