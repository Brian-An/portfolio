"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const COLS = 120;
const DENSITY = " .:-=+*#%@";
const CHAR_ASPECT = 0.55;

export default function AsciiCamera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [ascii, setAscii] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [started, setStarted] = useState(false);
  const [error, setError] = useState(false);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = videoRef.current!;
      video.srcObject = stream;
      await video.play();

      const videoAspect = video.videoWidth / video.videoHeight;
      const rows = Math.floor(COLS / videoAspect * CHAR_ASPECT);

      const canvas = canvasRef.current!;
      canvas.width = COLS;
      canvas.height = rows;
      const ctx = canvas.getContext("2d")!;

      setStarted(true);

      function render() {
        ctx.setTransform(-1, 0, 0, 1, COLS, 0);
        ctx.drawImage(video, 0, 0, COLS, rows);
        const { data } = ctx.getImageData(0, 0, COLS, rows);
        let result = "";
        for (let y = 0; y < rows; y++) {
          for (let x = 0; x < COLS; x++) {
            const i = (y * COLS + x) * 4;
            const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
            const charIndex = Math.floor(
              (brightness / 255) * (DENSITY.length - 1)
            );
            result += DENSITY[charIndex];
          }
          result += "\n";
        }
        setAscii(result);
        animRef.current = requestAnimationFrame(render);
      }

      animRef.current = requestAnimationFrame(render);
    } catch {
      setError(true);
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    return () => {
      cancelAnimationFrame(animRef.current);
      if (video?.srcObject) {
        (video.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const handleOpen = () => {
    setOpen(true);
    if (!started) {
      startCamera();
    }
  };

  return (
    <>
      {/* Hidden elements always in DOM so refs work */}
      <video ref={videoRef} className="hidden" muted playsInline />
      <canvas ref={canvasRef} className="hidden" />

      {/* Fixed bottom-right tab/panel */}
      <div className="fixed bottom-3 right-3 z-50 max-w-[calc(100vw-1.5rem)] sm:bottom-4 sm:right-4">
        {open ? (
          <div className="rounded border border-border bg-white shadow-lg">
            <div className="flex items-center justify-between border-b border-border px-2 py-1">
              <span className="font-serif text-[10px] text-muted-foreground">ascii cam</span>
              <button
                onClick={() => setOpen(false)}
                className="cursor-pointer font-serif text-[10px] text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>
            {error ? (
              <div className="px-4 py-6 text-center font-serif text-xs text-muted-foreground">
                camera access denied
              </div>
            ) : (
              <pre className="select-none overflow-hidden whitespace-pre rounded-b bg-black font-mono text-[2.5px] leading-[3px] text-white/80 sm:text-[3.5px] sm:leading-[4px]">
                {ascii}
              </pre>
            )}
          </div>
        ) : (
          <button
            onClick={handleOpen}
            className="cursor-pointer rounded border border-border bg-white px-3 py-2 font-serif text-xs text-muted-foreground shadow-lg transition-colors hover:bg-gray-50 hover:text-foreground"
          >
            click me for a surprise
          </button>
        )}
      </div>
    </>
  );
}
