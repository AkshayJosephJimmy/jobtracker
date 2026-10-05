const C = {
  bg: "#0b0d11",
  panel: "#12151b",
  panel2: "#171b23",
  line: "#232833",
  ink: "#eceae4",
  ink2: "#a9aeba",
  ink3: "#6f7788",
  lime: "#b8ff3c",
  limeBg: "#182008",
  limeLine: "#3d5a14",
} as const;

const F = {
  mono: "var(--font-jetbrains-mono), monospace",
  sans: "var(--font-plus-jakarta), system-ui, sans-serif",
  head: "var(--font-bricolage), sans-serif",
} as const;

export default function Home() {



  return (
    <div style={{ backgroundColor: C.bg, fontFamily: F.sans, color: C.ink }}>
      {/* ---------------- NAV ---------------- */}
      <header
        className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto"
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: C.lime }}
          >
            <span className="text-base font-extrabold" style={{ color: C.bg, fontFamily: F.head }}>
              J
            </span>
          </div>
          <span className="text-lg font-extrabold tracking-tight" style={{ fontFamily: F.head }}>
            Hunt
          </span>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/login"
            className="text-[13px] font-semibold px-3 py-2"
            style={{ color: C.ink2 }}
          >
            Log in
          </a>
          <a
            href="/dashboard"
            className="text-[13px] font-bold px-4 py-2 rounded-[8px] transition-colors"
            style={{ backgroundColor: C.lime, color: C.bg }}
          >
            Go to dashboard
          </a>
        </div>
      </header>

      {/* ---------------- HERO ---------------- */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-20 text-center">
        <div
          className="inline-block text-[10px] font-bold tracking-widest px-3 py-1 rounded-full mb-5"
          style={{ backgroundColor: C.limeBg, border: `1px solid ${C.limeLine}`, color: C.lime, fontFamily: F.mono }}
        >
          JOB HUNTING, TRACKED
        </div>

        {/* TODO: Replace with your own headline */}
        <h1
          className="text-4xl sm:text-5xl font-extrabold tracking-tight max-w-3xl mx-auto"
          style={{ fontFamily: F.head }}
        >
          Get your job applications organized and under control with JHunt.
        </h1>

        {/* TODO: Replace with your own subheading / pitch */}
        <p
          className="text-[15px] max-w-xl mx-auto mt-4"
          style={{ color: C.ink2 }}
        >
          Your supporting sentence or two about what Hunt does and why it helps goes here.
        </p>

        <div className="flex items-center justify-center gap-3 mt-8">
          <a
            href="/dashboard"
            className="text-[14px] font-bold px-5 py-3 rounded-[9px] transition-colors"
            style={{ backgroundColor: C.lime, color: C.bg }}
          >
            Go to dashboard →
          </a>
          <a
            href="/signup"
            className="text-[14px] font-semibold px-5 py-3 rounded-[9px]"
            style={{ backgroundColor: C.panel2, border: `1px solid ${C.line}`, color: C.ink }}
          >
            Create an account
          </a>
        </div>
      </section>

      {/* ---------------- DEMO VIDEO ---------------- */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <div className="text-center mb-8">
          <div className="text-[10px] font-bold tracking-widest mb-2" style={{ color: C.lime, fontFamily: F.mono }}>
            SEE IT IN ACTION
          </div>
          {/* TODO: Replace with your own section heading */}
          <h2 className="text-2xl font-extrabold" style={{ fontFamily: F.head }}>
            How to use Hunt
          </h2>
          {/* TODO: Replace with a short intro line for the video, if you want one */}
          <p className="text-[14px] mt-2" style={{ color: C.ink2 }}>
            A quick walkthrough of the workflow.
          </p>
        </div>

        <div
          className="w-full aspect-video rounded-[14px] overflow-hidden flex items-center justify-center"
          style={{ backgroundColor: C.panel, border: `1px solid ${C.line}` }}
        >
          {/*
            TODO: Put your demo video here. For example:

            <video
              className="w-full h-full object-cover"
              src="/videos/demo.mp4"
              controls
              poster="/videos/demo-poster.jpg"
            />

            or embed a YouTube/Vimeo iframe instead of the placeholder below.
          */}
          <span className="text-[13px]" style={{ color: C.ink3, fontFamily: F.mono }}>
            VIDEO GOES HERE
          </span>
        </div>
      </section>

      {/* ---------------- HOW TO USE EFFECTIVELY ---------------- */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="text-center mb-10">
          <div className="text-[10px] font-bold tracking-widest mb-2" style={{ color: C.lime, fontFamily: F.mono }}>
            GET THE MOST OUT OF IT
          </div>
          {/* TODO: Replace with your own section heading */}
          <h2 className="text-2xl font-extrabold" style={{ fontFamily: F.head }}>
            How to use this effectively
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* TODO: Replace the three tips below with your own (copy/paste the block for more) */}
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="rounded-[12px] p-5"
              style={{ backgroundColor: C.panel, border: `1px solid ${C.line}` }}
            >
              <div
                className="w-7 h-7 rounded-[7px] flex items-center justify-center text-[12px] font-bold mb-3"
                style={{ backgroundColor: C.limeBg, color: C.lime, fontFamily: F.mono }}
              >
                {n}
              </div>
              {/* TODO: Tip title */}
              <h3 className="text-[14px] font-bold mb-1.5">Tip title</h3>
              {/* TODO: Tip description */}
              <p className="text-[13px]" style={{ color: C.ink2 }}>
                Tip description goes here.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- FEATURES COMING SOON ---------------- */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="text-center mb-10">
          <div className="text-[10px] font-bold tracking-widest mb-2" style={{ color: C.lime, fontFamily: F.mono }}>
            ON THE ROADMAP
          </div>
          {/* TODO: Replace with your own section heading */}
          <h2 className="text-2xl font-extrabold" style={{ fontFamily: F.head }}>
            Features coming soon
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* TODO: Replace the four placeholders below with your own upcoming features (copy/paste the block for more) */}
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="rounded-[12px] p-5"
              style={{ backgroundColor: C.panel2, border: `1px solid ${C.line}` }}
            >
              <div
                className="inline-block text-[9px] font-bold tracking-widest px-2 py-0.5 rounded-full mb-3"
                style={{ backgroundColor: C.panel, color: C.ink3, fontFamily: F.mono, border: `1px solid ${C.line}` }}
              >
                SOON
              </div>
              {/* TODO: Feature title */}
              <h3 className="text-[14px] font-bold mb-1.5">Feature title</h3>
              {/* TODO: Feature description */}
              <p className="text-[13px]" style={{ color: C.ink2 }}>
                Feature description goes here.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- FOOTER CTA ---------------- */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div
          className="rounded-[16px] p-10 text-center"
          style={{ backgroundColor: C.panel, border: `1px solid ${C.line}` }}
        >
          {/* TODO: Replace with your own closing line */}
          <h2 className="text-xl font-extrabold mb-4" style={{ fontFamily: F.head }}>
            Ready to get organized?
          </h2>
          <a
            href="/dashboard"
            className="inline-block text-[14px] font-bold px-5 py-3 rounded-[9px]"
            style={{ backgroundColor: C.lime, color: C.bg }}
          >
            Go to dashboard →
          </a>
        </div>
      </section>

      <footer className="px-6 py-6 text-center">
        <span className="text-[12px]" style={{ color: C.ink3 }}>
          Hunt — job hunting, tracked.
        </span>
      </footer>
    </div>
  );
}
