// file: src/app/api/quiz/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "No prompt provided" }, { status: 400 });
    }

    // Buat prediction ke IBM Granite
    const createRes = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "ibm-granite/granite-3.3-8b-instruct",
        input: {
          prompt: `Anda adalah AI yang membuat pertanyaan pilihan ganda. Tolong buatkan 3 pertanyaan pengetahuan umum, masing-masing punya 4 opsi, dan berikan jawaban yang benar. Format output JSON:\n\n${prompt}`,
        },
      }),
    });

    const prediction = await createRes.json();

    if (prediction.error) {
      return NextResponse.json({ error: prediction.error }, { status: 500 });
    }

    // Polling sampai selesai
    let result = prediction;
    while (
      result.status !== "succeeded" &&
      result.status !== "failed" &&
      result.status !== "canceled"
    ) {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const pollRes = await fetch(
        `https://api.replicate.com/v1/predictions/${prediction.id}`,
        {
          headers: {
            Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
          },
        }
      );
      result = await pollRes.json();
    }

    if (result.status === "succeeded") {
      let parsed;
      try {
        parsed = JSON.parse(result.output[0]);
      } catch {
        return NextResponse.json(
          { error: "Invalid JSON from Granite", fallback: true },
          { status: 200 }
        );
      }
      return NextResponse.json({ questions: parsed });
    } else {
      return NextResponse.json({ error: "Quiz generation failed", fallback: true }, { status: 500 });
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message, fallback: true }, { status: 500 });
    }
    return NextResponse.json({ error: "Unknown error", fallback: true }, { status: 500 });
  }
}
