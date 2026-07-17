"use client";
import { Link } from "react-router-dom";
import KanbanBoard from "../components/kanban/KanbanBoard";
import { useRouter } from "next/navigation";



function Dashboard() {
  const router = useRouter();
  return (
    <div>
      <div className="flex flex-row gap-1">
        <h1 className="text-3xl tracking-wide" style={{ color: "#00ff46" }}>
          &gt; DASHBOARD
        </h1>
        <p className="text-lg tracking-wide" style={{ color: "#00ff46" }}>
          &gt; Analytics
        </p>

        <button onClick={()=>router.push("/signup")} style={{ color: "#00ff46" }}>
          Signed in
        </button>
        <KanbanBoard />
        

      </div>
    </div>
  )
}

export default Dashboard;