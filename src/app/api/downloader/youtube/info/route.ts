import { NextResponse } from "next/server";
import { create } from "youtube-dl-exec";
import path from "path";
import fs from "fs";

export async function POST(request: Request) {
    try {
        const { url } = await request.json();

        if (!url) {
            return NextResponse.json(
                { error: "URL is required" },
                { status: 400 }
            );
        }

        const binaryPath = path.join(process.cwd(), "bin", "yt-dlp");
        console.log("Binary path:", binaryPath);

        if (!fs.existsSync(binaryPath)) {
            console.error("Binary not found at:", binaryPath);
            return NextResponse.json(
                { error: "Server configuration error: yt-dlp binary not found" },
                { status: 500 }
            );
        }

        const youtubedl = create(binaryPath);

        // Use youtube-dl-exec to fetch video info
        const output = await youtubedl(url, {
            dumpSingleJson: true,
            noCheckCertificates: true,
            noWarnings: true,
            preferFreeFormats: true,
            addHeader: ["referer:youtube.com", "user-agent:googlebot"],
        });

        // Filter and map formats
        // @ts-ignore - output type is any
        const formats = output.formats
            .filter((f: any) => {
                // Keep all formats that have at least video or audio
                return f.vcodec !== "none" || f.acodec !== "none";
            })
            .map((format: any) => {
                let qualityLabel = "Unknown";
                if (format.vcodec !== "none") {
                    qualityLabel = `${format.height}p`;
                    if (format.fps > 30) {
                        qualityLabel += `60`;
                    }
                } else if (format.acodec !== "none") {
                    qualityLabel = "Audio Only";
                }

                return {
                    itag: format.format_id,
                    qualityLabel: qualityLabel,
                    container: format.ext,
                    hasAudio: format.acodec !== "none",
                    hasVideo: format.vcodec !== "none",
                    url: format.url,
                    height: format.height || 0,
                    fps: format.fps || 0,
                    filesize: format.filesize || format.filesize_approx || 0
                };
            });

        // Deduplicate: Keep only the best format for each qualityLabel + container
        const uniqueFormats = new Map();
        formats.forEach((format: any) => {
            // Group by quality (e.g. 1080p, 720p, Audio Only)
            // We ignore container for grouping because we will likely convert/merge to a standard container (mp4/mkv)
            // Actually, let's keep container distinction if it's audio only (m4a vs webm)
            // For video, we usually want mp4/mkv.

            let key = format.qualityLabel;
            if (!format.hasVideo) {
                key += `-${format.container}`;
            }

            if (!uniqueFormats.has(key)) {
                uniqueFormats.set(key, format);
            } else {
                const existing = uniqueFormats.get(key);

                // Preference logic:
                // 1. Prefer formats with Audio (native) over Video-only (requires merge)
                if (format.hasAudio && !existing.hasAudio) {
                    uniqueFormats.set(key, format);
                    return;
                }
                if (existing.hasAudio && !format.hasAudio) {
                    return;
                }

                // 2. Prefer higher bitrate/filesize
                if (format.filesize > existing.filesize) {
                    uniqueFormats.set(key, format);
                }
            }
        });

        const cleanedFormats = Array.from(uniqueFormats.values());

        // Sort by quality (resolution desc, then fps desc)
        cleanedFormats.sort((a: any, b: any) => {
            if (b.height !== a.height) {
                return b.height - a.height;
            }
            return b.fps - a.fps;
        });

        const videoDetails = {
            // @ts-ignore
            title: output.title,
            // @ts-ignore
            thumbnail: output.thumbnail,
            // @ts-ignore
            lengthSeconds: output.duration,
            // @ts-ignore
            author: output.uploader,
            formats: cleanedFormats,
        };

        return NextResponse.json(videoDetails);
    } catch (error: any) {
        console.error("Error fetching video info:", error);
        // Return a JSON error even if it crashes
        return NextResponse.json(
            { error: error.message || "Failed to fetch video information" },
            { status: 500 }
        );
    }
}
