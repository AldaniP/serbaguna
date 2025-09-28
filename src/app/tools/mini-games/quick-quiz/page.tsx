// app/mini-games/quick-quiz/page.tsx
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

type Q = { question: string; options: string[]; answer: string };

export default function QuickQuizGame() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const [questions, setQuestions] = useState<Q[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fallbackUsed, setFallbackUsed] = useState(false);

  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    setErrorMsg(null);
    setFallbackUsed(false);

    try {
      const prompt = `
        Buatkan 3 pertanyaan pilihan ganda seputar pengetahuan umum.
        Setiap pertanyaan memiliki 4 opsi dan tunjukkan jawaban yang benar.
        Format output JSON:
        [
          { "question": "...", "options": ["...", "...", "...", "..."], "answer": "..." },
          ...
        ]
      `;

      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) throw new Error(`API error ${res.status}`);

      const data = await res.json();
      if (!data?.questions || !Array.isArray(data.questions)) {
        throw new Error("Invalid response shape from API");
      }

      setQuestions(data.questions);
      if (data.fallback) setFallbackUsed(true);
    } catch (err: any) {
      setErrorMsg(err?.message ?? String(err));
      const fallback: Q[] = [
        { question: "Apa ibu kota Indonesia?", options: ["Jakarta", "Bandung", "Surabaya", "Medan"], answer: "Jakarta" },
        { question: "Siapa presiden pertama Indonesia?", options: ["Soekarno", "Suharto", "Jokowi", "Habibie"], answer: "Soekarno" },
        { question: "Berapa jumlah pulau di Indonesia?", options: ["17.000", "13.000", "10.000", "5.000"], answer: "17.000" },
      ];
      setQuestions(fallback);
      setFallbackUsed(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentQ(0);
    setScore(0);
    setSelected(null);
    setFinished(false);
  }, [questions]);

  const handleAnswer = (option: string) => {
    setSelected(option);
    if (option === questions[currentQ].answer) setScore((s) => s + 1);
  };

  const handleNext = () => {
    setSelected(null);
    if (currentQ + 1 < questions.length) setCurrentQ((c) => c + 1);
    else setFinished(true);
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
        <h1 className="text-2xl font-bold">Quick Quiz</h1>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </Button>
      </div>

      {loading ? (
        <p>Memuat pertanyaan...</p>
      ) : (
        <>
          {/* Error Message */}
            {errorMsg && (
            <div className="p-3 rounded-md border shadow-sm bg-red-50 dark:bg-red-900 border-red-300 dark:border-red-700">
                <p className="text-sm text-red-800 dark:text-red-100 font-medium">
                Terjadi error saat mengambil pertanyaan: {errorMsg}
                </p>
            </div>
            )}

          {/* Fallback Note */}
            {fallbackUsed && (
            <div className="p-3 rounded-md border shadow-sm bg-blue-50 dark:bg-blue-900 border-blue-300 dark:border-blue-700">
                <p className="text-sm text-blue-800 dark:text-blue-100">
                Catatan: pertanyaan menggunakan <b>fallback</b> (Granite tidak tersedia atau error).
                </p>
            </div>
            )}

          {!finished ? (
            <>
              {questions[currentQ] ? (
                <div className="space-y-3">
                  <p className="font-semibold">
                    Pertanyaan {currentQ + 1} dari {questions.length}
                  </p>
                  <p className="text-lg">{questions[currentQ].question}</p>
                  <div className="space-y-2">
                    {questions[currentQ].options.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleAnswer(option)}
                        disabled={selected !== null}
                        className={`block w-full px-4 py-2 rounded-lg border shadow-sm font-medium transition-colors ${
                          selected === option
                            ? option === questions[currentQ].answer
                              ? "bg-green-600 text-white border-green-700"
                              : "bg-red-600 text-white border-red-700"
                            : "bg-blue-50 hover:bg-blue-100 dark:bg-gray-800 dark:hover:bg-gray-700"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  {selected && (
                    <button
                      onClick={handleNext}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow mt-3"
                    >
                      {currentQ + 1 < questions.length ? "Pertanyaan Berikutnya" : "Lihat Skor"}
                    </button>
                  )}
                </div>
              ) : (
                <p>Tidak ada pertanyaan tersedia.</p>
              )}
            </>
          ) : (
            <div className="space-y-2 text-center">
              <p className="text-xl font-semibold">
                Skor kamu: {score} / {questions.length}
              </p>
              <Link href="/tools/mini-games">
                <button className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg shadow">
                  Kembali ke Hub
                </button>
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
