"use client";

import { useEffect, useState, useRef } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Moon, Sun, RotateCcw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

export default function SnakeGame() {
  const { theme, setTheme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [boardSize, setBoardSize] = useState(20); // Jumlah kotak per sisi
  const [gridSize, setGridSize] = useState(20); // Ukuran tiap kotak (px)
  const [snake, setSnake] = useState([{ x: 5, y: 5 }]);
  const [food, setFood] = useState({ x: 10, y: 10 });
  const [dir, setDir] = useState<Direction>("RIGHT");
  const dirRef = useRef<Direction>("RIGHT");
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const foodRef = useRef(food);

  const canvasSize = 400;

  // Update grid size ketika ukuran papan berubah
  useEffect(() => {
    setGridSize(canvasSize / boardSize);
  }, [boardSize]);

  // Sinkronisasi referensi arah & makanan
  useEffect(() => {
    foodRef.current = food;
  }, [food]);
  useEffect(() => {
    dirRef.current = dir;
  }, [dir]);

  // 🎨 Gambar permainan
  const drawGame = (snakeBody: any[], foodPos: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isDark = theme === "dark";
    ctx.fillStyle = isDark ? "#111827" : "#f9fafb";
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    // Grid
    ctx.strokeStyle = isDark ? "#1f2937" : "#e5e7eb";
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= boardSize; i++) {
      ctx.beginPath();
      ctx.moveTo(i * gridSize, 0);
      ctx.lineTo(i * gridSize, canvasSize);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i * gridSize);
      ctx.lineTo(canvasSize, i * gridSize);
      ctx.stroke();
    }

    // Makanan
    ctx.fillStyle = "#ef4444";
    ctx.fillRect(
      foodPos.x * gridSize + 1,
      foodPos.y * gridSize + 1,
      gridSize - 2,
      gridSize - 2
    );

    // Ular
    snakeBody.forEach((segment, i) => {
      ctx.fillStyle = i === 0 ? "#22c55e" : "#4ade80";
      ctx.fillRect(
        segment.x * gridSize + 1,
        segment.y * gridSize + 1,
        gridSize - 2,
        gridSize - 2
      );
    });
  };

  // 🕹️ Logika utama permainan
  const gameLoop = () => {
    setSnake((prev) => {
      const newSnake = [...prev];
      const head = { ...newSnake[0] };
      const currentDir = dirRef.current;

      // Gerakkan kepala ular
      if (currentDir === "UP") head.y -= 1;
      if (currentDir === "DOWN") head.y += 1;
      if (currentDir === "LEFT") head.x -= 1;
      if (currentDir === "RIGHT") head.x += 1;

      // 🚀 FITUR TEMBUS DINDING
      if (head.x < 0) head.x = boardSize - 1;
      if (head.x >= boardSize) head.x = 0;
      if (head.y < 0) head.y = boardSize - 1;
      if (head.y >= boardSize) head.y = 0;

      // Cek tabrakan dengan diri sendiri
      if (newSnake.some((s) => s.x === head.x && s.y === head.y)) {
        setIsGameOver(true);
        if (gameLoopRef.current) clearInterval(gameLoopRef.current);
        return prev;
      }

      newSnake.unshift(head);

      // Cek makanan
      const currentFood = foodRef.current;
      if (head.x === currentFood.x && head.y === currentFood.y) {
        setScore((s) => s + 10);

        // Tentukan makanan baru di posisi kosong
        let newFood: { x: number; y: number };
        do {
          newFood = {
            x: Math.floor(Math.random() * boardSize),
            y: Math.floor(Math.random() * boardSize),
          };
        } while (newSnake.some((s) => s.x === newFood.x && s.y === newFood.y));

        setFood(newFood);
      } else {
        newSnake.pop(); // Tidak makan, jadi buang ekor
      }

      return newSnake;
    });
  };

  // 🔁 Jalankan game loop
  useEffect(() => {
    if (isGameOver) return;
    gameLoopRef.current = setInterval(gameLoop, 120);
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [isGameOver, boardSize]);

  // 🎮 Kontrol keyboard
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const currentDir = dirRef.current;
      if (e.key === "ArrowUp" && currentDir !== "DOWN") setDir("UP");
      if (e.key === "ArrowDown" && currentDir !== "UP") setDir("DOWN");
      if (e.key === "ArrowLeft" && currentDir !== "RIGHT") setDir("LEFT");
      if (e.key === "ArrowRight" && currentDir !== "LEFT") setDir("RIGHT");
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // Render setiap frame
  useEffect(() => {
    drawGame(snake, food);
  }, [snake, food, theme, gridSize]);

  // Ulangi permainan
  const restartGame = () => {
    setSnake([{ x: 5, y: 5 }]);
    setFood({ x: 10, y: 10 });
    setDir("RIGHT");
    dirRef.current = "RIGHT";
    setScore(0);
    setIsGameOver(false);
  };

  return (
    <div className="min-h-screen p-4 flex flex-col items-center bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="flex items-center justify-between w-full max-w-md mb-4">
        <Link href="/tools/mini-games">
          <Button variant="outline" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">🐍 Snake Game</h1>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "light" ? <Moon /> : <Sun />}
        </Button>
      </div>

      <Card className="w-[420px] flex flex-col items-center p-4 shadow-lg">
        <CardContent className="flex flex-col items-center p-0">
          <canvas
            ref={canvasRef}
            width={canvasSize}
            height={canvasSize}
            className="rounded-lg border-2 border-gray-300 dark:border-gray-700 mb-4"
          />

          <div className="flex items-center gap-3 mb-3">
            <label className="text-sm font-medium">Ukuran papan:</label>
            <select
              value={boardSize}
              onChange={(e) => setBoardSize(Number(e.target.value))}
              className="border rounded-md px-2 py-1 dark:bg-gray-800"
            >
              <option value={15}>15×15</option>
              <option value={20}>20×20</option>
              <option value={25}>25×25</option>
              <option value={30}>30×30</option>
            </select>
          </div>

          <p className="font-semibold text-lg mb-2">
            🎯 Skor: <span className="text-green-600 dark:text-green-400">{score}</span>
          </p>

          {isGameOver && (
            <p className="text-red-500 font-semibold mb-3 text-center">
              💀 Game Over! Tekan "Ulangi" untuk main lagi.
            </p>
          )}

          <Button onClick={restartGame} className="bg-blue-600 text-white hover:bg-blue-700">
            <RotateCcw className="mr-2 h-4 w-4" /> Ulangi
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
