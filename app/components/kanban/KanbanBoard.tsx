"use client";

import { DragDropContext,DropResult  } from "@hello-pangea/dnd";
import KanbanColumn from "./KanbanColumn";









function KanbanBoard() {
  

    async function handleDragEnd(result: DropResult) {
        // Handle the drag and drop logic here
        console.log(result);
       const newStatus=result.destination?.droppableId;
       const application_id=result.draggableId

       const res =await fetch('/api/application',{
        method:"PATCH",
        headers:{"Content-Type": "application/json"},
        body:JSON.stringify({newStatus,application_id})


       })

       


        // fires when user drops a card
        // result tells you what moved and where
    }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex flex-row gap-4 overflow-x-auto p-4">
        <KanbanColumn title="APPLIED" />
        <KanbanColumn title=" INTERVIEW" />
        <KanbanColumn title=" SCREENING" />
        <KanbanColumn title="REJECTED " />

      </div>
    </DragDropContext>
  )
}
export default KanbanBoard;