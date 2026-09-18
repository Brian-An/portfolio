"use client";

import { useEffect, useRef, useState } from "react";

const COLS = 120;
const DENSITY = " .:-=+*#%@";
const CHAR_ASPECT = 0.55;

function CameraPreview() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ascii, setAscii] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    let cancelled = false;
    let stream: MediaStream | undefined;
    let frame = 0;

    const stop = () => {
      cancelAnimationFrame(frame);
      stream?.getTracks().forEach((track) => track.stop());
      video.srcObject = null;
    };

    const start = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        // Permission can resolve after the panel closes or a new session opens.
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        video.srcObject = stream;
        await video.play();
        if (cancelled) return;

        const rows = Math.floor(COLS / (video.videoWidth / video.videoHeight) * CHAR_ASPECT);
        canvas.width = COLS;
        canvas.height = rows;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas is unavailable");

        const render = () => {
          if (cancelled) return;
          ctx.setTransform(-1, 0, 0, 1, COLS, 0);
          ctx.drawImage(video, 0, 0, COLS, rows);
          const { data } = ctx.getImageData(0, 0, COLS, rows);
          let result = "";
          for (let y = 0; y < rows; y++) {
            for (let x = 0; x < COLS; x++) {
              const i = (y * COLS + x) * 4;
              const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
              result += DENSITY[Math.floor(brightness / 255 * (DENSITY.length - 1))];
            }
            result += "\n";
          }
          setAscii(result);
          frame = requestAnimationFrame(render);
        };
        frame = requestAnimationFrame(render);
      } catch (cause) {
        if (cancelled) return;
        stop();
        setError(cause instanceof DOMException && cause.name === "NotAllowedError"
          ? "camera access denied"
          : "camera unavailable - please try again");
      }
    };

    void start();
    return () => {
      cancelled = true;
      stop();
    };
  }, []);

  return (
    <>
      <video ref={videoRef} className="hidden" muted playsInline />
      <canvas ref={canvasRef} className="hidden" />
      {error || !ascii ? (
        <p role="status" className="px-4 py-6 text-center font-serif text-xs text-muted-foreground">
          {error ?? "starting camera..."}
        </p>
      ) : (
        <pre aria-label="Live ASCII camera preview" className="select-none overflow-hidden whitespace-pre rounded-b bg-black font-mono text-[2.5px] leading-[3px] text-white/80 sm:text-[3.5px] sm:leading-[4px]">
          {ascii}
        </pre>
      )}
    </>
  );
}

export default function AsciiCamera() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-3 right-3 z-50 max-w-[calc(100vw-1.5rem)] sm:bottom-4 sm:right-4">
      {open ? (
        <div className="rounded border border-border bg-white shadow-lg">
          <div className="flex items-center justify-between border-b border-border pl-2">
            <span className="font-serif text-[10px] text-muted-foreground">ascii cam</span>
            <button
              aria-label="Close camera"
              onClick={() => setOpen(false)}
              className="size-8 cursor-pointer font-serif text-xs text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
          </div>
          <CameraPreview />
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="cursor-pointer rounded border border-border bg-white px-3 py-2 font-serif text-xs text-muted-foreground shadow-lg transition-colors hover:bg-gray-50 hover:text-foreground"
        >
          click me for a surprise
        </button>
      )}
    </div>
  );
}
