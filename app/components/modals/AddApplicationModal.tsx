"use client";

import { useState, FormEvent } from "react";
import { toast } from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import {useApplication} from "@/app/context/ApplicationsContext"
import ScreenshotUpload from "./ScreenshotUpload";

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
  firstResponseAt: Date | null;
  notes: string;

};

type AddApplicationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAdd?: (application: any) => void;
};

const STATUSES = ['APPLIED', 'SCREENING', 'INTERVIEW', 'REJECTED'];


function todayISO() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const TODAY = todayISO();

function AddApplicationModal({ isOpen, onClose, onAdd }: AddApplicationModalProps) {
  const [isParsing, setIsParsing] = useState(false)
const [parseError, setParseError] = useState<string | null>(null)
  const{setApplication}=useApplication()
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState(STATUSES[0]);
  const [portal, setPortal] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [applyDate, setApplyDate] = useState(TODAY);
  const [resumeName, setResumeName] = useState("");
  const [resumeLink, setResumeLink] = useState("");
  const [hasReferral, setHasReferral] = useState(false);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [aiFilled, setAiFilled] = useState<Set<string>>(new Set());

  if (!isOpen) return null;

  function clearAiFilled(field: string) {
    setAiFilled((prev) => {
      if (!prev.has(field)) return prev;
      const next = new Set(prev);
      next.delete(field);
      return next;
    });
  }

  function resetForm() {
    setCompanyName("");
    setRole("");
    setStatus(STATUSES[0]);
    setPortal("");
    setJobDescription("");
    setApplyDate(TODAY);
    setResumeName("");
    setResumeLink("");
    setHasReferral(false);
    setNotes("");
    setAiFilled(new Set());
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
      firstResponseAt: null,
      
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

    setApplication(prev=>[...prev,updated])

    toast.success("Application added successfully!");
    onAdd?.(application);
    resetForm();
    onClose();
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  async function handleFileSelected(file: File) {

    if (!file.type.startsWith('image/')) {
    setParseError('Please upload an image')
    return
  }
  if (file.size > 5 * 1024 * 1024) {
    setParseError('Image must be under 5MB')
    return
  }

    setIsParsing(true)
    setParseError(null)
try{

  const base64=await new Promise<string>((resolve,reject)=>{
    const reader=new FileReader()
    reader.onload=()=>resolve((reader.result as string).split(',')[1])
    reader.onerror=()=>reject(new Error('Failed to read file'))
    
    reader.readAsDataURL(file)
  })

  const response=await fetch('/api/autoField',{
    method:'POST',
    headers:{
      'Content-Type':'application/json'
    },
    body:JSON.stringify({imageBase64:base64,mimeType:file.type})
  })
if(!response.ok){
setParseError('Failed to parse image')
return


}
const data=await response.json()
if (data.companyName) setCompanyName(data.companyName)
if (data.role) setRole(data.role)
if (data.portal) setPortal(data.portal)
if (data.jobDescription) setJobDescription(data.jobDescription)






}catch(error){
  setParseError('Failed to parse image')
  console.error(error)

}


   
    }

  function AiBadge() {
    return (
      <span className="ml-1.5 rounded-sm bg-[#182008] px-1 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#b8ff3c]">
        AI
      </span>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      onClick={handleClose}
    >
      <div
        className="relative z-10 w-full max-w-md rounded-md border border-[#232833] bg-[#12151b] p-6 max-h-[90vh] overflow-y-auto dark-scroll shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h1 className="text-sm font-semibold uppercase tracking-wide text-[#eceae4]">
            New Application
          </h1>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close"
            className="text-lg leading-none px-1 text-[#6f7788] hover:text-[#eceae4]"
          >
            &times;
          </button>
        </div>

        <ScreenshotUpload
          onFileSelected={(file) => handleFileSelected(file)}
          isParsing={false}
          error={null}
          onClearError={() => {}}
        />

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-[#232833]" />
          <span className="text-xs uppercase tracking-wide text-[#6f7788]">
            or enter manually
          </span>
          <div className="h-px flex-1 bg-[#232833]" />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label
                htmlFor="companyName"
                className="flex items-center text-xs uppercase tracking-wide text-[#6f7788]"
              >
                Company
                {aiFilled.has("companyName") && <AiBadge />}
              </label>
              <input
                id="companyName"
                type="text"
                required
                value={companyName}
                onChange={(e) => {
                  setCompanyName(e.target.value);
                  clearAiFilled("companyName");
                }}
                className={`bg-[#171b23] text-sm text-[#eceae4] px-3 py-2 rounded-sm outline-none border focus:border-[#3d5a14] ${
                  aiFilled.has("companyName")
                    ? "border-[#232833] border-l-2 border-l-[#b8ff3c]"
                    : "border-[#232833]"
                }`}
                placeholder="Tech Company"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="role"
                className="flex items-center text-xs uppercase tracking-wide text-[#6f7788]"
              >
                Role
                {aiFilled.has("role") && <AiBadge />}
              </label>
              <input
                id="role"
                type="text"
                required
                value={role}
                onChange={(e) => {
                  setRole(e.target.value);
                  clearAiFilled("role");
                }}
                className={`bg-[#171b23] text-sm text-[#eceae4] px-3 py-2 rounded-sm outline-none border focus:border-[#3d5a14] ${
                  aiFilled.has("role")
                    ? "border-[#232833] border-l-2 border-l-[#b8ff3c]"
                    : "border-[#232833]"
                }`}
                placeholder="Frontend Developer"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="status"
              className="flex items-center text-xs uppercase tracking-wide text-[#6f7788]"
            >
              Status
              {aiFilled.has("status") && <AiBadge />}
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                clearAiFilled("status");
              }}
              className={`bg-[#171b23] text-sm text-[#eceae4] px-3 py-2 rounded-sm outline-none border focus:border-[#3d5a14] ${
                aiFilled.has("status")
                  ? "border-[#232833] border-l-2 border-l-[#b8ff3c]"
                  : "border-[#232833]"
              }`}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label
                htmlFor="portal"
                className="flex items-center text-xs uppercase tracking-wide text-[#6f7788]"
              >
                Portal
                {aiFilled.has("portal") && <AiBadge />}
              </label>
              <input
                id="portal"
                type="text"
                value={portal}
                onChange={(e) => {
                  setPortal(e.target.value);
                  clearAiFilled("portal");
                }}
                className={`bg-[#171b23] text-sm text-[#eceae4] px-3 py-2 rounded-sm outline-none border focus:border-[#3d5a14] ${
                  aiFilled.has("portal")
                    ? "border-[#232833] border-l-2 border-l-[#b8ff3c]"
                    : "border-[#232833]"
                }`}
                placeholder="LinkedIn"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="resumeName"
                className="flex items-center text-xs uppercase tracking-wide text-[#6f7788]"
              >
                Resume Name
                {aiFilled.has("resumeName") && <AiBadge />}
              </label>
              <input
                id="resumeName"
                type="text"
                value={resumeName}
                onChange={(e) => {
                  setResumeName(e.target.value);
                  clearAiFilled("resumeName");
                }}
                className={`bg-[#171b23] text-sm text-[#eceae4] px-3 py-2 rounded-sm outline-none border focus:border-[#3d5a14] ${
                  aiFilled.has("resumeName")
                    ? "border-[#232833] border-l-2 border-l-[#b8ff3c]"
                    : "border-[#232833]"
                }`}
                placeholder="resume_v2.pdf"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="resumeLink"
              className="flex items-center text-xs uppercase tracking-wide text-[#6f7788]"
            >
              Resume Link
              {aiFilled.has("resumeLink") && <AiBadge />}
            </label>
            <input
              id="resumeLink"
              type="url"
              value={resumeLink}
              onChange={(e) => {
                setResumeLink(e.target.value);
                clearAiFilled("resumeLink");
              }}
              className={`bg-[#171b23] text-sm text-[#eceae4] px-3 py-2 rounded-sm outline-none border focus:border-[#3d5a14] ${
                aiFilled.has("resumeLink")
                  ? "border-[#232833] border-l-2 border-l-[#b8ff3c]"
                  : "border-[#232833]"
              }`}
              placeholder="https://..."
            />
          </div>

          <label
            htmlFor="hasReferral"
            className="flex items-center gap-2 text-sm text-[#a9aeba] cursor-pointer"
          >
            <input
              id="hasReferral"
              type="checkbox"
              checked={hasReferral}
              onChange={(e) => setHasReferral(e.target.checked)}
              className="h-4 w-4 accent-[#b8ff3c]"
            />
            Referral
          </label>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="jobDescription"
              className="flex items-center text-xs uppercase tracking-wide text-[#6f7788]"
            >
              Job Description
              {aiFilled.has("jobDescription") && <AiBadge />}
            </label>
            <textarea
              id="jobDescription"
              rows={3}
              value={jobDescription}
              onChange={(e) => {
                setJobDescription(e.target.value);
                clearAiFilled("jobDescription");
              }}
              className={`bg-[#171b23] text-sm text-[#eceae4] px-3 py-2 rounded-sm outline-none border focus:border-[#3d5a14] resize-none ${
                aiFilled.has("jobDescription")
                  ? "border-[#232833] border-l-2 border-l-[#b8ff3c]"
                  : "border-[#232833]"
              }`}
              placeholder="Paste the job description..."
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="notes"
              className="flex items-center text-xs uppercase tracking-wide text-[#6f7788]"
            >
              Notes
              {aiFilled.has("notes") && <AiBadge />}
            </label>
            <textarea
              id="notes"
              rows={2}
              value={notes}
              onChange={(e) => {
                setNotes(e.target.value);
                clearAiFilled("notes");
              }}
              className={`bg-[#171b23] text-sm text-[#eceae4] px-3 py-2 rounded-sm outline-none border focus:border-[#3d5a14] resize-none ${
                aiFilled.has("notes")
                  ? "border-[#232833] border-l-2 border-l-[#b8ff3c]"
                  : "border-[#232833]"
              }`}
              placeholder="Any extra notes..."
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="applyDate"
              className="flex items-center text-xs uppercase tracking-wide text-[#6f7788]"
            >
              Apply Date
              {aiFilled.has("applyDate") && <AiBadge />}
            </label>
            <input
              id="applyDate"
              type="date"
              required
              max={TODAY}
              value={applyDate}
              onChange={(e) => {
                setApplyDate(e.target.value);
                clearAiFilled("applyDate");
              }}
              className={`bg-[#171b23] text-sm text-[#eceae4] px-3 py-2 rounded-sm outline-none border focus:border-[#3d5a14] ${
                aiFilled.has("applyDate")
                  ? "border-[#232833] border-l-2 border-l-[#b8ff3c]"
                  : "border-[#232833]"
              }`}
            />
          </div>

          <div className="flex flex-row gap-3 mt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 text-sm font-medium py-2 rounded-sm border border-[#232833] text-[#a9aeba] transition-colors hover:bg-[#171b23]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 text-sm font-semibold py-2 rounded-sm border border-[#b8ff3c] bg-[#b8ff3c] text-[#0b0d11] transition-colors hover:bg-[#c8ff52] disabled:opacity-50"
            >
              {submitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddApplicationModal;
