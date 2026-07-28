"use client";

import { DragDropContext,DropResult  } from "@hello-pangea/dnd";
import KanbanColumn from "./KanbanColumn";







function KanbanBoard() {
  

    function handleDragEnd(result: DropResult) {
        // Handle the drag and drop logic here
        console.log(result);
        // fires when user drops a card
        // result tells you what moved and where
    }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex flex-row gap-4 overflow-x-auto p-4">
        <KanbanColumn title="APPLIED" />
        <KanbanColumn title=" INTERVIEW" />
        <KanbanColumn title=" SCREENIG" />
        <KanbanColumn title="REJECTED " />

      </div>
    </DragDropContext>
  )
}
export default KanbanBoard;