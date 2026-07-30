"use client";

import KanbanBoard from "../components/kanban/KanbanBoard";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { useEffect } from "react";
import { ApplicationProvider } from "../context/ApplicationsContext";


 function Dashboard() {

  
  
  
  
  const[userName, setUserName] = useState()
  
  useEffect( () => {
    async function fetchUser() {
    const supabase = createClient();
    const { data,error } = await supabase.auth.getUser();
    setUserName(data.user.email.split('@')[0]);
    console.log(userName)
}
fetchUser()

},[]);



 

  const router = useRouter();
  return (
    <ApplicationProvider>

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
    </ApplicationProvider>
  )
}

export default Dashboard;