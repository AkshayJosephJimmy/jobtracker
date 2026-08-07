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
        className={`absolute top-0 right-0 h-full w-105 max-w-[90vw] flex flex-col bg-neutral-950 border-l border-neutral-800 shadow-2xl transition-transform duration-200 ease-out ${
          mounted ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="shrink-0 border-b border-neutral-800 px-5 py-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-neutral-100 truncate">
                {application.companyName}
              </h2>
              <p className="text-sm text-neutral-400 truncate">{application.role}</p>
            </div>
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="shrink-0 rounded-md p-1 text-neutral-500 hover:text-neutral-200 hover:bg-neutral-800 transition-colors"
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
            <span className="text-xs text-neutral-500">
              {application.portal ? `${application.portal} · ` : ""}
              applied {formatDate(application.applyDate)}
            </span>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto px-5 py-4 flex flex-col gap-6">
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-500 mb-2">
              Follow-up
            </h3>

            {application.isFollowUpDue ? (
              <div className="rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-400">
                Follow-up due — {application.daysSinceContact} days since last contact
              </div>
            ) : (
              <p className="text-sm text-neutral-500">
                Last contact {application.daysSinceContact} days ago
              </p>
            )}

            <div className="mt-3 flex flex-col gap-3">
              {sortedFollowUps.length === 0 ? (
                <p className="text-sm text-neutral-500">No follow-ups yet</p>
              ) : (
                <ul className="flex flex-col gap-3">
                  {sortedFollowUps.map((f, index) => (
                    <li key={f.id} className="flex gap-2.5">
                      <span
                        className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${
                          index === 0 ? "bg-neutral-100" : "bg-neutral-700"
                        }`}
                      />
                      <div className="min-w-0">
                        <div className="text-xs text-neutral-500">{formatDate(f.followedUpAt)}</div>
                        <div className="text-sm text-neutral-300">{f.message}</div>
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
              className="mt-3 w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-neutral-200 placeholder:text-neutral-600 outline-none focus:border-neutral-600 resize-none"
            />

            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={handleMarkFollowUp}
                className="flex-1 rounded-md bg-neutral-100 text-neutral-900 text-sm font-medium py-2 hover:bg-white transition-colors"
              >
                Mark as followed up
              </button>
              <button
                type="button"
                className="flex-1 rounded-md border border-neutral-700 text-neutral-300 text-sm font-medium py-2 hover:bg-neutral-800 transition-colors"
              >
                Draft email
              </button>
            </div>
          </section>

          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-500 mb-2">
              Details
            </h3>
            <dl className="flex flex-col gap-2 text-sm">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-neutral-500">Resume</dt>
                <dd className="text-neutral-300 truncate max-w-60 text-right">
                  {application.resumeName && application.resumeLink ? (
                    <a
                      href={application.resumeLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      {application.resumeName}
                    </a>
                  ) : application.resumeName ? (
                    application.resumeName
                  ) : (
                    <span className="text-neutral-500">Not tracked</span>
                  )}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-neutral-500">Referral</dt>
                <dd className="text-neutral-300">{application.hasReferral ? "Yes" : "No"}</dd>
              </div>
              <div className="flex items-start justify-between gap-3">
                <dt className="text-neutral-500 shrink-0">Notes</dt>
                <dd className="text-neutral-300 text-right">
                  {application.notes ? application.notes : <span className="text-neutral-500">No notes</span>}
                </dd>
              </div>
            </dl>
          </section>

          {application.jobDescription && (
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-500 mb-2">
                Job description
              </h3>
              <div className="max-h-50 overflow-y-auto rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-neutral-400 whitespace-pre-wrap">
                {application.jobDescription}
              </div>
            </section>
          )}
        </div>

        <div className="shrink-0 border-t border-neutral-800 px-5 py-3">
          <button
            type="button"
            onClick={onDelete}
            className="text-sm text-red-500/80 hover:text-red-400 transition-colors"
          >
            Delete application
          </button>
        </div>
      </div>
    </div>
  );
}

export default ApplicationDrawer;
