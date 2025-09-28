// file: src/app/api/summarize/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { text, lang } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    // Buat prediction
    const createRes = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "ibm-granite/granite-3.3-8b-instruct", // cek versi terbaru di replicate
        input: {
          prompt: lang === "id"
                  ? `Anda adalah AI yang hanya boleh menjawab dengan bahasa Indonesia. Tolong ringkas teks berikut dengan singkat dan jelas dalam bahasa Indonesia saja, jangan gunakan bahasa Inggris:\n\n${text}`
                  : `Summarize the following text clearly in English:\n\n${text}`

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
      return NextResponse.json({ output: result.output });
    } else {
      return NextResponse.json({ error: "Summarization failed" }, { status: 500 });
    }
  } catch (error: unknown) {
  if (error instanceof Error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}
