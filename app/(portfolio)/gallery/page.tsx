import type { Metadata } from "next";
import Gallery from "@/components/sections/Gallery";

export const metadata: Metadata = {
  title: "Gallery",
  description: "A collection of Brian An's travel and everyday photography.",
  alternates: { canonical: "/gallery" },
  openGraph: {
    title: "Gallery | Brian An",
    description: "A collection of Brian An's travel and everyday photography.",
    url: "/gallery",
    type: "website",
    siteName: "Brian An",
  },
};

export default function GalleryPage() {
  return <Gallery />;
}
