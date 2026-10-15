"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { galleryPhotos, type GalleryPhoto } from "@/constants/gallery";
import Lightbox from "@/components/Lightbox";

export default function Gallery() {
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
  return (
    <section className="gallery-section" aria-labelledby="gallery-title">
      <Link href="/" className="back-link">Back</Link>
      <h1 id="gallery-title">Photography</h1>
      <div className="photo-grid">
        {galleryPhotos.map((photo, index) => (
          <button
            type="button"
            aria-label={`Open photo: ${photo.location}, ${photo.date}`}
            key={photo.src}
            className="gallery-photo"
            onClick={() => setSelectedPhoto(photo)}
          >
            <span className="gallery-image"><Image src={photo.src} alt={`${photo.location}, ${photo.date}`} width={photo.width} height={photo.height} sizes="(max-width: 600px) 100vw, (max-width: 900px) 45vw, 340px" quality={75} loading={index < 3 ? "eager" : "lazy"} /></span>
            <span className="photo-caption">{photo.date} · {photo.location}</span>
          </button>
        ))}
      </div>
      <Lightbox photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />
    </section>
  );
}
