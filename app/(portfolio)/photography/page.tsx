import type { Metadata } from "next";
import Gallery from "@/components/sections/Gallery";

export const metadata: Metadata = {
  title: "Photography",
  description: "A collection of Brian An's travel and everyday photography.",
  alternates: { canonical: "/photography" },
  openGraph: {
    title: "Photography | Brian An",
    description: "A collection of Brian An's travel and everyday photography.",
    url: "/photography",
    type: "website",
    siteName: "Brian An",
  },
};

export default function PhotographyPage() {
  return <Gallery />;
}
