"use client";

import { useEffect } from "react";
import Image from "next/image";
import * as motion from "motion/react-client";
import { AnimatePresence } from "motion/react";
import type { GalleryPhoto } from "@/constants/gallery";

interface LightboxProps {
  photo: GalleryPhoto | null;
  onClose: () => void;
}

export default function Lightbox({ photo, onClose }: LightboxProps) {
  useEffect(() => {
    if (!photo) return;

    const savedOverflow = document.body.style.overflow;
    const savedPosition = document.body.style.position;
    const savedWidth = document.body.style.width;
    const savedTop = document.body.style.top;
    const scrollY = window.scrollY;

    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
    document.body.style.top = `-${scrollY}px`;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = savedOverflow;
      document.body.style.position = savedPosition;
      document.body.style.width = savedWidth;
      document.body.style.top = savedTop;
      window.scrollTo(0, scrollY);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [photo, onClose]);

  return (
    <AnimatePresence>
      {photo && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          onClick={onClose}
        >
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white text-2xl cursor-pointer"
            onClick={onClose}
          >
            ✕
          </button>

          <motion.div
            className="flex flex-col items-center gap-3"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              width={4032}
              height={3024}
              unoptimized
              className="max-w-[90vw] max-h-[85vh] w-auto h-auto object-contain rounded-lg"
            />
            {(photo.caption ?? photo.alt) && (
              <p className="text-white/60 text-sm font-serif text-center max-w-[90vw] px-4">
                {photo.caption ?? photo.alt}
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
