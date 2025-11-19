"use client";

import React, { useState } from "react";
import { Download, Loader2, Youtube, AlertCircle, FileVideo } from "lucide-react";

interface VideoFormat {
  itag: number;
  qualityLabel: string;
  container: string;
  hasAudio: boolean;
  hasVideo: boolean;
  filesize: number;
}

interface VideoInfo {
  title: string;
  thumbnail: string;
  lengthSeconds: string;
  author: string;
  formats: VideoFormat[];
}

export default function Downloader() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);

  const fetchVideoInfo = async () => {
    if (!url) return;

    setLoading(true);
    setError("");
    setVideoInfo(null);

    try {
      const response = await fetch("/api/downloader/youtube/info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      let data;
      try {
        data = await response.json();
      } catch (e) {
        throw new Error("Received invalid response from server");
      }

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch video info");
      }

      setVideoInfo(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (format: VideoFormat) => {
    window.location.href = `/api/downloader/youtube/download?url=${encodeURIComponent(url)}&itag=${format.itag}&hasVideo=${format.hasVideo}&hasAudio=${format.hasAudio}`;
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "Unknown size";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-3 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
          <Youtube className="w-8 h-8 text-red-600 dark:text-red-500" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">YouTube Downloader</h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Download YouTube videos in various formats and qualities. Simply paste the URL below to get started.
        </p>
      </div>

      <div className="flex gap-2 max-w-2xl mx-auto">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste YouTube URL here..."
          className="flex-1 p-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:outline-none transition-all"
          onKeyDown={(e) => e.key === "Enter" && fetchVideoInfo()}
        />
        <button
          onClick={fetchVideoInfo}
          disabled={loading || !url}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors flex items-center gap-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Get Info"}
        </button>
      </div>

      {error && (
        <div className="max-w-2xl mx-auto p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3 text-red-700 dark:text-red-400">
          <AlertCircle className="w-5 h-5" />
          <p>{error}</p>
        </div>
      )}

      {videoInfo && (
        <div className="max-w-2xl mx-auto bg-card border rounded-xl overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="aspect-video relative">
            <img
              src={videoInfo.thumbnail}
              alt={videoInfo.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-12">
              <h2 className="text-white font-semibold text-lg line-clamp-2">{videoInfo.title}</h2>
              <p className="text-white/80 text-sm mt-1">{videoInfo.author}</p>
            </div>
          </div>

          <div className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Download className="w-4 h-4" />
              Available Formats
            </h3>

            <div className="space-y-2">
              {videoInfo.formats.map((format) => (
                <div
                  key={format.itag}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors border border-transparent hover:border-border"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-background rounded-md">
                      <FileVideo className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium flex items-center gap-2">
                        {format.qualityLabel || "Audio Only"}
                        <span className="text-xs text-muted-foreground uppercase px-1.5 py-0.5 bg-background rounded border">
                          {format.container}
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format.hasVideo ? "Video + Audio" : "Audio Only"} • {formatBytes(format.filesize)}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDownload(format)}
                    className="px-4 py-2 text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 rounded-md transition-colors"
                  >
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
