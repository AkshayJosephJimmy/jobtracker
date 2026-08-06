import {useApplication,} from "../../context/ApplicationsContext"

type Application = {
  id: string;
  title: string;
  company: string;
  job: string;
  portal: string;
  status: string;
  dateApplied: string;
  followUpStatus: string;
  updatedAt:string;
};

type ApplicationCardProps = {
  application: Application;
};

const FOLLOW_UP_COLOR: Record<string, string> = {
  Pending: "#ffd700",
  Sent: "#00ff46",
  None: "#7a7a7a",
};

const PORTAL_PALETTE = ["#0a66c2", "#2557a7", "#e5484d", "#00a86b", "#f59e0b", "#5b3df5"];

function hexToRgba(hex: string, alpha: number) {
  const clean = hex.replace("#", "");
  const bigint = parseInt(clean, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function portalDotColor(portal: string) {
  if (!portal) return "#8a857c";
  let hash = 0;
  for (let i = 0; i < portal.length; i++) hash = (hash * 31 + portal.charCodeAt(i)) % PORTAL_PALETTE.length;
  return PORTAL_PALETTE[Math.abs(hash)];
}



function ApplicationCard({ application }: ApplicationCardProps) {
 const{setApplication}=useApplication()
async function handleDelete(){

    const delete_id=application.id
    try{

        
        const res=await fetch(`/api/application/${delete_id}`,{
            method:"DELETE",
            headers:{
                "Content-Type": "application/json",
            },
            
            
            
        })
         if(res.ok){

        setApplication(prev=>prev.filter((app)=>app.id!==delete_id))

    }
    }catch(err){
        throw new Error("Could not delete Application")
    }
   



}

  const followUpColor =
    FOLLOW_UP_COLOR[application.followUpStatus] ?? "#00ff46";
  const followUpBg = hexToRgba(followUpColor, 0.14);
 

  return (
    <div
      className="group relative rounded-[10px] p-3 pr-2 pl-3.25 overflow-hidden"
      style={{
        fontFamily: "var(--font-plus-jakarta), system-ui, sans-serif",
        backgroundColor: "#fff",
        border: "1px solid rgba(20,18,15,.1)",
        boxShadow: "0 1px 2px rgba(20,18,15,.05)",
      }}
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-0.75"
        style={{ backgroundColor: followUpColor }}
      />

      <button
        type="button"
        aria-label="Delete application"
        onClick={handleDelete}
        className="absolute top-1.5 right-1.5 p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ color: "#a8a29a" }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "#c3363b";
          e.currentTarget.style.backgroundColor = "rgba(229,72,77,.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "#a8a29a";
          e.currentTarget.style.backgroundColor = "transparent";
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-3.5 h-3.5"
        >
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
          <path d="M10 11v6" />
          <path d="M14 11v6" />
          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
        </svg>
      </button>

      <div className="flex items-baseline gap-2 pr-5">
        <h3
          className="text-[13px] font-bold leading-tight tracking-tight truncate"
          style={{ color: "#14120f" }}
        >
          {application.title}
        </h3>
      </div>
      <p
        className="text-[11.5px] font-medium mt-0.5 truncate"
        style={{ color: "#6b6660" }}
      >
        {application.company}
      </p>

      <div className="flex items-center gap-1.5 mt-2">
        <div
          className="flex items-center gap-1 rounded-[5px] px-1.5 py-0.75"
          style={{ backgroundColor: "rgba(20,18,15,.05)" }}
        >
          <div
            className="w-1.25 h-1.25 rounded-full"
            style={{ backgroundColor: portalDotColor(application.portal) }}
          />
          <span className="text-[10px] font-semibold" style={{ color: "#4a463f" }}>
            {application.portal}
          </span>
        </div>
        <div className="flex-1" />
        <div
          className="flex items-center gap-1 rounded-[5px] px-1.5 py-0.75"
          style={{ backgroundColor: followUpBg }}
        >
          <span
            className="text-[9.5px] font-bold tracking-wide"
            style={{ color: followUpColor, fontFamily: "var(--font-jetbrains-mono), monospace" }}
          >
            {application.followUpStatus}
          </span>
          {application.updatedAt !== null && (
            <span
              className="text-[9px] font-semibold"
              style={{ color: followUpColor, opacity: 0.75, fontFamily: "var(--font-jetbrains-mono), monospace" }}
            >
              {application.updatedAt}d
            </span>
          )}
        </div>
      </div>

      <div
        className="text-[10.5px] mt-2"
        style={{ color: "#a8a29a", fontFamily: "var(--font-jetbrains-mono), monospace" }}
      >
        Applied {application.dateApplied}
      </div>

      <button
        className="mt-2.5 w-full text-[11px] font-semibold tracking-wide py-1.5 rounded-[7px] transition-colors"
        style={{
          color: "#4a463f",
          backgroundColor: "#f6f3ee",
        }}
      >
        View details
      </button>
    </div>
  );
}

export default ApplicationCard;
