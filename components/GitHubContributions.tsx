"use client";

import { useEffect, useRef, useState } from "react";

type Contribution = { date: string; count: number; level: number };

function isContribution(day: unknown): day is Contribution {
  if (!day || typeof day !== "object") return false;
  const { date, count, level } = day as Partial<Contribution>;
  return typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)
    && !Number.isNaN(Date.parse(date)) && new Date(date).toISOString().slice(0, 10) === date
    && typeof count === "number" && Number.isSafeInteger(count) && count >= 0
    && typeof level === "number" && Number.isInteger(level) && level >= 0 && level <= 4;
}

const monthFormat = new Intl.DateTimeFormat("en", { month: "short", timeZone: "UTC" });
const dateFormat = new Intl.DateTimeFormat("en", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });

export default function GitHubContributions() {
  const [activity, setActivity] = useState<Contribution[] | "loading" | "error">("loading");
  const sectionRef = useRef<HTMLElement>(null);
  const [width, setWidth] = useState(680);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry.contentRect.width > 0) setWidth(entry.contentRect.width);
    });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    const timeout = setTimeout(() => controller.abort(), 10000);

    async function load() {
      try {
        const response = await fetch("https://github-contributions-api.jogruber.de/v4/Brian-An?y=last", { signal: controller.signal });
        if (!response.ok) throw new Error("GitHub activity is unavailable");
        const data: unknown = await response.json();
        if (!data || typeof data !== "object" || !("contributions" in data)
          || !Array.isArray(data.contributions) || !data.contributions.length
          || data.contributions.length > 400 || !data.contributions.every(isContribution)) {
          throw new Error("Invalid contribution data");
        }
        const days = data.contributions.sort((a, b) => a.date.localeCompare(b.date));
        if (days.some((day, index) => index > 0 && Date.parse(day.date) - Date.parse(days[index - 1].date) !== 86400000)) {
          throw new Error("Incomplete contribution data");
        }
        if (active) setActivity(days);
      } catch {
        if (active) setActivity("error");
      } finally {
        clearTimeout(timeout);
      }
    }

    void load();
    return () => {
      active = false;
      clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  const days = Array.isArray(activity) ? activity : null;
  const total = days?.reduce((sum, day) => sum + day.count, 0) ?? 0;
  const offset = days ? new Date(days[0].date).getUTCDay() : 0;
  const weeks = Math.ceil(((days?.length ?? 0) + offset) / 7);
  const showWeekdays = width >= 540;
  const left = showWeekdays ? 28 : 0;
  const pitch = days ? (width - left) / weeks : 12;
  const height = 28 + 7 * pitch;
  const summary = `${total.toLocaleString("en")} ${total === 1 ? "contribution" : "contributions"} in the last year`;

  return (
    <section ref={sectionRef} className="contributions-section" aria-labelledby="contributions-title">
      <div className="contributions-heading">
        <h2 id="contributions-title"><a className="inline-link" href="https://github.com/Brian-An" target="_blank" rel="noopener noreferrer">Contributions</a></h2>
        {days && <p className="contributions-count">{summary}</p>}
      </div>
      {days ? (
        <>
          <div className="contributions-calendar">
            <svg className="contributions-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`GitHub contributions: ${summary}`}>
              {showWeekdays && [1, 3, 5].map((day, index) => <text key={day} x="0" y={24 + day * pitch + pitch * .7}>{["Mon", "Wed", "Fri"][index]}</text>)}
              {days.map((day, index) => {
                const date = new Date(day.date);
                const x = left + Math.floor((index + offset) / 7) * pitch;
                const y = 24 + date.getUTCDay() * pitch;
                const labelMonth = width >= 400 || date.getUTCMonth() % 2 === 1;
                return (
                  <g key={day.date}>
                    {labelMonth && (date.getUTCDate() === 1 || (index === 0 && date.getUTCDate() <= 14 && (width < 400 || pitch >= 12))) && <text x={Math.min(x, width - 22)} y="11">{monthFormat.format(date)}</text>}
                    <rect className="contribution-day" data-level={day.level} x={x} y={y} width={pitch * .75} height={pitch * .75} rx={Math.min(2, pitch * .15)}>
                      <title>{day.count ? `${day.count} ${day.count === 1 ? "contribution" : "contributions"}` : "No contributions"} on {dateFormat.format(date)}</title>
                    </rect>
                  </g>
                );
              })}
            </svg>
          </div>
          <div className="contributions-summary">
            <div className="contributions-legend" aria-label="Contribution intensity from less to more">
              <span>Less</span>
              {[0, 1, 2, 3, 4].map(level => <svg key={level} viewBox="0 0 10 10" aria-hidden="true"><rect className="contribution-day" data-level={level} width="10" height="10" rx="2" /></svg>)}
              <span>More</span>
            </div>
          </div>
        </>
      ) : (
        <p className="contributions-placeholder" role="status">{activity === "loading" ? "Loading GitHub activity…" : "Activity is temporarily unavailable."}</p>
      )}
    </section>
  );
}
