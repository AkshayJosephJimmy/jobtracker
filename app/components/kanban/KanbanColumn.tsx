"use client";

import { Draggable, Droppable } from "@hello-pangea/dnd";
import ApplicationCard from "./ApplicationCard";
import AddApplicationModal from "../modals/AddApplicationModal";
import { useState } from "react";

const application = {
  id: "1",
  title: "Frontend Developer",
  company: "Tech Company",
  job: "Frontend Developer",
  portal: "LinkedIn",
  status: "Interviewing",
  dateApplied: "2023-09-15",
  followUpStatus: "Pending",
};

type KanbanColumnProps = {
  title: string;
};

function KanbanColumn({ title }: KanbanColumnProps) {
  const [applications] = useState([application]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const cards = applications.filter((app) => app.status === title);
  function handelAddApplication() {
    setIsModalOpen(true);
  }
  return (
    <Droppable droppableId={title}>
      {(provided) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className="flex flex-col bg-black rounded-md border-2 p-4 w-72 shrink-0 min-h-80"
          style={{
            fontFamily: "var(--font-vt323), monospace",
            borderColor: "#00ff46",
            boxShadow: "0 0 3px rgba(0,255,70,0.4), 0 0 8px rgba(0,255,70,0.1)",
          }}
        >
          <h2
            className="text-2xl tracking-widest mb-3 pb-2 border-b-2"
            style={{
              color: "#00ff46",
              borderColor: "rgba(0,255,70,0.3)",
              textShadow: "0 0 3px rgba(0,255,70,0.5)",
            }}
          >
            &gt; {title.toUpperCase()}
          </h2>

          <div className="flex flex-col gap-3 flex-1">
            {cards.map((app, index) => (
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

            {cards.length === 0 && (
              <p
                className="text-lg tracking-wide text-center mt-6"
                style={{ color: "#00ff46", opacity: 0.4 }}
              >
                &gt; NO ENTRIES
              </p>
            )}
          </div>
          {title === "Applied" && (
            <button
              className="mt-4 w-full text-lg tracking-widest py-1 rounded-sm border-2 transition-colors"
              style={{
                color: "#00ff46",
                borderColor: "#00ff46",
                boxShadow: "0 0 3px rgba(0,255,70,0.35), inset 0 0 6px rgba(0,255,70,0.08)",
              }}
              onClick={handelAddApplication}
            >
              &gt; ADD APPLICATION
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
