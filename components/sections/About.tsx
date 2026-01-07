"use client";

import Link from "next/link";
import Image from "next/image";

export default function About() {
  return (
    <div className="max-w-xl flex flex-col gap-2 mt-2 mb-2">
      <div>
        <h1 className="font-semibold mb-1">currently:</h1>
        <div>
          <div className="flex items-center gap-1">
            <span>&gt; computer science and finance student at </span>
            <span>
              <Link
                href="https://uwaterloo.ca/computing-financial-management/"
                target="_blank"
                className="font-semibold text-decoration: underline flex items-center gap-1"
              >
                <Image
                  src="/logo/uwaterloo_logo.png"
                  alt="University of Waterloo logo"
                  width={16}
                  height={16}
                  className="inline-block"
                />
                university of waterloo
              </Link>
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span>&gt; software developer at </span>
            <span>
              <Link
                href="https://www.uwdatascience.ca/"
                target="_blank"
                className="font-semibold text-decoration: underline flex items-center gap-1"
              >
                <Image
                  src="/logo/uwdsc_logo.png"
                  alt="University of Waterloo Data Science Club logo"
                  width={16}
                  height={16}
                  className="inline-block"
                />
                university of waterloo data science club
              </Link>
            </span>
          </div>
        </div>
      </div>
      <div>
        <h1 className="font-semibold mb-1">previously:</h1>
        <div>
          <div className="flex items-center gap-1">
            <span>&gt; applied ai intern at </span>
            <span>
              <Link
                href="https://www.rogers.com/"
                target="_blank"
                className="font-semibold text-decoration: underline flex items-center gap-1"
              >
                <Image
                  src="/logo/rogers_communications_logo.svg"
                  alt="Rogers Communications logo"
                  width={16}
                  height={16}
                  className="inline-block"
                />
                rogers communications
              </Link>
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span>&gt; software developer intern at </span>
            <span>
              <Link
                href="https://www.touchbistro.com/"
                target="_blank"
                className="font-semibold text-decoration: underline flex items-center gap-1"
              >
                <Image
                  src="/logo/touchbistro_logo.jpeg"
                  alt="TouchBistro logo"
                  width={16}
                  height={16}
                  className="inline-block"
                />
                touchbistro
              </Link>
            </span>
          </div>
        </div>
      </div>
      <div>
        <h1 className="font-semibold mb-1">personal stuff:</h1>
        <div>
          <p>&gt; i love playing volleyball and golfing with my friends</p>
          <div>
            <span>&gt; i enjoy making content at </span>
            <span className="font-semibold">@imbrianan</span>
            <span> on </span>
            <span>
              <Link
                href="https://www.instagram.com/imbrianan"
                target="_blank"
                className="font-semibold text-decoration: underline"
              >
                instagram
              </Link>
            </span>
            <span> and </span>
            <span>
              <Link
                href="https://www.tiktok.com/@imbrianan"
                target="_blank"
                className="font-semibold text-decoration: underline"
              >
                tiktok
              </Link>
            </span>
          </div>
          <p>&gt; i love trying new foods lmk if you have any recs</p>
          <p>
            &gt; feel free to reach out! always open to connecting with new
            people
          </p>
        </div>
      </div>
    </div>
  );
}
