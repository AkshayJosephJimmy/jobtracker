"use client";

import { useEffect, useState } from "react";

type FollowUp = {
  id: string;
  message: string | null;
  followedUpAt: string;
};

type Application = {
  id: string;
  companyName: string;
  role: string;
  status: "APPLIED" | "SCREENING" | "INTERVIEW" | "REJECTED";
  portal: string | null;
  applyDate: string;
  resumeName: string | null;
  resumeLink: string | null;
  hasReferral: boolean;
  notes: string | null;
  jobDescription: string | null;
  daysSinceContact: number;
  isFollowUpDue: boolean;
  followUps: FollowUp[];
};

type ApplicationDrawerProps = {
  application: Application;
  onClose: () => void;
  onMarkFollowUp: (message: string) => void;
  onDelete: () => void;
};

const STATUS_STYLES: Record<Application["status"], string> = {
  APPLIED: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  SCREENING: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  INTERVIEW: "bg-green-500/15 text-green-400 border-green-500/30",
  REJECTED: "bg-red-500/15 text-red-400 border-red-500/30",
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function ApplicationDrawer({ application, onClose, onMarkFollowUp, onDelete }: ApplicationDrawerProps) {
  const [mounted, setMounted] = useState(false);
  const [followUpMessage, setFollowUpMessage] = useState("");

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const sortedFollowUps = [...application.followUps].sort(
    (a, b) => new Date(b.followedUpAt).getTime() - new Date(a.followedUpAt).getTime()
  );

  function handleMarkFollowUp() {
    onMarkFollowUp(followUpMessage);
    setFollowUpMessage("");
  }

  return (
    <div className="fixed inset-0 z-50">
      <div
        className={`absolute inset-0 bg-black/60 transition-opacity duration-200 ease-out ${
          mounted ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      <div
        className={`absolute top-0 right-0 h-full w-105 max-w-[90vw] flex flex-col bg-[#0b0d11] border-l border-[#232833] shadow-2xl transition-transform duration-200 ease-out ${
          mounted ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="shrink-0 border-b border-[#232833] px-5 py-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-[#eceae4] truncate">
                {application.companyName}
              </h2>
              <p className="text-sm text-[#a9aeba] truncate">{application.role}</p>
            </div>
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="shrink-0 rounded-md p-1 text-[#6f7788] hover:text-[#eceae4] hover:bg-[#171b23] transition-colors"
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
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-2 mt-3">
            <span
              className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[application.status]}`}
            >
              {application.status}
            </span>
            <span className="text-xs text-[#6f7788]">
              {application.portal ? `${application.portal} · ` : ""}
              applied {formatDate(application.applyDate)}
            </span>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto dark-scroll px-5 py-4 flex flex-col gap-6">
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-[#6f7788] mb-2">
              Follow-up
            </h3>

            {application.isFollowUpDue ? (
              <div className="rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-400">
                Follow-up due — {application.daysSinceContact} days since last contact
              </div>
            ) : (
              <p className="text-sm text-[#6f7788]">
                Last contact {application.daysSinceContact} days ago
              </p>
            )}

            <div className="mt-3 flex flex-col gap-3">
              {sortedFollowUps.length === 0 ? (
                <p className="text-sm text-[#6f7788]">No follow-ups yet</p>
              ) : (
                <ul className="flex flex-col gap-3">
                  {sortedFollowUps.map((f, index) => (
                    <li key={f.id} className="flex gap-2.5">
                      <span
                        className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${
                          index === 0 ? "bg-[#b8ff3c]" : "bg-[#232833]"
                        }`}
                      />
                      <div className="min-w-0">
                        <div className="text-xs text-[#6f7788]">{formatDate(f.followedUpAt)}</div>
                        <div className="text-sm text-[#a9aeba]">{f.message}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <textarea
              value={followUpMessage}
              onChange={(e) => setFollowUpMessage(e.target.value)}
              placeholder="What did you send? (optional)"
              rows={3}
              className="mt-3 w-full rounded-md border border-[#232833] bg-[#12151b] px-3 py-2 text-sm text-[#eceae4] placeholder:text-[#6f7788] outline-none focus:border-[#3d5a14] resize-none"
            />

            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={handleMarkFollowUp}
                className="flex-1 rounded-md bg-[#b8ff3c] text-[#0b0d11] text-sm font-semibold py-2 hover:bg-[#c8ff52] transition-colors"
              >
                Mark as followed up
              </button>
              <button
                type="button"
                className="flex-1 rounded-md border border-[#232833] text-[#a9aeba] text-sm font-medium py-2 hover:bg-[#171b23] transition-colors"
              >
                Draft email
              </button>
            </div>
          </section>

          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-[#6f7788] mb-2">
              Details
            </h3>
            <dl className="flex flex-col gap-2 text-sm">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-[#6f7788]">Resume</dt>
                <dd className="text-[#a9aeba] truncate max-w-60 text-right">
                  {application.resumeName && application.resumeLink ? (
                    <a
                      href={application.resumeLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#4a9eff] hover:underline"
                    >
                      {application.resumeName}
                    </a>
                  ) : application.resumeName ? (
                    application.resumeName
                  ) : (
                    <span className="text-[#6f7788]">Not tracked</span>
                  )}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-[#6f7788]">Referral</dt>
                <dd className="text-[#a9aeba]">{application.hasReferral ? "Yes" : "No"}</dd>
              </div>
              <div className="flex items-start justify-between gap-3">
                <dt className="text-[#6f7788] shrink-0">Notes</dt>
                <dd className="text-[#a9aeba] text-right">
                  {application.notes ? application.notes : <span className="text-[#6f7788]">No notes</span>}
                </dd>
              </div>
            </dl>
          </section>

          {application.jobDescription && (
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-[#6f7788] mb-2">
                Job description
              </h3>
              <div className="max-h-50 overflow-y-auto dark-scroll rounded-md border border-[#232833] bg-[#12151b] px-3 py-2 text-sm text-[#a9aeba] whitespace-pre-wrap">
                {application.jobDescription}
              </div>
            </section>
          )}
        </div>

        <div className="shrink-0 border-t border-[#232833] px-5 py-3">
          <button
            type="button"
            onClick={onDelete}
            className="text-sm text-[#ff7b7f]/80 hover:text-[#ff7b7f] transition-colors"
          >
            Delete application
          </button>
        </div>
      </div>
    </div>
  );
}

export default ApplicationDrawer;
