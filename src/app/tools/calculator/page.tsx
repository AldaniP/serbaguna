"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, ArrowLeft, Sun, Moon } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function CalculatorPage() {
  const { theme, setTheme } = useTheme();
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<{ id: string; expression: string; result: string }[]>([]);

  // Load history dari Supabase
  useEffect(() => {
    const fetchHistory = async () => {
      const { data, error } = await supabase
        .from("calc_history")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) console.error(error);
      else if (data) setHistory(data);
    };

    fetchHistory();
  }, []);

  const handleClick = (value: string) => setInput((prev) => prev + value);
  const handleClearInput = () => setInput("");

  const handleEqual = async () => {
    try {
      const result = eval(input).toString();
      const { data, error } = await supabase
        .from("calc_history")
        .insert([{ expression: input, result }])
        .select()
        .single();

      if (error) console.error(error);
      else if (data) setHistory((prev) => [data, ...prev]);

      setInput(result);
    } catch {
      setInput("Error");
    }
  };

  const handleDeleteOne = async (id: string) => {
    const { error } = await supabase.from("calc_history").delete().eq("id", id);
    if (error) console.error(error);
    else setHistory(history.filter((h) => h.id !== id));
  };

  const handleClearHistory = async () => {
    const { error } = await supabase.from("calc_history").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    if (error) console.error(error);
    else setHistory([]);
  };

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link href="/">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Calculator</h1>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </Button>
      </div>

      {/* Calculator + History */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Calculator */}
        <Card className="p-4">
          <CardContent>
            <div className="mb-2 p-2 rounded bg-muted text-right font-mono text-xl dark:bg-neutral-800">
              {input || "0"}
            </div>

            <div className="grid grid-cols-4 gap-2">
              {["7","8","9","/","4","5","6","*","1","2","3","-","0",".","=","+"].map((btn) => (
                <Button
                  key={btn}
                  variant={btn === "=" ? "default" : "outline"}
                  className="text-lg"
                  onClick={() => (btn === "=" ? handleEqual() : handleClick(btn))}
                >
                  {btn}
                </Button>
              ))}
              <Button
                variant="destructive"
                className="col-span-4"
                onClick={handleClearInput}
              >
                Clear Input
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* History */}
        <Card className="p-4 flex flex-col">
          <CardContent className="flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-semibold">History</h2>
              {history.length > 0 && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleClearHistory}
                >
                  Clear All
                </Button>
              )}
            </div>

            <ul className="space-y-1 text-sm font-mono flex-1 overflow-auto">
              {history.length === 0 && (
                <li className="text-muted-foreground">No history yet</li>
              )}
              {history.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between border-b border-muted pb-1 dark:border-neutral-700"
                >
                  <span>{item.expression} = {item.result}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5"
                    onClick={() => handleDeleteOne(item.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
