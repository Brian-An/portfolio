"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { RotateCcw, Eraser } from "lucide-react";
import * as motion from "motion/react-client";

const COLORS = [
  "#000000", // Black
  "#EF4444", // Red
  "#F97316", // Orange
  "#EAB308", // Yellow
  "#22C55E", // Green
  "#3B82F6", // Blue
  "#8B5CF6", // Purple
  "#EC4899", // Pink
];

const GRID_SIZE = 20;

// Using lucide-react icons (RotateCcw, Eraser)

export default function DrawingCanvas() {
  const gridCanvasRef = useRef<HTMLCanvasElement>(null);
  const drawCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [isEraser, setIsEraser] = useState(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  const drawGrid = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      ctx.strokeStyle = "#e5e5e5";
      ctx.lineWidth = 1;

      // Calculate grid to fit evenly (guard against zero)
      const cols = Math.max(1, Math.floor(width / GRID_SIZE));
      const rows = Math.max(1, Math.floor(height / GRID_SIZE));
      const actualGridWidth = width / cols;
      const actualGridHeight = height / rows;

      // Draw vertical lines
      for (let i = 0; i <= cols; i++) {
        const x = Math.round(i * actualGridWidth);
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Draw horizontal lines
      for (let i = 0; i <= rows; i++) {
        const y = Math.round(i * actualGridHeight);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    },
    []
  );

  const initCanvas = useCallback(() => {
    const gridCanvas = gridCanvasRef.current;
    const drawCanvas = drawCanvasRef.current;
    if (!gridCanvas || !drawCanvas) return;

    const gridCtx = gridCanvas.getContext("2d");
    const drawCtx = drawCanvas.getContext("2d");
    if (!gridCtx || !drawCtx) return;

    // Set canvas size
    const rect = gridCanvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    // Setup grid canvas
    gridCanvas.width = rect.width * dpr;
    gridCanvas.height = rect.height * dpr;
    gridCtx.scale(dpr, dpr);
    gridCtx.fillStyle = "#ffffff";
    gridCtx.fillRect(0, 0, rect.width, rect.height);
    drawGrid(gridCtx, rect.width, rect.height);

    // Setup drawing canvas
    drawCanvas.width = rect.width * dpr;
    drawCanvas.height = rect.height * dpr;
    drawCtx.scale(dpr, dpr);
  }, [drawGrid]);

  const clearDrawing = useCallback(() => {
    const drawCanvas = drawCanvasRef.current;
    if (!drawCanvas) return;

    const ctx = drawCanvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
  }, []);

  useEffect(() => {
    initCanvas();

    const handleResize = () => {
      initCanvas();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [initCanvas]);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();

    if ("touches" in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }

    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    lastPos.current = getPos(e);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;

    const canvas = drawCanvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !lastPos.current) return;

    const pos = getPos(e);

    if (isEraser) {
      // Use destination-out to erase (make transparent)
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.moveTo(lastPos.current.x, lastPos.current.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.strokeStyle = "rgba(0,0,0,1)";
      ctx.lineWidth = 20;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();
      ctx.globalCompositeOperation = "source-over";
    } else {
      ctx.beginPath();
      ctx.moveTo(lastPos.current.x, lastPos.current.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.strokeStyle = selectedColor;
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();
    }

    lastPos.current = pos;
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    lastPos.current = null;
  };

  const resetCanvas = () => {
    clearDrawing();
  };

  const selectColor = (color: string) => {
    setSelectedColor(color);
    setIsEraser(false);
  };

  const toggleEraser = () => {
    setIsEraser(!isEraser);
  };

  return (
    <motion.div
      className="w-full mt-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
    >
      <h1 className="font-semibold mb-2">doodle here:</h1>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 mb-2">
        {/* Color palette */}
        <div className="flex items-center gap-1">
          {COLORS.map((color) => (
            <button
              key={color}
              onClick={() => selectColor(color)}
              className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${
                selectedColor === color && !isEraser
                  ? "border-foreground scale-110"
                  : "border-transparent"
              }`}
              style={{ backgroundColor: color }}
              aria-label={`Select ${color} color`}
            />
          ))}
        </div>

        <div className="h-6 w-px bg-border mx-1" />

        {/* Eraser button */}
        <button
          onClick={toggleEraser}
          className={`p-1.5 rounded-md border transition-colors ${
            isEraser
              ? "bg-foreground text-background border-foreground"
              : "bg-background text-foreground border-border hover:bg-muted"
          }`}
          aria-label="Eraser"
        >
          <Eraser size={16} />
        </button>

        {/* Reset button */}
        <button
          onClick={resetCanvas}
          className="p-1.5 rounded-md border border-border bg-background text-foreground hover:bg-muted transition-colors"
          aria-label="Reset canvas"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      {/* Canvas - two layers: grid (bottom) and drawing (top) */}
      <div className="border border-border rounded-lg overflow-hidden relative">
        <canvas ref={gridCanvasRef} className="w-full h-48" />
        <canvas
          ref={drawCanvasRef}
          className="w-full h-48 cursor-crosshair touch-none absolute top-0 left-0"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>
    </motion.div>
  );
}
