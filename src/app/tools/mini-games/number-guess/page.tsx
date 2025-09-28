"use client";
import { useState } from "react";
import Link from "next/link";

export default function NumberGuessGame() {
  const [number] = useState(Math.floor(Math.random() * 100) + 1);
  const [guess, setGuess] = useState("");
  const [message, setMessage] = useState("");

  const handleGuess = () => {
    const g = parseInt(guess);
    if (g === number) setMessage("🎉 Benar!");
    else if (g > number) setMessage("Terlalu tinggi!");
    else setMessage("Terlalu rendah!");
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Tebak Angka 1–100</h2>
      <input
        type="number"
        value={guess}
        onChange={e => setGuess(e.target.value)}
        className="border p-2 rounded"
      />
      <div className="space-x-2">
        <button onClick={handleGuess} className="px-4 py-2 bg-blue-500 text-white rounded">Tebak</button>
        <Link href="/mini-games">
          <button className="px-4 py-2 bg-gray-500 text-white rounded">Kembali</button>
        </Link>
      </div>
      <p>{message}</p>
    </div>
  );
}
