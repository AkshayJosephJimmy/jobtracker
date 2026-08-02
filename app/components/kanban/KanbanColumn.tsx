"use client";

import { Draggable, Droppable } from "@hello-pangea/dnd";
import ApplicationCard from "./ApplicationCard";
import AddApplicationModal from "../modals/AddApplicationModal";
import { useState } from "react";
import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {useApplication,} from "../../context/ApplicationsContext"
import {fetchApplications} from "../../utility/fetchApplications"



type KanbanColumnProps = {
  title: string;
};

const COLUMN_STYLES: Record<string, { dot: string; bg: string; border: string }> = {
  APPLIED: { dot: "#8a857c", bg: "#f2efe9", border: "rgba(20,18,15,.09)" },
  SCREENING: { dot: "#5b3df5", bg: "#f1eefe", border: "rgba(91,61,245,.18)" },
  INTERVIEW: { dot: "#00a86b", bg: "#ecf8f2", border: "rgba(0,168,107,.2)" },
  REJECTED: { dot: "#b3ada4", bg: "#f0eeeb", border: "rgba(20,18,15,.07)" },
};
const DEFAULT_COLUMN_STYLE = { dot: "#8a857c", bg: "#f2efe9", border: "rgba(20,18,15,.09)" };

function KanbanColumn({ title }: KanbanColumnProps) {
 
  const {application,setApplication}=useApplication()
  const [isModalOpen, setIsModalOpen] = useState(false);
  

  
    
  async function handelAddApplication() {
    setIsModalOpen(true);

    }


     useEffect(() => {
        async function loadApplications(){
    
       const data=await fetchApplications()
      
        setApplication(data)
        
        

        
    
      }
      loadApplications()
    },[])

    console.log("fdfd",application)

    const columnStyle = COLUMN_STYLES[title.trim().toUpperCase()] ?? DEFAULT_COLUMN_STYLE;

  return (
    <Droppable droppableId={title}>
      {(provided) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className="flex flex-col rounded-xl border w-72 shrink-0 min-h-80"
          style={{
            fontFamily: "var(--font-plus-jakarta), system-ui, sans-serif",
            backgroundColor: columnStyle.bg,
            borderColor: columnStyle.border,
          }}
        >
          <div className="flex items-center gap-2 px-3 pt-3 pb-2.5">
            <div
              className="w-2 h-2 rounded-[3px]"
              style={{ backgroundColor: columnStyle.dot }}
            />
            <div
              className="text-[12.5px] font-bold tracking-wide"
              style={{ color: "#14120f" }}
            >
              {title.trim().toUpperCase()}
            </div>
            <div
              className="text-[11px] font-bold rounded-[5px] px-1.5 py-0.5"
              style={{
                color: "#6b6660",
                backgroundColor: "rgba(20,18,15,.07)",
                fontFamily: "var(--font-jetbrains-mono), monospace",
              }}
            >
              {application.filter((app) => app.status === title).length}
            </div>
            <div className="flex-1" />
            <div
              className="text-[13px] font-bold leading-none"
              style={{ color: "#a8a29a" }}
            >
              ⋯
            </div>
          </div>

          <div
            className="h-0.75 mx-3 mb-2.5 rounded-full overflow-hidden"
            style={{ backgroundColor: "rgba(20,18,15,.07)" }}
          >
            <div
              className="h-full rounded-full w-full"
              style={{ backgroundColor: columnStyle.dot }}
            />
          </div>

          <div className="flex flex-col gap-1.5 flex-1 min-h-0 overflow-y-auto px-2.5 pb-2.5">
            { application.filter((app) => app.status === title).map((app, index) => (
              <Draggable key={app.id} draggableId={app.id} index={index}>
                {(provided) => (
                  <div
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                  >
                    <ApplicationCard application={app} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}

            {application.length === 0 && (
              <p
                className="text-[12px] font-medium text-center mt-6"
                style={{ color: "#a8a29a" }}
              >
                No entries
              </p>
            )}
          </div>
          {title === "APPLIED" && (
            <button
              className="flex items-center gap-1.5 px-3 py-2.5 border-t text-[11.5px] font-semibold transition-colors"
              style={{
                borderColor: "rgba(20,18,15,.07)",
                color: "#8a857c",
              }}
              onClick={handelAddApplication}
            >
              <span className="text-[15px] leading-none font-semibold">+</span>
              Add application
            </button>
          )}

          <AddApplicationModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        </div>
      )}
    </Droppable>
  );
}

export default KanbanColumn;
