"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Sun, Moon, ArrowLeft } from "lucide-react";

// ==================== Helper Functions ====================

// Panjang
const convertLength = (value: number, from: string, to: string) => {
  const factors: Record<string, number> = {
    m: 1,
    cm: 100,
    mm: 1000,
    km: 0.001,
  };
  return (value / factors[from]) * factors[to];
};

// Massa
const convertMass = (value: number, from: string, to: string) => {
  const factors: Record<string, number> = {
    kg: 1,
    g: 1000,
    mg: 1000000,
    ton: 0.001,
  };
  return (value / factors[from]) * factors[to];
};

// Suhu
const convertTemperature = (value: number, from: string, to: string) => {
  if (from === to) return value;
  if (from === "C") {
    if (to === "F") return value * 1.8 + 32;
    if (to === "K") return value + 273.15;
  }
  if (from === "F") {
    if (to === "C") return ((value - 32) * 5) / 9;
    if (to === "K") return ((value - 32) * 5) / 9 + 273.15;
  }
  if (from === "K") {
    if (to === "C") return value - 273.15;
    if (to === "F") return ((value - 273.15) * 9) / 5 + 32;
  }
  return value;
};

// Area
const convertArea = (value: number, from: string, to: string) => {
  const factors: Record<string, number> = {
    m2: 1,
    dm2: 100,
    cm2: 10000,
    mm2: 1000000,
    km2: 0.000001,
  };
  return (value / factors[from]) * factors[to];
};

// Volume
const convertVolume = (value: number, from: string, to: string) => {
  const factors: Record<string, number> = {
    m3: 1,
    dm3: 1000,
    cm3: 1000000,
    mm3: 1000000000,
    L: 1000,
  };
  return (value / factors[from]) * factors[to];
};

// Waktu
const convertTime = (value: number, from: string, to: string) => {
  const factors: Record<string, number> = {
    s: 1,
    min: 1 / 60,
    h: 1 / 3600,
    day: 1 / 86400,
  };
  return (value / factors[from]) * factors[to];
};

// Diskon
const calculateDiscount = (price: number, discount: number) => {
  return price - price * (discount / 100);
};

// Tanggal → Tahun, Bulan, Hari
const dateDifference = (from: string, to: string) => {
  const start = new Date(from);
  const end = new Date(to);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return { years: 0, months: 0, days: 0 };
  }

  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  return { years, months, days };
};

// ==================== Component ====================

