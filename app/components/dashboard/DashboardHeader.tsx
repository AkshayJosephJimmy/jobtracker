"use client";

import { useApplication } from "@/app/context/ApplicationsContext";
import { searchApplications } from "@/app/utility/searchApplications";
import { useRouter, usePathname } from "next/navigation";
import { useState,useEffect } from "react";
import {getWeeklyProgress} from "@/app/utility/analytics"
import {createClient} from  "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js";

const C = {
  bg: "#0b0d11",
  panel: "#12151b",
  panel2: "#171b23",
  line: "#232833",
  line2: "#1e232d",
  ink: "#eceae4",
  ink2: "#a9aeba",
  ink3: "#6f7788",
  ink4: "#4a5262",
  lime: "#b8ff3c",
  limeBg: "#182008",
  limeLine: "#3d5a14",
} as const;

const F = {
  mono: "var(--font-jetbrains-mono), monospace",
  sans: "var(--font-plus-jakarta), system-ui, sans-serif",
  head: "var(--font-bricolage), sans-serif",
} as const;

const supabase=createClient()
 function DashboardHeader() {
  const [user,setUser]=useState<User | null>(null);

  useEffect(()=>{

    supabase.auth.getUser().then(
      (response)=>{
        const data=response.data
        const user=data.user
        setUser(user)
        



      }
    ).catch(
      (err)=>{
        throw new Error("cannot get user")
      }
    )

    

  },[])
  console.log(user)
  const name= user?.user_metadata?.full_name
  console.log("username:",name)

  const router = useRouter();
  const pathname = usePathname();
  const { application, query ,setQuery} = useApplication();

  const NAV_ITEMS = [
    { label: "BOARD", path: "/dashboard" },
    { label: "ANALYTICS", path: "/dashboard/analytics" },
   
  ] as const;

  const weekData=getWeeklyProgress(application)
  console.log(weekData)


  ;

  return (
    <div
      className="flex items-center gap-4 px-5 py-3"
      style={{ backgroundColor: C.panel, borderBottom: `1px solid ${C.line}` }}
    >
      <div className="flex items-center gap-2.5">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: C.lime }}
        >
          <span
            className="text-sm font-extrabold"
            style={{ color: C.bg, fontFamily: F.head }}
          >
            J
          </span>
        </div>
        <span
          className="text-base font-extrabold tracking-tight"
          style={{ color: C.ink, fontFamily: F.head }}
        >
          Hunt
        </span>
      </div>

      <div className="flex rounded-[5px] overflow-hidden" style={{ border: `1px solid ${C.line}` }}>
        {NAV_ITEMS.map((item, i) => {
          const isActive = item.path !== null && pathname === item.path;
          return (
            <div
              key={item.label}
              onClick={() => item.path && router.push(item.path)}
              className="px-3.5 py-1.5 text-[11px] font-semibold tracking-wide cursor-pointer transition-colors"
              style={{
                backgroundColor: isActive ? "#1f2430" : "transparent",
                color: isActive ? C.lime : C.ink3,
                fontFamily: F.mono,
                borderLeft: i ? `1px solid ${C.line}` : undefined,
              }}
              onMouseEnter={(e) => {
                if (isActive) return;
                e.currentTarget.style.backgroundColor = C.panel2;
                e.currentTarget.style.color = C.ink;
              }}
              onMouseLeave={(e) => {
                if (isActive) return;
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = C.ink3;
              }}
            >
              {item.label}
            </div>
          );
        })}
      </div>

      <div className="flex-1 flex justify-center">
        <div
          className="flex items-center gap-2 w-80 rounded-[9px] px-3 py-1.5"
          style={{ backgroundColor: C.panel2, border: `1px solid ${C.line}` }}
        >
          <div className="w-3 h-3 rounded-full" style={{ border: `1.6px solid ${C.ink3}` }} />
          <input
            type="text"
            placeholder="Search applications…"
            className="text-[12.5px] focus:outline-none w-full"
            style={{ color: C.ink, fontFamily: F.sans, backgroundColor: "transparent" }}
            onChange={(e) => {
              // Handle search input change
              setQuery(e.target.value);
            }}
            value={query}
          />
        </div>
      </div>

      <div
        className="flex items-center gap-2.5 rounded-[10px] pl-3 pr-2.5 py-1.5"
        style={{ backgroundColor: C.limeBg, border: `1px solid ${C.limeLine}` }}
      >
        <div>
          <div
            className="text-[9.5px] font-bold tracking-widest"
            style={{ color: C.ink3, fontFamily: F.mono }}
          >
            WEEK&apos;S TARGET
          </div>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span
              className="text-[15px] font-extrabold"
              style={{ color: C.ink, fontFamily: F.head }}
            >
              {weekData.applied}
            </span>
            <span className="text-[11px] font-semibold" style={{ color: C.ink3, fontFamily: F.mono }}>
              / {weekData.target}
            </span>
          </div>
        </div>
        <div className="w-24 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: C.line2 }}>
          <div
            className="h-full rounded-full"
            style={{ width: `${weekData.percent}%`, backgroundColor: C.lime }}
          />
        </div>
      </div>

      <button
        onClick={() => router.push("/signup")}
        className="w-8 h-8 rounded-full text-[10.5px] font-semibold flex items-center justify-center text-center"
        style={{ backgroundColor: C.panel2, border: `1.5px solid ${C.line}`, color: C.lime }}
      >
        ✓
      </button>
      {name && (
        <span
          className="text-[12.5px] font-semibold truncate max-w-32"
          style={{ color: C.ink2, fontFamily: F.sans }}
        >
          Hi, {name}
        </span>
      )}
    </div>
  );
}

export default DashboardHeader;
