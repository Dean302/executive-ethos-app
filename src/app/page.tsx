import { NotifyForm } from "@/components/common/notify-form";

export default function Home() {
  return (
    <div className="cs">
      {/* Ambient depth */}
      <div className="cs__bg" aria-hidden />

      {/* Signature: slow orbital meridian */}
      <svg
        className="cs__rings"
        viewBox="0 0 800 800"
        aria-hidden
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="csFade" cx="50%" cy="50%" r="50%">
            <stop offset="55%" stopColor="#C7A369" stopOpacity="0" />
            <stop offset="100%" stopColor="#C7A369" stopOpacity="0.14" />
          </radialGradient>
        </defs>
        <g className="cs__ring cs__ring--a" stroke="url(#csFade)" fill="none">
          <ellipse cx="400" cy="400" rx="360" ry="360" strokeWidth="1" />
        </g>
        <g className="cs__ring cs__ring--b">
          <ellipse
            cx="400"
            cy="400"
            rx="290"
            ry="120"
            fill="none"
            stroke="rgba(236,231,220,0.10)"
            strokeWidth="1"
          />
        </g>
        <g className="cs__ring cs__ring--c">
          <ellipse
            cx="400"
            cy="400"
            rx="150"
            ry="330"
            fill="none"
            stroke="rgba(199,163,105,0.16)"
            strokeWidth="1"
          />
          <circle className="cs__node" cx="400" cy="70" r="3" fill="#C7A369" />
        </g>
      </svg>

      {/* Top rail */}
      <header className="cs__nav">
        <span className="cs__brand">Executive&nbsp;Ethos</span>
        <span className="cs__status">
          <span className="cs__dot" aria-hidden />
          In development
        </span>
      </header>

      {/* Hero */}
      <main className="cs__main">
        <p className="cs__eyebrow cs__rise" style={{ animationDelay: "0.15s" }}>
          <span className="cs__tick" aria-hidden />
          Arriving 2026 · By invitation
        </p>

        <h1 className="cs__wordmark">
          <span className="cs__wm cs__rise" style={{ animationDelay: "0.3s" }}>
            Executive
          </span>
          <span
            className="cs__wm cs__wm--em cs__rise"
            style={{ animationDelay: "0.42s" }}
          >
            Ethos
          </span>
        </h1>

        <span className="cs__horizon cs__draw" aria-hidden />

        <p className="cs__lede cs__rise" style={{ animationDelay: "0.62s" }}>
          An operating standard for how leaders decide, communicate, and hold
          their line. Composure, made repeatable.
        </p>

        <div className="cs__cta cs__rise" style={{ animationDelay: "0.78s" }}>
          <NotifyForm />
          <p className="cs__note">
            Request early access — one note when the doors open. No noise.
          </p>
        </div>
      </main>

      {/* Foot rail */}
      <footer className="cs__foot cs__rise" style={{ animationDelay: "0.95s" }}>
        <span>© 2026 Executive Ethos</span>
        <span className="cs__foot-tag">The standard, before the scale.</span>
      </footer>
    </div>
  );
}
