import { NextResponse } from "next/server";
import play from "play-dl";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");
    const itag = searchParams.get("itag");

    if (!url) {
        return NextResponse.json({ error: "Invalid YouTube URL" }, { status: 400 });
    }

    if (!itag) {
        return NextResponse.json({ error: "Missing format ID" }, { status: 400 });
    }

    // Validate YouTube URL
    if (!play.yt_validate(url) || play.yt_validate(url) !== "video") {
        return NextResponse.json({ error: "Invalid YouTube URL" }, { status: 400 });
    }

    try {
        // Extract Video ID
        const videoId = play.extractID(url);
        console.log("Extracted Video ID:", videoId);

        // Use play-dl stream method with Video ID
        // Note: play-dl stream() usually takes URL or ID. We use ID to be safe.
        const stream = await play.stream(videoId, {
            quality: parseInt(itag, 10)
        });

        if (!stream) {
            return NextResponse.json({ error: "Failed to get video stream" }, { status: 500 });
        }

        // Get video info for filename
        const info = await play.video_info(url);

        // Sanitize filename
        let filename = info?.video_details.title
            ?.replace(/[^\w\s\-\.]/gi, "")
            .replace(/\s+/g, "_")
            .substring(0, 100) || "video";

        // Find format to get extension
        const format = info?.format.find(f => f.itag?.toString() === itag);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const ext = (format as any)?.container || format?.mimeType?.split(";")?.[0]?.split("/")?.[1] || "mp4";
        filename = `${filename}.${ext}`;

        // Convert Node.js Readable stream to Web ReadableStream
        const webStream = new ReadableStream({
            async start(controller) {
                stream.stream.on("data", (chunk: Buffer) => {
                    controller.enqueue(chunk);
                });

                stream.stream.on("end", () => {
                    controller.close();
                });

                stream.stream.on("error", (err: Error) => {
                    console.error("Stream error:", err);
                    controller.error(err);
                });
            },
            cancel() {
                stream.stream.destroy();
            },
        });

        return new NextResponse(webStream, {
            headers: {
                "Content-Disposition": `attachment; filename="${filename}"`,
                "Content-Type": stream.type || "application/octet-stream",
            },
        });

    } catch (error: unknown) {
        console.error("Download error:", error);
        const errorMessage = error instanceof Error ? error.message : "Failed to download video";
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}
