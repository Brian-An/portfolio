import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Socials from "@/components/Socials";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const siteUrl = "https://www.brianan.ca";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Brian An",
    template: "%s | Brian An",
  },
  description:
    "Brian An is a Computer Science and Finance student at the University of Waterloo.",
  keywords: [
    "Brian An",
    "Software Developer",
    "Web Developer",
    "University of Waterloo",
    "Computer Science",
    "Finance",
    "Portfolio",
    "Full Stack Developer",
    "React",
    "Next.js",
    "TypeScript",
  ],
  authors: [{ name: "Brian An", url: siteUrl }],
  creator: "Brian An",
  publisher: "Brian An",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Brian An",
    title: "Brian An | Software Engineer",
    description:
      "Computer Science and Finance student at the University of Waterloo.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "vCUjTKOAXOXyTsa-Z7Pu1_EF31gML2tsDeyDmLcJ5R8",
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Brian An",
  url: siteUrl,
  description:
    "Computer Science and Finance student at the University of Waterloo.",
};

const profileJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  mainEntity: {
    "@type": "Person",
    name: "Brian An",
    url: siteUrl,
    jobTitle: "Software Developer",
    description:
      "Computer Science and Finance student at the University of Waterloo",
    email: "brian.an1@uwaterloo.ca",
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "University of Waterloo",
      url: "https://uwaterloo.ca",
    },
    sameAs: [
      "https://www.linkedin.com/in/brian-an06/",
      "https://github.com/Brian-An",
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd).replace(/</g, "\\u003c") }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(profileJsonLd).replace(/</g, "\\u003c") }}
        />
      </head>
      <body className={`${geist.variable} antialiased`}>
        <div className="site-frame">
          {children}
          <footer className="site-footer site-shell">
            <Socials />
          </footer>
        </div>
      </body>
    </html>
  );
}
