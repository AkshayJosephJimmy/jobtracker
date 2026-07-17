"use client";

import { useState, FormEvent } from "react";

type NewApplication = {
  title: string;
  company: string;
  job: string;
  portal: string;
  status: string;
  dateApplied: string;
  followUpStatus: string;
};

type AddApplicationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAdd?: (application: NewApplication) => void;
};

const STATUSES = ["Applied", "Interviewing", "Offer Received", "Rejected"];
const FOLLOW_UP_STATUSES = ["Pending", "Sent", "None"];

const fieldStyle = {
  color: "#00ff46",
  borderColor: "#00ff46",
  boxShadow: "inset 0 0 4px rgba(0,255,70,0.15)",
};

function AddApplicationModal({ isOpen, onClose, onAdd }: AddApplicationModalProps) {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [job, setJob] = useState("");
  const [portal, setPortal] = useState("");
  const [status, setStatus] = useState(STATUSES[0]);
  const [dateApplied, setDateApplied] = useState("");
  const [followUpStatus, setFollowUpStatus] = useState(FOLLOW_UP_STATUSES[0]);

  if (!isOpen) return null;

  function resetForm() {
    setTitle("");
    setCompany("");
    setJob("");
    setPortal("");
    setStatus(STATUSES[0]);
    setDateApplied("");
    setFollowUpStatus(FOLLOW_UP_STATUSES[0]);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onAdd?.({ title, company, job, portal, status, dateApplied, followUpStatus });
    resetForm();
    onClose();
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4"
      onClick={handleClose}
    >
      <div
        className="relative z-10 w-full max-w-md border-2 rounded-md p-6 sm:p-8 bg-black"
        style={{
          fontFamily: "var(--font-vt323), monospace",
          borderColor: "#00ff46",
          boxShadow: "0 0 3px rgba(0,255,70,0.6), 0 0 8px rgba(0,255,70,0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h1
            className="text-3xl tracking-widest"
            style={{ color: "#00ff46", textShadow: "0 0 3px rgba(0,255,70,0.5)" }}
          >
            &gt; NEW_APPLICATION
          </h1>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close"
            className="text-2xl leading-none px-2"
            style={{ color: "#00ff46", textShadow: "0 0 3px rgba(0,255,70,0.5)" }}
          >
            [X]
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="title" className="text-xl" style={{ color: "#00ff46" }}>
              &gt; JOB_TITLE:
            </label>
            <input
              id="title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-black text-xl px-3 py-2 rounded-sm outline-none border-2 caret-[#00ff46]"
              style={fieldStyle}
              placeholder="Frontend Developer"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="company" className="text-xl" style={{ color: "#00ff46" }}>
              &gt; COMPANY:
            </label>
            <input
              id="company"
              type="text"
              required
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="bg-black text-xl px-3 py-2 rounded-sm outline-none border-2 caret-[#00ff46]"
              style={fieldStyle}
              placeholder="Tech Company"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="job" className="text-xl" style={{ color: "#00ff46" }}>
              &gt; ROLE:
            </label>
            <input
              id="job"
              type="text"
              value={job}
              onChange={(e) => setJob(e.target.value)}
              className="bg-black text-xl px-3 py-2 rounded-sm outline-none border-2 caret-[#00ff46]"
              style={fieldStyle}
              placeholder="Frontend Developer"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="portal" className="text-xl" style={{ color: "#00ff46" }}>
              &gt; PORTAL:
            </label>
            <input
              id="portal"
              type="text"
              value={portal}
              onChange={(e) => setPortal(e.target.value)}
              className="bg-black text-xl px-3 py-2 rounded-sm outline-none border-2 caret-[#00ff46]"
              style={fieldStyle}
              placeholder="LinkedIn"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="status" className="text-xl" style={{ color: "#00ff46" }}>
                &gt; STATUS:
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="bg-black text-xl px-3 py-2 rounded-sm outline-none border-2"
                style={fieldStyle}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="followUpStatus" className="text-xl" style={{ color: "#00ff46" }}>
                &gt; FOLLOW-UP:
              </label>
              <select
                id="followUpStatus"
                value={followUpStatus}
                onChange={(e) => setFollowUpStatus(e.target.value)}
                className="bg-black text-xl px-3 py-2 rounded-sm outline-none border-2"
                style={fieldStyle}
              >
                {FOLLOW_UP_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="dateApplied" className="text-xl" style={{ color: "#00ff46" }}>
              &gt; DATE_APPLIED:
            </label>
            <input
              id="dateApplied"
              type="date"
              required
              value={dateApplied}
              onChange={(e) => setDateApplied(e.target.value)}
              className="bg-black text-xl px-3 py-2 rounded-sm outline-none border-2 caret-[#00ff46]"
              style={fieldStyle}
            />
          </div>

          <div className="flex flex-row gap-4 mt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 text-xl tracking-widest py-2 rounded-sm border-2 transition-colors"
              style={{ color: "#00ff46", borderColor: "#00ff46", opacity: 0.7 }}
            >
              [ CANCEL ]
            </button>
            <button
              type="submit"
              className="flex-1 text-xl tracking-widest py-2 rounded-sm border-2 transition-colors"
              style={{
                color: "#00ff46",
                borderColor: "#00ff46",
                textShadow: "0 0 3px rgba(0,255,70,0.5)",
                boxShadow: "0 0 4px rgba(0,255,70,0.25)",
              }}
            >
              [ SAVE ]
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddApplicationModal;
