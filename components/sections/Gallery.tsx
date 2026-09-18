"use client";

import { useState } from "react";
import Image from "next/image";
import * as motion from "motion/react-client";
import { galleryPhotos, type GalleryPhoto } from "@/constants/gallery";
import Lightbox from "@/components/Lightbox";

export default function Gallery() {
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);

  if (galleryPhotos.length === 0) {
    return (
      <motion.div
        className="mt-2 mb-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <p className="text-muted-foreground text-sm">
          &gt; photos coming soon...
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="mt-2 mb-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="columns-2 sm:columns-3 gap-3">
        {galleryPhotos.map((photo, index) => (
          <motion.button
            type="button"
            aria-label={`Open photo: ${photo.alt}`}
            key={photo.src}
            className="block w-full mb-3 break-inside-avoid cursor-pointer overflow-hidden rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            initial={{ opacity: 0, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: (index % 6) * 0.06 }}
            whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
            onClick={() => setSelectedPhoto(photo)}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              width={400}
              height={300}
              sizes="(max-width: 639px) calc((100vw - 44px) / 2), (max-width: 799px) calc((100vw - 56px) / 3), 248px"
              quality={75}
              priority={index < 6}
              className="w-full h-auto hover:brightness-105 transition-[filter] duration-200"
            />
          </motion.button>
        ))}
      </div>

      <Lightbox photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />
    </motion.div>
  );
}
