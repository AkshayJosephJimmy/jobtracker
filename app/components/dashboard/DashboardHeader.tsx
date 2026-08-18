"use client";

import { useApplication } from "@/app/context/ApplicationsContext";
import { searchApplications } from "@/app/utility/searchApplications";
import { useRouter } from "next/navigation";
import { useState } from "react";

 function DashboardHeader() {

  const router = useRouter();
  const { application, query ,setQuery} = useApplication();
  

  ;

  return (
    <div
      className="flex items-center gap-4 px-5 py-3"
      style={{ backgroundColor: "#faf8f4", borderBottom: "1px solid rgba(20,18,15,.09)" }}
    >
      <div className="flex items-center gap-2.5">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: "#14120f" }}
        >
          <span
            className="text-sm font-extrabold"
            style={{ color: "#c8ff2e", fontFamily: "var(--font-bricolage), sans-serif" }}
          >
            J
          </span>
        </div>
        <span
          className="text-base font-extrabold tracking-tight"
          style={{ color: "#14120f", fontFamily: "var(--font-bricolage), sans-serif" }}
        >
          Hunt
        </span>
      </div>

      <div className="flex gap-0.5 rounded-[9px] p-0.75" style={{ backgroundColor: "rgba(20,18,15,.06)" }}>
        <div
          className="px-3.5 py-1.5 rounded-[7px] text-[12.5px] font-semibold"
          style={{ backgroundColor: "#fff", color: "#14120f", boxShadow: "0 1px 2px rgba(0,0,0,.08)" }}
        >
          Board
        </div>
        <div onClick={() => router.push("/analytics")} className="px-3.5 py-1.5 rounded-[7px] text-[12.5px] font-medium" style={{ color: "#6b6660" }}>
          Analytics
        </div>
        <div className="px-3.5 py-1.5 rounded-[7px] text-[12.5px] font-medium" style={{ color: "#6b6660" }}>
          Follow-ups
        </div>
      </div>

      <div className="flex-1 flex justify-center">
        <div
          className="flex items-center gap-2 w-80 rounded-[9px] px-3 py-1.5"
          style={{ backgroundColor: "#fff", border: "1px solid rgba(20,18,15,.12)" }}
        >
          <div className="w-3 h-3 rounded-full" style={{ border: "1.6px solid #a8a29a" }} />
          <input
            type="text"
            placeholder="Search applications…"
            className="text-[12.5px] focus:outline-none"
            style={{ color: "#a8a29a" }}
            onChange={(e) => {
              // Handle search input change
              setQuery(e.target.value);
            }}
            value={query}
          />
        </div>
      </div>

      <div
        className="flex items-center gap-2.5 rounded-[10px] pl-3 pr-2 py-1.5"
        style={{ backgroundColor: "#14120f" }}
      >
        <div>
          <div
            className="text-[9.5px] font-bold tracking-widest"
            style={{ color: "#8a857c", fontFamily: "var(--font-jetbrains-mono), monospace" }}
          >
            TODAY&apos;S TARGET
          </div>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span
              className="text-[15px] font-extrabold"
              style={{ color: "#fff", fontFamily: "var(--font-bricolage), sans-serif" }}
            >
              3
            </span>
            <span className="text-[11px] font-semibold" style={{ color: "#6b665e" }}>
              / 5 applied
            </span>
          </div>
        </div>
        <div className="w-24 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,.14)" }}>
          <div
            className="h-full rounded-full"
            style={{ width: "60%", background: "linear-gradient(90deg,#8bd400,#c8ff2e)" }}
          />
        </div>
        <div
          className="flex items-center gap-1 rounded-[7px] px-2 py-1"
          style={{ backgroundColor: "rgba(200,255,46,.14)", border: "1px solid rgba(200,255,46,.3)" }}
        >
          <span className="text-[12px] font-bold" style={{ color: "#c8ff2e" }}>
            🔥 12
          </span>
        </div>
      </div>

      <button
        onClick={() => router.push("/signup")}
        className="w-8 h-8 rounded-full text-[10.5px] font-semibold flex items-center justify-center text-center"
        style={{ backgroundColor: "#e8dcc8", border: "1.5px solid rgba(20,18,15,.12)", color: "#14120f" }}
      >
        ✓
      </button>
    </div>
  );
}

export default DashboardHeader;
