import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { spawn } from "child_process";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");
    const itag = searchParams.get("itag");
    const hasVideo = searchParams.get("hasVideo") === "true";
    const hasAudio = searchParams.get("hasAudio") === "true";

    if (!url) {
        return NextResponse.json({ error: "Invalid YouTube URL" }, { status: 400 });
    }

    if (!itag) {
        return NextResponse.json({ error: "Missing format ID" }, { status: 400 });
    }

    const binaryPath = path.join(process.cwd(), "bin", "yt-dlp");
    if (!fs.existsSync(binaryPath)) {
        return NextResponse.json(
            { error: "Server configuration error: yt-dlp binary not found" },
            { status: 500 }
        );
    }

    try {
        // Determine format argument
        // If it's video-only, we merge with best audio
        let formatArg = itag;
        let isMerging = false;

        if (hasVideo && !hasAudio) {
            formatArg = `${itag}+bestaudio`;
            isMerging = true;
        }

        // 1. Get Filename
        const filenameArgs = [
            url,
            "--get-filename",
            "-f", formatArg,
            "--no-warnings",
            "--no-check-certificates",
        ];

        if (isMerging) {
            filenameArgs.push("--merge-output-format", "mp4");
        }

        const filenameProcess = spawn(binaryPath, filenameArgs);
        let filenameData = "";

        await new Promise((resolve, reject) => {
            filenameProcess.stdout.on("data", (data) => {
                filenameData += data.toString();
            });
            filenameProcess.on("close", (code) => {
                if (code === 0) resolve(null);
                else reject(new Error("Failed to get filename"));
            });
        });

        let filename = filenameData.trim();
        // Sanitize filename
        filename = filename.replace(/[^\w\s\-\.]/gi, "").replace(/\s+/g, " ");
        if (!filename) filename = "video.mp4";

        // 2. Start Streaming
        const streamArgs = [
            url,
            "-f", formatArg,
            "-o", "-", // Stream to stdout
            "--no-warnings",
            "--no-check-certificates",
            "--prefer-free-formats",
            "--add-header", "referer:youtube.com",
            "--add-header", "user-agent:googlebot"
        ];

        if (isMerging) {
            streamArgs.push("--merge-output-format", "mp4");
        }

        const ytProcess = spawn(binaryPath, streamArgs);

        // Create a ReadableStream from the child process stdout
        const stream = new ReadableStream({
            start(controller) {
                ytProcess.stdout.on("data", (chunk) => {
                    controller.enqueue(chunk);
                });
                ytProcess.stdout.on("end", () => {
                    controller.close();
                });
                ytProcess.stdout.on("error", (err) => {
                    controller.error(err);
                });
                ytProcess.stderr.on("data", (data) => {
                    // Log stderr but don't break stream unless it's fatal
                    console.log("yt-dlp stderr:", data.toString());
                });
            },
            cancel() {
                ytProcess.kill();
            },
        });

        return new NextResponse(stream, {
            headers: {
                "Content-Disposition": `attachment; filename="${filename}"`,
                "Content-Type": "application/octet-stream",
            },
        });

    } catch (error: any) {
        console.error("Download error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to download video" },
            { status: 500 }
        );
    }
}
