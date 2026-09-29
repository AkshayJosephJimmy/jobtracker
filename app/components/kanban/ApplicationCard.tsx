import {useApplication,} from "../../context/ApplicationsContext"

type Application = {
  id: string;
  title: string;
  companyName: string;
  role: string;
  job: string;
  portal: string;
  status: string;
  applyDate: string;
  followUpStatus: string;
  updatedAt:string;
  daysSinceContact:number
};

type ApplicationCardProps = {
  application: Application;
  highlight?: boolean;
};

const C = {
  panel: "#12151b",
  panel2: "#171b23",
  line: "#232833",
  ink: "#eceae4",
  ink2: "#a9aeba",
  ink3: "#6f7788",
  lime: "#b8ff3c",
  limeBg: "#182008",
  limeLine: "#3d5a14",
  red: "#ff7b7f",
} as const;

const F = {
  mono: "var(--font-jetbrains-mono), monospace",
  sans: "var(--font-plus-jakarta), system-ui, sans-serif",
} as const;

const FOLLOW_UP_COLOR: Record<string, string> = {
  Pending: "#ffb43c",
  Sent: "#4fd99b",
  None: "#6f7788",
};

const PORTAL_PALETTE = ["#4a9eff", "#8b7bfa", "#ff7b7f", "#4fd99b", "#ffb43c", "#b8ff3c"];

function hexToRgba(hex: string, alpha: number) {
  const clean = hex.replace("#", "");
  const bigint = parseInt(clean, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function formatApplyDate(dateStr: string) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function portalDotColor(portal: string) {
  if (!portal) return C.ink3;
  let hash = 0;
  for (let i = 0; i < portal.length; i++) hash = (hash * 31 + portal.charCodeAt(i)) % PORTAL_PALETTE.length;
  return PORTAL_PALETTE[Math.abs(hash)];
}



function ApplicationCard({ application, highlight }: ApplicationCardProps) {
 const{setApplication,selectedId,setSelectedId}=useApplication()

 function followUpStatus(){

  if(application.daysSinceContact > 8){
    application.followUpStatus="Pending"

  }else if(application.daysSinceContact<8)
  {
    application.followUpStatus="Send"
  }else if(!application.daysSinceContact){
    application.followUpStatus="None"
  }

 }
 followUpStatus()


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
        fontFamily: F.sans,
        backgroundColor: highlight ? C.limeBg : C.panel2,
        border: `1px solid ${highlight ? C.limeLine : C.line}`,
        boxShadow: highlight
          ? "0 0 0 2px rgba(184,255,60,.35)"
          : "none",
        transition: "background-color 0.6s ease, box-shadow 0.6s ease",
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
        style={{ color: C.ink3 }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = C.red;
          e.currentTarget.style.backgroundColor = "rgba(255,123,127,.12)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = C.ink3;
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
          style={{ color: C.ink }}
        >
          {application.companyName}
        </h3>
      </div>
      <div className="flex items-baseline gap-1.5 mt-0.5">
        <p
          className="text-[11.5px] font-medium truncate min-w-0"
          style={{ color: C.ink3 }}
        >
          {application.role}
        </p>
        {formatApplyDate(application.applyDate) && (
          <span
            className="text-[9px] font-semibold shrink-0 ml-auto"
            style={{ color: C.ink3, fontFamily: F.mono, opacity: 0.75 }}
          >
            {formatApplyDate(application.applyDate)}
          </span>
        )}
      </div>

      <div className="flex items-center gap-1.5 mt-2">
        <div
          className="flex items-center gap-1 rounded-[5px] px-1.5 py-0.75"
          style={{ backgroundColor: C.panel }}
        >
          <div
            className="w-1.25 h-1.25 rounded-full"
            style={{ backgroundColor: portalDotColor(application.portal) }}
          />
          <span className="text-[10px] font-semibold" style={{ color: C.ink2 }}>
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
            style={{ color: followUpColor, fontFamily: F.mono }}
          >
            {application.followUpStatus}
          </span>
          {application.updatedAt !== null && (
            <span
              className="text-[9px] font-semibold"
              style={{ color: followUpColor, opacity: 0.75, fontFamily: F.mono }}
              >
              
              {application.daysSinceContact}d
            </span>
          )}
        </div>
      </div>

      <button
        className="mt-2.5 w-full text-[11px] font-semibold tracking-wide py-1.5 rounded-[7px] transition-colors"
        onClick={()=>setSelectedId(application.id)}
        style={{
          color: C.ink2,
          backgroundColor: C.panel,
          border: `1px solid ${C.line}`,
        }}
      >
        View details
      </button>
    </div>
  );
}

export default ApplicationCard;
