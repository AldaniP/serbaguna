"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function SummarizeTool() {
  const [inputText, setInputText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState("id");

  const { theme, setTheme } = useTheme();

  const handleSummarize = async () => {
    setLoading(true);
    setSummary("");

    const res = await fetch("/api/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: inputText, lang }),
    });

    const data = await res.json();

    if (data?.output) {
      setSummary(data.output.join("\n")); // output biasanya array → gabung string
    } else {
      setSummary("Error: gagal membuat ringkasan.");
    }

    setLoading(false);
  };

  return (
    <div className="p-4 space-y-4">
      {/* 🔹 Header */}
      <div className="flex items-center justify-between mb-6">
        <Link href="/">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Summarize</h1>
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

      {/* 🔹 Input */}
      <textarea
        className="w-full p-2 border rounded"
        rows={6}
        placeholder="Masukkan teks panjang di sini..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />

      {/* 🔹 Pilih bahasa */}
      <select
        value={lang}
        onChange={(e) => setLang(e.target.value)}
        className="p-2 border rounded"
      >
        <option value="id">Indonesia</option>
        <option value="en">English</option>
      </select>

      {/* 🔹 Tombol */}
      <button
        onClick={handleSummarize}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        {loading ? "Merangkum..." : "Rangkum"}
      </button>

      {/* 🔹 Hasil ringkasan */}
      {summary && (
        <div className="mt-4 p-3 border rounded bg-gray-50 dark:bg-gray-800">
          <strong>Summary:</strong>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
}
