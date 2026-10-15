"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import type { GalleryPhoto } from "@/constants/gallery";

interface LightboxProps {
  photo: GalleryPhoto | null;
  onClose: () => void;
}

export default function Lightbox({ photo, onClose }: LightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!photo) return;
    const dialog = dialogRef.current;
    if (!dialog) return;

    const savedOverflow = document.body.style.overflow;
    const savedPosition = document.body.style.position;
    const savedWidth = document.body.style.width;
    const savedTop = document.body.style.top;
    const scrollY = window.scrollY;

    dialog.showModal();
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
    document.body.style.top = `-${scrollY}px`;

    return () => {
      dialog.close();
      document.body.style.overflow = savedOverflow;
      document.body.style.position = savedPosition;
      document.body.style.width = savedWidth;
      document.body.style.top = savedTop;
      window.scrollTo(0, scrollY);
    };
  }, [photo]);

  return (
    <dialog
      ref={dialogRef}
      aria-label="Photo viewer"
      aria-describedby={photo ? "photo-caption" : undefined}
      className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none border-0 bg-transparent p-0 text-white backdrop:bg-black/80 backdrop:backdrop-blur-sm"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      {photo && (
        <>
          <button
            aria-label="Close photo"
            className="absolute top-4 right-4 z-10 flex size-11 items-center justify-center text-white/70 hover:text-white text-2xl cursor-pointer focus-visible:outline-2 focus-visible:outline-white"
            onClick={onClose}
          >
            ✕
          </button>
          <button
            aria-label="Close photo backdrop"
            tabIndex={-1}
            className="absolute inset-0 cursor-default"
            onClick={onClose}
          />
          <div className="pointer-events-none relative flex h-full flex-col items-center justify-center gap-3">
            <Image
              src={photo.src}
              alt={`${photo.location}, ${photo.date}`}
              width={photo.width}
              height={photo.height}
              sizes="(max-aspect-ratio: 4/3) 90vw, 110vh"
              className="pointer-events-auto max-w-[90vw] max-h-[80dvh] w-auto h-auto object-contain"
            />
            <p id="photo-caption" className="pointer-events-auto text-white/80 text-sm text-center max-w-[90vw] px-4">
              {photo.date} · {photo.location}
            </p>
          </div>
        </>
      )}
    </dialog>
  );
}
