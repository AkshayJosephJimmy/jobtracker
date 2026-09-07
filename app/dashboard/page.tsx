"use client";

import KanbanBoard from "../components/kanban/KanbanBoard";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { useEffect } from "react";
import { ApplicationProvider } from "../context/ApplicationsContext";
import ApplicationDrawer from "../components/drawer/ApplicationDrawer";
import DashboardHeader from "../components/dashboard/DashboardHeader";

const C = {
  bg: "#0b0d11",
  panel: "#12151b",
  panel2: "#171b23",
  line: "#232833",
  ink: "#eceae4",
  ink2: "#a9aeba",
  ink3: "#6f7788",
  lime: "#b8ff3c",
  amber: "#ffb43c",
  amberBg: "#241d12",
  amberLine: "#4a3a18",
} as const;

const F = {
  mono: "var(--font-jetbrains-mono), monospace",
  sans: "var(--font-plus-jakarta), system-ui, sans-serif",
} as const;

 function Dashboard() {





  const[userName, setUserName] = useState()

  useEffect( () => {
    async function fetchUser() {
    const supabase = createClient();
    const { data,error } = await supabase.auth.getUser();
   // setUserName(data.user.email.split('@')[0]);
    console.log(userName)
}
fetchUser()

},[]);





  return (
    

    <div
      style={{
        minHeight: "100vh",
        backgroundColor: C.bg,
        fontFamily: F.sans,
      }}
    >


      <div
        className="flex items-center gap-3 px-5 py-2"
        style={{ backgroundColor: C.amberBg, borderBottom: `1px solid ${C.amberLine}` }}
      >
        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: C.amber }} />
        <span className="text-[12.5px] font-semibold" style={{ color: C.amber }}>
          Applications are overdue for follow-up
        </span>
        <div className="flex-1" />
        <span className="text-[11.5px] font-semibold underline" style={{ color: C.amber }}>
          Review all →
        </span>
      </div>

      <div
        className="flex items-center gap-2 px-5 py-2"
        style={{ backgroundColor: C.panel, borderBottom: `1px solid ${C.line}` }}
      >
        <div
          className="rounded-[5px] px-2.5 py-1 text-[11px] font-semibold tracking-wide"
          style={{ backgroundColor: "#1f2430", color: C.lime, fontFamily: F.mono, border: `1px solid ${C.line}` }}
        >
          ALL
        </div>
        <div
          className="rounded-[5px] px-2.5 py-1 text-[11px] font-medium tracking-wide"
          style={{ backgroundColor: C.panel2, border: `1px solid ${C.line}`, color: C.ink2, fontFamily: F.mono }}
        >
          NEEDS FOLLOW-UP
        </div>
        <div
          className="rounded-[5px] px-2.5 py-1 text-[11px] font-medium tracking-wide"
          style={{ backgroundColor: C.panel2, border: `1px solid ${C.line}`, color: C.ink2, fontFamily: F.mono }}
        >
          THIS WEEK
        </div>
        <div
          className="rounded-[5px] px-2.5 py-1 text-[11px] font-medium tracking-wide"
          style={{ backgroundColor: C.panel2, border: `1px solid ${C.line}`, color: C.ink2, fontFamily: F.mono }}
        >
          PORTAL ▾
        </div>
      </div>



      <KanbanBoard />

    </div>
    
  )
}

export default Dashboard;
