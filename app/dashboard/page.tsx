"use client";

import KanbanBoard from "../components/kanban/KanbanBoard";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { useEffect } from "react";
import { ApplicationProvider } from "../context/ApplicationsContext";
import ApplicationDrawer from "../components/drawer/ApplicationDrawer";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import AnalyticsBody from "../components/analytics/AnalyticsBody";



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
        backgroundColor: "#e8e4dd",
        fontFamily: "var(--font-plus-jakarta), system-ui, sans-serif",
      }}
    >
      

      <div
        className="flex items-center gap-3 px-5 py-2"
        style={{ backgroundColor: "#fff7e8", borderBottom: "1px solid rgba(245,158,11,.25)" }}
      >
        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#f59e0b" }} />
        <span className="text-[12.5px] font-semibold" style={{ color: "#8a5a06" }}>
          Applications are overdue for follow-up
        </span>
        <div className="flex-1" />
        <span className="text-[11.5px] font-semibold underline" style={{ color: "#8a5a06" }}>
          Review all →
        </span>
      </div>

      <div
        className="flex items-center gap-2 px-5 py-2"
        style={{ backgroundColor: "#f0ece5", borderBottom: "1px solid rgba(20,18,15,.07)" }}
      >
        <div className="rounded-[7px] px-2.5 py-1 text-[11.5px] font-semibold" style={{ backgroundColor: "#14120f", color: "#fff" }}>
          All
        </div>
        <div
          className="rounded-[7px] px-2.5 py-1 text-[11.5px] font-medium"
          style={{ backgroundColor: "#fff", border: "1px solid rgba(20,18,15,.11)", color: "#4a463f" }}
        >
          Needs follow-up
        </div>
        <div
          className="rounded-[7px] px-2.5 py-1 text-[11.5px] font-medium"
          style={{ backgroundColor: "#fff", border: "1px solid rgba(20,18,15,.11)", color: "#4a463f" }}
        >
          This week
        </div>
        <div
          className="rounded-[7px] px-2.5 py-1 text-[11.5px] font-medium"
          style={{ backgroundColor: "#fff", border: "1px solid rgba(20,18,15,.11)", color: "#4a463f" }}
        >
          Portal ▾
        </div>
      </div>
       
      

      <KanbanBoard />
      
    </div>
    
  )
}

export default Dashboard;
