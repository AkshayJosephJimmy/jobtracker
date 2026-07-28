"use client";

import { useState, SubmitEvent } from "react";
import { VT323 } from "next/font/google";
import { createClient } from "@/lib/supabase/client";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { prisma } from "@/lib/prisma";

const vt323 = VT323({
  variable: "--font-vt323",
  subsets: ["latin"],
  weight: "400",
});

export default function SignupPage() {

  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
 
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    setError(null);
    

    if (password !== confirmPassword) {
      setError("PASSWORDS DO NOT MATCH");
      return;
    }
    

    setLoading(true);

    const supabase = createClient();
    const { data,error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (!data.session) {
  setError('An account with this email already exists. Please login instead.');
  console.log('Error signing up:', error);
  setLoading(false)
  return
}

    if (data){
      toast.success("ACCOUNT CREATED. CHECK EMAIL TO CONFIRM.");
      router.push("/dashboard");
    }

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    
  }

  return (
    <div
      className={`${vt323.variable} min-h-screen w-full flex items-center justify-center bg-black px-4 py-12 relative overflow-hidden`}
      style={{ fontFamily: "var(--font-vt323), monospace" }}
    >
      {/* CRT scanline overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            "repeating-linear-gradient(0deg, rgba(0,255,70,0.06) 0px, rgba(0,255,70,0.06) 1px, transparent 1px, transparent 3px)",
        }}
      />
      {/* Faint green vignette */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,255,70,0.04) 0%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      <div className="relative z-20 w-full max-w-md">
        <div
          className="border-2 rounded-md p-6 sm:p-8 bg-black"
          style={{
            borderColor: "#00ff46",
            boxShadow:
              "0 0 3px rgba(0,255,70,0.6), 0 0 8px rgba(0,255,70,0.2)",
          }}
        >
          <div className="mb-6 text-center">
            <h1
              className="text-4xl tracking-widest"
              style={{ color: "#00ff46", textShadow: "0 0 3px rgba(0,255,70,0.5)" }}
            >
              JOB_TRACKER
            </h1>
            <p className="text-lg tracking-wide" style={{ color: "#00ff46" }}>
              &gt; NEW USER REGISTRATION
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <label
                htmlFor="email"
                className="text-xl"
                style={{ color: "#00ff46" }}
              >
                &gt; USER_EMAIL:
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-black text-xl px-3 py-2 rounded-sm outline-none border-2 caret-[#00ff46]"
                style={{
                  color: "#00ff46",
                  borderColor: "#00ff46",
                  boxShadow: "inset 0 0 4px rgba(0,255,70,0.15)",
                }}
                placeholder="you@domain.com"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="password"
                className="text-xl"
                style={{ color: "#00ff46" }}
              >
                &gt; PASSWORD:
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-black text-xl px-3 py-2 rounded-sm outline-none border-2 caret-[#00ff46]"
                style={{
                  color: "#00ff46",
                  borderColor: "#00ff46",
                  boxShadow: "inset 0 0 4px rgba(0,255,70,0.15)",
                }}
                placeholder="********"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="confirmPassword"
                className="text-xl"
                style={{ color: "#00ff46" }}
              >
                &gt; CONFIRM_PASSWORD:
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-black text-xl px-3 py-2 rounded-sm outline-none border-2 caret-[#00ff46]"
                style={{
                  color: "#00ff46",
                  borderColor: "#00ff46",
                  boxShadow: "inset 0 0 4px rgba(0,255,70,0.15)",
                }}
                placeholder="********"
              />
            </div>

            {error && (
              <p
                className="text-lg tracking-wide"
                style={{ color: "#ff3b3b", textShadow: "0 0 6px #ff3b3b" }}
              >
                &gt; ERROR: {error}
              </p>
            )}

            

            <button
              type="submit"
              disabled={loading}
              className="mt-2 text-2xl tracking-widest py-2 rounded-sm border-2 transition-colors disabled:opacity-50"
              style={{
                color: "#00ff46",
                borderColor: "#00ff46",
                textShadow: "0 0 3px rgba(0,255,70,0.5)",
                boxShadow: "0 0 4px rgba(0,255,70,0.25)",
              }}
            >
              {loading ? "REGISTERING..." : "[ CREATE ACCOUNT ]"}
              <span className="animate-pulse">_</span>
            </button>
          </form>
          <p >
            Already have an account?{" "}
            <a href="/login" className="text-green-400 hover:underline">
              Log in
            </a>
          </p>
        </div>

        <p
          className="text-center text-lg mt-4 tracking-wide"
          style={{ color: "#00ff46", opacity: 0.7 }}
        >
          &gt; AWAITING INPUT...
        </p>
      </div>
    </div>
  );
}
