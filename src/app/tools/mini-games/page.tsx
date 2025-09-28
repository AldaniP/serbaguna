"use client";
import Link from "next/link";

export default function MiniGameHub() {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Mini Game Hub</h1>
      <div className="space-y-2">
        <Link href="/mini-games/number-guess">
          <button className="px-4 py-2 bg-blue-500 text-white rounded">Tebak Angka</button>
        </Link>
        <Link href="/mini-games/quick-quiz">
          <button className="px-4 py-2 bg-green-500 text-white rounded">Quiz Cepat</button>
        </Link>
        <Link href="/mini-games/click-speed">
          <button className="px-4 py-2 bg-purple-500 text-white rounded">Klik Cepat</button>
        </Link>
      </div>
    </div>
  );
}
