export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="portfolio-viewport">
      <div className="site-shell">
        <a href="#main-content" className="skip-link">Skip to content</a>
        <main id="main-content">{children}</main>
      </div>
    </div>
  );
}
