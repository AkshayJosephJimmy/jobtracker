"use client";

import { useState, FormEvent } from "react";
import { toast } from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import {useApplication} from "@/app/context/ApplicationsContext"

type NewApplication = {
  userId: string;
  companyName: string;
  role: string;
  status: string;
  portal: string;
  jobDescription: string;
  applyDate: string;
  resumeName: string;
  resumeLink: string;
  hasReferral: boolean;
  notes: string;
};

type AddApplicationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAdd?: (application: any) => void;
};

const STATUSES = ['APPLIED', 'SCREENING', 'INTERVIEW', 'REJECTED'];

const fieldStyle = {
  color: "#00ff46",
  borderColor: "#00ff46",
  boxShadow: "inset 0 0 4px rgba(0,255,70,0.15)",
};

function AddApplicationModal({ isOpen, onClose, onAdd }: AddApplicationModalProps) {
  const{setApplication}=useApplication()
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState(STATUSES[0]);
  const [portal, setPortal] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [applyDate, setApplyDate] = useState("");
  const [resumeName, setResumeName] = useState("");
  const [resumeLink, setResumeLink] = useState("");
  const [hasReferral, setHasReferral] = useState(false);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  function resetForm() {
    setCompanyName("");
    setRole("");
    setStatus(STATUSES[0]);
    setPortal("");
    setJobDescription("");
    setApplyDate("");
    setResumeName("");
    setResumeLink("");
    setHasReferral(false);
    setNotes("");
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error("You must be logged in to add an application.");
      setSubmitting(false);
      return;
    }

    const application: NewApplication = {
      userId: user.id,
      companyName,
      role,
      status,
      portal,
      jobDescription,
      applyDate,
      resumeName,
      resumeLink,
      hasReferral,
      notes,
    };

    const response = await fetch("/api/application", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(application),
    });

    setSubmitting(false);

    if (!response.ok) {
      console.error("Failed to add application");
      toast.error("Failed to add application. Please try again.");
      return;
    }
    const updated=await response.json()
    setApplication(prev=>[...prev,updated.application])

    toast.success("Application added successfully!");
    onAdd?.(application);
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
        className="relative z-10 w-full max-w-md border-2 rounded-md p-6 sm:p-8 bg-black max-h-[90vh] overflow-y-auto"
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
            <label htmlFor="companyName" className="text-xl" style={{ color: "#00ff46" }}>
              &gt; COMPANY:
            </label>
            <input
              id="companyName"
              type="text"
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="bg-black text-xl px-3 py-2 rounded-sm outline-none border-2 caret-[#00ff46]"
              style={fieldStyle}
              placeholder="Tech Company"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="role" className="text-xl" style={{ color: "#00ff46" }}>
              &gt; ROLE:
            </label>
            <input
              id="role"
              type="text"
              required
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="bg-black text-xl px-3 py-2 rounded-sm outline-none border-2 caret-[#00ff46]"
              style={fieldStyle}
              placeholder="Frontend Developer"
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
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="jobDescription" className="text-xl" style={{ color: "#00ff46" }}>
              &gt; JOB_DESCRIPTION:
            </label>
            <textarea
              id="jobDescription"
              rows={3}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="bg-black text-xl px-3 py-2 rounded-sm outline-none border-2 caret-[#00ff46] resize-none"
              style={fieldStyle}
              placeholder="Paste the job description..."
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="applyDate" className="text-xl" style={{ color: "#00ff46" }}>
              &gt; APPLY_DATE:
            </label>
            <input
              id="applyDate"
              type="date"
              required
              value={applyDate}
              onChange={(e) => setApplyDate(e.target.value)}
              className="bg-black text-xl px-3 py-2 rounded-sm outline-none border-2 caret-[#00ff46]"
              style={fieldStyle}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="resumeName" className="text-xl" style={{ color: "#00ff46" }}>
                &gt; RESUME_NAME:
              </label>
              <input
                id="resumeName"
                type="text"
                value={resumeName}
                onChange={(e) => setResumeName(e.target.value)}
                className="bg-black text-xl px-3 py-2 rounded-sm outline-none border-2 caret-[#00ff46]"
                style={fieldStyle}
                placeholder="resume_v2.pdf"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="resumeLink" className="text-xl" style={{ color: "#00ff46" }}>
                &gt; RESUME_LINK:
              </label>
              <input
                id="resumeLink"
                type="url"
                value={resumeLink}
                onChange={(e) => setResumeLink(e.target.value)}
                className="bg-black text-xl px-3 py-2 rounded-sm outline-none border-2 caret-[#00ff46]"
                style={fieldStyle}
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="notes" className="text-xl" style={{ color: "#00ff46" }}>
              &gt; NOTES:
            </label>
            <textarea
              id="notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="bg-black text-xl px-3 py-2 rounded-sm outline-none border-2 caret-[#00ff46] resize-none"
              style={fieldStyle}
              placeholder="Any extra notes..."
            />
          </div>

          <label htmlFor="hasReferral" className="flex items-center gap-2 text-xl cursor-pointer" style={{ color: "#00ff46" }}>
            <input
              id="hasReferral"
              type="checkbox"
              checked={hasReferral}
              onChange={(e) => setHasReferral(e.target.checked)}
              className="w-5 h-5 accent-[#00ff46]"
            />
            &gt; HAS_REFERRAL?
          </label>

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
              disabled={submitting}
              className="flex-1 text-xl tracking-widest py-2 rounded-sm border-2 transition-colors disabled:opacity-50"
              style={{
                color: "#00ff46",
                borderColor: "#00ff46",
                textShadow: "0 0 3px rgba(0,255,70,0.5)",
                boxShadow: "0 0 4px rgba(0,255,70,0.25)",
              }}
            >
              {submitting ? "SAVING..." : "[ SAVE ]"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddApplicationModal;