export default function ConverterPage() {
  const [type, setType] = useState<string>("");
  const [value, setValue] = useState<number>(0);
  const [fromUnit, setFromUnit] = useState<string>("");
  const [toUnit, setToUnit] = useState<string>("");
  const [result, setResult] = useState<string | null>(null);
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");

  const { theme, setTheme } = useTheme();

  const handleConvert = () => {
    let res: string | number | null = null;

    switch (type) {
      case "length":
        res = convertLength(value, fromUnit, toUnit);
        break;
      case "mass":
        res = convertMass(value, fromUnit, toUnit);
        break;
      case "temperature":
        res = convertTemperature(value, fromUnit, toUnit);
        break;
      case "area":
        res = convertArea(value, fromUnit, toUnit);
        break;
      case "volume":
        res = convertVolume(value, fromUnit, toUnit);
        break;
      case "time":
        res = convertTime(value, fromUnit, toUnit);
        break;
      case "discount":
        res = calculateDiscount(value, Number(toUnit));
        break;
      case "date":
        const diff = dateDifference(dateFrom, dateTo);
        res = `${diff.years} tahun, ${diff.months} bulan, ${diff.days} hari`;
        break;
      default:
        res = null;
    }

    setResult(res !== null ? String(res) : null);
  };

  // Reset hasil jika ganti kategori
  const handleTypeChange = (val: string) => {
    setType(val);
    setResult(null);
    setValue(0);
    setFromUnit("");
    setToUnit("");
    setDateFrom("");
    setDateTo("");
  };

  return (
    <div className="p-4 space-y-4 max-w-xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link href="/">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Konversi</h1>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </Button>
      </div>

      {/* Pilih jenis konversi */}
      <Select onValueChange={handleTypeChange}>
        <SelectTrigger>
          <SelectValue placeholder="Pilih jenis konversi" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="length">Panjang</SelectItem>
          <SelectItem value="mass">Massa</SelectItem>
          <SelectItem value="temperature">Suhu</SelectItem>
          <SelectItem value="area">Area</SelectItem>
          <SelectItem value="volume">Volume</SelectItem>
          <SelectItem value="time">Waktu</SelectItem>
          <SelectItem value="date">Tanggal</SelectItem>
          <SelectItem value="discount">Diskon</SelectItem>
        </SelectContent>
      </Select>

      {/* Form dinamis */}
      {type && (
        <div className="space-y-2 p-4 border rounded-lg">
          {type === "date" ? (
            <>
              <p>Tanggal Awal</p>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
              <p>Tanggal Akhir</p>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </>
          ) : type === "discount" ? (
            <>
              <p>Harga</p>
              <Input
                type="number"
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
              />
              <p>Diskon (%)</p>
              <Input
                type="number"
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
              />
            </>
          ) : (
            <>
              <p>Nilai</p>
              <Input
                type="number"
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
              />
              <div className="flex gap-2">
                <Select onValueChange={setFromUnit}>
                  <SelectTrigger>
                    <SelectValue placeholder="Dari" />
                  </SelectTrigger>
                  <SelectContent>
                    {type === "length" && (
                      <>
                        <SelectItem value="m">Meter</SelectItem>
                        <SelectItem value="cm">Centimeter</SelectItem>
                        <SelectItem value="mm">Milimeter</SelectItem>
                        <SelectItem value="km">Kilometer</SelectItem>
                      </>
                    )}
                    {type === "mass" && (
                      <>
                        <SelectItem value="kg">Kilogram</SelectItem>
                        <SelectItem value="g">Gram</SelectItem>
                        <SelectItem value="mg">Miligram</SelectItem>
                        <SelectItem value="ton">Ton</SelectItem>
                      </>
                    )}
                    {type === "temperature" && (
                      <>
                        <SelectItem value="C">Celsius</SelectItem>
                        <SelectItem value="F">Fahrenheit</SelectItem>
                        <SelectItem value="K">Kelvin</SelectItem>
                      </>
                    )}
                    {type === "area" && (
                      <>
                        <SelectItem value="m2">m²</SelectItem>
                        <SelectItem value="dm2">dm²</SelectItem>
                        <SelectItem value="cm2">cm²</SelectItem>
                        <SelectItem value="mm2">mm²</SelectItem>
                        <SelectItem value="km2">km²</SelectItem>
                      </>
                    )}
                    {type === "volume" && (
                      <>
                        <SelectItem value="m3">m³</SelectItem>
                        <SelectItem value="dm3">dm³</SelectItem>
                        <SelectItem value="cm3">cm³</SelectItem>
                        <SelectItem value="mm3">mm³</SelectItem>
                        <SelectItem value="L">Liter</SelectItem>
                      </>
                    )}
                    {type === "time" && (
                      <>
                        <SelectItem value="s">Detik</SelectItem>
                        <SelectItem value="min">Menit</SelectItem>
                        <SelectItem value="h">Jam</SelectItem>
                        <SelectItem value="day">Hari</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
                <Select onValueChange={setToUnit}>
                  <SelectTrigger>
                    <SelectValue placeholder="Ke" />
                  </SelectTrigger>
                  <SelectContent>
                    {type === "length" && (
                      <>
                        <SelectItem value="m">Meter</SelectItem>
                        <SelectItem value="cm">Centimeter</SelectItem>
                        <SelectItem value="mm">Milimeter</SelectItem>
                        <SelectItem value="km">Kilometer</SelectItem>
                      </>
                    )}
                    {type === "mass" && (
                      <>
                        <SelectItem value="kg">Kilogram</SelectItem>
                        <SelectItem value="g">Gram</SelectItem>
                        <SelectItem value="mg">Miligram</SelectItem>
                        <SelectItem value="ton">Ton</SelectItem>
                      </>
                    )}
                    {type === "temperature" && (
                      <>
                        <SelectItem value="C">Celsius</SelectItem>
                        <SelectItem value="F">Fahrenheit</SelectItem>
                        <SelectItem value="K">Kelvin</SelectItem>
                      </>
                    )}
                    {type === "area" && (
                      <>
                        <SelectItem value="m2">m²</SelectItem>
                        <SelectItem value="dm2">dm²</SelectItem>
                        <SelectItem value="cm2">cm²</SelectItem>
                        <SelectItem value="mm2">mm²</SelectItem>
                        <SelectItem value="km2">km²</SelectItem>
                      </>
                    )}
                    {type === "volume" && (
                      <>
                        <SelectItem value="m3">m³</SelectItem>
                        <SelectItem value="dm3">dm³</SelectItem>
                        <SelectItem value="cm3">cm³</SelectItem>
                        <SelectItem value="mm3">mm³</SelectItem>
                        <SelectItem value="L">Liter</SelectItem>
                      </>
                    )}
                    {type === "time" && (
                      <>
                        <SelectItem value="s">Detik</SelectItem>
                        <SelectItem value="min">Menit</SelectItem>
                        <SelectItem value="h">Jam</SelectItem>
                        <SelectItem value="day">Hari</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <Button onClick={handleConvert} className="w-full mt-2">
            Hitung
          </Button>

          {result && (
            <div className="p-2 border rounded bg-muted">
              <p>Hasil: {result}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
