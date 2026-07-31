type Application = {
  id: string;
  title: string;
  company: string;
  job: string;
  portal: string;
  status: string;
  dateApplied: string;
  followUpStatus: string;
};

type ApplicationCardProps = {
  application: Application;
};

const FOLLOW_UP_COLOR: Record<string, string> = {
  Pending: "#ffd700",
  Sent: "#00ff46",
  None: "#7a7a7a",
};

function ApplicationCard({ application }: ApplicationCardProps) {
  const followUpColor =
    FOLLOW_UP_COLOR[application.followUpStatus] ?? "#00ff46";

  return (
    <div
      className="group relative bg-black rounded-sm border-2 p-3 transition-shadow hover:shadow-lg"
      style={{
        fontFamily: "var(--font-vt323), monospace",
        borderColor: "#00ff46",
        boxShadow: "0 0 3px rgba(0,255,70,0.35), inset 0 0 6px rgba(0,255,70,0.08)",
      }}
    >
      <button
        type="button"
        aria-label="Delete application"
        className="absolute top-2 right-2 p-1 rounded-sm border transition-colors hover:bg-[#00ff46] hover:text-black"
        style={{ color: "#00ff46", borderColor: "rgba(0,255,70,0.5)" }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4"
        >
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
          <path d="M10 11v6" />
          <path d="M14 11v6" />
          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
        </svg>
      </button>

      <h3
        className="text-xl tracking-wide leading-tight pr-6"
        style={{ color: "#00ff46", textShadow: "0 0 3px rgba(0,255,70,0.5)" }}
      >
        {application.title}
      </h3>
      <p className="text-lg" style={{ color: "#00ff46", opacity: 0.8 }}>
        {application.company}
      </p>

      <div className="mt-2 flex flex-col gap-1 text-lg" style={{ color: "#00ff46", opacity: 0.7 }}>
        <p>
          <span style={{ opacity: 0.6 }}>&gt; PORTAL:</span> {application.portal}
        </p>
        <p>
          <span style={{ opacity: 0.6 }}>&gt; APPLIED:</span> {application.dateApplied}
        </p>
        <p style={{ color: followUpColor, opacity: 1 }}>
          <span style={{ opacity: 0.6, color: "#00ff46" }}>&gt; FOLLOW-UP:</span>{" "}
          {application.followUpStatus}
        </p>
      </div>

      <button
        className="mt-3 w-full text-lg tracking-widest py-1 rounded-sm border-2 transition-colors"
        style={{
          color: "#00ff46",
          borderColor: "#00ff46",
          textShadow: "0 0 3px rgba(0,255,70,0.5)",
        }}
      >
        [ VIEW DETAILS ]
      </button>
    </div>
  );
}

export default ApplicationCard;
