"use client";

import { useState, DragEvent, ChangeEvent, useRef } from "react";

type ScreenshotUploadProps = {
  onFileSelected: (file: File) => void;
  isParsing: boolean;
  error: string | null;
  onClearError: () => void;
};

function ScreenshotUpload({
  onFileSelected,
  isParsing,
  error,
  onClearError,
}: ScreenshotUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);

  function handleClick() {
    if (isParsing) return;
    inputRef.current?.click();
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onFileSelected(file);
    e.target.value = "";
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    if (isParsing) return;
    setIsDragging(true);
  }

  function handleDragLeave(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    if (isParsing) return;
    const file = e.dataTransfer.files?.[0];
    if (file) onFileSelected(file);
  }



  let borderClass = "border-dashed border-gray-300";
  let bgClass = "bg-gray-50";
  let cursorClass = "cursor-pointer";

  if (isParsing) {
    borderClass = "border-dashed border-gray-200";
    bgClass = "bg-gray-50 opacity-60";
    cursorClass = "cursor-default";
  } else if (error) {
    borderClass = "border-solid border-red-300";
    bgClass = "bg-red-50";
  } else if (isDragging) {
    borderClass = "border-solid border-indigo-400";
    bgClass = "bg-indigo-50";
  }

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative flex h-[140px] w-full flex-col items-center justify-center gap-1 rounded-md border-2 px-4 text-center transition-colors ${borderClass} ${bgClass} ${cursorClass} ${
        !isParsing && !error && !isDragging ? "hover:border-gray-400 group" : ""
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {isParsing && (
        <>
          <svg
            className="h-6 w-6 animate-spin text-gray-400"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          <p className="text-sm text-gray-600">Reading screenshot...</p>
          <p className="text-xs text-gray-400">This takes a few seconds</p>
        </>
      )}

      {!isParsing && error && (
        <>
          <p className="text-sm text-red-600">{error}</p>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClearError();
            }}
            className="text-xs font-medium text-red-500 underline hover:text-red-700"
          >
            Try again
          </button>
        </>
      )}

      {!isParsing && !error && isDragging && (
        <p className="text-sm font-medium text-indigo-500">Drop to read</p>
      )}

      {!isParsing && !error && !isDragging && (
        <>
          <svg
            className="h-6 w-6 text-gray-400 transition-colors group-hover:text-gray-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 16.5V18a2 2 0 002 2h12a2 2 0 002-2v-1.5M7.5 9L12 4.5 16.5 9M12 4.5V15"
            />
          </svg>
          <p className="text-sm text-gray-600 transition-colors group-hover:text-gray-800">
            Drop a screenshot of the job posting
          </p>
          <p className="text-xs text-gray-400">
            or paste with ⌘V · or click to browse
          </p>
        </>
      )}
    </div>
  );
}

export default ScreenshotUpload;
