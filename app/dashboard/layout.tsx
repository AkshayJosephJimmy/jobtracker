
import { createClient } from "@/lib/supabase/client";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import { ApplicationProvider } from "../context/ApplicationsContext";
import { FilterProvider } from "../context/FilterContext";
import { redirect } from "next/navigation";




export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
 
 const supabase = createClient()
 const user = await supabase.auth.getUser()

//  if (!user.data.user) {

//   redirect("/login")
//  }

  return (

    <ApplicationProvider>
      <FilterProvider>



    <div className="flex flex-col h-screen">
      <DashboardHeader />
      <div className="flex-1 overflow-y-auto dark-scroll">{children}</div>
    </div>
      </FilterProvider>
    </ApplicationProvider>
  );
}

