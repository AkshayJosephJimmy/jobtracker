
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {createClient} from "@/lib/supabase/server"



export async function PATCH(req:NextRequest,{params}:{params:Promise<{id:string}>}){

    

    try{
        const {id}=await params
        const {newStatus}=await req.json()
        const updatedData:any={status:newStatus}

        const existing=await prisma.application.findUnique({where:{id:id}})
        if (!existing) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 })
        }

        if(newStatus!=='APPLIED' && !existing.firstResponseAt){

            updatedData.firstResponseAt=new Date()




        }
        if(newStatus==="APPLIED" && existing.firstResponseAt){
            updatedData.firstResponseAt=null
        }

        
        const updatedApplication=await prisma.application.update(
            {
                where: {id: id},
                
                data:updatedData
                
            }
        )
        
        return NextResponse.json(updatedApplication)
        
    }catch(err){

         console.error("Prisma create failed:", err);
  return NextResponse.json({ message: "Failed to update application" }, { status: 500 });
        
    }



}

export async function DELETE(req:NextRequest,{params}:{params:Promise<{id:string}>}){

    
    const {id}=await params
   
    try{

       const deletedApplication= await prisma.application.delete({where: {
            id:id
        }})

        return NextResponse.json({message:"application deleted",deletedApplication},{status:200})
    }catch(err){
        return NextResponse.json({ error: "could not delete application" }, { status: 400 });
    }



}