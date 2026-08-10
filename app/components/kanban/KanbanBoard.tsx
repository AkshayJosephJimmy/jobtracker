"use client";

import { DragDropContext,DropResult  } from "@hello-pangea/dnd";
import KanbanColumn from "./KanbanColumn";
import {useApplication} from "../../context/ApplicationsContext";
import { useEffect } from "react";
import {fetchApplications} from "../../utility/fetchApplications"
import ApplicationDrawer from "../drawer/ApplicationDrawer";

function KanbanBoard() {

  
  const{application,setApplication,selectedId,setSelectedId}=useApplication()
  const selected=application.find(app=>app.id==selectedId)

  const previousApplication=application
    async function handleDragEnd(result: DropResult) {
      
        // Handle the drag and drop logic here
        console.log(result);
       
       const newStatus=result.destination?.droppableId;
        if(newStatus==undefined){

          return
          
        }
       const application_id=result.draggableId


       setApplication(prev=>prev.map(app=>app.id===application_id?{ ...app,status:newStatus as any }: app))

       const res =await fetch(`/api/application/${application_id}`,{
        method:"PATCH",
        headers:{"Content-Type": "application/json"},
        body:JSON.stringify({newStatus})


       })

       if (!res.ok){
        throw new Error("card not in the right column")
        setApplication(previousApplication)
       }

       
        // fires when user drops a card
        // result tells you what moved and where
    }
    async function followUp(message:string){

        const res=await fetch(`/api/application/${selectedId}/followUp`,{
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({message})
        })
        if(!res.ok){
          setApplication(previousApplication)
          return
        }

        const updatedApplication=await res.json()

        setApplication(prev=>prev.map(app=>app.id===updatedApplication.id ? updatedApplication:app))
       }

  return (
    <>
    <DragDropContext onDragEnd={handleDragEnd}>
      <div
        className="flex flex-row gap-3.5 overflow-x-auto p-4"
        style={{ backgroundColor: "#e8e4dd" }}
        >
        <KanbanColumn title="APPLIED" />
        <KanbanColumn title="INTERVIEW" />
        <KanbanColumn title="SCREENING" />
        <KanbanColumn title="REJECTED" />

      </div>
    </DragDropContext>

    {selectedId && <ApplicationDrawer application={selected} onClose={()=>{setSelectedId(null);return }} onMarkFollowUp={followUp} 
    onDelete={()=>{console.log("deleted")}}  />}

        </>

  )
}
export default KanbanBoard;