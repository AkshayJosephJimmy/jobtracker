"use client";

import { Draggable, Droppable } from "@hello-pangea/dnd";
import ApplicationCard from "./ApplicationCard";
import AddApplicationModal from "../modals/AddApplicationModal";
import { useState } from "react";
import { useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import {useApplication,} from "../../context/ApplicationsContext"
import {fetchApplications} from "../../utility/fetchApplications"
import ApplicationDrawer from "../drawer/ApplicationDrawer";
import { searchApplications ,followUpApplication} from "@/app/utility/searchApplications";
import Loader from "@/app/utility/LoaderForCard";
import { useFilters } from "@/app/context/FilterContext";
import { getWeeklyApplications } from "@/app/utility/searchApplications";



type KanbanColumnProps = {
  title: string;
};

const C = {
  panel: "#12151b",
  panel2: "#171b23",
  line: "#232833",
  line2: "#1e232d",
  ink: "#eceae4",
  ink2: "#a9aeba",
  ink3: "#6f7788",
  ink4: "#4a5262",
  violet: "#8b7bfa",
  green: "#4fd99b",
  red: "#ff7b7f",
} as const;

const F = {
  mono: "var(--font-jetbrains-mono), monospace",
  sans: "var(--font-plus-jakarta), system-ui, sans-serif",
} as const;

const COLUMN_STYLES: Record<string, { dot: string; bg: string; border: string }> = {
  APPLIED: { dot: C.ink4, bg: C.panel, border: C.line },
  SCREENING: { dot: C.violet, bg: C.panel, border: C.line },
  INTERVIEW: { dot: C.green, bg: C.panel, border: C.line },
  REJECTED: { dot: C.red, bg: C.panel, border: C.line },
};
const DEFAULT_COLUMN_STYLE = { dot: C.ink4, bg: C.panel, border: C.line };

function KanbanColumn({ title }: KanbanColumnProps) {


 
  const {application,setApplication,query,loading,isFollowUp}=useApplication()
  const [isModalOpen, setIsModalOpen] = useState(false);
  const{filters,toggleFilter}=useFilters()
  console.log("filters",filters)
  
  



  async function handelAddApplication() {
    setIsModalOpen(true);
    


    }




    console.log("fdfd",application)

    const columnStyle = COLUMN_STYLES[title.trim().toUpperCase()] ?? DEFAULT_COLUMN_STYLE;
    let visible = searchApplications(application,query);
    
    console.log("query",query)
    
   
    if(filters.isFollowUp){
      visible=followUpApplication(visible)


    }
    if(filters.isWeekly){
      visible=getWeeklyApplications(visible)
    }


    
    console.log("enriched",visible)
    
    
    const columnApplications = visible
      .filter((app) => app.status === title)
      
      .sort((a, b) => b.daysSinceContact - a.daysSinceContact);

    // for the highlighting of new application when added
        
    const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());
    const seenIds = useRef<Set<string> | null>(null);
    const [flashId, setFlashId] = useState<string | null>(null);

    useEffect(() => {
      const currentIds = new Set(columnApplications.map((app) => app.id));

      if (seenIds.current === null) {
        seenIds.current = currentIds;
        return;
      }

      const newApp = columnApplications.find((app) => !seenIds.current!.has(app.id));
      seenIds.current = currentIds;

      if (newApp) {
        const el = cardRefs.current.get(newApp.id);
        el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
        setFlashId(newApp.id);
        const timeout = setTimeout(() => setFlashId(null), 1400);
        return () => clearTimeout(timeout);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [columnApplications.map((app) => app.id).join(",")]);

  return (
    <Droppable droppableId={title}>
      {(provided) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className="flex flex-col rounded-xl border w-72 shrink-0 scroll-auto min-h-80 max-h-170"
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
              className="text-[11.5px] font-bold tracking-wide"
              style={{ color: C.ink, fontFamily: F.mono }}
            >
              {title.trim().toUpperCase()}
            </div>
            {loading ? <Loader /> :
            <div
              className="text-[11px] font-bold rounded-[5px] px-1.5 py-0.5"
              style={{
                color: C.ink2,
                backgroundColor: C.panel2,
                fontFamily: F.mono,
              }}
            >
              {application.filter((app) => app.status === title).length}
            </div>}
            <div className="flex-1" />
            <div
              className="text-[13px] font-bold leading-none"
              style={{ color: C.ink3 }}
            >
              ⋯
            </div>
          </div>

          <div
            className="h-0.75 mx-3 mb-2.5 rounded-full overflow-hidden"
            style={{ backgroundColor: C.line2 }}
          >
            <div
              className="h-full rounded-full w-full"
              style={{ backgroundColor: columnStyle.dot }}
            />
          </div>

          <div className="flex flex-col gap-1.5 flex-1 min-h-0 overflow-y-auto scroll-auto dark-scroll px-2.5 pb-2.5">
            { columnApplications.map((app, index) => (
              <Draggable key={app.id} draggableId={app.id} index={index}>
                {(provided) => (
                  <div
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={(el) => {
                      provided.innerRef(el);
                      if (el) {
                        cardRefs.current.set(app.id, el);
                      } else {
                        cardRefs.current.delete(app.id);
                      }
                    }}
                  >
                    <ApplicationCard application={app} highlight={flashId === app.id} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}

            {application.length === 0 && (
              <p
                className="text-[12px] font-medium text-center mt-6"
                style={{ color: C.ink3 }}
              >
                No entries
              </p>
            )}
          </div>
          {title === "APPLIED" && (
            <button
              className="flex items-center gap-1.5 px-3 py-2.5 border-t text-[11.5px] font-semibold transition-colors"
              style={{
                borderColor: C.line,
                color: C.ink3,
                fontFamily: F.sans,
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
