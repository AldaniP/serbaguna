import { NextResponse } from "next/server";
import play from "play-dl";

interface VideoFormat {
    itag: string;
    qualityLabel: string;
    container: string;
    hasAudio: boolean;
    hasVideo: boolean;
    url: string;
    height: number;
    fps: number;
    filesize: number;
}

export async function POST(request: Request) {
    try {
        const { url } = await request.json();

        if (!url) {
            return NextResponse.json(
                { error: "URL is required" },
                { status: 400 }
            );
        }

        // Validate YouTube URL
        if (!play.yt_validate(url) || play.yt_validate(url) !== "video") {
            return NextResponse.json(
                { error: "Invalid YouTube URL" },
                { status: 400 }
            );
        }

        // Fetch video info using play-dl
        const info = await play.video_info(url);

        if (!info) {
            return NextResponse.json(
                { error: "Could not fetch video information" },
                { status: 500 }
            );
        }

        const videoDetails = info.video_details;

        // Extract and map formats
        const formats: VideoFormat[] = info.format
            .map((format) => {
                let qualityLabel = "Unknown";

                if (format.qualityLabel) {
                    qualityLabel = format.qualityLabel;
                } else if (format.quality) {
                    qualityLabel = format.quality;
                }

                // Determine if format has audio/video based on properties
                const hasVideo = !!(format.width && format.height);
                const hasAudio = !!format.audioQuality || !!format.mimeType?.includes("audio");

                return {
                    itag: format.itag?.toString() || "",
                    qualityLabel: qualityLabel,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    container: (format as any).container || format.mimeType?.split(";")?.[0]?.split("/")?.[1] || "unknown",
                    hasAudio: hasAudio,
                    hasVideo: hasVideo,
                    url: format.url || "",
                    height: format.height || 0,
                    fps: format.fps || 0,
                    filesize: format.contentLength ? parseInt(format.contentLength, 10) : 0
                };
            })
            .filter((f) => f.hasVideo || f.hasAudio); // Keep only formats with video or audio

        // Deduplicate: Keep only the best format for each quality level
        const uniqueFormats = new Map<string, VideoFormat>();
        formats.forEach((format) => {
            let key = format.qualityLabel;

            // For audio-only, include container in key
            if (!format.hasVideo) {
                key += `-${format.container}`;
            }

            if (!uniqueFormats.has(key)) {
                uniqueFormats.set(key, format);
            } else {
                const existing = uniqueFormats.get(key)!;

                // Preference logic:
                // 1. Prefer formats with both audio and video
                if (format.hasAudio && format.hasVideo && !(existing.hasAudio && existing.hasVideo)) {
                    uniqueFormats.set(key, format);
                    return;
                }
                if (existing.hasAudio && existing.hasVideo && !(format.hasAudio && format.hasVideo)) {
                    return;
                }

                // 2. Prefer higher filesize (usually better quality)
                if (format.filesize > existing.filesize) {
                    uniqueFormats.set(key, format);
                }
            }
        });

        const cleanedFormats = Array.from(uniqueFormats.values());

        // Sort by quality (resolution desc, then fps desc)
        cleanedFormats.sort((a, b) => {
            if (b.height !== a.height) {
                return b.height - a.height;
            }
            return b.fps - a.fps;
        });

        const response = {
            title: videoDetails.title || "Unknown",
            thumbnail: videoDetails.thumbnails?.[videoDetails.thumbnails.length - 1]?.url || "",
            lengthSeconds: videoDetails.durationInSec || 0,
            author: videoDetails.channel?.name || "Unknown",
            formats: cleanedFormats,
        };

        return NextResponse.json(response);
    } catch (error: unknown) {
        console.error("Error fetching video info:", error);
        const errorMessage = error instanceof Error ? error.message : "Failed to fetch video information";
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}
