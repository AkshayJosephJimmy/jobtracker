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
      className="group bg-black rounded-sm border-2 p-3 transition-shadow hover:shadow-lg"
      style={{
        fontFamily: "var(--font-vt323), monospace",
        borderColor: "#00ff46",
        boxShadow: "0 0 3px rgba(0,255,70,0.35), inset 0 0 6px rgba(0,255,70,0.08)",
      }}
    >
      <h3
        className="text-xl tracking-wide leading-tight"
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
