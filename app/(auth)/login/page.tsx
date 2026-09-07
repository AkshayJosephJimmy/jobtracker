"use client";

import { useState, SubmitEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const C = {
  bg: "#0b0d11",
  panel: "#12151b",
  panel2: "#171b23",
  line: "#232833",
  ink: "#eceae4",
  ink2: "#a9aeba",
  ink3: "#6f7788",
  lime: "#b8ff3c",
  limeLine: "#3d5a14",
  red: "#ff7b7f",
} as const;

const F = {
  mono: "var(--font-jetbrains-mono), monospace",
  sans: "var(--font-plus-jakarta), system-ui, sans-serif",
  head: "var(--font-bricolage), sans-serif",
} as const;

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-4 py-12"
      style={{ backgroundColor: C.bg, fontFamily: F.sans }}
    >
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2.5 mb-6">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: C.lime }}
          >
            <span className="text-base font-extrabold" style={{ color: C.bg, fontFamily: F.head }}>
              J
            </span>
          </div>
          <span className="text-xl font-extrabold tracking-tight" style={{ color: C.ink, fontFamily: F.head }}>
            Hunt
          </span>
        </div>

        <div
          className="rounded-xl p-6 sm:p-8"
          style={{ backgroundColor: C.panel, border: `1px solid ${C.line}` }}
        >
          <div className="mb-6">
            <div className="text-[9px] font-bold tracking-widest" style={{ color: C.lime, fontFamily: F.mono }}>
              SYSTEM LOGIN
            </div>
            <h1 className="text-lg font-extrabold mt-1" style={{ color: C.ink, fontFamily: F.head }}>
              Welcome back
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-[10px] font-bold tracking-widest"
                style={{ color: C.ink3, fontFamily: F.mono }}
              >
                EMAIL
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-[13px] px-3 py-2 rounded-[7px] outline-none border"
                style={{
                  backgroundColor: C.panel2,
                  color: C.ink,
                  borderColor: C.line,
                }}
                placeholder="you@domain.com"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="text-[10px] font-bold tracking-widest"
                style={{ color: C.ink3, fontFamily: F.mono }}
              >
                PASSWORD
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-[13px] px-3 py-2 rounded-[7px] outline-none border"
                style={{
                  backgroundColor: C.panel2,
                  color: C.ink,
                  borderColor: C.line,
                }}
                placeholder="********"
              />
            </div>

            {error && (
              <p className="text-[12px] font-medium" style={{ color: C.red }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-1 text-[13px] font-bold tracking-wide py-2.5 rounded-[7px] transition-colors disabled:opacity-50"
              style={{ backgroundColor: C.lime, color: C.bg }}
            >
              {loading ? "SIGNING IN…" : "SIGN IN"}
            </button>
          </form>

          <p className="text-[12.5px] mt-5 text-center" style={{ color: C.ink3 }}>
            Don&apos;t have an account?{" "}
            <a href="/signup" className="font-semibold hover:underline" style={{ color: C.lime }}>
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
