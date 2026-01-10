"use client";

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-white">
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100" />

      {/* Animated floating shapes */}
      <div className="absolute top-1/4 -left-20 h-96 w-96 animate-blob rounded-full bg-gray-300 opacity-60 blur-3xl" />
      <div className="absolute top-1/3 -right-20 h-96 w-96 animate-blob animation-delay-2000 rounded-full bg-gray-300 opacity-50 blur-3xl" />
      <div className="absolute -bottom-20 left-1/3 h-96 w-96 animate-blob animation-delay-4000 rounded-full bg-gray-300 opacity-55 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 h-80 w-80 animate-blob animation-delay-3000 rounded-full bg-gray-300 opacity-45 blur-3xl" />
      <div className="absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 animate-blob animation-delay-1000 rounded-full bg-gray-200 opacity-70 blur-3xl" />

      {/* Subtle grain overlay for texture */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}
