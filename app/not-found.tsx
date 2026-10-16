import Link from "next/link";
import WanderingTraveler from "@/components/WanderingTraveler";

export default function NotFound() {
  return (
    <main className="lost-page">
      <WanderingTraveler />
      <div className="lost-copy">
        <p className="lost-code">404</p>
        <h1>Looks like you’re lost</h1>
        <Link href="/" className="inline-link">Go back home</Link>
      </div>
    </main>
  );
}
