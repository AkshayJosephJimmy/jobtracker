import DashboardHeader from "../components/dashboard/DashboardHeader";
import { ApplicationProvider } from "../context/ApplicationsContext";



export default function DashboardLayout({ children }: { children: React.ReactNode }) {

  return (
    <ApplicationProvider>

    <div className="flex flex-col h-screen">
      <DashboardHeader />
      <div className="flex-1 overflow-y-auto dark-scroll">{children}</div>
    </div>
    </ApplicationProvider>
  );
}

