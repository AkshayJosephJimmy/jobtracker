
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {createClient} from "@/lib/supabase/server"








export async function POST(req:NextRequest) {

    const supabase=await createClient()

     
      const {data:{user}}=await supabase.auth.getUser()
    if(!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
 


    const   {userId,
            companyName,
            role,
            status,
            portal,
            jobDescription,
            applyDate,
            resumeName,
            resumeLink,
            hasReferral,
            notes,} = await req.json();


    if(!userId || !companyName || !role || !status || !portal || !jobDescription || !applyDate   || hasReferral === undefined ){
        return NextResponse.json({message:"Missing required fields"}, {status:400})
    }        

    try{

        
        const application = await prisma.application.create({
            data:{
                userId,
                companyName,
                role,
                status,
                portal,
                jobDescription,
                applyDate: new Date(applyDate),
                resumeName,
                resumeLink,
                hasReferral,
                notes
            }
        })
        
        return NextResponse.json({message:"Application added successfully", application})
    }catch(err){
          console.error("Prisma create failed:", err);
  return NextResponse.json({ message: `Failed to create application ${err}`, }, { status: 500 });
    }




    





}
export async function GET(){

   const supabase=await createClient()

    const {data:{user}}=await supabase.auth.getUser()
    if(!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    try{

        
        const applications= await prisma.application.findMany({where:
            {userId:user.id}})
            
            
            return NextResponse.json(applications)
            
        }

    catch(err){
        console.error("Prisma create failed:", err);
  return NextResponse.json({ message: "Failed to fetch application" }, { status: 500 });

    }    

    




}

export async function PATCH(req:NextRequest){

    const {newStatus,application_id}=await req.json()

    try{

        
        const updatedApplication=await prisma.application.update(
            {
                where: {id: application_id},
                
                data:{status:newStatus}
                
            }
        )
        return NextResponse.json(updatedApplication)
        
    }catch(err){

         console.error("Prisma create failed:", err);
  return NextResponse.json({ message: "Failed to update application" }, { status: 500 });
        
    }



}

export async function DELETE(req:NextRequest){
    let delete_id:string
try{

     ({delete_id}=await req.json());

}catch(err){
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
}
    try{

       const deletedApplication= await prisma.application.delete({where: {
            id:delete_id
        }})

        return NextResponse.json({message:"application deleted",deletedApplication},{status:200})
    }catch(err){
        return NextResponse.json({ error: "could not delete application" }, { status: 400 });
    }



}